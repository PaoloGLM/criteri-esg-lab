"use client";

import { useEffect, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { sendToParent } from "./visual-runtime";
import { hiddenStore } from "./editable-texts";

/**
 * figure-styles.tsx — Ajustos de les FIGURES SVG de les seccions dissenyades
 * (HeroChart, XrefDiagram...), editables des de /admin/visual com els texts
 * (estils) i les imatges. Compartit CA/ES; viu a content_ca.figures:
 *
 *   { [figureId]: { widthPct?: number, mt?: number } }
 *
 *  · widthPct: amplada del contenidor de la figura (40–160%).
 *    100 = mida del codi (identitat, no genera CSS).
 *  · mt: espai abans en px (0–200), mateix token que els texts.
 *  · Amagar/restaurar fa servir el hiddenStore compartit (content_ca.hidden,
 *    mateixa llista «Elements amagats» del panell, mateix protocol hidden-patch).
 *
 * Absència d'estil = la figura es mostra exactament igual que el codi.
 *
 * Protocol postMessage { source: "criteri-cms" }:
 *  iframe → pare:  figures-ready | figure-patch { id, style } | figure-select { id }
 *  pare → iframe:  figures-set { figures } | figure-patch { id, style }
 */

export interface FigureStyle {
  widthPct?: number;
  mt?: number;
}

export type FiguresMap = Record<string, FigureStyle>;

let figures: FiguresMap = {};
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const figuresStore = {
  get(id: string): FigureStyle | null {
    return figures[id] ?? null;
  },
  /** Reemplaça tot el mapa (el panell mana via figures-set). */
  setAll(next: FiguresMap | null) {
    figures = next && typeof next === "object" ? next : {};
    emit();
  },
  /** Una figura ajustada (null = torna a la mida del codi). */
  setOne(id: string, style: FigureStyle | null) {
    const next = { ...figures };
    if (
      style &&
      (typeof style.widthPct === "number" || typeof style.mt === "number")
    ) {
      next[id] = style;
    } else {
      delete next[id];
    }
    figures = next;
    emit();
  },
  snapshot(): FiguresMap {
    return figures;
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

/** Extreu i valida content_ca.figures vingut de la BD. */
export function pickFigures(json: unknown): FiguresMap {
  const out: FiguresMap = {};
  if (!json || typeof json !== "object") return out;
  const fg = (json as { figures?: unknown }).figures;
  if (!fg || typeof fg !== "object" || Array.isArray(fg)) return out;
  for (const [k, v] of Object.entries(fg as Record<string, unknown>)) {
    if (!v || typeof v !== "object" || Array.isArray(v)) continue;
    const s = v as Record<string, unknown>;
    const entry: FigureStyle = {};
    if (typeof s.widthPct === "number" && Number.isFinite(s.widthPct))
      entry.widthPct = Math.max(40, Math.min(160, s.widthPct));
    if (typeof s.mt === "number" && Number.isFinite(s.mt) && s.mt >= 0)
      entry.mt = Math.min(200, s.mt);
    if (typeof entry.widthPct === "number" || typeof entry.mt === "number") out[k] = entry;
  }
  return out;
}

// ── Mode editor (detectat post-mount, hydration safe) ───────────────────
function useEditMode(): boolean {
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (window.location.search.includes("edit=1")) setEdit(true);
  }, []);
  return edit;
}

/** CSS públic dels ajustos; absència d'estil = res (identitat del codi). */
function styleFor(s: FigureStyle | null): CSSProperties | undefined {
  if (!s) return undefined;
  const css: CSSProperties = {};
  if (typeof s.widthPct === "number" && s.widthPct !== 100) {
    css.width = `${s.widthPct}%`;
    css.marginLeft = "auto";
    css.marginRight = "auto";
  }
  if (typeof s.mt === "number" && s.mt > 0) css.marginTop = `${s.mt}px`;
  return Object.keys(css).length ? css : undefined;
}

/**
 * Figura editable dins una secció dissenyada (gràfic SVG del codi).
 * Públic: aplica widthPct/mt desats o res (com era). Editor: nansa ⇔
 * d'amplada sota la figura, ✕ per amagar-la i fantasma per restaurar-la.
 */
export function EditableFigure({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  const edit = useEditMode();
  const style = useSyncExternalStore(
    figuresStore.subscribe,
    () => figuresStore.get(id),
    () => null
  );
  const hiddenNow = useSyncExternalStore(
    hiddenStore.subscribe,
    () => hiddenStore.is(id),
    () => false
  );

  if (!edit) {
    if (hiddenNow) return null;
    return (
      <div className={className} style={styleFor(style)}>
        {children}
      </div>
    );
  }

  return (
    <div className={className}>
      <div data-cfig={id} className="cfig-wrap" style={styleFor(style)}>
        {hiddenNow ? (
          <div
            className="cfig-ph"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              hiddenStore.setOne(id, false);
              sendToParent("hidden-patch", { id, hidden: false });
            }}
          >
            📐 Figura oculta — clica per restaurar-la
          </div>
        ) : (
          <>
            {children}
            <div className="cfig-tools">
              <button
                type="button"
                title="Amaga la figura (clica el fantasma per restaurar-la)"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  hiddenStore.setOne(id, true);
                  sendToParent("hidden-patch", { id, hidden: true });
                }}
              >
                ✕
              </button>
            </div>
            <div className="cfig-nansa" title="Arrossega per canviar l'amplada (40–160%)" />
          </>
        )}
      </div>
    </div>
  );
}

// ── FiguresRuntime: gestió DOM dins l'iframe (?edit=1) ──────────────────
export function FiguresRuntime() {
  // Missatges del panell
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as { source?: string; action?: string; figures?: unknown; id?: unknown; style?: unknown };
      if (m?.source !== "criteri-cms" || !m.action) return;
      if (m.action === "figures-set" && m.figures && typeof m.figures === "object") {
        figuresStore.setAll(m.figures as FiguresMap);
      } else if (m.action === "figure-patch" && typeof m.id === "string") {
        figuresStore.setOne(m.id, (m.style as FigureStyle | null) ?? null);
      } else if (m.action === "deselect") {
        document.querySelectorAll(".cfig-sel").forEach((el) => el.classList.remove("cfig-sel"));
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Avisa el pare (ell respondrà amb figures-set)
  useEffect(() => {
    sendToParent("figures-ready", {});
  }, []);

  // Estils + nansa d'amplada + selecció
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .cfig-wrap { position: relative; margin-inline: auto; }
      .cfig-sel { outline: 2px dashed var(--salvia, #7a9471); outline-offset: 4px; border-radius: 4px; }
      .cfig-tools { position: absolute; top: 6px; right: 6px; z-index: 45; display: flex; gap: 6px; }
      .cfig-tools button {
        pointer-events: auto; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
        background: rgba(38,49,43,.85); color: #fff; border: 1px solid rgba(255,255,255,.35); border-radius: 6px;
        font-size: 12px; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.3);
      }
      .cfig-nansa {
        position: absolute; left: 50%; bottom: -15px; transform: translateX(-50%);
        width: 46px; height: 18px; z-index: 45; cursor: ew-resize; display: none;
      }
      .cfig-nansa::after {
        content: "⇔"; position: absolute; inset: 2px auto auto 50%; transform: translateX(-50%);
        width: 34px; height: 13px; display: flex; align-items: center; justify-content: center;
        background: var(--salvia, #7a9471); color: #fff; border-radius: 999px;
        font-size: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.35);
      }
      .cfig-sel .cfig-nansa, .cfig-wrap:hover .cfig-nansa { display: block; }
      .cfig-ph {
        display: flex; align-items: center; justify-content: center; min-height: 110px;
        border: 1px dashed var(--rule, #e5e3dd); border-radius: 10px;
        color: var(--ink-muted, #6b7280); font-size: 13px; text-align: center; padding: 12px;
      }
    `;
    document.head.appendChild(style);

    let dragging: { id: string; startX: number; startW: number; contW: number; last: number } | null = null;

    const onMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const pct = Math.max(40, Math.min(160, Math.round(((dragging.startW + (ev.clientX - dragging.startX)) / dragging.contW) * 100)));
      dragging.last = pct;
      const el = document.querySelector<HTMLElement>(`[data-cfig="${dragging.id}"]`);
      if (el) el.style.width = `${pct}%`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      if (!dragging) return;
      const { id, last } = dragging;
      dragging = null;
      const cur = figuresStore.get(id);
      if (last && (!cur || cur.widthPct !== last)) {
        const next = { ...(cur ?? {}), widthPct: last };
        figuresStore.setOne(id, next);
        sendToParent("figure-patch", { id, style: next });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const nansa = (e.target as HTMLElement | null)?.closest?.(".cfig-nansa") as HTMLElement | null;
      if (!nansa) return;
      const wrap = nansa.closest("[data-cfig]") as HTMLElement | null;
      const id = wrap?.dataset.cfig ?? "";
      if (!wrap || !id) return;
      e.preventDefault();
      dragging = {
        id,
        startX: e.clientX,
        startW: wrap.getBoundingClientRect().width,
        contW: wrap.parentElement?.clientWidth ?? 1,
        last: figuresStore.get(id)?.widthPct ?? 100,
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    };

    const onDocClick = (e: MouseEvent) => {
      // Els texts dins la figura (figcaption...) són del TextsRuntime: no seleccionar figura.
      if ((e.target as HTMLElement | null)?.closest?.("[data-ctext]")) return;
      if ((e.target as HTMLElement | null)?.closest?.(".cfig-tools")) return;
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cfig]") as HTMLElement | null;
      if (!t || t.classList.contains("cfig-ph")) return;
      document.querySelectorAll(".cfig-sel").forEach((el) => el.classList.remove("cfig-sel"));
      t.classList.add("cfig-sel");
      sendToParent("figure-select", { id: t.dataset.cfig ?? null });
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onDocClick, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("pointermove", onMove);
      style.remove();
    };
  }, []);

  return null;
}
