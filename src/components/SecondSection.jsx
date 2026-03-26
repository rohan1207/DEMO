import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShoppingCart, Thermometer, ShieldCheck, Droplets, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const SAGE      = "#7A9A7C";
const SAGE_LIGHT = "rgba(122,154,124,0.10)";
const SAGE_MID   = "rgba(122,154,124,0.18)";

const inter = {
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Text', sans-serif",
};

const SecondSection = () => {
  const features = [
    {
      Icon: Thermometer,
      title: "Temperature That Lasts",
      subtitle:
        "Double-wall vacuum insulation keeps your cold drinks icy for 24 hrs and hot drinks steaming for 12 hrs — every single time.",
    },
    {
      Icon: Zap,
      title: "One-Click Flip Lid",
      subtitle:
        "Precision-engineered flip-top lid with dual-latch lock — snaps open with one thumb, seals shut with a satisfying click.",
    },
    {
      Icon: ShieldCheck,
      title: "Built to Outlast",
      subtitle:
        "18/8 food-grade stainless steel interior. BPA-free, rust-resistant, and finished to handle years of real, daily use.",
    },
    {
      Icon: Droplets,
      title: "Zero Leaks. Zero Mess.",
      subtitle:
        "Double-secured closure ensures your bag, desk, and car stay dry — no matter how hard the day gets.",
    },
  ];

  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const springConfig = { stiffness: 45, damping: 26, restDelta: 0.001 };

  const scale        = useTransform(scrollYProgress, [0, 1], [0.96, 1.12]);
  const yFloating1   = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const smoothY1     = useSpring(yFloating1, springConfig);
  const yFloating2   = useTransform(scrollYProgress, [0, 1], [60, -100]);
  const smoothY2     = useSpring(yFloating2, springConfig);

  return (
    <section
      ref={targetRef}
      className="relative bg-white py-10 sm:py-14 lg:py-16 px-4 sm:px-8 overflow-hidden"
      style={inter}
    >
      {/* Background watermark */}
      <motion.div
        className="absolute top-4 sm:top-0 left-0 right-0 text-center text-[16vw] sm:text-[14vw] lg:text-[16vw] font-black whitespace-nowrap z-0 leading-none select-none pointer-events-none"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        style={{ letterSpacing: "0.1em", color: "rgba(122,154,124,0.12)" }}
      >
        T-REX
      </motion.div>

      {/* Main layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-6xl mx-auto pt-8 sm:pt-10 lg:pt-12 mt-6">

        {/* Left — product image */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center order-2 lg:order-1 mt-8 sm:mt-6 lg:mt-36">
          <motion.div
            className="relative z-20 w-[85%] sm:w-[65%] lg:w-[90%]"
            style={{ scale }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="/middle.png"
              alt="T-Rex Tumbler"
              className="w-full h-full object-cover rounded-md drop-shadow-2xl"
              loading="lazy"
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>
        </div>

        {/* Right — copy */}
        <div className="w-full lg:w-1/2 lg:pl-16 order-1 lg:order-2 text-left ">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-lg mx-0"
          >
            {/* Eyebrow */}
            <p
              className="text-[10px] tracking-[0.38em] uppercase mb-4"
              style={{ color: "rgba(122,154,124,0.9)" }}
            >
              Why T‑Rex · The Difference
            </p>

            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-light text-neutral-900 leading-tight mb-4 sm:mb-6"
              style={{ letterSpacing: "0.02em" }}
            >
              ENGINEERED
              <br />
              FOR REAL LIFE
            </h2>

            <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-light">
              Every T‑Rex Tumbler is built around one idea — your drink should
              be exactly the way you left it, hours later. Vacuum-sealed walls,
              a one-click lid, and stainless steel that doesn't rust, taint, or
              quit. Relentless performance in a design that means business.
            </p>

            {/* CTA row */}
            <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-6 lg:gap-10">
              <Link
                to="/shop"
                className="text-white px-5 sm:px-8 py-3 sm:py-4 text-[11px] sm:text-xs font-light tracking-[0.2em] uppercase rounded-full transition-all duration-300 whitespace-nowrap flex items-center gap-2"
                style={{ backgroundColor: SAGE }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#5f7c62")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SAGE)}
              >
                <ShoppingCart size={14} />
                Shop the Collection
              </Link>

              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: SAGE_LIGHT }}
                  whileHover={{ scale: 1.08, rotate: 12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Thermometer size={18} style={{ color: SAGE }} />
                </motion.div>
                <span className="text-neutral-700 font-light text-xs sm:text-base leading-tight">
                  Cold 24 hrs ·{" "}
                  <span style={{ color: SAGE }}>Hot 12 hrs. Guaranteed.</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative images */}
      <motion.div
        className="absolute right-[-5%] top-[12%] w-28 sm:w-56 lg:w-72 z-30 hidden sm:block"
        style={{ y: smoothY1 }}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <img
          src="/product1.png"
          alt=""
          className="w-full h-auto object-contain rounded-md opacity-90"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      <motion.div
        className="absolute left-[-2%] bottom-[10%] w-24 sm:w-52 z-30 hidden sm:block"
        style={{ y: smoothY2 }}
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <img
          src="./product2.png"
          alt=""
          className="w-full h-auto object-contain rounded-md opacity-90"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Features grid */}
      <div className="relative z-20 mt-12 sm:mt-24 lg:mt-16 px-0">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 max-w-6xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 bg-neutral-50 rounded-none border border-neutral-100 p-5 sm:p-6 hover:border-neutral-200 transition-all duration-500 group"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500"
                style={{ backgroundColor: SAGE_LIGHT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = SAGE_MID)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = SAGE_LIGHT)}
              >
                <feature.Icon size={22} style={{ color: SAGE }} />
              </div>
              <div>
                <h3
                  className="font-medium text-neutral-900 tracking-wide text-sm sm:text-base mb-1"
                >
                  {feature.title}
                </h3>
                <p className="text-neutral-500 text-xs sm:text-sm font-light leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SecondSection;
