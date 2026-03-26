import React from 'react';
import DripLandingPage from './DripLandingPage';
import DummySection from '../components/drip/DummySection';
import SecondSection from '../components/SecondSection';
/**
 * Home page: one long scroll. Order = Drip landing (animation) → sections below → Footer is in App.
 * Navbar and Footer live in App and do not overlap the frames; they are separate visible blocks.
 */
export default function HomePage() {
  return (
    <>
      <DripLandingPage />
      {/* <SecondSection /> */}
     
      {/* Add more sections here; they will appear below the drip and be visible on scroll */}
    </>
  );
}
