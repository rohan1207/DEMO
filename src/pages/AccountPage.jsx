import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

export default function AccountPage() {
  const { user, orders, logout, catalog } = useStore();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">My Account</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profile</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">{user.name}</p>
          <p className="text-slate-600">{user.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-6 rounded-full border border-slate-300 px-5 py-2 text-xs uppercase tracking-[0.18em] text-slate-700"
          >
            Logout
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-900">Order History</h2>
          {!orders.length ? (
            <p className="mt-3 text-slate-600">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{order.id}</p>
                    <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-[#4f8248]">{order.status}</p>
                  </div>
                  <div className="mt-3 space-y-1">
                    {order.items.map((item) => {
                      const product = catalog.find((p) => String(p.id) === String(item.productId));
                      return (
                        <p key={item.productId} className="text-sm text-slate-700">
                          {product?.shortName || item.productId} × {item.qty}
                        </p>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">Total: {money(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
