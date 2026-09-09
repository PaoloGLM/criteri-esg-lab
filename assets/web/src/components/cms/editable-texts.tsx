"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/language-provider";
import { sanitizeHtml } from "@/lib/blocks";
import { supabase } from "@/lib/supabase";
import { sendToParent } from "./visual-runtime";
import { orderStore, pickOrders } from "./text-order";
import {
  StyleEl,
  TextStyle,
  TextStylesMap,
  isValidTextColor,
  styleToCss,
} from "./text-styles";

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
 *   content    → { styles?: { [textId]: { font?, sizePct?, color? } } } (compartit CA/ES)
 *
 * Protocol postMessage { source: "criteri-cms" } (accions texts-*):
 *  iframe → pare:  texts-ready { lang } | texts-change { id, lang, html } |
 *                  text-select { id, styleEl }
 *  pare → iframe:  texts-set { texts: { ca?, es? } } | styles-set { styles } |
 *                  style-patch { id, style } | set-lang { lang } | texts-reset { lang }
 */

type Lang = "ca" | "es";
type TextsMap = Record<string, string>;
type Overrides = { ca: TextsMap | null; es: TextsMap | null };

// ── Store singleton (client only; el servidor mai no el llegeix) ───────
let overrides: Overrides = { ca: null, es: null };
let styles: TextStylesMap = {};
let editingId: string | null = null;
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const textsStore = {
  getOverride(lang: Lang, id: string): string | null {
    return overrides[lang]?.[id] ?? null;
  },
  getStyle(id: string): TextStyle | null {
    return styles[id] ?? null;
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
  /** Reemplaça el mapa d'estils compartit (panell via styles-set). */
  setStyles(next: TextStylesMap | null) {
    styles = next && typeof next === "object" ? next : {};
    emit();
  },
  /** Un estil concret canviat des de l'inspector del panell. */
  setOneStyle(id: string, style: TextStyle | null) {
    const next = { ...styles };
    if (style && (style.font || typeof style.sizePct === "number" || style.color)) {
      next[id] = style;
    } else {
      delete next[id];
    }
    styles = next;
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
  /** Rol tipogràfic: si és present, el text admet canvi de MIDA des de l'editor. */
  styleEl?: StyleEl;
  /** Per quan `as="a"` (no és a HTMLAttributes). */
  href?: string;
  children?: React.ReactNode;
}

/**
 * Envolcalla un text de la pàgina per fer-lo editable des de /admin/visual
 * sense canviar el disseny: mateix element, mateixa classe, mateix estil.
 * Els fills JSX són el contingut per defecte; l'override de la BD (HTML
 * desat a l'editor) el substitueix quan existeix.
 * Amb `styleEl`, l'estil desat (mida/tipografia/color token) s'aplica per
 * sobre de l'estil del codi (inline guanya sobre la classe, mai no al revés).
 */
export function EditableText({ id, as = "span", styleEl, children, ...rest }: EditableTextProps) {
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
  const styleOverride = useSyncExternalStore(
    textsStore.subscribe,
    () => textsStore.getStyle(id),
    () => null
  );

  // Estil desat de l'editor: CSS inline fusionat amb l'estil del codi.
  // React gestiona aquestes claus (fontFamily/fontSize/color): en canviar
  // des de l'inspector mentre s'edita, la re-renderització actualitza només
  // l'estil — el DOM del text (congelat) no es toca.
  // Nota: sense styleEl el text admet igualment font i color; la mida
  // (sizePct) només s'aplica quan el text té un rol tipogràfic declarat.
  const styleCss = styleOverride ? styleToCss(styleOverride, styleEl) : null;
  const mergedStyle = styleCss
    ? { ...(rest.style ?? {}), ...styleCss }
    : rest.style;

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
      <Tag data-ctext={id} data-cstyle={styleEl ?? ""} {...rest} style={mergedStyle}>
        {editing ? frozen.current : override !== null ? (
          <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(override) }} />
        ) : (
          children
        )}
      </Tag>
    );
  }
  if (override !== null) {
    return <Tag {...rest} style={mergedStyle} dangerouslySetInnerHTML={{ __html: sanitizeHtml(override) }} />;
  }
  return <Tag {...rest} style={mergedStyle}>{children}</Tag>;
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

/** Estils per text (content_*.styles), validant cada camp contra els tokens. */
export function pickStyles(json: unknown): TextStylesMap {
  const out: TextStylesMap = {};
  if (!json || typeof json !== "object") return out;
  const st = (json as { styles?: unknown }).styles;
  if (!st || typeof st !== "object") return out;
  for (const [k, v] of Object.entries(st as Record<string, unknown>)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const s = v as Record<string, unknown>;
    const entry: TextStyle = {};
    if (s.font === "serif" || s.font === "sans" || s.font === "mono") entry.font = s.font;
    if (typeof s.sizePct === "number" && Number.isFinite(s.sizePct)) entry.sizePct = s.sizePct;
    if (isValidTextColor(s.color)) entry.color = s.color;
    if (entry.font || typeof entry.sizePct === "number" || entry.color) out[k] = entry;
  }
  return Object.keys(out).length ? out : {};
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
        // Estils compartits CA/ES (viuen a content_ca.styles)
        textsStore.setStyles(pickStyles(data.content_ca));
        // Ordre dels grups de seccions dissenyades (compartit CA/ES; a content_ca)
        orderStore.setAll(pickOrders(data.content_ca));
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
        styles?: TextStylesMap;
        lang?: Lang;
        id?: string;
        style?: unknown;
        orders?: unknown;
        group?: unknown;
        list?: unknown;
      };
      if (m?.source !== "criteri-cms" || !m.action) return;
      if (m.action === "texts-set" && m.texts && typeof m.texts === "object") {
        textsStore.setAll({ ca: m.texts.ca ?? null, es: m.texts.es ?? null });
      } else if (m.action === "styles-set" && m.styles && typeof m.styles === "object") {
        textsStore.setStyles(m.styles);
      } else if (
        m.action === "style-patch" &&
        typeof m.id === "string" &&
        (m.style === null || (m.style && typeof m.style === "object" && !Array.isArray(m.style)))
      ) {
        textsStore.setOneStyle(m.id, (m.style as TextStyle | null) ?? null);
      } else if (m.action === "set-lang" && (m.lang === "ca" || m.lang === "es")) {
        // Sincronitza el LanguageProvider real de la pàgina: tota la prosa
        // (Statement, Hero, seccions) canvia d'idioma amb el panell.
        setLang(m.lang);
      } else if (m.action === "texts-reset" && (m.lang === "ca" || m.lang === "es")) {
        textsStore.clear(m.lang);
      } else if (m.action === "orders-set" && m.orders && typeof m.orders === "object") {
        orderStore.setAll(m.orders as Record<string, string[]>);
      } else if (
        m.action === "order-patch" &&
        typeof m.group === "string" &&
        Array.isArray(m.list)
      ) {
        orderStore.setOne(m.group, m.list.filter((x): x is string => typeof x === "string"));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [setLang]);

  // Avisa el pare (ell respondrà amb texts-set + styles-set + set-lang)
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

      /* Reordre dins seccions dissenyades: nansa al cantell sup-esquerre */
      [data-citem] { position: relative; }
      [data-citem]:hover::before {
        content: "⠿";
        position: absolute; top: 4px; left: 4px; z-index: 40;
        width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
        background: var(--salvia, #7a9471); color: #fff; border-radius: 6px;
        font-size: 12px; cursor: grab; box-shadow: 0 1px 4px rgba(0,0,0,.35);
      }
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

    // ── Reordre dins seccions dissenyades (grups [data-corder]) ─────────
    // La nansa ⠿ (cantell sup-esquerre de l'item) inicia el drag; en deixar
    // anar, s'envia order-patch { group, list } al panell per desar-lo.
    let suppressClick = false;
    const groupDrag = { item: null as HTMLElement | null, group: "", startY: 0, started: false };
    let groupTarget: HTMLElement | null = null;
    let groupLine: HTMLDivElement | null = null;

    const removeGroupLine = () => {
      groupLine?.remove();
      groupLine = null;
    };

    const onGroupMove = (ev: PointerEvent) => {
      const item = groupDrag.item;
      if (!item) return;
      if (!groupDrag.started) {
        if (Math.abs(ev.clientY - groupDrag.startY) < 6) return;
        groupDrag.started = true;
        suppressClick = true;
        item.style.opacity = "0.45";
        document.body.style.cursor = "grabbing";
      }
      const cont = item.closest("[data-corder]") as HTMLElement | null;
      if (!cont) return;
      const siblings = Array.from(cont.querySelectorAll<HTMLElement>("[data-citem]")).filter((el) => el !== item);
      let target: HTMLElement | null = null;
      for (const el of siblings) {
        const r = el.getBoundingClientRect();
        if (ev.clientY >= r.top && ev.clientY <= r.bottom) {
          target = ev.clientY < r.top + r.height / 2 ? el : (el.nextElementSibling as HTMLElement | null);
          break;
        }
      }
      if (target === item) target = null;
      if (target !== groupTarget) {
        removeGroupLine();
        groupTarget = target;
        if (target) {
          groupLine = document.createElement("div");
          groupLine.style.height = "3px";
          groupLine.style.background = "var(--salvia, #7a9471)";
          groupLine.style.borderRadius = "999px";
          target.parentElement?.insertBefore(groupLine, target);
        }
      }
    };

    const onGroupUp = () => {
      window.removeEventListener("pointermove", onGroupMove);
      const item = groupDrag.item;
      const started = groupDrag.started;
      document.body.style.cursor = "";
      if (item) item.style.opacity = "";
      groupDrag.item = null;
      groupDrag.started = false;
      removeGroupLine();
      const target = groupTarget;
      groupTarget = null;
      if (!item || !started || !target) return;
      const group = groupDrag.group;
      const cont = item.closest("[data-corder]") as HTMLElement | null;
      const itemKey = item.dataset.citem ?? "";
      const targetKey = target.dataset.citem ?? "";
      if (!cont || !itemKey || !targetKey) return;
      // Ordre nou: l'item surt de la llista actual (DOM) i entra abans del destí
      const list = Array.from(cont.querySelectorAll<HTMLElement>("[data-citem]"))
        .map((el) => el.dataset.citem ?? "")
        .filter((k) => k && k !== itemKey);
      const at = list.indexOf(targetKey);
      if (at < 0) return;
      list.splice(at, 0, itemKey);
      orderStore.setOne(group, list);
      sendToParent("order-patch", { group, list });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const t = (e.target as HTMLElement | null)?.closest?.("[data-citem]") as HTMLElement | null;
      if (!t || t.isContentEditable) return;
      // Només la zona de la nansa (cantell sup-esquerre) inicia el drag
      const r = t.getBoundingClientRect();
      if (e.clientX - r.left > 34 || e.clientY - r.top > 34) return;
      const cont = t.closest("[data-corder]") as HTMLElement | null;
      if (!cont?.dataset.corder) return;
      e.preventDefault();
      groupDrag.item = t;
      groupDrag.group = cont.dataset.corder;
      groupDrag.startY = e.clientY;
      window.addEventListener("pointermove", onGroupMove);
      window.addEventListener("pointerup", onGroupUp, { once: true });
    };
    document.addEventListener("pointerdown", onPointerDown, true);

    const onClick = (e: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const t = (e.target as HTMLElement | null)?.closest?.("[data-ctext]") as HTMLElement | null;
      if (t && !t.isContentEditable) {
        startEdit(t);
        // En mode edició, el clic només edita: atura handlers React del node
        // (p.ex. botons CTA que obririen diàlegs) i navegació.
        e.preventDefault();
        e.stopPropagation();
        // Avisa el panell: mostra l'inspector d'estil per a aquest text.
        sendToParent("text-select", { id: t.dataset.ctext ?? null, styleEl: t.dataset.cstyle || null });
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
      } else if (!t) {
        stopEdit();
        sendToParent("text-select", { id: null });
      }
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
      document.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointermove", onGroupMove);
      window.removeEventListener("pointerup", onGroupUp);
      removeGroupLine();
      style.remove();
    };
  }, []);

  return null;
}
