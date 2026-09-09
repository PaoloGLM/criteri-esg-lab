"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/language-provider";
import { sanitizeHtml } from "@/lib/blocks";
import { supabase } from "@/lib/supabase";
import { sendToParent } from "./visual-runtime";

/**
 * editable-texts.tsx — Capa d'edició in-place per als texts de les pàgines
 * (Statement, Hero, seccions de la landing...). Experiència tipus WordPress:
 * l'usuari clica qualsevol text de la pàgina REAL dins /admin/visual i escriu.
 *
 * Arquitectura:
 *  · `EditableText` envolcalla un element existent SENSE canviar-ne el
 *    disseny (mateixa classe/estil). Per defecte renderitza els fills JSX
 *    (el contingut del codi). Si la BD té un override, renderitza l'HTML
 *    desat (sanitzat) amb dangerouslySetInnerHTML.
 *  · `CmsTexts` (provider per pàgina) carrega els overrides publicats de la
 *    taula `pages` (content_ca/content_es → .texts) i els aplica. En mode
 *    editor (?edit=1) NO fa fetch: l'estat ve del panell via postMessage.
 *  · `TextsRuntime` (muntat dins FreeBlocks quan edit=1) gestiona la
 *    selecció i l'edició contentEditable sobre els nodes [data-ctext] i
 *    parla amb el panell (visual/page.tsx) via postMessage.
 *
 * Model de dades (taula public.pages, mateixa fila que els blocs):
 *   content_ca → { blocks?: [...], texts?: { [textId]: html } }
 *   content_es → ídem
 *
 * Protocol postMessage { source: "criteri-cms" } (accions texts-*):
 *  iframe → pare:  texts-ready { lang } | texts-change { id, lang, html }
 *  pare → iframe:  texts-set { texts: { ca?, es? } } | set-lang { lang } |
 *                  texts-reset { lang }
 */

type Lang = "ca" | "es";
type TextsMap = Record<string, string>;
type Overrides = { ca: TextsMap | null; es: TextsMap | null };

// ── Store singleton (client only; el servidor mai no el llegeix) ───────
let overrides: Overrides = { ca: null, es: null };
let editingId: string | null = null;
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const textsStore = {
  getOverride(lang: Lang, id: string): string | null {
    return overrides[lang]?.[id] ?? null;
  },
  isEditing(id: string): boolean {
    return editingId === id;
  },
  /** Overrides complets per idioma (per al texts-ready inicial). */
  snapshot(): { ca: TextsMap; es: TextsMap } {
    return { ca: overrides.ca ?? {}, es: overrides.es ?? {} };
  },
  /** Reemplaça tots els overrides (el panell mana via texts-set). */
  setAll(next: { ca?: TextsMap | null; es?: TextsMap | null }) {
    overrides = { ca: next.ca ?? null, es: next.es ?? null };
    emit();
  },
  /** Un text concret canviat en edició (no re-renderitza el que s'edita). */
  setOne(lang: Lang, id: string, html: string) {
    const cur = overrides[lang] ?? {};
    overrides = { ...overrides, [lang]: { ...cur, [id]: html } };
    emit();
  },
  setEditing(id: string | null) {
    editingId = id;
    emit();
  },
  clear(lang: Lang) {
    overrides = { ...overrides, [lang]: null };
    emit();
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

// ── Mode editor (detectat post-mount: hydration safe, com a FreeBlocks) ─
function useEditMode(): boolean {
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (window.location.search.includes("edit=1")) setEdit(true);
  }, []);
  return edit;
}

// ── EditableText ────────────────────────────────────────────────────────
interface EditableTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Identificador estable del text dins la pàgina (p.ex. "hero.title"). */
  id: string;
  /** Element HTML a renderitzar (per defecte span, no altera el layout). */
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * Envolcalla un text de la pàgina per fer-lo editable des de /admin/visual
 * sense canviar el disseny: mateix element, mateixa classe, mateix estil.
 * Els fills JSX són el contingut per defecte; l'override de la BD (HTML
 * desat a l'editor) el substitueix quan existeix.
 */
export function EditableText({ id, as = "span", children, ...rest }: EditableTextProps) {
  const { lang } = useLanguage();
  const edit = useEditMode();
  const override = useSyncExternalStore(
    textsStore.subscribe,
    () => textsStore.getOverride(lang, id),
    () => null // SSR: mai hi ha override al primer render (hydration safe)
  );
  const editing = useSyncExternalStore(
    textsStore.subscribe,
    () => textsStore.isEditing(id),
    () => false
  );

  // Contingut congelat durant l'edició: en entrar en mode edició capturem
  // l'element React tal com estava i el tornem a renderitzar AMB LA MATEIXA
  // referència mentre duri l'edició. React no detecta cap canvi de props i
  // no toca el DOM del node contentEditable (abans renderitzàvem null i
  // React esborrava els fills: el text desapareixia en clicar).
  const frozen = useRef<React.ReactNode>(null);
  const wasEditing = useRef(false);
  if (editing && !wasEditing.current) {
    frozen.current =
      override !== null ? (
        <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(override) }} />
      ) : (
        children
      );
  }
  wasEditing.current = editing;

  const Tag = as as React.ElementType;

  if (edit) {
    // En edició, el contingut el gestiona el runtime (contentEditable):
    // React renderitza l'element congelat (sense mutar el DOM) i el runtime
    // llegeix/escriu el contingut directament.
    return (
      <Tag data-ctext={id} {...rest}>
        {editing ? frozen.current : override !== null ? (
          <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(override) }} />
        ) : (
          children
        )}
      </Tag>
    );
  }
  if (override !== null) {
    return <Tag {...rest} dangerouslySetInnerHTML={{ __html: sanitizeHtml(override) }} />;
  }
  return <Tag {...rest}>{children}</Tag>;
}

// ── CmsTexts: provider per pàgina (carrega overrides publicats) ────────
function pickTexts(json: unknown): TextsMap | null {
  if (!json || typeof json !== "object") return null;
  const texts = (json as { texts?: unknown }).texts;
  if (!texts || typeof texts !== "object") return null;
  const out: TextsMap = {};
  for (const [k, v] of Object.entries(texts as Record<string, unknown>)) {
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}

/**
 * Provider que carrega els texts publicats d'una pàgina i els aplica.
 * En mode editor no fa fetch (l'estat mana el panell): evita carreres.
 */
export function CmsTexts({ page, children }: { page: string; children: React.ReactNode }) {
  const edit = useEditMode();

  useEffect(() => {
    if (edit) return;
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("pages")
          .select("content_ca, content_es")
          .eq("slug", page)
          .eq("status", "published")
          .maybeSingle();
        if (!alive || error || !data) return;
        const ca = pickTexts(data.content_ca);
        const es = pickTexts(data.content_es);
        if (ca || es) textsStore.setAll({ ca, es });
      } catch {
        /* BD absent o falla → la pàgina es queda amb el contingut del codi */
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, edit]);

  return <>{children}</>;
}

// ── TextsRuntime: edició in-place dins l'iframe (?edit=1) ──────────────
const EDIT_CLASS = "ctext-sel";

export function TextsRuntime() {
  const { lang, setLang } = useLanguage();
  const langRef = useRef(lang);
  const editingNode = useRef<HTMLElement | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  // Missatges del panell
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as {
        source?: string;
        action?: string;
        texts?: { ca?: TextsMap; es?: TextsMap };
        lang?: Lang;
      };
      if (m?.source !== "criteri-cms" || !m.action) return;
      if (m.action === "texts-set" && m.texts && typeof m.texts === "object") {
        textsStore.setAll({ ca: m.texts.ca ?? null, es: m.texts.es ?? null });
      } else if (m.action === "set-lang" && (m.lang === "ca" || m.lang === "es")) {
        // Sincronitza el LanguageProvider real de la pàgina: tota la prosa
        // (Statement, Hero, seccions) canvia d'idioma amb el panell.
        setLang(m.lang);
      } else if (m.action === "texts-reset" && (m.lang === "ca" || m.lang === "es")) {
        textsStore.clear(m.lang);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [setLang]);

  // Avisa el panell (ell respondrà amb texts-set + set-lang)
  useEffect(() => {
    sendToParent("texts-ready", { lang: langRef.current });
  }, []);

  // Estils d'edició (hover + selecció) i gestió DOM
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      [data-ctext] { outline: 2px dashed transparent; outline-offset: 3px; transition: outline-color .12s; cursor: default; }
      [data-ctext]:hover { outline-color: rgba(122,148,113,.55); cursor: text; }
      .${EDIT_CLASS} { outline: 2px solid var(--salvia, #7a9471) !important; border-radius: 2px; }
    `;
    document.head.appendChild(style);

    const pushChange = () => {
      const node = editingNode.current;
      if (!node) return;
      const id = node.dataset.ctext;
      if (!id) return;
      const html = node.innerHTML;
      textsStore.setOne(langRef.current, id, html);
      sendToParent("texts-change", { id, lang: langRef.current, html });
    };

    const stopEdit = () => {
      const node = editingNode.current;
      if (!node) return;
      editingNode.current = null;
      node.removeAttribute("contenteditable");
      node.classList.remove(EDIT_CLASS);
      textsStore.setEditing(null);
      pushChange(); // canvi final (idempotent si no s'ha mogut res)
      if (debounce.current) clearTimeout(debounce.current);
    };

    const startEdit = (node: HTMLElement) => {
      if (editingNode.current === node) return;
      stopEdit();
      editingNode.current = node;
      node.setAttribute("contenteditable", "true");
      node.classList.add(EDIT_CLASS);
      textsStore.setEditing(node.dataset.ctext ?? null);
      node.focus();
    };

    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement | null)?.closest?.("[data-ctext]") as HTMLElement | null;
      if (t && !t.isContentEditable) {
        startEdit(t);
        // Col·loca el cursor al punt exacte del clic (després del re-render,
        // perquè el commit de React no el perdi). Chrome/Edge/Safari.
        requestAnimationFrame(() => {
          const doc = document as Document & {
            caretRangeFromPoint?: (x: number, y: number) => Range | null;
          };
          const range = doc.caretRangeFromPoint?.(e.clientX, e.clientY);
          if (!range || !t.contains(range.startContainer)) return;
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        });
      } else if (!t) stopEdit();
    };
    // focusout (no blur delegat): capta el cas "clic fora / tab"
    const onFocusOut = (e: FocusEvent) => {
      if (editingNode.current && e.target === editingNode.current) stopEdit();
    };
    const onInput = () => {
      if (!editingNode.current) return;
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = setTimeout(pushChange, 400);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("input", onInput, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("input", onInput, true);
      style.remove();
    };
  }, []);

  return null;
}
