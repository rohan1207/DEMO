import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

export default function DripMiniCart({ open, onClose }) {
  const { cart, cartTotal, updateQty, removeFromCart, catalog } = useStore();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <button type="button" className="absolute inset-0 bg-black/25" onClick={onClose} aria-label="Close cart" />
      <aside className="relative z-10 h-full w-full max-w-xl bg-white shadow-2xl p-6 lg:p-8 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-slate-900">Your Cart</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs uppercase tracking-[0.18em]"
          >
            Close
          </button>
        </div>

        {!cart.length ? (
          <div className="mt-10">
            <p className="text-slate-600">Your cart is empty.</p>
            <Link to="/shop" onClick={onClose} className="mt-4 inline-block underline text-[#4f8248]">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-4">
              {cart.map((item) => {
                const product = catalog.find((p) => String(p.id) === String(item.productId));
                if (!product) return null;
                return (
                  <div key={item.productId} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-24 w-24 rounded-xl bg-slate-50 object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = product.fallbackImage;
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{product.shortName}</p>
                        <p className="text-sm text-slate-500">{money(product.price)}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, item.qty - 1)}
                            className="h-8 w-8 rounded-full border border-slate-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(product.id, item.qty + 1)}
                            className="h-8 w-8 rounded-full border border-slate-300"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="ml-auto text-xs uppercase tracking-[0.15em] text-slate-500"
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
            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between text-lg font-semibold text-slate-900">
                <span>Subtotal</span>
                <span>{money(cartTotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="mt-5 block w-full rounded-full bg-[#7FAF73] py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white"
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
