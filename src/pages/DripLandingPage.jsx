import React, { useCallback } from 'react';
import DripLandingSequence from '../components/drip/DripLandingSequence';
import { useSequencePreload } from '../hooks/useSequencePreload';

export default function DripLandingPage() {
  const onProgress = useCallback(() => {}, []);

  const { frames, entryReady } = useSequencePreload(onProgress);

  return (
    <div className="drip-page min-h-screen bg-white overflow-x-hidden">
      <DripLandingSequence frames={frames} sequenceReady={entryReady} />
    </div>
  );
}
