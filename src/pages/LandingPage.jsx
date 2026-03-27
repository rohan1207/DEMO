import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DripPreloader from '../components/drip/DripPreloader';
import { useSequencePreload } from '../hooks/useSequencePreload';

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const onProgress = useCallback((p) => setPercent(p), []);
  const { entryReady } = useSequencePreload(onProgress);

  useEffect(() => {
    if (!entryReady) return;
    navigate('/home', { replace: true });
  }, [entryReady, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DripPreloader percent={percent} visible />
    </div>
  );
}
