import React from 'react';

/**
 * Test section placed below the DRIP landing. Scroll past the sequence + footer
 * to verify content below the DRIP page is visible (traditional scroll).
 */
export default function DummySection() {
  return (
    <section
      className="DRIP-below-content w-full flex flex-col items-center justify-center text-center px-4"
      style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)' }}
      aria-label="Dummy section for scroll test"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Dummy section – if you see this, content below the T-REX page works
      </h2>
      <p className="text-white/80 max-w-lg">
        This block has 100vh height. It is rendered below DRIPLandingSequence so you can confirm
        traditional scroll shows components one below the other.
      </p>
    </section>
  );
}
