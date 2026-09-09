"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Block, BlockType, validateBlocks } from "@/lib/blocks";
import { pickStyles, pickHidden } from "@/components/cms/editable-texts";
import { pickOrders } from "@/components/cms/text-order";
import { ImagesMap, PageImage, pickImages } from "@/components/cms/editable-images";
import {
  StyleEl,
  TextStyle,
  TextStylesMap,
  SCALE_RANGE,
  TEXT_COLORS,
} from "@/components/cms/text-styles";

/**
 * /admin/visual — Editor visual ("simulador") tipus WordPress/Elementor.
 *
 * Carrega la pàgina REAL (p.ex. la landing) en un iframe amb ?edit=1,
 * que activa el runtime d'edició dins la zona CMS de la pàgina:
 * clic per seleccionar, vèrtex per estirar la mida (lliure, no presets),
 * arrossegar per reordenar, escriure sobre la pàgina. Inspector contextual
 * per a camps que no caben in-place (URL imatge, alt, peu, CTA href...).
 *
 * Protocol postMessage { source: "criteri-cms" }:
 *  iframe → pare:  ready | change { blocks, lang } | select { id } |
 *                  texts-ready { lang } | texts-change { id, lang, html } |
 *                  text-select { id, styleEl } | order-patch { group, list } |
 *                  hidden-patch { id, hidden } | image-select { id } |
 *                  images-patch { id, image } | images-hidden { id, hidden }
 *  pare → iframe:  set-blocks { blocks, lang } | set-lang { lang } |
 *                  texts-set { texts: {ca,es} } | add-block { type } |
 *                  styles-set { styles } | style-patch { id, style } |
 *                  move { dir } | remove {} | deselect {} |
 *                  hidden-set { hidden } | images-set { images, hidden } |
 *                  images-patch { id, image }
 */

type Lang = "ca" | "es";
type Status = "draft" | "published" | "archived";

const CMS_MSG = "criteri-cms";

const PAGES: { slug: string; label: string }[] = [
  { slug: "home", label: "Inici (landing)" },
  { slug: "qui-som", label: "Qui som" },
  { slug: "que-fem", label: "Què fem" },
];

export default function VisualEditorPage() {
  const [slug, setSlug] = useState("home");
  const [lang, setLang] = useState<Lang>("ca");
  const [status, setStatus] = useState<Status | null>(null);
  const [blocksByLang, setBlocksByLang] = useState<Record<Lang, Block[]>>({ ca: [], es: [] });
  const [textsByLang, setTextsByLang] = useState<Record<Lang, Record<string, string>>>({ ca: {}, es: {} });
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState<Record<Lang, boolean>>({ ca: false, es: false });
  const [banner, setBanner] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const latest = useRef<Record<Lang, Block[]>>({ ca: [], es: [] });
  const latestTexts = useRef<Record<Lang, Record<string, string>>>({ ca: {}, es: {} });
  const [styles, setStyles] = useState<TextStylesMap>({});
  const latestStyles = useRef<TextStylesMap>({});
  const [styleDirty, setStyleDirty] = useState(false);
  const latestOrders = useRef<Record<string, string[]>>({});
  const latestHidden = useRef<Record<string, true>>({});
  const latestImages = useRef<ImagesMap>({});
  const [images, setImages] = useState<ImagesMap>({});
  const [hiddenList, setHiddenList] = useState<string[]>([]);
  const [imgSel, setImgSel] = useState<string | null>(null);
  const [textSel, setTextSel] = useState<{ id: string; styleEl: StyleEl | null } | null>(null);

  const post = useCallback((msg: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage({ source: CMS_MSG, ...msg }, window.location.origin);
  }, []);

  // ── Undo (Ctrl+Z) / Redo (Ctrl+Y) ────────────────────────────────────
  // Historial ÚNIC al panell: cada mutació (vindri de l'iframe o de
  // l'inspector) desa un snapshot ABANS d'aplicar-se. Un snapshot és la
  // còpia completa de totes les fonts de contingut — una sola línia de
  // temps per a blocs, texts, estils, ordre, amagats i imatges.
  type Snap = {
    blocks: Record<Lang, Block[]>;
    texts: Record<Lang, Record<string, string>>;
    styles: TextStylesMap;
    orders: Record<string, string[]>;
    hidden: Record<string, true>;
    images: ImagesMap;
  };
  const undoStack = useRef<Snap[]>([]);
  const redoStack = useRef<Snap[]>([]);

  // Cridar SEMPRE com a primera sentència d'una mutació (captura el
  // pre-estat). Els canvis fets dins l'iframe arriben aquí via echo
  // ("change"/"texts-change"/...), així que els botons del panell que
  // només manen ordres a l'iframe no cal que hi passin.
  const pushUndo = useCallback(() => {
    undoStack.current.push({
      blocks: latest.current,
      texts: latestTexts.current,
      styles: latestStyles.current,
      orders: latestOrders.current,
      hidden: latestHidden.current,
      images: latestImages.current,
    });
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
  }, []);

  const applySnap = useCallback(
    (s: Snap) => {
      latest.current = s.blocks;
      latestTexts.current = s.texts;
      latestStyles.current = s.styles;
      latestOrders.current = s.orders;
      latestHidden.current = s.hidden;
      latestImages.current = s.images;
      setBlocksByLang(s.blocks);
      setTextsByLang(s.texts);
      setStyles(s.styles);
      setImages(s.images);
      setHiddenList(Object.keys(s.hidden));
      setImgSel(null);
      setTextSel(null);
      setSelected(null);
      post({ action: "deselect" });
      // Els set-* dins l'iframe són silenciosos (no fan eco): restaurar
      // no genera nous passos d'historial.
      post({ action: "set-blocks", blocks: s.blocks[lang], lang });
      post({ action: "texts-set", texts: s.texts, lang });
      post({ action: "styles-set", styles: s.styles });
      post({ action: "orders-set", orders: s.orders });
      post({ action: "hidden-set", hidden: s.hidden });
      post({ action: "images-set", images: s.images, hidden: s.hidden });
      setDirty({ ca: true, es: true });
      setStyleDirty(true);
    },
    [lang, post]
  );

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    redoStack.current.push({
      blocks: latest.current,
      texts: latestTexts.current,
      styles: latestStyles.current,
      orders: latestOrders.current,
      hidden: latestHidden.current,
      images: latestImages.current,
    });
    applySnap(prev);
  }, [applySnap]);

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    undoStack.current.push({
      blocks: latest.current,
      texts: latestTexts.current,
      styles: latestStyles.current,
      orders: latestOrders.current,
      hidden: latestHidden.current,
      images: latestImages.current,
    });
    applySnap(next);
  }, [applySnap]);

  // Ctrl+Z / Ctrl+Y quan el focus és al PANELL (si és dins l'iframe, el
  // runtime ens ho reenvia via "hotkey"). Dins camps de text (inputs,
  // contentEditable) no interferim: actua el undo natiu del navegador.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === "z" || key === "y")) {
        const t = e.target as HTMLElement | null;
        const inText =
          !!t &&
          (t.isContentEditable ||
            t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.tagName === "SELECT");
        if (inText) return;
        e.preventDefault();
        if (key === "z" && !e.shiftKey) undo();
        else redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  const blocks = blocksByLang[lang];
  const selBlock = blocks.find((b) => b.id === selected) ?? null;
  const iframeSrc = `/${slug === "home" ? "" : slug}?edit=1`;

  // ── Carrega la pàgina ──────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setBanner(null);
    setSelected(null);
    adminApi.pages
      .get(slug)
      .then(({ page }) => {
        if (!alive) return;
        const load = (content: unknown): Block[] => {
          if (!content || typeof content !== "object") return [];
          const arr = (content as { blocks?: unknown }).blocks;
          if (!Array.isArray(arr)) return [];
          return arr.filter(
            (b): b is Block => !!b && typeof b === "object" && typeof (b as Block).id === "string"
          );
        };
        const next = { ca: load(page.content_ca), es: load(page.content_es) };
        latest.current = next;
        setBlocksByLang(next);
        // Texts estàtics desats (content_*.texts) per a l'edició in-place
        const loadTexts = (content: unknown): Record<string, string> => {
          if (!content || typeof content !== "object") return {};
          const t = (content as { texts?: unknown }).texts;
          if (!t || typeof t !== "object") return {};
          const out: Record<string, string> = {};
          for (const [k, v] of Object.entries(t as Record<string, unknown>)) {
            if (typeof v === "string" && v.trim()) out[k] = v;
          }
          return out;
        };
        const nextTexts = { ca: loadTexts(page.content_ca), es: loadTexts(page.content_es) };
        latestTexts.current = nextTexts;
        setTextsByLang(nextTexts);
        // Estils de text (compartits CA/ES; viuen a content_ca.styles)
        const nextStyles = pickStyles(page.content_ca);
        latestStyles.current = nextStyles;
        setStyles(nextStyles);
        const nextOrders = pickOrders(page.content_ca);
        latestOrders.current = nextOrders;
        // Elements amagats + imatges editables (compartits CA/ES; a content_ca)
        const nextHidden = pickHidden(page.content_ca);
        latestHidden.current = nextHidden;
        setHiddenList(Object.keys(nextHidden));
        const pickedImages = pickImages(page.content_ca);
        latestImages.current = pickedImages.images;
        setImages(pickedImages.images);
        setImgSel(null);
        setStyleDirty(false);
        setTextSel(null);
        setStatus((page.status as Status) ?? "draft");
        // Si l'iframe ja havia enviat "ready" (carrera: ready abans que acabés
        // la càrrega), rebia blocs buits — reenviem ara el contingut desat.
        post({ action: "set-blocks", blocks: next[lang], lang });
        // Reenvia l'idioma ara que la pàgina realment ha carregat: si l'usuari
        // va canviar de llengua abans de la càrrega, l'iframe podia haver quedat
        // desincronitzat (panell CA + pàgina ES).
        post({ action: "set-lang", lang });
      })
      .catch((e) => alive && setBanner({ type: "error", msg: (e as { error?: string }).error || "Error carregant la pàgina" }))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  // Quan canvia l'idioma, sincronitza l'iframe
  useEffect(() => {
    post({ action: "set-lang", lang });
  }, [lang]);

  // ── Missatges de l'iframe ──────────────────────────────────────────
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as { source?: string; action?: string; blocks?: unknown; lang?: Lang; id?: string | null; html?: unknown; texts?: unknown; styles?: unknown; styleEl?: string | null; orders?: unknown; group?: unknown; list?: unknown; hidden?: unknown; image?: unknown };
      if (m?.source !== CMS_MSG || !m.action) return;
      switch (m.action) {
        case "ready":
          post({ action: "set-blocks", blocks: latest.current[lang], lang });
          break;
        case "texts-ready":
          // El runtime de texts ha muntat dins l'iframe: envia els overrides
          // desats (ambdós idiomes) + re-sincronitza l'idioma del panell.
          post({ action: "texts-set", texts: latestTexts.current, lang });
          post({ action: "styles-set", styles: latestStyles.current });
          post({ action: "orders-set", orders: latestOrders.current });
          post({ action: "hidden-set", hidden: latestHidden.current });
          post({ action: "images-set", images: latestImages.current, hidden: latestHidden.current });
          post({ action: "set-lang", lang });
          break;
        case "image-select":
          setImgSel(typeof m.id === "string" && m.id ? m.id : null);
          setTextSel(null);
          break;
        case "images-ready":
          // El runtime d'imatges ha muntat: envia l'estat desat (com texts-ready).
          post({ action: "images-set", images: latestImages.current, hidden: latestHidden.current });
          break;
        case "hidden-patch":
          // L'iframe ha amagat/restaurat un element (✕ o fantasma).
          if (typeof m.id === "string" && m.id) {
            pushUndo();
            const next = { ...latestHidden.current };
            if (m.hidden === false) delete next[m.id];
            else next[m.id] = true;
            latestHidden.current = next;
            setHiddenList(Object.keys(next));
            setStyleDirty(true);
            setDirty((d) => ({ ...d, [lang]: true }));
          }
          break;
        case "images-patch":
          // Nansa de mida sobre una imatge de secció dissenyada.
          if (typeof m.id === "string" && m.id && m.image && typeof m.image === "object") {
            pushUndo();
            latestImages.current = { ...latestImages.current, [m.id]: m.image as PageImage };
            setImages(latestImages.current);
            setStyleDirty(true);
            setDirty((d) => ({ ...d, [lang]: true }));
          }
          break;
        case "images-hidden":
          // L'iframe ja ha canviat el seu estat local: el reflectim al panell.
          if (typeof m.id === "string" && m.id) {
            pushUndo();
            const next = { ...latestHidden.current };
            if (m.hidden === true) next[m.id] = true;
            else delete next[m.id];
            latestHidden.current = next;
            setHiddenList(Object.keys(next));
            setStyleDirty(true);
            setDirty((d) => ({ ...d, [lang]: true }));
          }
          break;
        case "text-select":
          // Clic sobre un text de la pàgina → inspector d'estil al panell.
          setImgSel(null);
          setTextSel(
            typeof m.id === "string" && m.id
              ? { id: m.id, styleEl: (m.styleEl as StyleEl) || null }
              : null
          );
          break;
        case "order-patch":
          // L'iframe ha reordenat un grup d'una secció dissenyada.
          if (typeof m.group === "string" && Array.isArray(m.list)) {
            pushUndo();
            latestOrders.current = {
              ...latestOrders.current,
              [m.group]: m.list.filter((x): x is string => typeof x === "string"),
            };
            setStyleDirty(true);
            setDirty((d) => ({ ...d, [lang]: true }));
          }
          break;
        case "texts-change":
          if ((m.lang === "ca" || m.lang === "es") && typeof m.id === "string" && typeof m.html === "string") {
            pushUndo();
            const l = m.lang;
            const next = { ...latestTexts.current[l], [m.id]: m.html };
            latestTexts.current = { ...latestTexts.current, [l]: next };
            setTextsByLang((s) => ({ ...s, [l]: next }));
            setDirty((d) => ({ ...d, [l]: true }));
          }
          break;
        case "change":
          if (Array.isArray(m.blocks) && (m.lang === "ca" || m.lang === "es")) {
            pushUndo();
            const l = m.lang;
            latest.current = { ...latest.current, [l]: m.blocks as Block[] };
            setBlocksByLang((s) => ({ ...s, [l]: m.blocks as Block[] }));
            setDirty((d) => ({ ...d, [l]: true }));
          }
          break;
        case "select":
          setSelected(typeof m.id === "string" ? m.id : null);
          if (typeof m.id === "string") setTextSel(null);
          break;
        case "hotkey": {
          // Ctrl+Z / Ctrl+Y premuts DINS l'iframe (el runtime ens ho reenvia
          // amb { key: "z"|"y", shift }; ja ha filtrat inputs/contentEditable
          // — allà actua el undo natiu del navegador).
          const hk = m as { key?: unknown; shift?: unknown };
          if (hk.key === "z" && hk.shift !== true) undo();
          else if (hk.key === "z" || hk.key === "y") redo();
          break;
        }
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [lang, post, undo, redo]);

  // ── Accions cap a l'iframe ─────────────────────────────────────────
  const addBlock = (type: BlockType) => post({ action: "add-block", type });
  const move = (dir: -1 | 1) => post({ action: "move", dir });
  const remove = () => {
    if (selected && confirm("Esborrar el bloc seleccionat?")) {
      post({ action: "remove" });
      setSelected(null);
    }
  };

  // Restaura un element amagat des del panell (llista "Elements amagats").
  const restoreHidden = (id: string) => {
    pushUndo();
    const next = { ...latestHidden.current };
    delete next[id];
    latestHidden.current = next;
    setHiddenList(Object.keys(next));
    setStyleDirty(true);
    setDirty((d) => ({ ...d, [lang]: true }));
    post({ action: "hidden-set", hidden: next });
    post({ action: "images-set", images: latestImages.current, hidden: next });
  };

  // Inspector d'imatge de secció dissenyada: URL, alt i amplada.
  const patchImage = (p: Partial<PageImage>) => {
    if (!imgSel) return;
    pushUndo();
    const cur = latestImages.current[imgSel] ?? { url: "", alt: "", widthPct: 100 };
    const next = { ...cur, ...p };
    latestImages.current = { ...latestImages.current, [imgSel]: next };
    setImages(latestImages.current);
    setStyleDirty(true);
    setDirty((d) => ({ ...d, [lang]: true }));
    post({ action: "images-patch", id: imgSel, image: next });
  };

  // Inspector: actualitzar camps del bloc seleccionat
  const patchSelected = (patch: Record<string, unknown>) => {
    if (!selected) return;
    pushUndo();
    const bs = blocks.map((b) => (b.id === selected ? { ...b, data: { ...b.data, ...patch } } : b));
    latest.current = { ...latest.current, [lang]: bs };
    setBlocksByLang((s) => ({ ...s, [lang]: bs }));
    setDirty((d) => ({ ...d, [lang]: true }));
    post({ action: "set-blocks", blocks: bs, lang });
  };

  // Inspector de text: afegeix/treu tokens d'estil al text seleccionat.
  // Els estils són compartits CA/ES i es guarden a content_ca.styles.
  const patchTextStyle = (partial: TextStyle | null) => {
    if (!textSel) return;
    pushUndo();
    const id = textSel.id;
    const merged: TextStyle =
      partial === null ? {} : { ...(latestStyles.current[id] ?? {}), ...partial };
    if (!merged.font) delete merged.font;
    if (typeof merged.sizePct !== "number" || !Number.isFinite(merged.sizePct)) delete merged.sizePct;
    if (!merged.color) delete merged.color;
    if (typeof merged.mt !== "number" || !Number.isFinite(merged.mt) || merged.mt < 0) delete merged.mt;
    const next = { ...latestStyles.current };
    if (Object.keys(merged).length === 0) delete next[id];
    else next[id] = merged;
    latestStyles.current = next;
    setStyles(next);
    setStyleDirty(true);
    setDirty((d) => ({ ...d, [lang]: true }));
    post({ action: "style-patch", id, style: next[id] ?? null });
  };

  const save = async (newStatus?: Status) => {
    const v = validateBlocks(blocks);
    if (!v.ok) {
      setBanner({ type: "error", msg: v.error ?? "Contingut invàlid" });
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {};
      // Save combinat: blocs + texts in-place a la mateixa fila `pages`.
      body[`content_${lang}`] = {
        blocks,
        texts: latestTexts.current[lang] ?? {},
        ...(lang === "ca"
          ? { styles: latestStyles.current, order: latestOrders.current, hidden: latestHidden.current, images: latestImages.current }
          : {}),
      };
      // Els estils viuen sempre a content_ca: si es desa en castellà amb
      // canvis d'estil pendents, s'inclou també la columna CA reconstruïda.
      if (lang !== "ca" && styleDirty) {
        body.content_ca = {
          blocks: latest.current.ca,
          texts: latestTexts.current.ca ?? {},
          styles: latestStyles.current,
          order: latestOrders.current,
          hidden: latestHidden.current,
          images: latestImages.current,
        };
      }
      body.status = newStatus ?? status ?? "draft";
      await adminApi.pages.put(slug, body);
      setDirty((d) => ({ ...d, [lang]: false }));
      if (newStatus) setStatus(newStatus);
      setBanner({
        type: "ok",
        msg: newStatus === "published" ? "Publicat — ja és visible a la web" : "Canvis desats",
      });
    } catch (e) {
      setBanner({ type: "error", msg: (e as { error?: string }).error || "Error desant" });
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full rounded-md border px-3 py-2 text-sm";
  const inpStyle = { borderColor: "var(--rule, #e5e3dd)", background: "#fff" };
  const lbl = "mb-1 block text-xs font-medium";
  const lblStyle = { color: "var(--ink-muted, #6b7280)" };
  const btnGhost = "rounded-lg border px-3 py-1.5 text-sm";

  // Text seleccionat dins la pàgina (per a l'inspector d'estil)
  const selText = textSel;
  const selTextStyle: TextStyle | null = selText ? (styles[selText.id] ?? null) : null;
  const selStyleEl: StyleEl | null = selText?.styleEl ?? null;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg, #f4f3ef)" }}>
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--rule, #e5e3dd)", background: "#fff" }}>
        <a href="/admin" className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>← Admin</a>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} className="rounded-md border px-3 py-2 text-sm" style={inpStyle}>
          {PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>{p.label}</option>
          ))}
        </select>
        {(["ca", "es"] as Lang[]).map((l) => (
          <button key={l} onClick={() => setLang(l)} className={btnGhost}
            style={lang === l ? { background: "var(--salvia, #7a9471)", color: "#fff", borderColor: "var(--salvia, #7a9471)" } : { borderColor: "var(--rule, #e5e3dd)" }}>
            {l.toUpperCase()}{dirty[l] ? " •" : ""}
          </button>
        ))}
        <div className="flex-1" />
        <select value={status ?? "draft"} onChange={(e) => setStatus(e.target.value as Status)} className="rounded-md border px-3 py-2 text-sm" style={inpStyle}>
          <option value="draft">Esborrany</option>
          <option value="published">Publicat</option>
        </select>
        <button onClick={() => save()} disabled={saving || loading} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>💾 Desa</button>
        <button onClick={() => save("published")} disabled={saving || loading}
          className="rounded-lg px-4 py-1.5 text-sm font-medium text-white" style={{ background: "var(--salvia, #7a9471)" }}>
          Publica
        </button>
      </div>

      {banner && (
        <div className="px-4 py-2 text-sm"
          style={{ background: banner.type === "ok" ? "#f0fdf4" : "#fef2f2", color: banner.type === "ok" ? "#166534" : "#b91c1c" }}>
          {banner.msg}
        </div>
      )}

      {/* Cos: iframe de la pàgina real + inspector */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="Editor visual"
            className="h-[calc(100vh-140px)] w-full rounded-xl border bg-white shadow-sm"
            style={{ borderColor: "var(--rule, #e5e3dd)" }}
          />
        </div>

        {/* Barra lateral: afegir blocs + inspector del bloc seleccionat */}
        <div className="w-72 shrink-0 space-y-4 overflow-y-auto border-l p-4" style={{ borderColor: "var(--rule, #e5e3dd)", background: "#fff" }}>
          <div>
            <p className={lbl} style={lblStyle}>Afegeix un bloc</p>
            <div className="flex gap-2">
              <button onClick={() => addBlock("text")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>¶ Text</button>
              <button onClick={() => addBlock("image")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>🖼 Imatge</button>
              <button onClick={() => addBlock("cta")} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>→ CTA</button>
            </div>
          </div>

          {imgSel && (
            <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "var(--salvia, #7a9471)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--ink, #1f2937)" }}>Imatge de la secció</p>
              <div>
                <label className={lbl} style={lblStyle}>URL de la imatge</label>
                <input className={inp} style={inpStyle} value={images[imgSel]?.url ?? ""}
                  onChange={(e) => patchImage({ url: e.target.value })} placeholder="https://… o /illustrations/…" />
              </div>
              <div>
                <label className={lbl} style={lblStyle}>Text alternatiu</label>
                <input className={inp} style={inpStyle} value={images[imgSel]?.alt ?? ""}
                  onChange={(e) => patchImage({ alt: e.target.value })} placeholder="Descripció breu" />
              </div>
              <div>
                <label className={lbl} style={lblStyle}>Amplada · {Math.round(images[imgSel]?.widthPct ?? 100)}%</label>
                <input type="range" min={20} max={100} step={5} value={images[imgSel]?.widthPct ?? 100}
                  onChange={(e) => patchImage({ widthPct: Number(e.target.value) })} className="w-full" />
              </div>
              <p className="text-xs" style={lblStyle}>També pots arrossegar la nansa ⇔ sota la imatge, o clicar ✕ per amagar-la.</p>
            </div>
          )}

          {selText && (
            <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "var(--salvia, #7a9471)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--ink, #1f2937)" }}>Estil del text</p>
              <div>
                <label className={lbl} style={lblStyle}>Tipografia</label>
                <div className="flex flex-wrap gap-1.5">
                  {([null, "serif", "sans", "mono"] as const).map((f) => {
                    const active = (selTextStyle?.font ?? null) === f;
                    return (
                      <button key={f ?? "def"} onClick={() => patchTextStyle(f ? { font: f } : { font: undefined })}
                        className="rounded-md border px-2 py-1 text-xs"
                        style={active ? { background: "var(--salvia, #7a9471)", color: "#fff", borderColor: "var(--salvia, #7a9471)" } : { borderColor: "var(--rule, #e5e3dd)" }}>
                        {f === null ? "Per defecte" : f === "serif" ? "Serif" : f === "sans" ? "Sans" : "Mono"}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selStyleEl ? (
                <div>
                  <label className={lbl} style={lblStyle}>
                    Mida{selTextStyle?.sizePct !== undefined ? ` · ${Math.round(selTextStyle.sizePct)}%` : " · per defecte"}
                  </label>
                  <input type="range" min={SCALE_RANGE[selStyleEl][0]} max={SCALE_RANGE[selStyleEl][1]} step={5}
                    value={selTextStyle?.sizePct ?? 100}
                    onChange={(e) => patchTextStyle({ sizePct: Number(e.target.value) })}
                    className="w-full" />
                </div>
              ) : (
                <p className="text-xs" style={lblStyle}>Aquest text no admet canvi de mida (només tipografia i color).</p>
              )}
              <div>
                <div className="flex items-center justify-between">
                  <label className={lbl} style={lblStyle}>
                    Espai abans{selTextStyle?.mt !== undefined ? ` · ${Math.round(selTextStyle.mt)}px` : " · per defecte"}
                  </label>
                  {selTextStyle?.mt !== undefined && (
                    <button onClick={() => patchTextStyle({ mt: undefined })} className="text-xs" style={{ color: "var(--ink-muted, #6b7280)" }} title="Torna a l'espai del disseny original">↺</button>
                  )}
                </div>
                <input type="range" min={0} max={200} step={5}
                  value={selTextStyle?.mt ?? 0}
                  onChange={(e) => patchTextStyle({ mt: Number(e.target.value) })}
                  className="w-full" />
                <p className="text-xs" style={lblStyle}>0 = enganxat amb l&apos;element anterior · 200 = molt separa&shy;t.</p>
              </div>
              <div>
                <label className={lbl} style={lblStyle}>Color (paleta Criteri)</label>
                <div className="flex flex-wrap gap-1.5">
                  {TEXT_COLORS.map((c) => {
                    const active = selTextStyle?.color === c.value;
                    return (
                      <button key={c.value} title={c.label} onClick={() => patchTextStyle({ color: c.value })}
                        className="h-6 w-6 rounded-full border"
                        style={{
                          background: c.swatch,
                          borderColor: active ? "var(--salvia, #7a9471)" : "var(--rule, #e5e3dd)",
                          boxShadow: active ? "0 0 0 2px var(--salvia, #7a9471)" : "none",
                        }} />
                    );
                  })}
                </div>
              </div>
              <button onClick={() => patchTextStyle(null)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>
                ↺ Restaura l&apos;estil per defecte
              </button>
            </div>
          )}

          {selected && selBlock && (
            <div className="space-y-3 rounded-lg border p-3" style={{ borderColor: "var(--rule, #e5e3dd)" }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ color: "var(--ink, #1f2937)" }}>
                  {selBlock.type === "text" ? "Bloc de text" : selBlock.type === "image" ? "Imatge" : "Botó CTA"}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => move(-1)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }} title="Puja">↑</button>
                  <button onClick={() => move(1)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }} title="Baixa">↓</button>
                  <button onClick={remove} className={btnGhost} style={{ color: "#b91c1c", borderColor: "#b91c1c" }} title="Esborra">✕</button>
                </div>
              </div>

              {selBlock.type === "image" && (
                <>
                  <div>
                    <label className={lbl} style={lblStyle}>URL de la imatge</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.url ?? "")}
                      onChange={(e) => patchSelected({ url: e.target.value })} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Text alternatiu</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.alt ?? "")}
                      onChange={(e) => patchSelected({ alt: e.target.value })} placeholder="Descripció breu" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Peu de foto</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.caption ?? "")}
                      onChange={(e) => patchSelected({ caption: e.target.value })} />
                  </div>
                  <p className="text-xs" style={lblStyle}>Mida: estira el vèrtex ● de la imatge. Alineació: botons sota la imatge.</p>
                </>
              )}

              {selBlock.type === "cta" && (
                <>
                  <div>
                    <label className={lbl} style={lblStyle}>Text del botó</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.label ?? "")}
                      onChange={(e) => patchSelected({ label: e.target.value })} />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Enllaç</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.href ?? "")}
                      onChange={(e) => patchSelected({ href: e.target.value })} placeholder="https://… o /informes" />
                  </div>
                  <div>
                    <label className={lbl} style={lblStyle}>Nota sota el botó</label>
                    <input className={inp} style={inpStyle} value={String(selBlock.data.note ?? "")}
                      onChange={(e) => patchSelected({ note: e.target.value })} />
                  </div>
                </>
              )}

              {selBlock.type === "text" && (
                <p className="text-xs" style={lblStyle}>Clica sobre el text i escriu directament a la pàgina.</p>
              )}
            </div>
          )}

          {!selected && (
            <p className="text-xs" style={lblStyle}>
              Clica qualsevol bloc de la pàgina per editar-lo. Arrossega la nansa ⠿ per moure&apos;l.
              <br />
              <strong>Ctrl+Z</strong> desfés l&apos;últim canvi · <strong>Ctrl+Y</strong> el torna a fer.
            </p>
          )}

          {hiddenList.length > 0 && (
            <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--rule, #e5e3dd)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--ink, #1f2937)" }}>Elements amagats</p>
              {hiddenList.map((id) => (
                <div key={id} className="flex items-center justify-between gap-2 text-xs" style={{ color: "var(--ink-muted, #6b7280)" }}>
                  <span className="truncate" title={id}>{id}</span>
                  <button onClick={() => restoreHidden(id)} className={btnGhost} style={{ borderColor: "var(--rule, #e5e3dd)" }}>Mostra</button>
                </div>
              ))}
              <p className="text-xs" style={lblStyle}>També els pots restaurar clicant el fantasma 👻 a la pàgina.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
