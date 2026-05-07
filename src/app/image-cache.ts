"use client";

import { useEffect } from "react";

type IdleDeadline = {
  timeRemaining: () => number;
};

type WindowWithIdleCallback = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: (deadline: IdleDeadline) => void) => number;
    cancelIdleCallback?: (id: number) => void;
  };

const warmedImages = new Set<string>();

function scheduleIdleWork(callback: () => void) {
  const idleWindow = window as WindowWithIdleCallback;

  if (typeof idleWindow.requestIdleCallback === "function") {
    const id = idleWindow.requestIdleCallback(() => callback());
    return () => idleWindow.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 120);
  return () => window.clearTimeout(id);
}

function warmImageCache(paths: string[]) {
  let nextIndex = 0;
  let cancelScheduledWork: (() => void) | undefined;
  let isCancelled = false;

  const loadNextBatch = () => {
    if (isCancelled) return;

    let loadedInBatch = 0;

    while (nextIndex < paths.length && loadedInBatch < 8) {
      const src = paths[nextIndex];
      nextIndex += 1;

      if (!src || warmedImages.has(src)) continue;

      warmedImages.add(src);
      const image = new window.Image();
      image.decoding = "async";
      image.loading = "eager";
      image.src = src;
      loadedInBatch += 1;
    }

    if (nextIndex < paths.length) {
      cancelScheduledWork = scheduleIdleWork(loadNextBatch);
    }
  };

  cancelScheduledWork = scheduleIdleWork(loadNextBatch);

  return () => {
    isCancelled = true;
    cancelScheduledWork?.();
  };
}

export function useImageCache(paths: string[]) {
  useEffect(() => warmImageCache(paths), [paths]);
}
