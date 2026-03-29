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

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export default function CheckoutPage() {
  const { cart, cartTotal, user, token, catalog, createRazorpayOrder, placeOrder } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const navigate = useNavigate();
  const updateForm = (key, value) => {
    setError('');
    setForm((f) => ({ ...f, [key]: value }));
  };

  useEffect(() => {
    if (!user) {
      navigate('/account?returnTo=/checkout', { replace: true });
      return;
    }
    const defaultAddress = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0] || {};
    setForm((f) => ({
      ...f,
      fullName: defaultAddress.fullName || user.name || f.fullName,
      email: user.email || f.email,
      phone: defaultAddress.phone || user.phone || f.phone,
      line1: defaultAddress.line1 || f.line1,
      city: defaultAddress.city || f.city,
      state: defaultAddress.state || f.state,
      postalCode: defaultAddress.postalCode || f.postalCode,
      country: defaultAddress.country || f.country,
    }));
  }, [user, navigate]);

  const lineItems = useMemo(() => {
    return cart
      .map((item) => {
      const p = catalog.find((x) => x.id === item.productId || x._id === item.productId);
      if (!p) return null;
      const title = p.shortName || p.name || 'Item';
      const price = p.price ?? 0;
      return { ...item, title, price, lineTotal: price * item.qty };
    })
      .filter(Boolean);
  }, [cart, catalog]);

  const formValid =
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.line1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim();

  if (!cart.length) return <Navigate to="/shop" replace />;
  if (!user) return null;

  const payNow = async () => {
    setError('');
    if (!formValid) {
      setError('Please fill in your name, email, phone, and full shipping address.');
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

    const shippingAddress = { ...form };

    const rz = new window.Razorpay({
      key,
      amount: response.order.amount,
      currency: response.order.currency,
      order_id: response.order.id,
      name: 'T-REX',
      description: 'Premium Tumbler Checkout',
      handler: async (responseData) => {
        const verify = await window.fetch(
          `${API_BASE}/orders/razorpay/verify`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        navigate('/account?tab=orders');
      },
      prefill: {
        name: form.fullName.trim(),
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
                value={form.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
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
                onChange={(e) => updateForm('email', e.target.value)}
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
                onChange={(e) => updateForm('phone', e.target.value)}
                className={field}
                placeholder="+91 or 10-digit mobile"
              />
            </div>
            <div>
              <label htmlFor="co-line1" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                Address line
              </label>
              <textarea
                id="co-line1"
                autoComplete="street-address"
                rows={3}
                value={form.line1}
                onChange={(e) => updateForm('line1', e.target.value)}
                className={`${field} resize-y min-h-[120px]`}
                placeholder="House / flat, street, landmark"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="co-city" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  City
                </label>
                <input id="co-city" value={form.city} onChange={(e) => updateForm('city', e.target.value)} className={field} />
              </div>
              <div>
                <label htmlFor="co-state" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  State
                </label>
                <input id="co-state" value={form.state} onChange={(e) => updateForm('state', e.target.value)} className={field} />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="co-postal" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  Postal code
                </label>
                <input id="co-postal" value={form.postalCode} onChange={(e) => updateForm('postalCode', e.target.value)} className={field} />
              </div>
              <div>
                <label htmlFor="co-country" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                  Country
                </label>
                <input id="co-country" value={form.country} onChange={(e) => updateForm('country', e.target.value)} className={field} />
              </div>
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
            disabled={loading}
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
