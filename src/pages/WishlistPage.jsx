import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${(v || 0).toLocaleString('en-IN')}`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function WishlistPage() {
  const { wishlist, toggleWishlist, catalog, catalogLoading } = useStore();
  const items = catalog.filter((p) => wishlist.includes(p.id));
  const isEmpty = !items.length;

  return (
    <section
      className={`mx-auto flex w-full max-w-7xl flex-col px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 lg:py-12 ${
        isEmpty ? 'min-h-[calc(100dvh-72px)]' : ''
      } pb-[max(2rem,env(safe-area-inset-bottom,0px))]`}
    >
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:mt-3 sm:text-base">
          Save your favorite products here.
        </p>
      </div>

      {catalogLoading ? (
        <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-8 sm:mt-12 sm:gap-10 md:grid-cols-2 md:gap-10">
          {[...Array(2)].map((_, i) => (
            <div
              key={`wishlist-skeleton-${i}`}
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
          ))}
        </div>
      ) : isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-2 py-12 text-center sm:py-16">
          <p className="max-w-md text-base font-medium leading-relaxed text-slate-700 sm:text-lg">
            No items in your wishlist yet.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:w-auto sm:tracking-[0.18em]"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="mx-auto mt-10 grid w-full max-w-5xl grid-cols-1 gap-8 sm:mt-12 sm:gap-10 md:mt-14 md:grid-cols-2 md:gap-10 lg:gap-12">
          {items.map((product, index) => {
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
                      toggleWishlist(product.id);
                    }}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#7FAF73] shadow-sm backdrop-blur transition hover:bg-white sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                    aria-label="Remove from wishlist"
                  >
                    <FaHeart className="h-[18px] w-[18px]" aria-hidden />
                  </button>
                </div>

                <div className="flex flex-1 flex-col px-4 pb-5 pt-2 sm:px-6 sm:pb-6">
                  <div>
                    <h2 className="line-clamp-2 text-base font-semibold leading-snug text-black sm:text-lg md:text-xl">
                      {product.name}
                    </h2>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2">
                      <div className="flex shrink-0 text-[#7FAF73]">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        ))}
                      </div>
                      <span className="text-xs text-black/50 sm:text-sm">
                        {product.rating?.toFixed(1) ?? '5.0'} · {product.reviewCount ?? 0} reviews
                      </span>
                    </div>
                  </div>

                  {product.description ? (
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/65 sm:mt-4 sm:line-clamp-2">
                      {product.description}
                    </p>
                  ) : null}

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
                    {product.price != null && (
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-semibold text-black sm:text-xl">{money(product.price)}</span>
                        {product.compareAtPrice ? (
                          <span className="text-xs text-black/40 line-through sm:text-sm">
                            {money(product.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>
                    )}
                    <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-2">
                      <Link
                        to={`/product/${product.slug}`}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-black/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-black/80 transition-colors hover:bg-black/[0.03] sm:min-h-0 sm:px-5 sm:py-2.5 sm:text-[10px] sm:tracking-[0.16em]"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-[#7FAF73]/40 bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#4f8248] transition-colors hover:bg-[#7FAF73]/10 sm:min-h-0 sm:px-5 sm:py-2.5 sm:text-[10px] sm:tracking-[0.16em]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
