import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DRIPPreloader from '../components/drip/DripPreloader';
import { useSequencePreload } from '../hooks/useSequencePreload';

/**
 * Minimum time on splash: preload runs from frame 0 in order (same singleton as /home).
 * After this, we navigate; remaining frames keep downloading in the background.
 */
const MIN_LANDING_DISPLAY_MS = 10_000;

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const navigatedRef = useRef(false);

  // Progress 0–100% = share of full sequence loaded (not a short buffer), so the bar reflects real preload work during the 10s window.
  const onProgress = useCallback((p) => setPercent(p), []);
  const { error } = useSequencePreload(onProgress, { landingProgress: false });

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      setPercent(100);
      navigate('/home', { replace: true });
    }, MIN_LANDING_DISPLAY_MS);
    return () => clearTimeout(id);
  }, [navigate]);

  // Fail-safe: broken asset path — don’t block forever.
  useEffect(() => {
    if (!error || navigatedRef.current) return;
    navigatedRef.current = true;
    navigate('/home', { replace: true });
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DRIPPreloader percent={percent} visible />
    </div>
  );
}
