import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
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
  const { addToCart, buyNow, toggleWishlist, wishlist, catalog, catalogLoading, user } = useStore();
  const navigate = useNavigate();

  const goBuyNow = (productId) => {
    buyNow(productId, 1);
    if (!user) navigate('/account?returnTo=/checkout');
    else navigate('/checkout');
  };

  const scrollToShop = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-white">
      {/* Hero — viewport minus navbar; responsive min-heights */}
      <section className="relative min-h-[calc(100dvh-72px)] w-full overflow-hidden border-b border-black/5 lg:min-h-[calc(100dvh-96px)]">
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
        <div className="relative z-10 flex min-h-[inherit] flex-col pt-[env(safe-area-inset-top,0px)]">
          <div className="flex flex-1 flex-col items-center justify-center px-4 pb-4 pt-6 text-center sm:px-6 sm:pb-6 sm:pt-8 md:px-8">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7FAF73] sm:text-xs sm:tracking-[0.22em]">
                DRIP Shop
              </p>
              <h1 className="mt-3 text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Everyday carry,
                <span className="text-white/85"> elevated.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:mx-auto sm:mt-5 sm:text-base md:text-lg">
                Premium tumblers built for motion, routine, and presence. Two signature finishes—designed to feel as
                good as they look.
              </p>
              <div className="mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToShop}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#7FAF73] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#719D66] sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.18em]"
                >
                  View collection
                </button>
                <Link
                  to="/about"
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.16em]"
                >
                  Our story
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="flex shrink-0 justify-center pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:pb-6">
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
      <section id="collection" className="scroll-mt-20 border-b border-black/5 bg-white sm:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7FAF73] sm:text-xs sm:tracking-[0.22em]">
              The collection
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:mt-3 sm:text-3xl md:text-4xl">
              Two drops. Zero filler.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65 sm:mt-4 sm:text-base">
              We&apos;re intentionally starting small—two refined SKUs so we can obsess over fit, finish, and how each
              bottle feels in hand. More colors and accessories follow as we grow.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 sm:mt-12 sm:gap-10 md:mt-14 md:grid-cols-2 md:gap-10 lg:gap-12">
            {catalogLoading
              ? [...Array(2)].map((_, index) => (
                  <div
                    key={`shop-skeleton-${index}`}
                    className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-black/8 bg-white sm:rounded-3xl"
                  >
                    <div className="h-[220px] bg-slate-100 sm:h-[280px] md:h-[320px]" />
                    <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
                      <div className="h-6 w-2/3 rounded bg-slate-100" />
                      <div className="h-4 w-full rounded bg-slate-100" />
                      <div className="h-4 w-5/6 rounded bg-slate-100" />
                      <div className="h-10 w-full rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))
              : catalog.map((product, index) => {
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
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_2px_40px_-12px_rgba(15,23,42,0.08)] transition-shadow duration-300 sm:rounded-3xl hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]"
                >
                  <div className="relative">
                    <Link
                      to={`/product/${product.slug}`}
                      className="relative block overflow-hidden bg-gradient-to-b from-[#FAFCF9] to-white px-4 pb-2 pt-8 sm:px-6 sm:pt-9 md:px-8 md:pt-10"
                    >
                      <span className="absolute left-4 top-4 rounded-full bg-[#7FAF73]/12 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4f8248] sm:left-6 sm:top-6 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.16em]">
                        {product.shortName || 'DRIP'}
                      </span>
                      <img
                        src={product.heroImage || product.images?.[0]}
                        alt={product.name}
                        className="mx-auto h-[220px] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-[260px] md:h-[300px] lg:h-[320px]"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#7FAF73] shadow-sm backdrop-blur transition hover:bg-white sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      {inWishlist ? (
                        <FaHeart className="h-[18px] w-[18px]" aria-hidden />
                      ) : (
                        <FaRegHeart className="h-[18px] w-[18px] text-slate-600" aria-hidden />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-5 pt-2 sm:px-6 sm:pb-6">
                    <div>
                      <h3 className="text-base font-semibold leading-snug text-black sm:text-lg md:text-xl">{product.name}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2">
                        <div className="flex shrink-0 text-[#7FAF73]">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          ))}
                        </div>
                        <span className="text-xs text-black/50 sm:text-sm">
                          {product.rating?.toFixed(1)} · {product.reviewCount ?? 0} reviews
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/65 sm:mt-4 sm:line-clamp-2">
                      {product.description}
                    </p>

                    {highlights.length > 0 && (
                      <ul className="mt-3 space-y-1.5 border-t border-black/6 pt-3 sm:mt-4 sm:space-y-2 sm:pt-4">
                        {highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2 text-xs text-black/75 sm:text-sm">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7FAF73]" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-5 flex flex-col gap-4 border-t border-black/6 pt-5 sm:mt-6 sm:pt-6">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-semibold text-black sm:text-xl">{money(product.price)}</span>
                        <span className="text-xs text-black/40 line-through sm:text-sm">{money(product.compareAtPrice)}</span>
                      </div>
                      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/80 transition-colors hover:bg-black/[0.03] sm:min-h-0 sm:px-5 sm:py-2.5 sm:text-[10px] sm:tracking-[0.16em]"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id, 1)}
                          className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#7FAF73]/40 bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4f8248] transition-colors hover:bg-[#7FAF73]/10 sm:min-h-0 sm:px-5 sm:py-2.5 sm:text-[10px] sm:tracking-[0.16em]"
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          onClick={() => goBuyNow(product.id)}
                          className="col-span-2 inline-flex min-h-[42px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#719D66] sm:col-span-1 sm:min-h-0 sm:w-auto sm:px-5 sm:tracking-[0.16em]"
                        >
                          Buy now
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

      {/* Why DRIP */}
      <section className="border-b border-black/5 bg-[#F5FAF4]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7FAF73] sm:text-xs sm:tracking-[0.22em]">
              Why DRIP
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:mt-3 sm:text-3xl md:text-4xl">
              Precision you can feel
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/65 sm:mt-4 sm:text-base">
              We&apos;re not racing to fill shelves—we&apos;re building a carry system that earns a spot in your day.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 md:mt-14 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {WHY_TREX.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="rounded-2xl border border-black/6 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7FAF73]/12 text-[#4f8248] sm:h-12 sm:w-12">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-black sm:mt-6 sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/65 sm:mt-3">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + closing CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-20">
          <div className="grid gap-8 rounded-2xl border border-black/8 bg-gradient-to-br from-white to-[#FAFCF9] p-6 sm:gap-10 sm:rounded-3xl sm:p-8 md:grid-cols-3 md:gap-8 md:p-10 lg:p-12">
            {TRUST_STRIP.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black sm:text-sm sm:tracking-[0.14em]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/60">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-6 rounded-2xl bg-[#7FAF73] px-5 py-8 text-center sm:mt-12 sm:items-center sm:rounded-3xl sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between md:text-left lg:px-14">
            <div className="max-w-xl md:flex-1">
              <h2 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">Questions before you order?</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                We&apos;d rather earn your trust with clarity than rush a sale. Reach out—we read every message.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2d5a28] shadow-sm transition-colors hover:bg-white/95 sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.18em]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
