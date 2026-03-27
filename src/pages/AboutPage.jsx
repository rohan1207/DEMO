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

  // Auto-slide effect for mobile testimonials
  useEffect(() => {
    if (window.innerWidth < 768) {
      // Only run on mobile
      const timer = setInterval(() => {
        showNextTestimonial();
      }, 3000); // Change testimonial every 3 seconds

      return () => clearInterval(timer);
    }
  }, [currentTestimonialIndex]);

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
      className="relative font-['Plus_Jakarta_Sans'] text-black"
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

        <div className="container mx-auto px-6 py-16">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-[0.12em] px-4">
              ABOUT US
            </h2>
            <div className="flex items-center justify-center gap-2 md:gap-4 px-4">
              <div className="w-8 md:w-12 h-0.5 bg-[#7FAF73]"></div>
              <span className="text-[#7FAF73] font-semibold text-xs md:text-sm tracking-widest">
                T-REX BRAND PHILOSOPHY
              </span>
              <div className="w-8 md:w-12 h-0.5 bg-[#7FAF73]"></div>
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-8 md:gap-16 mt-8 md:mt-0">
            {/* Image Stack */}
            <div
              className="relative w-full flex justify-center items-center h-[400px] md:h-[600px]"
              ref={imageStackRef}
            >
              {/* Back Image - Paneer Tikka */}
              <motion.div
                className="food-image absolute w-[90%] md:w-[850px] h-[300px] md:h-[550px] z-10"
                style={{
                  top: "40px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
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

              {/* Front Image - Spring Rolls */}
              <motion.div
                className="food-image absolute w-[65%] md:w-[500px] h-[200px] md:h-[350px] z-20"
                style={{
                  top: "260px",
                  right: "2%",
                  "@media (min-width: 768px)": {
                    top: "350px",
                    right: "calc(50% - 450px)",
                  },
                }}
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

              {/* 16 Years Badge */}
              <div
                className="badge-16 absolute z-30"
                style={{
                  top: "10px",
                  left: "10px",
                  "@media (min-width: 768px)": {
                    top: "30px",
                    left: "calc(50% - 500px)",
                  },
                }}
              >
               
              </div>
            </div>

            {/* Quote Section */}
            <div className="w-full max-w-2xl quote-section mt-8 px-4 md:px-0">
              <div className="relative flex flex-col md:flex-row items-start gap-4">
                {/* Quote Icon */}
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#7FAF73] to-[#719D66] rounded-full flex items-center justify-center shadow-lg mt-2">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Quote Text */}
                <div className="flex-grow mt-4 md:mt-10">
                  <p className="text-base md:text-xl text-black/80 leading-relaxed font-light">
                    At T-REX, we engineer everyday carry. We operate on a simple
                    principle - essentials should perform at a higher standard,
                    not just in function, but in presence.{" "}
                    <span className="font-semibold border-b-2 border-[#7FAF73] pb-1">
                      No excess. No compromise. Only refined execution.
                    </span>
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="w-12 h-0.5 bg-[#7FAF73]"></div>
                    <p className="text-md text-black/70 font-medium">T-REX</p>
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
        className="relative overflow-hidden bg-[#7FAF73] py-12 sm:py-14 px-4 border-y border-white/25"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.p
            className="text-center text-white/90 text-xs font-semibold tracking-[0.22em] uppercase mb-10"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            By the numbers
          </motion.p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:gap-8">
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
                <div className="text-3xl sm:text-4xl md:text-[2.65rem] font-bold text-white mb-2 leading-none tracking-tight">
                  <MetricRollValue
                    end={m.value}
                    suffix={m.suffix}
                    decimals={m.decimals}
                    inView={metricsInView}
                    delay={0.2 + i * 0.14}
                  />
                </div>
                <p className="text-xs sm:text-sm text-white/85 font-medium leading-snug max-w-[11rem] mx-auto">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* BRAND PRINCIPLES SECTION */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-[#7FAF73] text-sm font-medium tracking-widest mb-2">
              - T-REX PRINCIPLES -
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              BUILT TO PERFORM
            </h1>
          </motion.div>

          {/* Facilities Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                className="bg-white rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                {/* Image Container */}
                <motion.div
                  className="relative h-64 overflow-hidden"
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
                  className="p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <h3 className="text-xl font-bold text-black mb-4 tracking-wide">
                    {facility.title}
                  </h3>
                  <p className="text-black/70 leading-relaxed">
                    {facility.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="w-16 h-1 bg-[#7FAF73] rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* ABOUT BRAND SECTION */}
      <div className="bg-[#F5FAF4] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Background text */}
            <div className="hidden lg:block absolute -right-20 top-1/2 transform -translate-y-1/2">
              <span className="text-9xl font-extrabold text-[#7FAF73]/20 transform -rotate-90 whitespace-nowrap">
                DELICIOUS DINING
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-0.5 bg-[#7FAF73]"></div>
                  <span className="text-[#7FAF73] font-semibold text-sm tracking-widest">
                    ABOUT T-REX
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-black mb-6 leading-tight">
                  PRECISION IN EVERY
                  <br />
                  EVERYDAY ESSENTIAL
                </h2>
                <p className="text-black/70 mb-8">
                  Every T-REX product is built through a deliberate process:
                  clean design, structural durability, and seamless usability.
                  We design for consistency, reliability, and long-term use.
                </p>

                {/* Review Box */}
                <div className="bg-white p-6 rounded-md shadow-lg mb-8 inline-block">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-black">
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
                      <p className="text-black/60 text-sm">
                        Design-first execution
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-black/70">
                  <FaHeart className="text-[#7FAF73]" />
                  <span>Built to perform. Designed to represent.</span>
                </div>
              </div>

              {/* Right Content - Images */}
              <div className="relative h-[400px] sm:h-[600px] mt-8 sm:mt-0">
                <img
                  src="/middle.png"
                  alt="Chef"
                  className="absolute z-10 w-full h-full object-contain scale-90 sm:scale-100"
                />

                {/* Decorative background circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-[#7FAF73]/15 rounded-full"></div>

              

               
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="bg-gradient-to-br from-white via-[#FAFCF9] to-[#F3F8F2] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-16">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-[#7FAF73] text-sm font-medium tracking-widest mb-2">
              - WHY T-REX -
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
              DESIGNED TO REPRESENT
            </h1>
            <div className="flex items-center justify-center mt-4">
              <div className="flex text-[#7FAF73] text-2xl">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <span className="ml-3 text-black/70 font-medium">
                Not just hydration - control, clarity, and intent in motion.
              </span>
            </div>

            {/* Mobile Navigation Arrows */}
            <div className="flex justify-center items-center gap-4 mt-6 md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#7FAF73] border border-black/5"
                onClick={() => {
                  const cards = document.querySelectorAll(
                    ".testimonial-card-mobile"
                  );
                  const activeCard = document.querySelector(
                    ".testimonial-card-mobile.active"
                  );
                  const currentIndex = Array.from(cards).indexOf(activeCard);
                  const prevIndex =
                    (currentIndex - 1 + cards.length) % cards.length;
                  activeCard.classList.remove("active");
                  cards[prevIndex].classList.add("active");
                }}
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#7FAF73] border border-black/5"
                onClick={() => {
                  const cards = document.querySelectorAll(
                    ".testimonial-card-mobile"
                  );
                  const activeCard = document.querySelector(
                    ".testimonial-card-mobile.active"
                  );
                  const currentIndex = Array.from(cards).indexOf(activeCard);
                  const nextIndex = (currentIndex + 1) % cards.length;
                  activeCard.classList.remove("active");
                  cards[nextIndex].classList.add("active");
                }}
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
                className="flex-shrink-0 w-96 bg-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mx-3"
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
                className="flex-shrink-0 w-96 bg-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mx-3"
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
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#FAFCF9] to-transparent pointer-events-none z-10"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FAFCF9] to-transparent pointer-events-none z-10"></div>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="md:hidden relative px-4 mb-8">
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={showPrevTestimonial}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#7FAF73] border border-black/5 z-20"
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={showNextTestimonial}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#7FAF73] border border-black/5 z-20"
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

        {/* Mobile Single Card View */}
        <div className="md:hidden relative px-4">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white rounded-md shadow-lg p-6 mx-auto"
              >
                <div className="flex text-[#7FAF73] mb-4">
                  {[...Array(testimonials[currentTestimonialIndex].rating)].map(
                    (_, i) => (
                      <FaStar key={i} className="text-sm" />
                    )
                  )}
                </div>
                <p className="text-black/80 leading-relaxed mb-4 text-sm">
                  "{testimonials[currentTestimonialIndex].review}"
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

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-12">
          <div className="w-16 h-1 bg-gradient-to-r from-[#7FAF73] to-[#719D66] rounded-full"></div>
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