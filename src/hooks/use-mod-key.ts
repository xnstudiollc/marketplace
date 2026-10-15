"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

function isApple() {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform;
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** "⌘" on Apple platforms, "Ctrl" elsewhere. Renders "⌘" on the server and during hydration. */
export function useModKey(): string {
  return useSyncExternalStore(noop, () => (isApple() ? "⌘" : "Ctrl "), () => "⌘");
}
