import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, signup } = useStore();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (!form.name || !form.email || !form.password) {
        setError('Please complete all fields.');
        return;
      }
      const result = await signup(form);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      navigate('/account');
      return;
    }
    const res = await login(form);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    navigate('/account');
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-5xl items-center px-6 py-10">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 lg:p-12 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="mt-2 text-slate-600">
          {mode === 'login'
            ? 'Sign in to view orders, wishlist, and your account details.'
            : 'Join DRIP for a premium shopping experience.'}
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
              placeholder="Full name"
              autoComplete="name"
            />
          )}
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            placeholder="Email"
            type="email"
            autoComplete="email"
          />
          <input
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#7FAF73]"
            placeholder="Password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="mt-2 inline-flex rounded-full bg-[#7FAF73] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
          className="mt-6 text-sm text-slate-600 underline"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </button>
      </div>
    </section>
  );
}
