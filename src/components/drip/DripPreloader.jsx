import React from 'react';

export default function DRIPPreloader({ percent, visible, onVideoEnd }) {
  const videoHandlers = onVideoEnd ? { onEnded: onVideoEnd } : {};
  return (
    <div
      id="preloader-container"
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{ display: visible ? 'block' : 'none' }}
    >
      <div
        id="preloader"
        className={`fixed inset-0 bg-white transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-[520px]">
            <video
              src="/landing.mp4"
              className="w-full h-auto object-contain"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              {...videoHandlers}
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full z-[2]">
          <div
            className="h-[0.22rem] bg-[#7FAF73] transition-[width] duration-300 ease-linear"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="absolute bottom-4 right-4 text-[#111827] text-[clamp(22px,5vw,46px)] font-semibold tracking-tight">
          {percent < 10 ? `0${percent}%` : `${percent}%`}
        </div>
      </div>
    </div>
  );
}
