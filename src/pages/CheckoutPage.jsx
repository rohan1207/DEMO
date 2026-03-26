import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${v.toLocaleString('en-IN')}`;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function formatShippingPayload({ name, email, phone, address }) {
  return [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    `Phone: ${phone.trim()}`,
    '',
    'Address:',
    address.trim(),
  ].join('\n');
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function CheckoutPage() {
  const { cart, cartTotal, user, catalog, createRazorpayOrder, placeOrder } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: user.name || f.name,
      email: user.email || f.email,
      phone: user.phone || f.phone,
      address: user.address || f.address,
    }));
  }, [user]);

  const lineItems = useMemo(() => {
    return cart.map((item) => {
      const p = catalog.find((x) => x.id === item.productId || x._id === item.productId);
      const title = p?.shortName || p?.name || 'Item';
      const price = p?.price ?? 0;
      return { ...item, title, price, lineTotal: price * item.qty };
    });
  }, [cart, catalog]);

  const formValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim().length >= 8;

  if (!cart.length) return <Navigate to="/shop" replace />;

  const payNow = async () => {
    setError('');
    if (!formValid) {
      setError('Please fill in your name, email, phone, and full shipping address.');
      return;
    }
    if (!user) {
      setError('Please sign in to complete payment.');
      return;
    }

    setLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setLoading(false);
      setError('Payment SDK failed to load. Check your connection and try again.');
      return;
    }
    const response = await createRazorpayOrder();
    if (!response.ok) {
      setLoading(false);
      setError(response.message);
      return;
    }

    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!key) {
      setLoading(false);
      setError('Set VITE_RAZORPAY_KEY_ID in frontend env');
      return;
    }

    const shippingAddress = formatShippingPayload(form);

    const rz = new window.Razorpay({
      key,
      amount: response.order.amount,
      currency: response.order.currency,
      order_id: response.order.id,
      name: 'Drip',
      description: 'Premium Tumbler Checkout',
      handler: async (responseData) => {
        const verify = await window.fetch(
          `${API_BASE}/orders/razorpay/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('drip_token') || ''}`,
            },
            body: JSON.stringify(responseData),
          }
        );

        if (!verify.ok) {
          setError('Payment verification failed');
          return;
        }

        await placeOrder({
          razorpayOrderId: responseData.razorpay_order_id,
          razorpayPaymentId: responseData.razorpay_payment_id,
          shippingAddress,
        });
        navigate('/account');
      },
      prefill: {
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.phone.replace(/\D/g, '').slice(-10),
      },
      theme: { color: '#7FAF73' },
    });
    rz.open();
    setLoading(false);
  };

  const field =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#7FAF73] focus:ring-1 focus:ring-[#7FAF73]/30';

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Checkout</h1>
      <p className="mt-2 max-w-xl text-slate-600">
        Enter your contact and shipping details, review your order, then pay securely.
      </p>

      {!user && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
          <span className="font-medium">Sign in required for payment.</span>{' '}
          <Link to="/login" className="font-semibold text-[#5a8f52] underline underline-offset-2 hover:text-[#4a7a44]">
            Sign in
          </Link>{' '}
          or{' '}
          <Link to="/login" className="font-semibold text-[#5a8f52] underline underline-offset-2 hover:text-[#4a7a44]">
            create an account
          </Link>{' '}
          to continue — you can still fill in your details below.
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_minmax(280px,380px)] lg:items-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Shipping details</h2>
          <p className="mt-1 text-sm text-slate-500">We&apos;ll use this for delivery updates.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="co-name" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Full name
              </label>
              <input
                id="co-name"
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={field}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="co-email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Email
              </label>
              <input
                id="co-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={field}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="co-phone" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Phone number
              </label>
              <input
                id="co-phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={field}
                placeholder="+91 or 10-digit mobile"
              />
            </div>
            <div>
              <label htmlFor="co-address" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Shipping address
              </label>
              <textarea
                id="co-address"
                autoComplete="street-address"
                rows={4}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={`${field} resize-y min-h-[120px]`}
                placeholder="House / flat, street, landmark, city, state, PIN code"
              />
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm lg:sticky lg:top-28 lg:p-8">
          <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
          <ul className="mt-4 divide-y divide-slate-200/80">
            {lineItems.map((row) => (
              <li key={row.productId} className="flex gap-3 py-3 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">{row.title}</p>
                  <p className="text-sm text-slate-500">Qty {row.qty}</p>
                </div>
                <p className="shrink-0 text-sm font-medium text-slate-800">{money(row.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-2xl font-semibold text-slate-900">{money(cartTotal)}</span>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            disabled={loading || !user}
            onClick={payNow}
            className="mt-6 w-full rounded-full bg-[#7FAF73] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#6fa064] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? 'Processing…' : 'Pay now'}
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">Pay securely with Razorpay</p>
        </aside>
      </div>
    </section>
  );
}
