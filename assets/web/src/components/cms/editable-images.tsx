"use client";

import { useEffect, useSyncExternalStore, useState } from "react";
import { sendToParent } from "./visual-runtime";

/**
 * editable-images.tsx — Imatges editables a les seccions dissenyades
 * (hero, manifest...), on els blocs lliures no arriben. Experiència
 * coherent amb TextsRuntime i VisualBlocksRuntime:
 *
 *  · Clic sobre la imatge → selecció (inspector del panell: URL, alt)
 *  · Nansa ⇔ sota la imatge → amplada 20–100% del seu contenidor
 *  · Botó ✕ (cantonada) → amagar la imatge (es pot restaurar)
 *  · Sense imatge → marc discontinu amb instrucció (només a l'editor)
 *
 * Model de dades (taula pages, COMPARTIT CA/ES com els estils i l'ordre):
 *   content_ca.images → { [imatgeId]: { url, alt, widthPct } }
 *   content_ca.hidden → { [imatgeId]: true }   (amagada, es pot restaurar)
 *
 * Protocol postMessage { source: "criteri-cms" }:
 *  iframe → pare:  images-ready | images-patch { id, image } |
 *                  images-hidden { id, hidden } | image-select { id }
 *  pare → iframe:  images-set { images, hidden } | images-patch | images-hidden
 */

type Lang = "ca" | "es";

export interface PageImage {
  url: string;
  alt: string;
  widthPct: number;
}

export type ImagesMap = Record<string, PageImage>;
export type HiddenMap = Record<string, true>;

// ── Store singleton (client only) ───────────────────────────────────────
let images: ImagesMap = {};
let hidden: HiddenMap = {};
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const imagesStore = {
  get(id: string): PageImage | null {
    return images[id] ?? null;
  },
  isHidden(id: string): boolean {
    return hidden[id] === true;
  },
  setAll(next: { images?: ImagesMap | null; hidden?: HiddenMap | null }) {
    images = next?.images && typeof next.images === "object" ? next.images : {};
    hidden = next?.hidden && typeof next.hidden === "object" ? next.hidden : {};
    emit();
  },
  /** Upsert de la imatge (també la restaura si era amagada). */
  setOne(id: string, img: PageImage) {
    images = { ...images, [id]: img };
    if (hidden[id]) {
      const h = { ...hidden };
      delete h[id];
      hidden = h;
    }
    emit();
  },
  setHidden(id: string, value: boolean) {
    const h = { ...hidden };
    if (value) h[id] = true;
    else delete h[id];
    hidden = h;
    emit();
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

/** Extreu i valida content_ca.images + content_ca.hidden. */
export function pickImages(json: unknown): { images: ImagesMap; hidden: HiddenMap } {
  const outImages: ImagesMap = {};
  const outHidden: HiddenMap = {};
  if (!json || typeof json !== "object") return { images: outImages, hidden: outHidden };
  const o = json as { images?: unknown; hidden?: unknown };
  if (o.images && typeof o.images === "object" && !Array.isArray(o.images)) {
    for (const [k, v] of Object.entries(o.images as Record<string, unknown>)) {
      if (!v || typeof v !== "object" || Array.isArray(v)) continue;
      const g = v as Record<string, unknown>;
      if (typeof g.url !== "string" || !g.url) continue;
      outImages[k] = {
        url: g.url,
        alt: typeof g.alt === "string" ? g.alt : "",
        widthPct:
          typeof g.widthPct === "number" && Number.isFinite(g.widthPct)
            ? Math.max(20, Math.min(100, g.widthPct))
            : 100,
      };
    }
  }
  if (o.hidden && typeof o.hidden === "object" && !Array.isArray(o.hidden)) {
    for (const [k, v] of Object.entries(o.hidden as Record<string, unknown>)) {
      if (v === true) outHidden[k] = true;
    }
  }
  return { images: outImages, hidden: outHidden };
}

// ── Mode editor (detectat post-mount, hydration safe) ───────────────────
function useEditMode(): boolean {
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    if (window.location.search.includes("edit=1")) setEdit(true);
  }, []);
  return edit;
}

/**
 * Imatge editable dins una secció dissenyada. En públic: res fins que
 * l'editor hi posa una URL (sense imatge, la pàgina queda igual que abans).
 */
export function EditableImages({ id, className }: { id: string; className?: string }) {
  const edit = useEditMode();
  const img = useSyncExternalStore(
    imagesStore.subscribe,
    () => imagesStore.get(id),
    () => null
  );
  const hiddenNow = useSyncExternalStore(
    imagesStore.subscribe,
    () => imagesStore.isHidden(id),
    () => false
  );

  if (!edit) {
    if (!img || hiddenNow) return null;
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.url} alt={img.alt} className="cimg-img" style={{ width: `${img.widthPct}%` }} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div data-cimg={id} className="cimg-wrap">
        {img && !hiddenNow ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="cimg-img" style={{ width: `${img.widthPct}%` }} />
            <div className="cimg-tools">
              <button
                type="button"
                title="Amaga la imatge (es pot restaurar)"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  imagesStore.setHidden(id, true);
                  sendToParent("images-hidden", { id, hidden: true });
                }}
              >
                ✕
              </button>
            </div>
            <div className="cimg-nansa" title="Arrossega per canviar la mida (20–100%)" />
          </>
        ) : (
          <div
            className="cimg-ph"
            onClick={(e) => {
              if (!hiddenNow) return;
              e.preventDefault();
              e.stopPropagation();
              imagesStore.setHidden(id, false);
              sendToParent("images-hidden", { id, hidden: false });
            }}
          >
            {hiddenNow
              ? "🖼 Imatge oculta — clica per restaurar-la"
              : "🖼 Imatge — selecciona-la i enganxa la URL des de l'inspector del panell"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── EditableImage: imatge inline d'una secció dissenyada ────────────────
interface EditableImageProps {
  /** Identificador estable (p.ex. "quisom.ai.illustracio"). */
  id: string;
  /** Imatge del codi (normalment un SVG il·lustratiu) si l'editor no n'ha desat cap. */
  fallbackSrc?: string;
  fallbackAlt?: string;
  /** Classe del contenidor. */
  className?: string;
  /** Classe de l'img (p.ex. "h-auto w-full"). */
  imgClassName?: string;
}

/**
 * Imatge editable dins una secció dissenyada, amb IMATGE PER DEFECTE del
 * codi (a diferència d'EditableImages, que és un slot buit). Públic:
 * mostra la desat a la BD o, si no n'hi ha, l'SVG del codi tal com era.
 * Editor: nansa de mida + ✕ per amagar-la + fantasma per restaurar-la.
 */
export function EditableImage({ id, fallbackSrc, fallbackAlt = "", className, imgClassName }: EditableImageProps) {
  const edit = useEditMode();
  const img = useSyncExternalStore(
    imagesStore.subscribe,
    () => imagesStore.get(id),
    () => null
  );
  const hiddenNow = useSyncExternalStore(
    imagesStore.subscribe,
    () => imagesStore.isHidden(id),
    () => false
  );

  // En mode edició, materialitza l'entrada amb el fallback del codi perquè
  // la nansa de mida i el ✕ funcionin des del primer moment. Canvis locals
  // (sense sendToParent): si l'usuari no toca res, es desa el mateix d'abans.
  useEffect(() => {
    if (!edit || img || hiddenNow || !fallbackSrc) return;
    imagesStore.setOne(id, { url: fallbackSrc, alt: fallbackAlt, widthPct: 100 });
  }, [edit, img, hiddenNow, id, fallbackSrc, fallbackAlt]);

  if (!edit) {
    if (hiddenNow) return null;
    const shown = img ?? (fallbackSrc ? { url: fallbackSrc, alt: fallbackAlt, widthPct: 100 } : null);
    if (!shown) return null;
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shown.url} alt={shown.alt} className={imgClassName}
          style={shown.widthPct < 100 ? { width: `${shown.widthPct}%` } : undefined} />
      </div>
    );
  }

  return (
    <div className={className}>
      <div data-cimg={id} className="cimg-wrap">
        {img && !hiddenNow ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className={imgClassName ?? "cimg-img"}
              style={{ width: `${img.widthPct}%` }} />
            <div className="cimg-tools">
              <button
                type="button"
                title="Amaga la imatge (clica el fantasma per restaurar-la)"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  imagesStore.setHidden(id, true);
                  sendToParent("images-hidden", { id, hidden: true });
                }}
              >
                ✕
              </button>
            </div>
            <div className="cimg-nansa" title="Arrossega per canviar la mida (20–100%)" />
          </>
        ) : (
          <div
            className="cimg-ph"
            onClick={(e) => {
              if (!hiddenNow) return;
              e.preventDefault();
              e.stopPropagation();
              imagesStore.setHidden(id, false);
              sendToParent("images-hidden", { id, hidden: false });
            }}
          >
            {hiddenNow
              ? "🖼 Imatge oculta — clica per restaurar-la"
              : "🖼 Imatge — selecciona-la i enganxa la URL des de l'inspector del panell"}
          </div>
        )}
      </div>
    </div>
  );
}

// ── EditableImagesRuntime: gestió DOM dins l'iframe (?edit=1) ───────────
export function EditableImagesRuntime() {
  // Missatges del panell
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const m = e.data as { source?: string; action?: string; images?: unknown; hidden?: unknown; id?: unknown; image?: unknown };
      if (m?.source !== "criteri-cms" || !m.action) return;
      if (m.action === "images-set" && m.images && typeof m.images === "object") {
        imagesStore.setAll({ images: m.images as ImagesMap, hidden: (m.hidden as HiddenMap) ?? null });
      } else if (m.action === "images-patch" && typeof m.id === "string" && m.image && typeof m.image === "object") {
        imagesStore.setOne(m.id, m.image as PageImage);
      } else if (m.action === "images-hidden" && typeof m.id === "string") {
        imagesStore.setHidden(m.id, m.hidden === true);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Avisa el pare (ell respondrà amb images-set)
  useEffect(() => {
    sendToParent("images-ready", {});
  }, []);

  // Estils + nansa d'amplada + selecció
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .cimg-wrap { position: relative; }
      .cimg-sel { outline: 2px dashed var(--salvia, #7a9471); outline-offset: 4px; border-radius: 4px; }
      .cimg-tools { position: absolute; top: 6px; right: 6px; z-index: 45; display: flex; gap: 6px; }
      .cimg-tools button {
        pointer-events: auto; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
        background: rgba(38,49,43,.85); color: #fff; border: 1px solid rgba(255,255,255,.35); border-radius: 6px;
        font-size: 12px; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.3);
      }
      .cimg-nansa {
        position: absolute; left: 50%; bottom: -15px; transform: translateX(-50%);
        width: 46px; height: 18px; z-index: 45; cursor: ew-resize; display: none;
      }
      .cimg-nansa::after {
        content: "⇔"; position: absolute; inset: 2px auto auto 50%; transform: translateX(-50%);
        width: 34px; height: 13px; display: flex; align-items: center; justify-content: center;
        background: var(--salvia, #7a9471); color: #fff; border-radius: 999px;
        font-size: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.35);
      }
      .cimg-sel .cimg-nansa, .cimg-wrap:hover .cimg-nansa { display: block; }
      .cimg-ph {
        display: flex; align-items: center; justify-content: center; min-height: 110px;
        border: 1px dashed var(--rule, #e5e3dd); border-radius: 10px;
        color: var(--ink-muted, #6b7280); font-size: 13px; text-align: center; padding: 12px;
      }
    `;
    document.head.appendChild(style);

    let dragging: { id: string; startX: number; startW: number; contW: number; last: number } | null = null;

    const onMove = (ev: PointerEvent) => {
      if (!dragging) return;
      const pct = Math.max(20, Math.min(100, Math.round(((dragging.startW + (ev.clientX - dragging.startX)) / dragging.contW) * 100)));
      dragging.last = pct;
      const el = document.querySelector<HTMLElement>(`[data-cimg="${dragging.id}"] img`);
      if (el) el.style.width = `${pct}%`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      if (!dragging) return;
      const { id, last } = dragging;
      dragging = null;
      const cur = imagesStore.get(id);
      if (cur && last && last !== cur.widthPct) {
        const next = { ...cur, widthPct: last };
        imagesStore.setOne(id, next);
        sendToParent("images-patch", { id, image: next });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const nansa = (e.target as HTMLElement | null)?.closest?.(".cimg-nansa") as HTMLElement | null;
      if (!nansa) return;
      const wrap = nansa.closest("[data-cimg]") as HTMLElement | null;
      const id = wrap?.dataset.cimg ?? "";
      const cur = id ? imagesStore.get(id) : null;
      if (!wrap || !id || !cur) return;
      e.preventDefault();
      dragging = {
        id,
        startX: e.clientX,
        startW: wrap.querySelector("img")?.getBoundingClientRect().width ?? wrap.clientWidth,
        contW: wrap.parentElement?.clientWidth ?? 1,
        last: cur.widthPct,
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, { once: true });
    };

    const onDocClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.(".cimg-tools")) return;
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cimg]") as HTMLElement | null;
      if (!t) return;
      document.querySelectorAll(".cimg-sel").forEach((el) => el.classList.remove("cimg-sel"));
      t.classList.add("cimg-sel");
      sendToParent("image-select", { id: t.dataset.cimg ?? null });
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
