import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOBILE_SEQUENCE_SCROLL_VH } from '../../hooks/useSequencePreload';

gsap.registerPlugin(ScrollTrigger);

const ASSETS = '/assets/images';

const SECTION_HEIGHT_VH = 100;
const NUM_SECTIONS = 11;

/** Mobile scroll heights: total must equal MOBILE_SEQUENCE_SCROLL_VH. Last section is 2× a normal slice so sticky CTA has runway; first 10 share the remainder. */
const MOBILE_SCROLL_TOTAL = MOBILE_SEQUENCE_SCROLL_VH;
const lastMobileSectionVh = (2 * MOBILE_SCROLL_TOTAL) / NUM_SECTIONS;
const firstTenMobileSectionVh = (MOBILE_SCROLL_TOTAL - lastMobileSectionVh) / 10;

/**
 * SCROLL MODEL: Canvas is fixed while scrolling through the sequence. When the end of the
 * animation (last frame) is reached, the canvas is "unsticky" (hidden) so content below
 * (DummySection, Footer in App) is fully visible. Footer lives in App.jsx only.
 */
export default function DRIPLandingSequence({ frames, sequenceReady }) {
  const sequenceBlockRef = useRef(null);
  const canvasRef = useRef(null);
  const ctaRef = useRef(null);
  // Lerp state — target is set by ScrollTrigger, current is advanced each rAF tick
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (!frames || frames.length === 0 || !sequenceBlockRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mobile = window.innerWidth <= 1081;
    const width = mobile ? 1080 : 1920;
    const height = mobile ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    const maxFrame = frames.length - 1;
    // Last ~30 frames: show product CTAs (desktop CTA overlay; range scales with sequence length)
    const CTA_FRAME_COUNT = 30;
    const ctaFrameStart = Math.max(0, maxFrame - CTA_FRAME_COUNT + 1);

    function drawFrame(index) {
      const i = Math.max(0, Math.min(index, maxFrame));
      const img = frames[i];
      if (!img || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mobile) {
        // Phone: contain (full frame visible — no left/right crop). Bottom-aligned; top letterbox is white and blends with the page.
        const iw = img.naturalWidth || 1;
        const ih = img.naturalHeight || 1;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.min(cw / iw, ch / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (cw - dw) / 2;
        const dy = ch - dh;
        ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        // Desktop: slight zoom + bleed to hide seams
        const bleed = 40;
        const scale = 1.04;
        const targetWidth = (canvas.width + bleed * 2) * scale;
        const targetHeight = canvas.height * scale;
        const offsetX = -bleed - (targetWidth - (canvas.width + bleed * 2)) / 2;
        const offsetY = -(targetHeight - canvas.height) / 2;
        ctx.drawImage(img, offsetX, offsetY, targetWidth, targetHeight);
      }
    }

    const scroller = document.querySelector('.main-content') || window;

    // rAF render loop — lerps currentFrame toward targetFrame each paint tick.
    // This decouples scroll events from canvas drawing and gives silky smooth motion.
    const LERP = 0.18; // 0–1: higher = snappier, lower = more lag
    let lastDrawn = -1;

    function renderLoop() {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const next = current + (target - current) * LERP;

      // Snap to target when very close to avoid endless micro-movement
      const snapped = Math.abs(next - target) < 0.5 ? target : next;
      currentFrameRef.current = snapped;

      const displayFrame = Math.min(Math.round(snapped), maxFrame);
      if (displayFrame !== lastDrawn) {
        drawFrame(displayFrame);
        lastDrawn = displayFrame;

        // CTA visibility — direct DOM, zero React lag
        if (ctaRef.current) {
          const inRange = displayFrame >= ctaFrameStart && displayFrame <= maxFrame;
          ctaRef.current.style.transition = inRange
            ? 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)'
            : 'none';
          ctaRef.current.style.opacity = inRange ? '1' : '0';
        }
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    }

    rafIdRef.current = requestAnimationFrame(renderLoop);

    // ScrollTrigger only updates the target frame — no drawing happens here
    const trigger = ScrollTrigger.create({
      trigger: sequenceBlockRef.current,
      scroller,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        targetFrameRef.current = Math.round(self.progress * maxFrame);
      },
    });

    // Premium horizontal parallax reveal for text blocks
    // scrub: 0.6 adds a small lag that smooths out fast/jerky scrolls
    gsap.utils.toArray('.DRIP-parallax-left').forEach((el) => {
      gsap.fromTo(
        el,
        { xPercent: 20, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.6,
          },
        },
      );
    });

    gsap.utils.toArray('.DRIP-parallax-right').forEach((el) => {
      gsap.fromTo(
        el,
        { xPercent: -20, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 0.6,
          },
        },
      );
    });

    if (mobile) {
      gsap.utils.toArray('.DRIP-mobile-section-inner').forEach((el) => {
        const section = el.closest('.DRIP-mobile-section');
        if (!section || section.classList.contains('DRIP-mobile-section--final')) return;
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              scroller,
              start: 'top 92%',
              end: 'top 36%',
              scrub: 0.72,
            },
          },
        );
      });
      ScrollTrigger.refresh();
    }

    drawFrame(0);

    return () => {
      trigger.kill();
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [frames]);

  const scrollToBottom = () => {
    const main = document.querySelector('.main-content');
    if (main) main.scrollTo({ top: main.scrollHeight, behavior: 'smooth' });
    else window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };
  if (!sequenceReady) {
    return (
      <div className="DRIP-landing-sequence-container h-screen bg-black flex items-center justify-center">
        <p className="text-black">Loading sequence…</p>
      </div>
    );
  }

  return (
    <div className="DRIP-landing-sequence-container">
      {/* Wrapper so sequence + footer sit above the fixed canvas and are visible when you scroll past the frames */}
      <div className="DRIP-sequence-content-wrapper">
      <div ref={sequenceBlockRef} className="DRIP-sequence-block">
        {/* Desktop (≥1082px): section-wise overlay; scroll drives frames */}
        <div className="hidden min-[1082px]:block">
          {/* Section 0 – hero copy kept away from center product */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-sm space-y-7">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 leading-tight">
                  A better
                </h1>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#7FAF73] leading-tight">
                  everyday tumbler
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-snug max-w-xs">
                  Built to disappear into your<br />routine, not your cupboard.
                </p>
              </div>
              <div className="hidden md:flex flex-1 justify-end">
                {/* empty spacer so copy hugs the left / product stays visually centered */}
              </div>
            </div>
          </section>

          {/* Section 1 – left copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-md space-y-7">
                <h2 className="text-5xl md:text-6xl lg:text-[3.6rem] font-semibold tracking-tight text-gray-900 leading-tight">
                  Designed for<br />everyday carry
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-snug">
                  Lightweight yet durable stainless steel<br />construction for work, travel and daily use.
                </p>
              </div>
              <div className="hidden md:flex flex-1 justify-end" />
            </div>
          </section>

          {/* Section 2 – right copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="hidden md:flex flex-1" />
              <div className="DRIP-parallax-right max-w-md space-y-7 text-right">
                <div className="space-y-1">
                  <h1 className="text-6xl md:text-7xl lg:text-[4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    Sleek
                  </h1>
                  <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                    design
                  </h2>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-snug">
                  Clean stainless steel, soft curves,<br />and a handle that feels natural in your hand.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 – left copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-md space-y-7">
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-snug">
                  A thoughtfully designed lid handle<br />keeps your grip secure and comfortable,<br />from commute to weekend.
                </p>
              </div>
              <div className="hidden md:flex flex-1 justify-end" />
            </div>
          </section>

          {/* Section 4 – right copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="hidden md:flex flex-1" />
              <div className="DRIP-parallax-right max-w-md space-y-7 text-right">
                <div className="space-y-1">
                  <h1 className="text-6xl md:text-7xl lg:text-[4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    Flip-top
                  </h1>
                  <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                    drinking lid
                  </h2>
                </div>
                <div className="space-y-1">
                  <h2 className="text-4xl md:text-5xl lg:text-[2.8rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    One‑flip
                  </h2>
                  <h1 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                    easy sip
                  </h1>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 – left copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-md space-y-7">
                <div className="space-y-1">
                  <h1 className="text-6xl md:text-7xl lg:text-[4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    Direct
                  </h1>
                  <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                    drink
                  </h2>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-snug">
                  A simple lid, tuned for smooth,<br />direct sipping every time.
                </p>
              </div>
              <div className="hidden md:flex flex-1 justify-end" />
            </div>
          </section>

          {/* Section 6 – right copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="hidden md:flex flex-1" />
              <div className="DRIP-parallax-right max-w-md space-y-7 text-right">
                <h1 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                  Built‑in straw
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-[2.8rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                  Food‑grade silicone<br />designed for daily use.
                </h2>
              </div>
            </div>
          </section>

          {/* Section 7 – left copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-md space-y-5">
                <h1 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                  Total capacity
                </h1>
                <h2 className="text-6xl md:text-7xl lg:text-[4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                  1 L
                </h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end" />
            </div>
          </section>

          {/* Section 8 – right copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="hidden md:flex flex-1" />
              <div className="DRIP-parallax-right max-w-md space-y-7 text-right">
                <div className="space-y-1">
                  <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    Stable
                  </h2>
                  <h1 className="text-6xl md:text-7xl lg:text-[4rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                    grip
                  </h1>
                  <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                    base
                  </h2>
                </div>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-snug">
                  A rubber‑padded base keeps the tumbler<br />stable on any surface while softening noise<br />and preventing scratches.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9 – left copy */}
          <section className="min-h-screen w-full flex items-center px-6 lg:px-24">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
              <div className="DRIP-parallax-left max-w-md space-y-5">
                <h2 className="text-4xl md:text-5xl lg:text-[3rem] font-semibold tracking-tight text-gray-900 leading-tight">
                  Disinfection rate
                </h2>
                <h1 className="text-7xl md:text-8xl lg:text-[4.6rem] font-semibold tracking-tight text-[#7FAF73] leading-tight">
                  99%
                </h1>
              </div>
              <div className="hidden md:flex flex-1 justify-end" />
            </div>
          </section>

          {/* Section 10 + CTA — tall section + sticky copy so “Ready to experience” stays visible (no parallax fade-out) */}
          <section className="min-h-[200vh] w-full flex items-start justify-center px-6 pt-[12vh] lg:px-24 lg:pt-[14vh]">
            <div className="DRIP-sticky-ready sticky top-[min(20vh,9rem)] z-10 mx-auto w-full max-w-md space-y-9 text-center">
              <h2 className="text-5xl md:text-6xl lg:text-[3.4rem] font-semibold tracking-tight text-gray-900 leading-tight">
                Ready to<br />experience it?
              </h2>
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 rounded-full bg-[#7FAF73] px-8 py-3 text-sm md:text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#719D66] transition-colors"
              >
                Buy now
              </Link>
            </div>
          </section>
        </div>

        {/* Phone (≤1081px): same story beats as desktop, center-aligned, above the canvas; scroll height matches frame mapping */}
        <div className="min-[1082px]:hidden relative z-20">
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-4 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">A better</h1>
              <h2 className="text-3xl font-semibold tracking-tight text-[#7FAF73] leading-tight">everyday tumbler</h2>
              <p className="text-base text-gray-700 leading-relaxed">Built to disappear into your routine, not your cupboard.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-4 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">Designed for everyday carry</h2>
              <p className="text-base text-gray-700 leading-relaxed">Lightweight yet durable stainless steel construction for work, travel and daily use.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">Sleek</h1>
              <h2 className="text-3xl font-semibold tracking-tight text-[#7FAF73] leading-tight">design</h2>
              <p className="text-base text-gray-700 leading-relaxed">Clean stainless steel, soft curves, and a handle that feels natural in your hand.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md text-center">
              <p className="text-base text-gray-700 leading-relaxed">A thoughtfully designed lid handle keeps your grip secure and comfortable, from commute to weekend.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">Flip-top</h1>
              <h2 className="text-3xl font-semibold tracking-tight text-[#7FAF73] leading-tight">drinking lid</h2>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 leading-tight">One-flip easy sip</h2>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">Direct</h1>
              <h2 className="text-3xl font-semibold tracking-tight text-[#7FAF73] leading-tight">drink</h2>
              <p className="text-base text-gray-700 leading-relaxed">A simple lid, tuned for smooth, direct sipping every time.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">Built-in straw</h1>
              <h2 className="text-2xl font-semibold tracking-tight text-[#7FAF73] leading-tight">Food-grade silicone designed for daily use.</h2>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-gray-900 leading-tight">Total capacity</h1>
              <h2 className="text-5xl font-semibold tracking-tight text-[#7FAF73] leading-tight">1 L</h2>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">Stable grip base</h2>
              <p className="text-base text-gray-700 leading-relaxed">A rubber-padded base keeps the tumbler stable on any surface while softening noise and preventing scratches.</p>
            </div>
          </section>
          <section className="DRIP-mobile-section flex w-full items-center justify-center px-5" style={{ minHeight: `${firstTenMobileSectionVh}vh` }}>
            <div className="DRIP-mobile-section-inner mx-auto max-w-md space-y-3 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">Disinfection rate</h2>
              <h1 className="text-6xl font-semibold tracking-tight text-[#7FAF73] leading-tight">99%</h1>
            </div>
          </section>
          {/* Final beat: no scrub on inner. Sticky top matches nav (72px) so CTA never rides above the bar; taller section = longer pin before scroll-out. */}
          <section
            className="DRIP-mobile-section DRIP-mobile-section--final flex w-full items-start justify-center px-5"
            style={{ minHeight: `${lastMobileSectionVh}vh` }}
          >
            <div className="sticky top-[72px] z-20 mx-auto w-full max-w-md space-y-6 px-2 py-2 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 leading-tight">Ready to experience it?</h2>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
              >
                Buy now
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Scroll-release zone: transparent spacer that gives the scroll enough room to reach
          progress=1.0 without visually covering the fixed canvas beneath it. */}
      <div className="h-screen w-full bg-transparent" aria-hidden="true" />
      </div>

      {/* Fixed canvas — always visible, stays on last frame once animation completes */}
      <div className="DRIP-canvas-container">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Product CTAs — z above canvas + scroll copy; on phone sits lower and can overlap tumblers */}
      <div
        ref={ctaRef}
        className="fixed left-0 z-[60] w-screen pointer-events-none max-[1081px]:bottom-[30%] max-[1081px]:top-auto max-[1081px]:h-auto min-[1082px]:top-[100px] min-[1082px]:h-[calc(100vh-100px)]"
        style={{
          opacity: 0,
          transition: 'none',
        }}
      >
        {/* Desktop: absolute positions over sequence */}
        <div className="relative hidden h-full min-[1082px]:block">
          <Link
            to="/product/sage-green"
            className="absolute pointer-events-auto flex flex-col items-center gap-1.5"
            style={{ left: '30%', top: '14%', transform: 'translateX(-50%)' }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">₹2,499</span>
              <span className="text-xs font-medium text-gray-400 line-through">₹3,000</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#7FAF73] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(127,175,115,0.35)] hover:bg-[#6a9e63] transition-all duration-300">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0">
                <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L9.22 5.03a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-gray-900 mt-0.5">Sage Green</span>
          </Link>
          <Link
            to="/product/blush-pink"
            className="absolute pointer-events-auto flex flex-col items-center gap-1.5"
            style={{ left: '69%', top: '14%', transform: 'translateX(-50%)' }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">₹2,499</span>
              <span className="text-xs font-medium text-gray-400 line-through">₹3,000</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#7FAF73] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_rgba(127,175,115,0.35)] hover:bg-[#6a9e63] transition-all duration-300">
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0">
                <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L9.22 5.03a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-gray-900 mt-0.5">Blush Pink</span>
          </Link>
        </div>

        {/* Phone: two columns, centered, nowrap buttons, sits above frames */}
        <div className="flex min-[1082px]:hidden w-full justify-center px-2">
          <div className="flex w-full max-w-sm items-start justify-between gap-3 sm:gap-4 pointer-events-auto">
            <Link to="/product/sage-green" className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0">
                <span className="text-xs font-semibold text-gray-900 sm:text-sm">₹2,499</span>
                <span className="text-[10px] font-medium text-gray-400 line-through sm:text-xs">₹3,000</span>
              </div>
              <span className="inline-flex w-fit max-w-full items-center justify-center gap-1 rounded-full bg-[#7FAF73] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_16px_rgba(127,175,115,0.4)] whitespace-nowrap">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5 shrink-0">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L9.22 5.03a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-900 sm:text-[11px] sm:tracking-[0.16em]">Sage Green</span>
            </Link>
            <Link to="/product/blush-pink" className="flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center">
              <div className="flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0">
                <span className="text-xs font-semibold text-gray-900 sm:text-sm">₹2,499</span>
                <span className="text-[10px] font-medium text-gray-400 line-through sm:text-xs">₹3,000</span>
              </div>
              <span className="inline-flex w-fit max-w-full items-center justify-center gap-1 rounded-full bg-[#7FAF73] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_16px_rgba(127,175,115,0.4)] whitespace-nowrap">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-2.5 w-2.5 shrink-0">
                  <path fillRule="evenodd" d="M2 8a.75.75 0 01.75-.75h8.69L9.22 5.03a.75.75 0 011.06-1.06l3.5 3.5a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 11-1.06-1.06l2.22-2.22H2.75A.75.75 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-900 sm:text-[11px] sm:tracking-[0.16em]">Blush Pink</span>
            </Link>
          </div>
        </div>
      </div>

      <button type="button" className="DRIP-scroll-to-bottom" onClick={scrollToBottom} aria-label="Scroll to bottom">
        <img src={`${ASSETS}/scroll-bottom.svg`} alt="" />
      </button>

      {(!frames || frames.length === 0) && (
        <p className="fixed bottom-20 left-1/2 -translate-x-1/2 text-black/70 text-xs z-10 max-w-md text-center">
          Add sequence frames under public/assets/seq/ — phone uses desktop-webp/; wide screens use mobile-webp/. See
          useSequencePreload.js.
        </p>
      )}
    </div>
  );
}
