import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
  AnimatePresence,
} from "framer-motion";
import { FaStar, FaHeart } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const METRICS = [
  {
    id: "units",
    label: "Carry units shipped",
    value: 50,
    suffix: "K+",
    decimals: 0,
  },
  {
    id: "markets",
    label: "Markets worldwide",
    value: 24,
    suffix: "+",
    decimals: 0,
  },
  {
    id: "rating",
    label: "Avg. product rating",
    value: 4.9,
    suffix: "",
    decimals: 1,
  },
  {
    id: "qc",
    label: "QC pass rate",
    value: 100,
    suffix: "%",
    decimals: 0,
  },
];

function MetricRollValue({ end, suffix, decimals, inView, delay }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, end, {
      duration: 1.25,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, end, delay]);

  const text =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span className="tabular-nums">
      {text}
      {suffix}
    </span>
  );
}

const AboutUs = () => {
  const pageRef = useRef(null);
  const leafRef = useRef(null);
  const leafStartRef = useRef(null);
  const leafEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const metricsRibbonRef = useRef(null);
  const metricsInView = useInView(metricsRibbonRef, {
    root: scrollContainerRef,
    once: true,
    amount: 0.35,
    margin: "0px 0px -12% 0px",
  });

  // About section refs and state
  const containerRef = useRef(null);
  const imageStackRef = useRef(null);
  const [imageContainerHeight, setImageContainerHeight] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Function to handle next testimonial
  const showNextTestimonial = () => {
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex + 1) % testimonials.length
    );
  };

  // Function to handle previous testimonial
  const showPrevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance testimonials on small screens only
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    let intervalId;
    const start = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      if (mq.matches) {
        intervalId = setInterval(() => {
          setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
        }, 3500);
      }
    };
    start();
    mq.addEventListener("change", start);
    return () => {
      mq.removeEventListener("change", start);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Restaurant Facilities data
  const facilities = [
    {
      id: 1,
      title: "CLEAN DESIGN LANGUAGE",
      description:
        "Every surface, line, and proportion is shaped for visual clarity and modern everyday carry.",
      image: "/a1.png",
    },
    {
      id: 2,
      title: "STRUCTURAL DURABILITY",
      description:
        "Engineered to handle routine motion and daily pressure without compromise in form or function.",
      image: "/a2.png",
    },
    {
      id: 3,
      title: "SEAMLESS USABILITY",
      description:
        "Built to integrate naturally into workflow, commute, and lifestyle with zero friction.",
      image: "/a3.png",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Rohan Mehta",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "The finish feels genuinely premium—matte, even, and the lid action is tight without being fiddly. Ice still there at the end of a long workday. This is the tumbler I reach for every morning.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Lin",
      role: "Verified purchase",
      time: "a week ago",
      review:
        "Finally a bottle that looks as good on a desk as it does in the car. Fits my cup holder perfectly, zero leaks so far, and the pastel green reads subtle and high-end—not loud.",
      rating: 5,
    },
    {
      id: 3,
      name: "James Okafor",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "Insulation is the real deal. Hot stays hot, cold stays cold, and the mouthfeel of the rim is comfortable for all-day sipping. Build quality matches the price—you can tell it was engineered, not decorated.",
      rating: 5,
    },
    {
      id: 4,
      name: "Ananya Krishnan",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "I rotate between the gym and client meetings—T-REX is the one product that doesn’t look out of place in either setting. Clean lines, solid weight, no gimmicks. Exactly what I wanted from a premium carry.",
      rating: 5,
    },
    {
      id: 5,
      name: "Marcus Bell",
      role: "Verified purchase",
      time: "a week ago",
      review:
        "Dropped it once on tile—no dents, no drama. The exterior still looks new. If you care about durability and a quiet, confident design language, this brand gets it.",
      rating: 5,
    },
    {
      id: 6,
      name: "Elena Varga",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "The lid seals with a satisfying click and doesn’t collect grime in awkward corners—small detail, huge difference for daily use. T-REX feels like something I’ll keep for years, not replace in six months.",
      rating: 5,
    },
    {
      id: 7,
      name: "Vikram Shah",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "I’ve tried a few ‘premium’ tumblers; T-REX is the first where the branding feels earned. Minimal, precise, and the product actually performs when you’re commuting, hiking, or stuck in back-to-back calls.",
      rating: 5,
    },
    {
      id: 8,
      name: "Chloe Park",
      role: "Verified purchase",
      time: "2 weeks ago",
      review:
        "Love the understated color and the way it sits in hand—balanced, not bulky. Condensation is minimal and it never sweats through my bag. This is everyday carry done right.",
      rating: 5,
    },
  ];

  useLayoutEffect(() => {
    // Use app's actual scroll container for scroll-driven animations
    scrollContainerRef.current = document.querySelector(".main-content");
  }, []);

  // Get scroll progress for About section
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Spring-smooth scroll progress for buttery zoom in/out based on direction
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    mass: 0.5,
  });

  // Hero image zoom: scroll down -> zoom in, scroll up -> zoom out
  const backImageScale = useTransform(smoothScrollProgress, [0, 1], [0.9, 1.7]);
  const frontImageScale = useTransform(smoothScrollProgress, [0, 1], [0.92, 1.55]);

  // Animation variants for Restaurant Facilities
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Simple scroll-based leaf animation using Framer Motion
  const { scrollYProgress: leafScrollProgress } = useScroll({
    container: scrollContainerRef,
    target: pageRef,
    offset: ["start start", "end end"],
  });

  // Transform scroll progress to leaf position and rotation
  const leafY = useTransform(leafScrollProgress, [0, 1], [0, 800]); // Falls down 800px
  const leafX = useTransform(leafScrollProgress, [0, 1], [0, -100]); // Slight drift left
  const leafRotation = useTransform(leafScrollProgress, [0, 1], [0, 180]); // Gentle rotation
  const leafSway = useTransform(
    leafScrollProgress,
    (progress) => Math.sin(progress * 8) * 20
  ); // Natural swaying

  // About section effects
  useEffect(() => {
    if (imageStackRef.current) {
      setImageContainerHeight(imageStackRef.current.offsetHeight);

      const handleResize = () => {
        setImageContainerHeight(imageStackRef.current.offsetHeight);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Animate images with staggered effect
    tl.fromTo(
      ".food-image",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      }
    )
      .fromTo(
        ".badge-16",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" },
        "-=0.4"
      )
      .fromTo(
        ".quote-section",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2"
      );

    // Floating animation for decorative elements
    gsap.to(".floating-leaf", {
      y: -10,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      stagger: 0.5,
    });
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative font-['Plus_Jakarta_Sans'] text-black pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* ABOUT SECTION */}
      <div
        ref={containerRef}
        className="relative min-h-screen bg-gradient-to-br from-white via-[#F9FCF8] to-white overflow-hidden"
      >
        {/* Background Decorative Elements */}

        <div
          ref={leafStartRef}
          className="absolute top-60 sm:right-32 right-5 w-40 h-45 opacity-0"
        >
          <img
            src="/corindor.png"
            alt="decorative dish"
            className="w-full h-full"
          />
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-3 text-2xl font-bold tracking-[0.1em] text-black sm:mb-4 sm:text-3xl sm:tracking-[0.12em] md:text-4xl lg:text-5xl">
              ABOUT US
            </h2>
            <div className="flex items-center justify-center gap-2 px-2 sm:gap-3 md:gap-4">
              <div className="h-0.5 w-6 bg-[#7FAF73] sm:w-8 md:w-12"></div>
              <span className="text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7FAF73] sm:text-xs sm:tracking-widest md:text-sm">
                T-REX BRAND PHILOSOPHY
              </span>
              <div className="h-0.5 w-6 bg-[#7FAF73] sm:w-8 md:w-12"></div>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col items-center gap-8 md:mt-0 md:gap-12 lg:gap-16">
            {/* Image Stack */}
            <div
              className="relative flex h-[min(78vw,340px)] w-full items-center justify-center sm:h-[400px] md:h-[520px] lg:h-[600px]"
              ref={imageStackRef}
            >
              {/* Back Image */}
              <motion.div
                className="food-image absolute left-1/2 top-6 z-10 h-[220px] w-[92%] max-w-[900px] -translate-x-1/2 sm:top-8 sm:h-[300px] md:top-10 md:h-[450px] md:w-[850px] lg:h-[550px]"
              >
                <div className="w-full h-full bg-white rounded-md shadow-2xl overflow-hidden">
                  <motion.img
                    src={"./about1.png"}
                    alt="Paneer Tikka"
                    className="w-full h-full object-cover"
                    style={{
                      scale: backImageScale,
                      transformOrigin: "center center",
                      willChange: "transform",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>

              {/* Front Image */}
              <motion.div
                className="food-image absolute right-[2%] top-[190px] z-20 h-[160px] w-[68%] max-w-[500px] sm:top-[220px] sm:h-[200px] md:right-[calc(50%-450px)] md:top-[340px] md:h-[350px] md:w-[500px] lg:right-[calc(50%-480px)]"
              >
                <div className="w-full h-full bg-white rounded-md shadow-2xl overflow-hidden">
                  <motion.img
                    src={"./about2.png"}
                    alt="Veg Spring Rolls"
                    className="w-full h-full object-cover"
                    style={{
                      scale: frontImageScale,
                      transformOrigin: "center center",
                      willChange: "transform",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </motion.div>

              {/* Badge anchor (animations target .badge-16) */}
              <div className="badge-16 absolute left-3 top-3 z-30 md:left-[calc(50%-500px)] md:top-8" />
            </div>

            {/* Quote Section */}
            <div className="quote-section mt-6 w-full max-w-2xl px-1 sm:mt-8 sm:px-4 md:mt-10 md:px-0">
              <div className="relative flex flex-col items-start gap-4 md:flex-row md:gap-6">
                {/* Quote Icon */}
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7FAF73] to-[#719D66] shadow-lg sm:h-12 sm:w-12 md:mt-2 md:h-16 md:w-16">
                  <svg
                    className="h-5 w-5 text-white sm:h-6 sm:w-6 md:h-8 md:w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Quote Text */}
                <div className="mt-2 flex-grow md:mt-10">
                  <p className="text-sm font-light leading-relaxed text-black/80 sm:text-base md:text-lg lg:text-xl">
                    At T-REX, we engineer everyday carry. We operate on a simple
                    principle - essentials should perform at a higher standard,
                    not just in function, but in presence.{" "}
                    <span className="font-semibold border-b-2 border-[#7FAF73] pb-1">
                      No excess. No compromise. Only refined execution.
                    </span>
                  </p>

                  <div className="mt-4 flex items-center gap-3 sm:gap-4">
                    <div className="h-0.5 w-10 bg-[#7FAF73] sm:w-12"></div>
                    <p className="text-sm font-medium text-black/70 sm:text-base">T-REX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* METRICS RIBBON — roll up + count when in view */}
      <motion.section
        ref={metricsRibbonRef}
        className="relative overflow-hidden border-y border-white/25 bg-[#7FAF73] px-3 py-10 sm:px-4 sm:py-12 md:py-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.p
                className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 sm:mb-10 sm:text-xs sm:tracking-[0.22em]"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            By the numbers
          </motion.p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-8">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.id}
                className="text-center"
                initial={{ y: 44, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-1.5 text-2xl font-bold leading-none tracking-tight text-white sm:mb-2 sm:text-3xl md:text-[2.65rem]">
                  <MetricRollValue
                    end={m.value}
                    suffix={m.suffix}
                    decimals={m.decimals}
                    inView={metricsInView}
                    delay={0.2 + i * 0.14}
                  />
                </div>
                <p className="mx-auto max-w-[10rem] text-[11px] font-medium leading-snug text-white/85 sm:max-w-[11rem] sm:text-xs md:text-sm">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* BRAND PRINCIPLES SECTION */}
      <div className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            className="mb-10 text-center sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-2 text-[11px] font-medium tracking-widest text-[#7FAF73] sm:text-sm">
              - T-REX PRINCIPLES -
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl lg:text-5xl">
              BUILT TO PERFORM
            </h1>
          </motion.div>

          {/* Facilities Grid */}
          <motion.div
            className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                className="overflow-hidden rounded-md bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                {/* Image Container */}
                <motion.div
                  className="relative h-52 overflow-hidden sm:h-60 md:h-64"
                  variants={imageVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </motion.div>

                {/* Content */}
                <motion.div
                  className="p-6 text-center sm:p-7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <h3 className="mb-3 text-base font-bold tracking-wide text-black sm:mb-4 sm:text-lg md:text-xl">
                    {facility.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-black/70 sm:text-base">
                    {facility.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="mt-10 flex justify-center sm:mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="h-1 w-14 rounded-full bg-[#7FAF73] sm:w-16"></div>
          </motion.div>
        </div>
      </div>

      {/* ABOUT BRAND SECTION */}
      <div className="overflow-hidden bg-[#F5FAF4] px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            {/* Background text — large screens only */}
            <div className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 lg:block xl:-right-10">
              <span className="block origin-center rotate-[-90deg] whitespace-nowrap text-6xl font-extrabold text-[#7FAF73]/15 xl:text-8xl">
                T-REX
              </span>
            </div>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Left Content */}
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
                  <div className="h-0.5 w-10 bg-[#7FAF73] sm:w-12"></div>
                  <span className="text-xs font-semibold tracking-widest text-[#7FAF73] sm:text-sm">
                    ABOUT T-REX
                  </span>
                </div>
                <h2 className="mb-5 text-2xl font-bold leading-tight text-black sm:mb-6 sm:text-3xl md:text-4xl">
                  PRECISION IN EVERY
                  <br />
                  EVERYDAY ESSENTIAL
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-black/70 sm:mb-8 sm:text-base">
                  Every T-REX product is built through a deliberate process:
                  clean design, structural durability, and seamless usability.
                  We design for consistency, reliability, and long-term use.
                </p>

                {/* Review Box */}
                <div className="mb-6 inline-block w-full max-w-sm rounded-md bg-white p-5 shadow-lg sm:mb-8 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <span className="text-3xl font-bold text-black sm:text-4xl">
                      100%
                    </span>
                    <div>
                      <div className="flex text-[#7FAF73]">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                      <p className="text-xs text-black/60 sm:text-sm">
                        Design-first execution
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-black/70 sm:text-base">
                  <FaHeart className="shrink-0 text-[#7FAF73]" />
                  <span>Built to perform. Designed to represent.</span>
                </div>
              </div>

              {/* Right Content - Images */}
              <div className="relative mt-6 h-[min(70vw,320px)] sm:mt-0 sm:h-[420px] md:h-[520px] lg:h-[600px]">
                <img
                  src="/middle.png"
                  alt=""
                  className="absolute z-10 h-full w-full scale-95 object-contain sm:scale-100"
                />

                {/* Decorative background circle */}
                <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-[#7FAF73]/15 sm:h-[360px] sm:w-[360px] md:h-[440px] md:w-[440px] lg:h-[500px] lg:w-[500px]"></div>

              

               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="overflow-hidden bg-gradient-to-br from-white via-[#FAFCF9] to-[#F3F8F2] py-12 sm:py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-7xl px-4 sm:mb-12 sm:px-6 md:mb-16">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-2 text-[11px] font-medium tracking-widest text-[#7FAF73] sm:text-sm">
              - WHY T-REX -
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-4xl lg:text-5xl">
              DESIGNED TO REPRESENT
            </h1>
            <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center justify-center gap-3 sm:mt-5 sm:flex-row sm:gap-4 md:mt-6">
              <div className="flex shrink-0 text-lg text-[#7FAF73] sm:text-xl md:text-2xl">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="text-center text-sm font-medium leading-snug text-black/70 sm:text-left sm:text-base">
                Not just hydration — control, clarity, and intent in motion.
              </span>
            </div>
          </motion.div>
        </div>

        {/* Desktop Infinite Scrolling Testimonials */}
        <div className="relative hidden md:block">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -100 * testimonials.length],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: testimonials.length * 8,
                ease: "linear",
              },
            }}
            whileHover={{
              animationPlayState: "paused",
            }}
            style={{
              width: `${testimonials.length * 2 * 400}px`,
            }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={`desktop-${testimonial.id}`}
                className="mx-2 w-[min(100%,320px)] shrink-0 rounded-md bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:mx-3 sm:w-80 sm:p-6 md:w-96"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex text-[#7FAF73] mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <p className="text-black/80 leading-relaxed mb-4 text-sm line-clamp-4">
                  "{testimonial.review}"
                </p>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-black text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-black/60 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-black/45 text-xs">
                        {testimonial.time}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-[#7FAF73] rounded-full mr-1"></div>
                        <span className="text-xs text-black font-medium">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Second set for seamless loop */}
            {testimonials.map((testimonial) => (
              <motion.div
                key={`desktop-second-${testimonial.id}`}
                className="mx-2 w-[min(100%,320px)] shrink-0 rounded-md bg-white p-5 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:mx-3 sm:w-80 sm:p-6 md:w-96"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex text-[#7FAF73] mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-sm" />
                  ))}
                </div>
                <p className="text-black/80 leading-relaxed mb-4 text-sm line-clamp-4">
                  "{testimonial.review}"
                </p>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-black text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-black/60 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-black/45 text-xs">
                        {testimonial.time}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-[#7FAF73] rounded-full mr-1"></div>
                        <span className="text-xs text-black font-medium">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop Gradient Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FAFCF9] to-transparent sm:w-24 md:w-32"></div>
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FAFCF9] to-transparent sm:w-24 md:w-32"></div>
        </div>

        {/* Mobile Single Card View */}
        <div className="relative px-4 pb-2 md:hidden">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="mx-auto w-full max-w-lg rounded-md bg-white p-5 shadow-lg sm:p-6"
              >
                <div className="mb-4 flex text-[#7FAF73]">
                  {[...Array(testimonials[currentTestimonialIndex].rating)].map(
                    (_, i) => (
                      <FaStar key={i} className="text-sm" />
                    )
                  )}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-black/80">
                  &ldquo;{testimonials[currentTestimonialIndex].review}&rdquo;
                </p>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-black text-sm">
                        {testimonials[currentTestimonialIndex].name}
                      </h4>
                      <p className="text-black/60 text-xs">
                        {testimonials[currentTestimonialIndex].role}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-black/45 text-xs">
                        {testimonials[currentTestimonialIndex].time}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-[#7FAF73] rounded-full mr-1"></div>
                        <span className="text-xs text-black font-medium">
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile prev / next */}
        <div className="relative mt-5 px-4 md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <motion.button
              type="button"
              aria-label="Previous testimonial"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={showPrevTestimonial}
              className="z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-[#7FAF73] shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next testimonial"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={showNextTestimonial}
              className="z-20 flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white text-[#7FAF73] shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-8 flex justify-center px-4 sm:mt-12">
          <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#7FAF73] to-[#719D66] sm:w-16"></div>
        </div>
      </div>

      {/* Animated corindor Leaf
      <motion.img
        src="/corindor.png"
        alt="Floating corindor leaf"
        className="w-12 h-12 sm:w-20 sm:h-20 pointer-events-none"
        style={{
          position: "fixed",
          top: "80px",
          right: window.innerWidth < 640 ? "20px" : "80px", // Adjust right position for mobile
          zIndex: 1000,
          x: useTransform([leafX, leafSway], ([x, sway]) => x + sway),
          y: leafY,
          rotate: leafRotation,
          opacity: 1,
        }}
      /> */}
    </div>
  );
};

export default AboutUs;