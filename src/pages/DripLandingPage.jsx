import React, { useCallback } from 'react';
import DRIPLandingSequence from '../components/drip/DripLandingSequence';
import { useSequencePreload } from '../hooks/useSequencePreload';

export default function DRIPLandingPage() {
  const onProgress = useCallback(() => {}, []);

  const { frames, entryReady } = useSequencePreload(onProgress);

  return (
    <div className="DRIP-page min-h-screen bg-white overflow-x-hidden">
      <DRIPLandingSequence frames={frames} sequenceReady={entryReady} />
    </div>
  );
}
