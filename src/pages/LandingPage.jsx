import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DRIPPreloader from '../components/drip/DripPreloader';
import { useSequencePreload } from '../hooks/useSequencePreload';

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const navigatedRef = useRef(false);

  const onProgress = useCallback((p) => setPercent(p), []);
  const { ready, error } = useSequencePreload(onProgress, { landingProgress: true });

  useEffect(() => {
    if (navigatedRef.current) return;
    if (ready) {
      navigatedRef.current = true;
      navigate('/home', { replace: true });
    }
  }, [ready, navigate]);

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
