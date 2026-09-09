"use client";

import { useSyncExternalStore } from "react";

/**
 * text-order.tsx — Ordre dels elements dins les seccions dissenyades
 * (valors, criteris, blocs, equip...). El codi defineix l'ordre per defecte;
 * l'editor pot REORDENAR amb drag (nansa ⠿, vegeu TextsRuntime) i l'ordre
 * desat viu a content_ca.order — compartit CA/ES, com els estils:
 *
 *   { [grup]: [itemKey, ...] }   p.ex. { "quisom.valors": ["03", "01", "02"] }
 *
 * Els items no llistats conserven el seu ordre relatiu per defecte al final.
 * Els grups s'identifiquen amb data-corder="grup" al contenidor i cada
 * element amb data-citem="clau" (clau ESTABLE de l'element, no posició).
 */

type OrdersMap = Record<string, string[]>;

let orders: OrdersMap = {};
const subs = new Set<() => void>();

function emit() {
  subs.forEach((f) => f());
}

export const orderStore = {
  get(key: string): string[] | null {
    return orders[key] ?? null;
  },
  /** Reemplaça tot el mapa (el panell mana via orders-set). */
  setAll(next: OrdersMap | null) {
    orders = next && typeof next === "object" ? next : {};
    emit();
  },
  /** Un grup reordenat amb drag. */
  setOne(key: string, list: string[]) {
    orders = { ...orders, [key]: list };
    emit();
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

/** Llegeix l'ordre desat d'un grup (null = ordre per defecte del codi). */
export function useGroupOrder(key: string): string[] | null {
  return useSyncExternalStore(
    orderStore.subscribe,
    () => orderStore.get(key),
    () => null // SSR: mai hi ha ordre al primer render (hydration safe)
  );
}

/** Ordena `items` segons `order` (els absents van al final, ordre relatiu intacte). */
export function sortItems<T>(items: T[], order: string[] | null, getKey: (item: T) => string): T[] {
  if (!order || !order.length) return items;
  const idx = new Map(order.map((k, i) => [k, i]));
  return [...items].sort((a, b) => {
    const ia = idx.get(getKey(a));
    const ib = idx.get(getKey(b));
    if (ia === undefined && ib === undefined) return 0;
    if (ia === undefined) return 1;
    if (ib === undefined) return -1;
    return ia - ib;
  });
}

/** Extreu i valida content_ca.order vingut de la BD. */
export function pickOrders(json: unknown): OrdersMap {
  const out: OrdersMap = {};
  if (!json || typeof json !== "object") return out;
  const o = (json as { order?: unknown }).order;
  if (!o || typeof o !== "object" || Array.isArray(o)) return out;
  for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
    if (!Array.isArray(v)) continue;
    const list = v
      .filter((x): x is string => typeof x === "string" && !!x && x.length <= 64)
      .slice(0, 100);
    if (list.length && k.length <= 80) out[k] = list;
  }
  return out;
}
