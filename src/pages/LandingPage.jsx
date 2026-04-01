import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DRIPPreloader from '../components/drip/DripPreloader';
import { useSequencePreload } from '../hooks/useSequencePreload';

export default function LandingPage() {
  const navigate = useNavigate();
  const [percent, setPercent] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const onProgress = useCallback((p) => setPercent(p), []);
  useSequencePreload(onProgress);

  useEffect(() => {
    if (!videoEnded) return;
    navigate('/home', { replace: true });
  }, [videoEnded, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <DRIPPreloader percent={percent} visible onVideoEnd={() => setVideoEnded(true)} />
    </div>
  );
}
