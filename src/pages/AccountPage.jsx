import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const money = (v) => `₹${(v || 0).toLocaleString('en-IN')}`;

const tabs = ['profile', 'orders', 'addresses', 'return/exchange'];

const within7Days = (isoDate) => {
  const d = new Date(isoDate).getTime();
  return Number.isFinite(d) && Date.now() - d <= 7 * 24 * 60 * 60 * 1000;
};

export default function AccountPage() {
  const {
    user,
    orders,
    logout,
    catalog,
    login,
    signup,
    checkEmailExists,
    updateProfile,
    returnRequests,
    submitReturnRequest,
  } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = useMemo(
    () => new URLSearchParams(location.search).get('returnTo') || '/account',
    [location.search]
  );

  const tabFromUrl = useMemo(() => {
    const t = new URLSearchParams(location.search).get('tab');
    return t && tabs.includes(t) ? t : null;
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    return t && tabs.includes(t) ? t : 'profile';
  });

  useEffect(() => {
    if (tabFromUrl) setActiveTab(tabFromUrl);
  }, [tabFromUrl]);
  const [authStep, setAuthStep] = useState('email');
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [returnForm, setReturnForm] = useState({ orderId: '', reason: '', imageFile: null });
  const [returnMsg, setReturnMsg] = useState('');

  const eligibleOrders = useMemo(() => orders.filter((o) => within7Days(o.createdAt)), [orders]);

  const itemDisplayName = (item) => {
    if (item?.name) return item.name;
    const product = catalog.find(
      (p) => String(p.id) === String(item.productId) || String(p._id) === String(item.productId)
    );
    return product?.shortName || product?.name || 'Item';
  };

  const itemHeroImage = (item) => {
    if (item?.image) return item.image;
    const product = catalog.find(
      (p) => String(p.id) === String(item.productId) || String(p._id) === String(item.productId)
    );
    return product?.heroImage || product?.images?.[0] || '';
  };

  const orderTitle = (order) => {
    const names = (order.items || []).map(itemDisplayName).filter(Boolean);
    if (!names.length) return 'Order';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names[0]}, ${names[1]} + ${names.length - 2} more`;
  };

  const onCheckEmail = async (e) => {
    e.preventDefault();
    setAuthError('');
    const result = await checkEmailExists(email);
    if (!result.ok) {
      setAuthError(result.message);
      return;
    }
    setAuthMode(result.exists ? 'login' : 'signup');
    setAuthStep('credentials');
  };

  const onAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const res =
      authMode === 'login'
        ? await login({ email, password })
        : await signup({ name, email, password });
    if (!res.ok) {
      setAuthError(res.message);
      return;
    }
    navigate(returnTo, { replace: true });
  };

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    const res = await updateProfile(profileForm);
    setProfileMsg(res.ok ? 'Profile updated successfully.' : res.message);
  };

  const onSubmitReturn = async (e) => {
    e.preventDefault();
    setReturnMsg('');
    if (!returnForm.orderId || !returnForm.reason.trim()) {
      setReturnMsg('Please choose an order and enter a reason.');
      return;
    }
    const res = await submitReturnRequest(returnForm);
    setReturnMsg(res.ok ? 'Return request submitted.' : res.message);
    if (res.ok) setReturnForm({ orderId: '', reason: '', imageFile: null });
  };

  if (!user) {
    return (
      <section className="mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-lg items-center px-4 py-8 sm:max-w-2xl sm:px-6 sm:py-12 md:max-w-3xl lg:px-8">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8 md:p-10">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Account access
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Continue to checkout and track orders. Start with your email.
          </p>

          {authStep === 'email' ? (
            <form className="mt-6 space-y-4 sm:mt-8" onSubmit={onCheckEmail}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
                placeholder="Email"
                type="email"
                autoComplete="email"
              />
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:w-auto sm:tracking-[0.18em]"
              >
                Continue
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4 sm:mt-8" onSubmit={onAuthSubmit}>
              {authMode === 'signup' && (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
                  placeholder="Full name"
                />
              )}
              <input
                value={email}
                disabled
                className="w-full min-h-[48px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-500 sm:min-h-0"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#7FAF73] sm:min-h-0"
                placeholder="Password"
                type="password"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              {authError && <p className="text-sm text-red-500">{authError}</p>}
              <button
                type="submit"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white sm:w-auto sm:px-8 sm:text-xs sm:tracking-[0.18em]"
              >
                {authMode === 'login' ? 'Welcome Back - Login' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-10 md:px-8 lg:px-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          My Account
        </h1>
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 sm:w-auto sm:py-2 sm:text-xs sm:tracking-[0.18em]"
        >
          Logout
        </button>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-6 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 rounded-full px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.16em] ${
              activeTab === tab ? 'bg-[#7FAF73] text-white' : 'border border-slate-300 text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form
          onSubmit={onSaveProfile}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={profileForm.name}
              onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base sm:min-h-0"
              placeholder="Full name"
            />
            <input
              value={user.email}
              disabled
              className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-500 sm:min-h-0"
            />
            <input
              value={profileForm.phone}
              onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
              className="min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base md:col-span-2 sm:min-h-0 md:max-w-md"
              placeholder="Phone number"
              inputMode="tel"
              autoComplete="tel"
            />
          </div>
          {profileMsg && <p className="mt-3 text-sm text-slate-600">{profileMsg}</p>}
          <button
            type="submit"
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:w-auto sm:tracking-[0.18em]"
          >
            Save profile
          </button>
        </form>
      )}

      {activeTab === 'orders' && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          {!orders.length ? (
            <p className="text-sm text-slate-600 sm:text-base">No orders yet.</p>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border border-slate-200 p-3 sm:p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
                    <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-slate-900 sm:text-base">
                      {orderTitle(order)}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 sm:text-sm">
                      <time dateTime={order.createdAt}>
                        {new Date(order.createdAt).toLocaleString()}
                      </time>
                      <span className="font-medium text-[#4f8248]">{order.status}</span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {order.items.map((item, idx) => {
                      const src = itemHeroImage(item);
                      const label = itemDisplayName(item);
                      return (
                        <div
                          key={`${order.id}-${item.productId}-${idx}`}
                          className="flex items-start gap-3 sm:items-center"
                        >
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:h-14 sm:w-14">
                            {src ? (
                              <img
                                src={src}
                                alt={label}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center text-xs text-slate-400"
                                aria-hidden
                              >
                                —
                              </div>
                            )}
                          </div>
                          <p className="min-w-0 flex-1 text-sm leading-snug text-slate-700">
                            <span className="font-medium text-slate-900">{label}</span>
                            <span className="text-slate-500"> × {item.qty}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900 sm:text-base">
                    Total: {money(order.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          {user.addresses?.length ? (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id || `${addr.line1}-${addr.phone}`}
                  className="min-w-0 rounded-xl border border-slate-200 p-4"
                >
                  <p className="break-words font-medium text-slate-900">{addr.fullName}</p>
                  <p className="mt-1 break-all text-sm text-slate-600">{addr.phone}</p>
                  <p className="break-all text-sm text-slate-600">{addr.email}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {addr.line1}, {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  {addr.isDefault && (
                    <p className="mt-2 inline-block rounded-full bg-[#7FAF73]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4f8248]">
                      Default
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              No saved addresses yet. Your checkout address will appear here.
            </p>
          )}
        </div>
      )}

      {activeTab === 'return/exchange' && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <form
            onSubmit={onSubmitReturn}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
          >
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              Request return / exchange
            </h2>
            {!eligibleOrders.length ? (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                No orders are eligible for return (only last 7 days).
              </p>
            ) : (
              <>
                <select
                  className="mt-4 w-full min-h-[48px] rounded-xl border border-slate-300 px-4 py-3 text-base sm:min-h-0"
                  value={returnForm.orderId}
                  onChange={(e) => setReturnForm((f) => ({ ...f, orderId: e.target.value }))}
                >
                  <option value="">Select eligible order</option>
                  {eligibleOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {orderTitle(o)} — {new Date(o.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <textarea
                  className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-base"
                  rows={4}
                  placeholder="Reason for return/exchange"
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm((f) => ({ ...f, reason: e.target.value }))}
                />
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
                    Supporting image (optional)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full min-h-[48px] rounded-xl border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#7FAF73]/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#4f8248] sm:text-base"
                    onChange={(e) => setReturnForm((f) => ({ ...f, imageFile: e.target.files?.[0] || null }))}
                  />
                </label>
                <button
                  type="submit"
                  className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#7FAF73] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:w-auto sm:tracking-[0.18em]"
                >
                  Submit request
                </button>
              </>
            )}
            {returnMsg && <p className="mt-3 text-sm text-slate-600">{returnMsg}</p>}
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">My return requests</h2>
            {!returnRequests.length ? (
              <p className="mt-3 text-sm text-slate-600">No return/exchange requests yet.</p>
            ) : (
              <div className="mt-4 max-h-[min(60vh,480px)] space-y-3 overflow-y-auto pr-1 sm:max-h-none sm:overflow-visible">
                {returnRequests.map((request) => (
                  <div
                    key={request._id}
                    className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-4"
                  >
                    <p className="break-words text-sm font-medium text-slate-900">
                      Order: {request.order?._id ? String(request.order._id).slice(-8) : 'N/A'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{request.reason}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f8248]">
                      {request.status}
                    </p>
                    {request.adminNote && (
                      <p className="mt-1 break-words text-xs text-slate-500">Admin note: {request.adminNote}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
