import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${(v || 0).toLocaleString('en-IN')}`;

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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={`wishlist-skeleton-${i}`}
              className="animate-pulse rounded-2xl border border-slate-200 p-4 sm:rounded-3xl sm:p-5"
            >
              <div className="h-44 w-full rounded-xl bg-slate-100 sm:h-52 md:h-56" />
              <div className="mt-4 h-5 w-2/3 rounded bg-slate-100" />
              <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <div className="h-11 flex-1 rounded-full bg-slate-100" />
                <div className="h-11 flex-1 rounded-full bg-slate-100" />
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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_24px_-12px_rgba(15,23,42,0.08)] sm:rounded-3xl"
            >
              <Link
                to={`/product/${product.slug}`}
                className="group block bg-gradient-to-b from-[#FAFCF9] to-white px-4 pb-2 pt-6 sm:px-5 sm:pt-8"
              >
                <img
                  src={product.heroImage || product.images?.[0]}
                  alt={product.name}
                  className="mx-auto h-44 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-52 md:h-56"
                />
              </Link>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                  {product.name}
                </h2>
                {product.price != null && (
                  <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
                    {money(product.price)}
                    {product.compareAtPrice ? (
                      <span className="ml-2 text-sm font-normal text-slate-400 line-through">
                        {money(product.compareAtPrice)}
                      </span>
                    ) : null}
                  </p>
                )}
                <div className="mt-4 flex flex-col gap-2 sm:mt-auto sm:flex-row sm:flex-wrap sm:gap-2">
                  <Link
                    to={`/product/${product.slug}`}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-[#7FAF73] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white sm:min-h-0 sm:flex-none sm:px-5 sm:text-xs sm:tracking-[0.18em]"
                  >
                    View product
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50 sm:min-h-0 sm:flex-none sm:px-5 sm:text-xs sm:tracking-[0.18em]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
