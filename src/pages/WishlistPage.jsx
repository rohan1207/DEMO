import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, catalog } = useStore();
  const items = catalog.filter((p) => wishlist.includes(p.id));
  const isEmpty = !items.length;

  return (
    <section
      className={`mx-auto flex w-full max-w-6xl flex-col px-6 py-10 lg:px-12 ${
        isEmpty ? 'min-h-[calc(100vh-180px)]' : ''
      }`}
    >
      <h1 className="text-center text-3xl font-semibold tracking-tight text-slate-900">Wishlist</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Save your favorite products here.</p>
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-slate-700">No items in your wishlist yet.</p>
          <Link
            to="/shop"
            className="mt-4 rounded-full bg-[#7FAF73] px-6 py-2 text-xs uppercase tracking-[0.18em] text-white"
          >
            Shop now
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {items.map((product) => (
            <article key={product.id} className="rounded-2xl border border-slate-200 p-5">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-60 w-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = product.fallbackImage;
                }}
              />
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{product.name}</h2>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  to={`/product/${product.slug}`}
                  className="rounded-full bg-[#7FAF73] px-5 py-2 text-xs uppercase tracking-[0.18em] text-white"
                >
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="rounded-full border border-slate-300 px-5 py-2 text-xs uppercase tracking-[0.18em] text-slate-700"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
