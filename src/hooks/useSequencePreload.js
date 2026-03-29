import { useState, useEffect, useCallback } from 'react';

// Load every Nth frame to keep memory under ~2-3 GB.
// The rAF lerp in DRIPLandingSequence smooths skipped frames invisibly.
const FRAME_STEP = 1; // load all frames; memory is manageable without ImageBitmap conversion

const DESKTOP_TOTAL_FRAMES = 785;
// Phone (≤1081px): 830 frames from desktop-webp/ (ezgif-frame-001.png … ezgif-frame-830.png)
const MOBILE_START_FRAME = 1;
const MOBILE_END_FRAME = 830;

const desktopLoadCount = Math.ceil(DESKTOP_TOTAL_FRAMES / FRAME_STEP);
const MOBILE_TOTAL_FRAMES = Math.ceil((MOBILE_END_FRAME - MOBILE_START_FRAME + 1) / FRAME_STEP);

const ENTRY_READY_PERCENT = 12;
const ENTRY_MAX_WAIT_MS = 2500;

// Wide screens (>1081px): full sequence from mobile-webp folder (785 frames).
function framePathDesktop(loadIndex) {
  const num = loadIndex * FRAME_STEP + 1; // 1, 3, 5 … 785
  return `/assets/seq/mobile-webp/ezgif-frame-${String(num).padStart(3, '0')}.png`;
}

// Phone / narrow screens (≤1081px): use desktop-webp folder only; frame range MOBILE_START–END.
function framePathMobile(loadIndex) {
  const num = MOBILE_START_FRAME + loadIndex * FRAME_STEP;
  return `/assets/seq/desktop-webp/ezgif-frame-${String(num).padStart(3, '0')}.png`;
}

// Old mobile sequence length (before 830-frame phone export) — used only to scale scroll distance
const LEGACY_MOBILE_FRAME_COUNT = 564;
// Scroll spacer height (vh) for phone; proportional to frame count vs legacy 2000vh
const MOBILE_SEQUENCE_SCROLL_VH = Math.round((2000 * MOBILE_TOTAL_FRAMES) / LEGACY_MOBILE_FRAME_COUNT);

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null); // null = failed, skip silently
    img.src = src;
  });
}

function createManager(total, pathFn) {
  return {
    total,
    pathFn,
    loaded: 0,
    frames: null,
    ready: false,
    entryReady: false,
    error: null,
    started: false,
    subscribers: new Set(),
  };
}

const preloadManagers = {
  desktop: createManager(desktopLoadCount, framePathDesktop),
  mobile: createManager(MOBILE_TOTAL_FRAMES, framePathMobile),
};

function toSnapshot(manager) {
  return {
    frames: manager.frames,
    ready: manager.ready,
    entryReady: manager.entryReady,
    error: manager.error,
    loaded: manager.loaded,
    total: manager.total,
  };
}

function subscribeManager(manager, callback) {
  manager.subscribers.add(callback);
  callback(toSnapshot(manager));
  return () => {
    manager.subscribers.delete(callback);
  };
}

function notifyManager(manager) {
  const snapshot = toSnapshot(manager);
  manager.subscribers.forEach((cb) => cb(snapshot));
}

function ensureEntryReady(manager, startedAt) {
  if (manager.entryReady) return;
  const threshold = Math.max(1, Math.floor(manager.total * (ENTRY_READY_PERCENT / 100)));
  const hasFirstFrame = Boolean(manager.frames?.[0]);
  const reachedMinFrames = manager.loaded >= threshold && hasFirstFrame;
  const timedOut = Date.now() - startedAt >= ENTRY_MAX_WAIT_MS && hasFirstFrame;
  if (reachedMinFrames || timedOut) {
    manager.entryReady = true;
  }
}

function startManager(manager) {
  if (manager.started) return;
  manager.started = true;

  (async () => {
    const BATCH = 20;
    const startedAt = Date.now();
    const results = new Array(manager.total).fill(null);
    manager.frames = results;
    notifyManager(manager);

    try {
      // Load first frame first so canvas always has a drawable fallback frame.
      const firstFrame = await loadImage(manager.pathFn(0));
      results[0] = firstFrame;
      manager.loaded = firstFrame ? 1 : 0;
      ensureEntryReady(manager, startedAt);
      notifyManager(manager);

      for (let start = 1; start < manager.total; start += BATCH) {
        const end = Math.min(start + BATCH, manager.total);
        const batch = Array.from({ length: end - start }, (_, j) => {
          const idx = start + j;
          return loadImage(manager.pathFn(idx)).then((img) => {
            if (img) {
              results[idx] = img;
              manager.loaded += 1;
            }
            ensureEntryReady(manager, startedAt);
          });
        });
        await Promise.all(batch);

        // Batch-level notify keeps UI smooth without render thrash.
        notifyManager(manager);
      }

      manager.ready = true;
      manager.entryReady = true;

      if (manager.loaded === 0) {
        manager.error = new Error(
          'No sequence frames loaded. Wide: public/assets/seq/mobile-webp/ · Phone: public/assets/seq/desktop-webp/'
        );
      }

      notifyManager(manager);
    } catch (err) {
      manager.error = err instanceof Error ? err : new Error('Failed to preload sequence frames');
      manager.entryReady = true;
      manager.ready = true;
      notifyManager(manager);
    }
  })();
}

/**
 * Progressive preload:
 * - entryReady: enough frames loaded to start quickly (used by splash redirect)
 * - ready: full sequence loaded
 */
export function useSequencePreload(onProgress) {
  const getInitialSnapshot = () => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 1081 : false;
    return toSnapshot(isMobile ? preloadManagers.mobile : preloadManagers.desktop);
  };
  const [snapshot, setSnapshot] = useState(getInitialSnapshot);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 1081 : false;
    const manager = isMobile ? preloadManagers.mobile : preloadManagers.desktop;
    startManager(manager);
    const unsubscribe = subscribeManager(manager, setSnapshot);
    return unsubscribe;
  }, []);

  const report = useCallback(() => {
    const percent =
      snapshot.total > 0
        ? Math.min(100, Math.floor((100 * snapshot.loaded) / snapshot.total))
        : 100;
    onProgress?.(percent);
  }, [onProgress, snapshot.loaded, snapshot.total]);

  useEffect(() => {
    report();
  }, [report]);

  return {
    frames: snapshot.frames,
    ready: snapshot.ready,
    entryReady: snapshot.entryReady,
    error: snapshot.error,
  };
}

export {
  DESKTOP_TOTAL_FRAMES as TOTAL_FRAMES,
  framePathDesktop as framePath,
  framePathMobile,
  MOBILE_TOTAL_FRAMES,
  MOBILE_SEQUENCE_SCROLL_VH,
};
