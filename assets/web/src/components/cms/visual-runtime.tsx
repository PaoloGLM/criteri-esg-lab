"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Block, BlockType, newBlockId, sanitizeHtml } from "@/lib/blocks";
import { TextBlock, ImageBlock, CtaBlock } from "@/components/cms/blocks-view";

/**
 * visual-runtime.tsx — El "simulador": corre DINS la pàgina real (carregada
 * en un iframe des de /admin/visual) i converteix la zona de blocs CMS en
 * editable in-place, experiència tipus WordPress/Elementor:
 *
 *  · Clic en un bloc → selecció (contorn salvia)
 *  · Vèrtex inferior → arrossegar per canviar l'amplada de la imatge (lliure, no presets)
 *  · Nanses ← → sota la imatge seleccionada → alineació esquerra/centra/dreta
 *  · Text editable directament sobre la pàgina (contentEditable, es desa en sortit)
 *  · Arrossegar la nansa ⠿ per reordenar blocs, amb LÍNIA D'INSERCIÓ visual
 *  · Imatge seleccionada: arrossega-la horitzontalment per situar-la —
 *    guies d'alineació (marge esquerre, centre, marge dret) amb snap
 *    tipus PowerPoint; en deixar anar s'alinea amb la zona més propera
 *  · Cada canvi s'envia al pare (postMessage) per als botons Desa/Publica
 *
 * Protocol (missatges { source: "criteri-cms", action, ... }):
 *  iframe → pare:  ready | change { blocks, lang } | select { id } |
 *                  hotkey { key, shift }  (Ctrl+Z/Y → l'undo viu al pare)
 *  pare → iframe:  set-blocks { blocks, lang } | add-block { type } |
 *                  move { dir } | remove {} | deselect {}
 */

type Lang = "ca" | "es";
type Align = "left" | "center" | "right";

const CMS_MSG = "criteri-cms";

export function sendToParent(action: string, payload?: Record<string, unknown>) {
  try {
    window.parent?.postMessage({ source: CMS_MSG, action, ...payload }, window.location.origin);
  } catch {
    /* iframe sense pare (vista pública) — ignorem */
  }
}

type DragState = {
  id: string;
  kind: "block" | "image";
  dx: number;
  guides: string[];
  cw: number;
};

export function VisualBlocksRuntime() {
  const [blocksByLang, setBlocksByLang] = useState<Record<Lang, Block[]>>({ ca: [], es: [] });
  const [lang, setLang] = useState<Lang>("ca");
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const insertAtRef = useRef<number | null>(null);
  const dragInfo = useRef<{ id: string; kind: "block" | "image"; startX: number; startY: number; moved: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const blocks = blocksByLang[lang];

  const setBlocks = (arg: Block[] | ((bs: Block[]) => Block[])) => {
    setBlocksByLang((s) => {
      const bs = typeof arg === "function" ? arg(s[lang]) : arg;
      sendToParent("change", { blocks: bs, lang });
      return { ...s, [lang]: bs };
    });
  };

  // ── Missatges del pare ─────────────────────────────────────────────
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as { source?: string; action?: string; blocks?: unknown; lang?: Lang; type?: BlockType; dir?: number };
      if (m?.source !== CMS_MSG || !m.action) return;
      switch (m.action) {
        case "set-blocks":
          if (Array.isArray(m.blocks)) {
            const l = m.lang === "es" ? "es" : "ca";
            setBlocksByLang((s) => ({ ...s, [l]: m.blocks as Block[] }));
            if (l === lang) setSelected(null);
          }
          break;
        case "set-lang":
          if (m.lang === "ca" || m.lang === "es") setLang(m.lang);
          break;
        case "add-block": {
          const t = m.type;
          if (t !== "text" && t !== "image" && t !== "cta") return;
          const nb: Block =
            t === "text"
              ? { id: newBlockId(), type: "text", data: { html: "<p>Escriu aquí el teu text…</p>" } }
              : t === "image"
                ? { id: newBlockId(), type: "image", data: { url: "", alt: "", widthPct: 60, align: "center", focalX: 50, focalY: 50, caption: "" } }
                : { id: newBlockId(), type: "cta", data: { label: "Text del botó", href: "/", style: "solid", note: "" } };
          setBlocksByLang((s) => {
            const bs = [...s[lang]];
            const at = selected ? bs.findIndex((b) => b.id === selected) + 1 : bs.length;
            bs.splice(at, 0, nb);
            setSelected(nb.id);
            sendToParent("change", { blocks: bs, lang });
            return { ...s, [lang]: bs };
          });
          break;
        }
        case "move":
          setBlocksByLang((s) => {
            const bs = [...s[lang]];
            const i = bs.findIndex((b) => b.id === selected);
            if (i < 0) return s;
            const j = i + (m.dir === -1 ? -1 : 1);
            if (j < 0 || j >= bs.length) return s;
            [bs[i], bs[j]] = [bs[j], bs[i]];
            sendToParent("change", { blocks: bs, lang });
            return { ...s, [lang]: bs };
          });
          break;
        case "remove":
          setBlocksByLang((s) => {
            const bs = s[lang].filter((b) => b.id !== selected);
            setSelected(null);
            sendToParent("change", { blocks: bs, lang });
            return { ...s, [lang]: bs };
          });
          break;
        case "deselect":
          setSelected(null);
          break;
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [lang, selected]);

  // Avisa el pare que som a punt (ell enviarà set-blocks amb el contingut desat)
  useEffect(() => {
    sendToParent("ready", { lang });
  }, []);

  // Dins l'editor, els enllaços de la pàgina no han de navegar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("a")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Ctrl+Z / Ctrl+Y (o Ctrl+Shift+Z): l'historial d'undo viu al PARE
  // (concentra blocs, texts, estils, ordre, amagats i imatges en una sola
  // línia de temps). Si el focus és dins un camp de text (contentEditable o
  // input) deleguem al undo natiu del navegador d'aquell camp.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (key === "z" || key === "y")) {
        const t = e.target as HTMLElement | null;
        const inText =
          !!t &&
          (t.isContentEditable ||
            t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.tagName === "SELECT");
        if (inText) return; // undo natiu del camp
        e.preventDefault();
        sendToParent("hotkey", { key, shift: e.shiftKey });
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, []);

  // ── Resize per vèrtex (amplada lliure) ─────────────────────────────
  const startResize = (e: React.PointerEvent, blockId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const blockEl = containerRef.current?.querySelector<HTMLElement>(`[data-cms-id="${blockId}"] > .cms-image`);
    const containerW = containerRef.current?.clientWidth ?? 1;
    if (!blockEl) return;
    const startW = blockEl.getBoundingClientRect().width;
    const startX = e.clientX;
    const onMove = (ev: PointerEvent) => {
      const pct = Math.max(10, Math.min(100, Math.round(((startW + (ev.clientX - startX)) / containerW) * 100)));
      setBlocksByLang((s) => {
        const bs = s[lang].map((b) => (b.id === blockId ? { ...b, data: { ...b.data, widthPct: pct } } : b));
        return { ...s, [lang]: bs };
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setBlocksByLang((s) => {
        sendToParent("change", { blocks: s[lang], lang });
        return s;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // ── Drag de blocs (reordenar amb línia d'inserció) ─────────────────
  const startBlockDrag = (e: React.PointerEvent, index: number, id: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    dragInfo.current = { id, kind: "block", startX: e.clientX, startY, moved: false };
    const onMove = (ev: PointerEvent) => {
      const info = dragInfo.current;
      if (!info) return;
      if (!info.moved && Math.abs(ev.clientY - startY) < 5) return;
      info.moved = true;
      const cont = containerRef.current;
      if (!cont) return;
      // Posició d'inserció = punt mitjà dels blocs restants
      const els = Array.from(cont.querySelectorAll<HTMLElement>("[data-cms-id]"));
      const rest = els.filter((el) => el.dataset.cmsId !== id);
      let ins = rest.length;
      for (let i = 0; i < rest.length; i++) {
        const r = rest[i].getBoundingClientRect();
        if (ev.clientY < r.top + r.height / 2) {
          ins = i;
          break;
        }
      }
      insertAtRef.current = ins;
      setInsertAt(ins);
      setDrag({ id, kind: "block", dx: 0, guides: [], cw: cont.clientWidth });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const info = dragInfo.current;
      const ins = insertAtRef.current;
      dragInfo.current = null;
      insertAtRef.current = null;
      setDrag(null);
      setInsertAt(null);
      if (info?.moved && ins !== null) {
        setBlocksByLang((s) => {
          const bs = [...s[lang]];
          const from = bs.findIndex((b) => b.id === info.id);
          if (from < 0) return s;
          const [moved] = bs.splice(from, 1);
          bs.splice(Math.min(ins, bs.length), 0, moved);
          sendToParent("change", { blocks: bs, lang });
          return { ...s, [lang]: bs };
        });
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // ── Drag horitzontal d'imatge amb guies i snap (tipus PowerPoint) ──
  const startImageDrag = (e: React.PointerEvent, id: string) => {
    if (selected !== id || e.button !== 0) return; // primer clic selecciona; el drag només amb el bloc seleccionat
    e.preventDefault();
    const cont = containerRef.current;
    if (!cont) return;
    const startX = e.clientX;
    const cw = cont.clientWidth;
    dragInfo.current = { id, kind: "image", startX, startY: e.clientY, moved: false };
    let lastZone: Align | null = null;
    const onMove = (ev: PointerEvent) => {
      const info = dragInfo.current;
      if (!info) return;
      const dx = ev.clientX - startX;
      if (!info.moved && Math.abs(dx) < 5) return;
      info.moved = true;
      const frac = 0.5 + dx / cw; // posició del centre de la imatge (0..1)
      const zone: Align = frac < 0.36 ? "left" : frac < 0.64 ? "center" : "right";
      lastZone = zone;
      // Guia activa quan el centre és a prop de l'àncora de la zona
      const anchor = zone === "left" ? 0.06 : zone === "center" ? 0.5 : 0.94;
      const guides = Math.abs(frac - anchor) < 0.06 ? [zone] : [];
      setDrag({ id, kind: "image", dx, guides, cw });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const info = dragInfo.current;
      dragInfo.current = null;
      setDrag(null);
      if (info?.moved && lastZone) {
        setBlocks((bs) => bs.map((x) => (x.id === info.id ? { ...x, data: { ...x.data, align: lastZone as Align } } : x)));
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const textBlur = (blockId: string, html: string) =>
    setBlocks((bs) => bs.map((b) => (b.id === blockId ? { ...b, data: { ...b.data, html } } : b)));

  const btn = "absolute flex items-center justify-center w-6 h-6 rounded-md text-white text-xs shadow-lg cursor-pointer select-none";

  // Guies verticals d'alineació (durant el drag d'imatge)
  const guidesOverlay =
    drag?.kind === "image" ? (
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 30 }}>
        {([["left", 24], ["center", drag.cw / 2], ["right", drag.cw - 24]] as const).map(([k, x]) => (
          <div
            key={k}
            style={{
              position: "absolute",
              top: -8,
              bottom: -8,
              left: x,
              borderLeft: drag.guides.includes(k)
                ? "2px dashed var(--salvia, #7a9471)"
                : "1px dashed rgba(122,148,113,.22)",
            }}
          />
        ))}
      </div>
    ) : null;

  // Línia d'inserció (durant el drag de reordenació)
  const insertLine = (
    <div style={{ height: 3, background: "var(--salvia, #7a9471)", borderRadius: 999, opacity: 0.9 }} />
  );

  const from = drag ? blocks.findIndex((b) => b.id === drag.id) : -1;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-3xl space-y-10 px-6"
      onClick={() => {
        setSelected(null);
        sendToParent("select", { id: null });
      }}
    >
      {guidesOverlay}
      {blocks.map((b, i) => {
        const sel = selected === b.id;
        const dragging = drag?.id === b.id;
        const restIdx = i < from ? i : i - 1;
        return (
          <Fragment key={b.id}>
            {drag && insertAt !== null && i !== from && insertAt === restIdx && insertLine}
            <div
              data-cms-id={b.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(b.id);
                sendToParent("select", { id: b.id });
              }}
              className="relative"
              style={{
                outline: sel ? "2px solid var(--salvia, #7a9471)" : "2px solid transparent",
                outlineOffset: 6,
                borderRadius: 8,
                opacity: dragging ? 0.45 : 1,
              }}
            >
              {/* Nansa per arrossegar (reordenar amb línia d'inserció) */}
              <div
                title="Arrossega per moure el bloc"
                className={btn}
                style={{
                  top: -14,
                  left: -14,
                  background: "var(--salvia, #7a9471)",
                  display: sel ? "flex" : "none",
                  cursor: "grab",
                }}
                onPointerDown={(e) => startBlockDrag(e, i, b.id)}
              >
                ⠿
              </div>

              {b.type === "text" ? (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => textBlur(b.id, e.currentTarget.innerHTML)}
                  className="sec-body cms-rich"
                  style={{ color: "var(--ink)", outline: "none" }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(String(b.data.html || "")) }}
                />
              ) : b.type === "image" ? (
                <div
                  className="relative"
                  style={{
                    cursor: sel ? "grab" : undefined,
                    transform: dragging && drag.kind === "image" ? `translateX(${drag.dx}px)` : undefined,
                  }}
                  onPointerDown={(e) => startImageDrag(e, b.id)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <EditableImage data={b.data} />
                  {/* Vèrtex d'estirament */}
                  <div
                    title="Arrossega per canviar la mida"
                    className="absolute"
                    style={{
                      right: -9,
                      bottom: -9,
                      width: 20,
                      height: 20,
                      display: sel ? "block" : "none",
                      cursor: "nwse-resize",
                    }}
                    onPointerDown={(e) => startResize(e, b.id)}
                  >
                    <div style={{ width: 14, height: 14, margin: 3, background: "var(--salvia, #7a9471)", borderRadius: 3, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,.35)" }} />
                  </div>
                </div>
              ) : (
                <div className="pointer-events-none"><CtaBlock data={b.data} /></div>
              )}

              {/* Alineació d'imatge (botons equivalents al drag) */}
              {b.type === "image" && sel && (
                <div className="mt-2 flex justify-center gap-2">
                  {(["left", "center", "right"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={(e) => {
                        e.stopPropagation();
                        setBlocks((bs) => bs.map((x) => (x.id === b.id ? { ...x, data: { ...x.data, align: a } } : x)));
                      }}
                      className="rounded-md border px-3 py-1 text-xs"
                      style={{
                        background: b.data.align === a ? "var(--salvia, #7a9471)" : "#fff",
                        color: b.data.align === a ? "#fff" : "var(--ink)",
                        borderColor: "var(--salvia, #7a9471)",
                      }}
                    >
                      {a === "left" ? "⇤ Esquerra" : a === "center" ? "↔ Centre" : "Dreta ⇥"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Fragment>
        );
      })}

      {drag && insertAt === blocks.length - 1 && insertLine}

      {blocks.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm" style={{ color: "var(--ink-muted, #6b7280)", borderColor: "var(--rule, #e5e3dd)" }}>
          Aquesta pàgina encara no té blocs. Afegeix-ne amb els botons <strong>+ Text / + Imatge / + CTA</strong> de la barra superior.
        </div>
      )}
    </div>
  );
}

/** Imatge amb placeholder editable quan encara no té URL. */
function EditableImage({ data }: { data: Record<string, unknown> }) {
  const url = typeof data.url === "string" ? data.url : "";
  if (url) return <ImageBlock data={data} />;
  return (
    <div
      className="flex aspect-video w-full items-center justify-center rounded-[10px] border border-dashed text-sm"
      style={{ color: "var(--ink-muted, #6b7280)", borderColor: "var(--rule, #e5e3dd)" }}
    >
      🖼 Enganxa la URL de la imatge des de la barra lateral
    </div>
  );
}
