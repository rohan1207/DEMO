import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, toggleWishlist, wishlist, catalog, fetchProductBySlug } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProductBySlug(slug).then((res) => {
      if (!mounted) return;
      if (res.ok) setProduct(res.product);
      else setProduct(undefined);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
    // fetchProductBySlug is stable enough for this provider lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Loading product...</h1>
      </div>
    );
  }

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-slate-900">Product not found</h1>
        <Link className="mt-4 inline-block text-[#4f8248] underline" to="/shop">
          Go to shop
        </Link>
      </div>
    );
  }

  const alsoLike = catalog.filter((p) => p.id !== product.id);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-12">
      <div className="grid gap-8 lg:grid-cols-[110px_1fr_1fr]">
        <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-auto">
          {product.images.map((img, idx) => (
            <button
              key={`${product.id}-${idx}`}
              type="button"
              onClick={() => setActiveImage(idx)}
              className={`h-24 w-24 rounded-2xl border p-1 ${
                idx === activeImage ? 'border-[#7FAF73]' : 'border-slate-200'
              }`}
            >
              <img
                src={img}
                alt={`${product.name} ${idx + 1}`}
                className="h-full w-full rounded-xl object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = product.fallbackImage;
                }}
              />
            </button>
          ))}
        </div>

        <div className="order-1 lg:order-2 rounded-3xl bg-slate-50 p-8">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="mx-auto h-[520px] w-full object-contain"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = product.fallbackImage;
            }}
          />
        </div>

        <div className="order-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#4f8248]">Premium Tumbler</p>
          <h1 className="mt-3 text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900">
            {product.name}
          </h1>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-semibold text-slate-900">{money(product.price)}</span>
            <span className="text-lg text-slate-400 line-through">{money(product.compareAtPrice)}</span>
          </div>

          <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Colors</h3>
            <div className="mt-3 flex gap-3">
              {catalog.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] ${
                    p.id === product.id ? 'border-[#7FAF73] text-[#4f8248]' : 'border-slate-300 text-slate-600'
                  }`}
                >
                  {p.shortName}
                </Link>
              ))}
            </div>
          </div>

          <ul className="mt-8 space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="text-slate-700">
                • {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => addToCart(product.id, 1)}
              className="inline-flex rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
            >
              Add To Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`inline-flex rounded-full border px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] ${
                wishlist.includes(product.id)
                  ? 'border-[#7FAF73] text-[#4f8248] bg-[#7FAF73]/10'
                  : 'border-slate-300 text-slate-700'
              }`}
            >
              {wishlist.includes(product.id) ? 'Wishlisted' : 'Add To Wishlist'}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Shipping & Returns</p>
            <p className="mt-1">Free shipping in India. 7-day easy returns.</p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">You may also like</h2>
        {alsoLike.length ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {alsoLike.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="rounded-2xl border border-slate-200 p-5">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="h-56 w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = p.fallbackImage;
                  }}
                />
                <p className="mt-3 font-medium text-slate-900">{p.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">Explore our full collection in shop.</p>
        )}
      </div>
    </section>
  );
}
