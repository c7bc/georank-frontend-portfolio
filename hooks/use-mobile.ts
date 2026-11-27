"use client";

import { useSyncExternalStore } from "react";

const mobileQuery = "(max-width: 767px)";

function subscribe(listener: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

const getSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
