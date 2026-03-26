import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

const WHY_TREX = [
  {
    title: 'Engineered carry',
    body:
      'Clean silhouettes, tight tolerances, and hardware that still feels precise after daily use—not seasonal novelty.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.571.393A9.065 9.065 0 0112 21a9.065 9.065 0 01-6.229-2.306L4.2 15.3" />
      </svg>
    ),
  },
  {
    title: 'Thermal you can trust',
    body:
      'Insulation that holds temperature through commutes, workouts, and long desk days—so your routine stays uninterrupted.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    title: 'Built to represent',
    body:
      'A quiet, confident finish that looks right in meetings, on the trail, and everywhere between—design with intent, not noise.',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const TRUST_STRIP = [
  {
    title: 'Secure checkout',
    body: 'Encrypted payments and clear order confirmation—no surprises at pay time.',
  },
  {
    title: 'Careful dispatch',
    body: 'Packed to protect finishes and lids so your first unboxing matches the product page.',
  },
  {
    title: 'We respond',
    body: 'Questions before you buy? Reach us via Contact—real humans, not ticket black holes.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ShopPage() {
  const { addToCart, toggleWishlist, wishlist, catalog } = useStore();

  const scrollToShop = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-white">
      {/* Hero — one viewport height below navbar; full-bleed bg image */}
      <section className="relative h-[calc(100dvh-60px)] max-h-[calc(100dvh-60px)] w-full overflow-hidden border-b border-black/5 lg:h-[calc(100dvh-100px)] lg:max-h-[calc(100dvh-100px)]">
        <img
          src="/about1.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/product2.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/55" />
        <div className="relative z-10 flex h-full min-h-0 flex-col">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7FAF73]">T-REX Shop</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Everyday carry,
                <span className="text-white/85"> elevated.</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed text-white/90 md:text-lg">
                Premium tumblers built for motion, routine, and presence. Two signature finishes—designed to feel as
                good as they look.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={scrollToShop}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#7FAF73] px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#719D66]"
                >
                  View collection
                </button>
                <Link
                  to="/about"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Our story
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="flex shrink-0 justify-center pb-6 pt-2">
            <button
              type="button"
              onClick={scrollToShop}
              className="group flex flex-col items-center gap-2 rounded-full text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAF73] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="Scroll to shop"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">Shop</span>
              <motion.span
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-sm"
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: [0.45, 0, 0.55, 1],
                }}
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="scroll-mt-24 border-b border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7FAF73]">The collection</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-4xl">Two drops. Zero filler.</h2>
            <p className="mt-4 text-base text-black/65">
              We&apos;re intentionally starting small—two refined SKUs so we can obsess over fit, finish, and how each
              bottle feels in hand. More colors and accessories follow as we grow.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {catalog.map((product, index) => {
              const inWishlist = wishlist.includes(product.id);
              const highlights = product.highlights?.slice(0, 2) ?? [];

              return (
                <motion.article
                  key={product.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeUp}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_2px_40px_-12px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className="relative block overflow-hidden bg-gradient-to-b from-[#FAFCF9] to-white px-8 pb-2 pt-10"
                  >
                    <span className="absolute left-6 top-6 rounded-full bg-[#7FAF73]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4f8248]">
                      {product.shortName || 'T-REX'}
                    </span>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="mx-auto h-[300px] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = product.fallbackImage;
                      }}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-black md:text-xl">{product.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex text-[#7FAF73]">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className="h-3.5 w-3.5" />
                            ))}
                          </div>
                          <span className="text-sm text-black/50">
                            {product.rating?.toFixed(1)} · {product.reviewCount ?? 0} reviews
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                          inWishlist
                            ? 'border-[#7FAF73] bg-[#7FAF73]/10 text-[#4f8248]'
                            : 'border-black/15 text-black/60 hover:border-black/25'
                        }`}
                      >
                        {inWishlist ? 'Saved' : 'Wishlist'}
                      </button>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-black/65">{product.description}</p>

                    {highlights.length > 0 && (
                      <ul className="mt-4 space-y-2 border-t border-black/6 pt-4">
                        {highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-sm text-black/75">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7FAF73]" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/6 pt-6">
                      <div>
                        <span className="text-xl font-semibold text-black">{money(product.price)}</span>
                        <span className="ml-2 text-sm text-black/40 line-through">{money(product.compareAtPrice)}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="inline-flex rounded-full border border-black/15 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/80 transition-colors hover:bg-black/[0.03]"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id, 1)}
                          className="inline-flex rounded-full bg-[#7FAF73] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#719D66]"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why T-REX */}
      <section className="border-b border-black/5 bg-[#F5FAF4]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7FAF73]">Why T-REX</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-4xl">Precision you can feel</h2>
            <p className="mt-4 text-base text-black/65">
              We&apos;re not racing to fill shelves—we&apos;re building a carry system that earns a spot in your day.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {WHY_TREX.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="rounded-2xl border border-black/6 bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7FAF73]/12 text-[#4f8248]">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/65">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + closing CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-12 lg:py-20">
          <div className="grid gap-10 border border-black/8 rounded-3xl bg-gradient-to-br from-white to-[#FAFCF9] p-8 md:grid-cols-3 md:gap-8 md:p-12">
            {TRUST_STRIP.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#7FAF73] px-8 py-10 text-center md:flex-row md:text-left lg:px-14">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Questions before you order?</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                We&apos;d rather earn your trust with clarity than rush a sale. Reach out—we read every message.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#2d5a28] shadow-sm transition-colors hover:bg-white/95"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
