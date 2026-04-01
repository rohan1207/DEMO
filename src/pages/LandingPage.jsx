import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DRIPPreloader from '../components/drip/DripPreloader';
import { useSequencePreload, getLandingBufferRequired } from '../hooks/useSequencePreload';

/** Hard cap: keep preloading on splash, then continue — longer waits feel broken and users bounce. */
const MAX_LANDING_WAIT_MS = 10_000;

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const navigatedRef = useRef(false);

  const onProgress = useCallback((p) => setPercent(p), []);
  const { entryReady, error, loaded, total } = useSequencePreload(onProgress, { landingProgress: true });

  const bufferRequired = useMemo(
    () => (total > 0 ? getLandingBufferRequired(total) : 0),
    [total],
  );
  const canEnterHome = Boolean(entryReady && bufferRequired > 0 && loaded >= bufferRequired);

  useEffect(() => {
    if (canEnterHome) setPercent(100);
  }, [canEnterHome]);

  useEffect(() => {
    if (navigatedRef.current) return;
    if (canEnterHome) {
      navigatedRef.current = true;
      navigate('/home', { replace: true });
    }
  }, [canEnterHome, navigate]);

  // After MAX_LANDING_WAIT_MS, always leave splash (buffer may be partial; home canvas uses nearest-frame fallback).
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      setPercent(100);
      navigate('/home', { replace: true });
    }, MAX_LANDING_WAIT_MS);
    return () => clearTimeout(id);
  }, [navigate]);

  // Fail-safe: if preload fails entirely, don't trap the user on splash forever.
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
