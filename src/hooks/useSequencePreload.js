import { useState, useEffect, useCallback } from 'react';

// Load every Nth frame to keep memory under ~2-3 GB.
// The rAF lerp in DripLandingSequence smooths skipped frames invisibly.
const FRAME_STEP = 1; // load all frames; memory is manageable without ImageBitmap conversion

const DESKTOP_TOTAL_FRAMES = 785;
// Phone (≤1081px): 830 frames from desktop-webp/ (ezgif-frame-001.png … ezgif-frame-830.png)
const MOBILE_START_FRAME = 1;
const MOBILE_END_FRAME = 830;

const desktopLoadCount = Math.ceil(DESKTOP_TOTAL_FRAMES / FRAME_STEP);
const MOBILE_TOTAL_FRAMES = Math.ceil((MOBILE_END_FRAME - MOBILE_START_FRAME + 1) / FRAME_STEP);

// In-memory cache so landing preload can be reused on /home instantly.
const frameCache = {
  desktop: null,
  mobile: null,
};

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

/**
 * Loads every FRAME_STEP-th frame in parallel batches.
 * Reports progress as frames complete. Ready fires when all batches done.
 */
export function useSequencePreload(onProgress) {
  const [frames, setFrames] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const report = useCallback(
    (loaded, total) => {
      const percent = total > 0 ? Math.min(100, Math.floor((100 * loaded) / total)) : 100;
      onProgress?.(percent);
    },
    [onProgress]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 1081 : false;
      const cacheKey = isMobile ? 'mobile' : 'desktop';
      if (frameCache[cacheKey]) {
        const expectedLen = isMobile ? MOBILE_TOTAL_FRAMES : desktopLoadCount;
        if (frameCache[cacheKey].length === expectedLen) {
          setFrames(frameCache[cacheKey]);
          report(100, 100);
          setReady(true);
          return;
        }
        frameCache[cacheKey] = null;
      }

      const loadCount = isMobile ? MOBILE_TOTAL_FRAMES : desktopLoadCount;
      const pathFn = isMobile ? framePathMobile : framePathDesktop;

      // Load in parallel batches of 20 to maximise throughput without flooding the browser
      const BATCH = 20;
      const results = new Array(loadCount).fill(null);
      let loaded = 0;

      for (let start = 0; start < loadCount; start += BATCH) {
        if (cancelled) return;
        const end = Math.min(start + BATCH, loadCount);
        const batch = Array.from({ length: end - start }, (_, j) => {
          const idx = start + j;
          return loadImage(pathFn(idx)).then((img) => {
            results[idx] = img;
            loaded++;
            report(loaded, loadCount);
          });
        });
        await Promise.all(batch);
      }

      if (cancelled) return;

      const imgs = results.filter(Boolean);
      console.info(`[useSequencePreload] loaded ${imgs.length} / ${loadCount} frames (step=${FRAME_STEP})`);

      if (imgs.length === 0) {
        setError(
          new Error(
            'No sequence frames loaded. Wide: public/assets/seq/mobile-webp/ · Phone: public/assets/seq/desktop-webp/'
          )
        );
        report(loadCount, loadCount);
        setReady(true);
        return;
      }

      setFrames(imgs);
      frameCache[cacheKey] = imgs;
      report(loadCount, loadCount);
      setReady(true);
    })();

    return () => { cancelled = true; };
  }, [report]);

  return { frames, ready, error };
}

export {
  DESKTOP_TOTAL_FRAMES as TOTAL_FRAMES,
  framePathDesktop as framePath,
  framePathMobile,
  MOBILE_TOTAL_FRAMES,
  MOBILE_SEQUENCE_SCROLL_VH,
};
