"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const EVENT = "vl:querychange";
const SERVER = "\u0000";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export type QueryUpdate = Record<string, string | string[] | null | undefined>;

/**
 * URL search params as state without `useSearchParams`, so pages keep a full static prerender.
 * `ready` is false during the server render and hydration, when the URL is not known yet.
 */
export function useQueryState() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => SERVER);
  const ready = search !== SERVER;
  const params = useMemo(() => new URLSearchParams(ready ? search : ""), [search, ready]);

  const update = useCallback((updates: QueryUpdate, mode: "push" | "replace" = "push") => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(updates)) {
      const v = Array.isArray(value) ? value.join(",") : value;
      if (v === null || v === undefined || v === "") next.delete(key);
      else next.set(key, v);
    }
    const qs = next.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { params, ready, update };
}

export function readList(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? "").split(",").filter(Boolean);
}
