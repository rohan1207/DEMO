import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

function resolveProduct(catalog, productId) {
  return catalog.find(
    (p) => String(p.id) === String(productId) || String(p._id) === String(productId)
  );
}

export default function DripMiniCart({ open, onClose }) {
  const { cart, cartTotal, updateQty, removeFromCart, catalog } = useStore();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] sm:bg-black/25"
        onClick={onClose}
        aria-label="Close cart"
      />
      <aside
        className="relative z-10 flex h-[100dvh] w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-md lg:max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-5 sm:py-5 lg:px-8"
        >
          <h2 id="mini-cart-title" className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            Your cart
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-slate-300 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 sm:min-h-0 sm:min-w-0 sm:py-2 sm:text-xs sm:tracking-[0.18em]"
          >
            Close
          </button>
        </div>

        {!cart.length ? (
          <div className="flex flex-1 flex-col justify-center px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 lg:items-center">
            <p className="text-center text-base text-slate-600 sm:text-left lg:text-center">Your cart is empty.</p>
            <Link
              to="/shop"
              onClick={onClose}
              className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white sm:w-auto sm:self-start sm:tracking-[0.18em] lg:self-center"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
              <div className="space-y-3 sm:space-y-4">
                {cart.map((item) => {
                  const product = resolveProduct(catalog, item.productId);
                  if (!product) return null;
                  const title = product.shortName || product.name || 'Item';
                  return (
                    <div
                      key={item.productId}
                      className="rounded-2xl border border-slate-200 p-3 sm:p-4"
                    >
                      <div className="flex gap-3 sm:gap-4">
                        <img
                          src={product.heroImage || product.images?.[0]}
                          alt={product.name || title}
                          className="h-20 w-20 shrink-0 rounded-xl bg-slate-50 object-contain sm:h-24 sm:w-24"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-medium leading-snug text-slate-900">{title}</p>
                          <p className="mt-0.5 text-sm text-slate-500">{money(product.price)}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/80 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, item.qty - 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-lg font-medium text-slate-700 transition hover:bg-white active:scale-95 sm:h-9 sm:w-9 sm:text-base"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, item.qty + 1)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-lg font-medium text-slate-700 transition hover:bg-white active:scale-95 sm:h-9 sm:w-9 sm:text-base"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="ml-auto min-h-[40px] text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 underline-offset-2 hover:text-slate-800 sm:min-h-0 sm:text-xs sm:tracking-[0.15em]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.12)] sm:px-6 lg:px-8">
              <div className="flex items-baseline justify-between gap-4 text-slate-900">
                <span className="text-sm font-medium uppercase tracking-[0.12em] text-slate-600 sm:text-base sm:normal-case sm:tracking-normal">
                  Subtotal
                </span>
                <span className="text-xl font-semibold tabular-nums sm:text-2xl">{money(cartTotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#7FAF73] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#6fa064] sm:tracking-[0.18em]"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
