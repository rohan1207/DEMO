import React from 'react';
import DRIPLandingPage from './DripLandingPage';
import DummySection from '../components/drip/DummySection';
import SecondSection from '../components/SecondSection';
/**
 * Home page: one long scroll. Order = DRIP landing (animation) → sections below → Footer is in App.
 * Navbar and Footer live in App and do not overlap the frames; they are separate visible blocks.
 */
export default function HomePage() {
  return (
    <>
      <DRIPLandingPage />
      {/* <SecondSection /> */}
     
      {/* Add more sections here; they will appear below the DRIP and be visible on scroll */}
    </>
  );
}
