import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart, buyNow, toggleWishlist, wishlist, catalog, fetchProductBySlug, user } = useStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const goBuyNow = (productId) => {
    buyNow(productId, 1);
    if (!user) navigate('/account?returnTo=/checkout');
    else navigate('/checkout');
  };

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
      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-12">
        <div className="grid animate-pulse gap-8 lg:grid-cols-[110px_1fr_1fr]">
          <div className="order-2 lg:order-1 flex lg:flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 w-24 rounded-2xl bg-slate-100" />
            ))}
          </div>
          <div className="order-1 lg:order-2 h-[520px] rounded-3xl bg-slate-100" />
          <div className="order-3 space-y-4">
            <div className="h-3 w-28 rounded bg-slate-100" />
            <div className="h-10 w-3/4 rounded bg-slate-100" />
            <div className="h-8 w-1/2 rounded bg-slate-100" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-11 w-40 rounded-full bg-slate-100" />
          </div>
        </div>
      </section>
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
  const detailSections = product.detailSections ?? [];

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
              />
            </button>
          ))}
        </div>

        <div className="order-1 lg:order-2 rounded-3xl bg-slate-50 p-8">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="mx-auto h-[520px] w-full object-contain"
          />
        </div>

        <div className="order-3 relative">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#7FAF73] shadow-sm transition hover:border-[#7FAF73]/40"
            aria-label={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlist.includes(product.id) ? (
              <FaHeart className="h-5 w-5" aria-hidden />
            ) : (
              <FaRegHeart className="h-5 w-5 text-slate-600" aria-hidden />
            )}
          </button>
          <p className="text-xs uppercase tracking-[0.2em] text-[#4f8248] pr-14">Premium Tumbler</p>
          <h1 className="mt-3 text-3xl lg:text-4xl font-semibold tracking-tight text-slate-900 pr-14">
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
              className="inline-flex rounded-full border border-[#7FAF73]/40 bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f8248] transition hover:bg-[#7FAF73]/10"
            >
              Add To Cart
            </button>
            <button
              type="button"
              onClick={() => goBuyNow(product.id)}
              className="inline-flex rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#719D66]"
            >
              Buy now
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Shipping & Returns</p>
            <p className="mt-1">Free shipping in India. 7-day easy returns.</p>
          </div>
        </div>
      </div>

      {detailSections.length > 0 && (
        <div className="mt-20 space-y-0">
          {detailSections.slice(0, 3).map((section, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <article
                key={`${product.id}-detail-${section.title}`}
                className={`grid overflow-hidden bg-white lg:grid-cols-2 ${
                  reverse ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="h-[320px] overflow-hidden bg-slate-50 md:h-[440px]">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="flex items-center p-8 md:p-12">
                  <div className="max-w-lg">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f8248]">Product Details</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                      {section.title}
                    </h3>
                    <p className="mt-4 text-slate-600 leading-relaxed md:text-[1.05rem]">{section.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-20 w-full">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">You may also like</h2>
        {alsoLike.length ? (
          <div className="mt-6 grid w-full grid-cols-1 justify-items-start gap-7 md:grid-cols-2 md:gap-8 lg:gap-10">
            {alsoLike.map((p) => {
              const inWishlist = wishlist.includes(p.id);
              return (
              <article
                key={p.id}
                className="group flex w-full max-w-[380px] flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_2px_40px_-12px_rgba(15,23,42,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)]"
              >
                <div className="relative">
                  <Link
                    to={`/product/${p.slug}`}
                    className="relative block overflow-hidden bg-gradient-to-b from-[#FAFCF9] to-white px-8 pb-2 pt-10"
                  >
                    <span className="absolute left-6 top-6 rounded-full bg-[#7FAF73]/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4f8248]">
                      {p.shortName}
                    </span>
                    <img
                      src={p.heroImage || p.images?.[0]}
                      alt={p.name}
                      className="mx-auto h-[280px] w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#7FAF73] shadow-sm backdrop-blur transition hover:bg-white"
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {inWishlist ? (
                      <FaHeart className="h-[18px] w-[18px]" aria-hidden />
                    ) : (
                      <FaRegHeart className="h-[18px] w-[18px] text-slate-600" aria-hidden />
                    )}
                  </button>
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-2">
                  <h3 className="text-lg font-semibold text-black md:text-xl">{p.name}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-black/65">{p.description}</p>
                  <ul className="mt-4 space-y-2 border-t border-black/6 pt-4">
                    {(p.highlights ?? []).slice(0, 2).map((h) => (
                      <li key={`${p.id}-${h}`} className="flex items-start gap-2 text-sm text-black/75">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#7FAF73]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/6 pt-6">
                    <div>
                      <span className="text-xl font-semibold text-black">{money(p.price)}</span>
                      <span className="ml-2 text-sm text-black/40 line-through">{money(p.compareAtPrice)}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        to={`/product/${p.slug}`}
                        className="inline-flex rounded-full border border-black/15 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/80 transition-colors hover:bg-black/[0.03]"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => addToCart(p.id, 1)}
                        className="inline-flex rounded-full border border-[#7FAF73]/40 bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#4f8248] transition-colors hover:bg-[#7FAF73]/10"
                      >
                        Add to cart
                      </button>
                      <button
                        type="button"
                        onClick={() => goBuyNow(p.id)}
                        className="inline-flex rounded-full bg-[#7FAF73] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#719D66]"
                      >
                        Buy now
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        ) : (
          <p className="mt-3 text-slate-600">Explore our full collection in shop.</p>
        )}
      </div>
    </section>
  );
}
