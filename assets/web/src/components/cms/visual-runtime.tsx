"use client";

import { useEffect, useRef, useState } from "react";
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
 *  · Arrossegar per la nansa superior per reordenar blocs
 *  · Cada canvi s'envia al pare (postMessage) per als botons Desa/Publica
 *
 * Protocol (missatges { source: "criteri-cms", action, ... }):
 *  iframe → pare:  ready | change { blocks, lang } | select { id }
 *  pare → iframe:  set-blocks { blocks, lang } | add-block { type } |
 *                  move { dir } | remove {} | deselect {}
 */

type Lang = "ca" | "es";

const CMS_MSG = "criteri-cms";

function sendToParent(action: string, payload?: Record<string, unknown>) {
  try {
    window.parent?.postMessage({ source: CMS_MSG, action, ...payload }, window.location.origin);
  } catch {
    /* iframe sense pare (vista pública) — ignorem */
  }
}

export function VisualBlocksRuntime() {
  const [blocksByLang, setBlocksByLang] = useState<Record<Lang, Block[]>>({ ca: [], es: [] });
  const [lang, setLang] = useState<Lang>("ca");
  const [selected, setSelected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragFrom = useRef<number | null>(null);
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

  // ── Drag per reordenar ─────────────────────────────────────────────
  const dragStart = (i: number) => {
    dragFrom.current = i;
  };
  const dragEnter = (i: number) => setDragOver(i);
  const drop = () => {
    const from = dragFrom.current;
    const to = dragOver;
    dragFrom.current = null;
    setDragOver(null);
    if (from === null || to === null || from === to) return;
    setBlocksByLang((s) => {
      const bs = [...s[lang]];
      const [moved] = bs.splice(from, 1);
      bs.splice(to, 0, moved);
      sendToParent("change", { blocks: bs, lang });
      return { ...s, [lang]: bs };
    });
  };

  const textBlur = (blockId: string, html: string) =>
    setBlocks((bs) => bs.map((b) => (b.id === blockId ? { ...b, data: { ...b.data, html } } : b)));

  const btn = "absolute flex items-center justify-center w-6 h-6 rounded-md text-white text-xs shadow-lg cursor-pointer select-none";

  return (
    <div ref={containerRef} className="mx-auto max-w-3xl space-y-10 px-6" onClick={() => { setSelected(null); sendToParent("select", { id: null }); }}>
      {blocks.map((b, i) => {
        const sel = selected === b.id;
        return (
          <div
            key={b.id}
            data-cms-id={b.id}
            draggable={sel}
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; dragStart(i); }}
            onDragEnter={() => dragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={drop}
            onDragEnd={() => { dragFrom.current = null; setDragOver(null); }}
            onClick={(e) => { e.stopPropagation(); setSelected(b.id); sendToParent("select", { id: b.id }); }}
            className="relative"
            style={{
              outline: sel ? "2px solid var(--salvia, #7a9471)" : dragOver === i ? "2px dashed var(--salvia, #7a9471)" : "2px solid transparent",
              outlineOffset: 6,
              borderRadius: 8,
              cursor: "grab",
            }}
          >
            {/* Nansa per arrossegar (reordenar) */}
            <div
              title="Arrossega per moure el bloc"
              className={btn}
              style={{ top: -14, left: -14, background: "var(--salvia, #7a9471)", display: sel ? "flex" : "none" }}
              onMouseDown={() => { dragFrom.current = i; }}
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
              <div className="relative">
                <EditableImage data={b.data} />
                {/* Vèrtex d'estirament */}
                <div
                  title="Arrossega per canviar la mida"
                  className="absolute"
                  style={{
                    right: -9, bottom: -9, width: 20, height: 20,
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

            {/* Alineació d'imatge */}
            {b.type === "image" && sel && (
              <div className="mt-2 flex justify-center gap-2">
                {(["left", "center", "right"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={(e) => { e.stopPropagation(); setBlocks((bs) => bs.map((x) => (x.id === b.id ? { ...x, data: { ...x.data, align: a } } : x))); }}
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
        );
      })}

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
