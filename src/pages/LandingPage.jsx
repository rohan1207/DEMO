import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DRIPPreloader from '../components/drip/DripPreloader';
import { useSequencePreload, LANDING_PRELOAD_TARGET } from '../hooks/useSequencePreload';

const LANDING_NAV_TIMEOUT_MS = 25000;

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const navigatedRef = useRef(false);

  const onProgress = useCallback((p) => setPercent(p), []);
  const { loaded, total } = useSequencePreload(onProgress, { landingProgress: true });

  useEffect(() => {
    if (navigatedRef.current) return;
    const need = total > 0 ? Math.max(1, Math.ceil(total * LANDING_PRELOAD_TARGET)) : 0;
    if (need > 0 && loaded >= need) {
      navigatedRef.current = true;
      navigate('/home', { replace: true });
    }
  }, [loaded, total, navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      navigate('/home', { replace: true });
    }, LANDING_NAV_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DRIPPreloader percent={percent} visible />
    </div>
  );
}
