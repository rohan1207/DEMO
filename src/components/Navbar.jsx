import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar({ onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, user } = useStore();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  // Scroll-aware navbar: add subtle shadow + reduce height on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setIsScrolled(y > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/about', label: 'About Us' },
  ];

  return (
    <>
      <header
        id="menu"
        className={`fixed left-0 top-0 w-full z-[999] transition-all duration-300 ${
          isScrolled ? 'bg-white/95 shadow-[0_1px_6px_rgba(15,23,42,0.06)] backdrop-blur' : 'bg-white'
        }`}
      >
        <nav className="relative flex items-center justify-between h-[72px] px-4 lg:h-[96px] lg:px-10">

          {/* ── Left: desktop links ── */}
          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-5 text-black/60 hover:text-black text-xs font-medium uppercase tracking-[0.18em] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Centre: logo (always centred) ── */}
          <Link
            to="/"
            aria-label="T-REX logo"
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto z-10"
          >
            <img
              src="/logo.png"
              alt="T-REX"
            className="h-14 w-auto lg:h-[4.5rem]"
            />
          </Link>

          {/* ── Right: icons + burger ── */}
          <div className="flex items-center gap-1 ml-auto relative z-20">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden lg:inline-flex items-center justify-center rounded-full border border-slate-200/70 h-8 w-8 text-slate-800 hover:bg-slate-100/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c-4.7-2.9-7.5-5.64-7.5-9a4.5 4.5 0 018.1-2.74A4.5 4.5 0 0119.5 11.25c0 3.36-2.8 6.1-7.5 9z" />
              </svg>
            </Link>
            <Link
              to="/account"
              aria-label={user ? 'Account' : 'Login'}
              className="hidden lg:inline-flex items-center justify-center rounded-full border border-slate-200/70 h-8 w-8 text-slate-800 hover:bg-slate-100/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={onCartClick}
              aria-label="Cart"
              className="hidden lg:inline-flex relative items-center justify-center rounded-full border border-slate-200/70 h-8 w-8 text-slate-800 hover:bg-slate-100/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a2 2 0 001.95 1.54h8.9a2 2 0 001.95-1.54L22 7H7.2" />
                <circle cx="10" cy="19" r="1.5" />
                <circle cx="18" cy="19" r="1.5" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[1rem] rounded-full bg-[#7FAF73] px-1 text-center text-[9px] font-semibold leading-[1rem] text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
            <Link
              to="/shop"
            className="hidden lg:inline-flex items-center justify-center rounded-full bg-[#7FAF73] text-white px-4 h-9 text-[11px] font-medium tracking-[0.18em] uppercase hover:bg-[#719D66] transition-colors ml-2"
            >
              Buy Now
            </Link>

            {/* Mobile cart icon — left of hamburger */}
            <button
              type="button"
              onClick={onCartClick}
              aria-label="Open cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300/80 text-slate-800 transition-colors hover:bg-slate-100 lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a2 2 0 001.95 1.54h8.9a2 2 0 001.95-1.54L22 7H7.2" />
                <circle cx="10" cy="19" r="1.5" />
                <circle cx="18" cy="19" r="1.5" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[1.1rem] rounded-full bg-[#7FAF73] px-1 text-center text-[10px] font-semibold leading-[1.1rem] text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden p-2 flex flex-col justify-center items-center gap-[5px] ml-1"
            >
              <span
                className={`block w-6 h-0.5 bg-black transition-transform duration-300 origin-center ${
                  menuOpen ? 'translate-y-[6.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-black transition-opacity duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-black transition-transform duration-300 origin-center ${
                  menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay menu ── */}
      <div
        className={`fixed inset-0 z-[998] bg-white flex flex-col pt-[60px] px-6 lg:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col mt-8 gap-1">
          {navLinks.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className="text-black/80 hover:text-black text-xl font-medium uppercase py-3 border-b border-slate-200 transition-colors"
              style={{
                transitionDelay: menuOpen ? `${i * 50}ms` : '0ms',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/wishlist"
            onClick={closeMenu}
            aria-label="Wishlist"
            className="text-black/80 hover:text-black py-3 border-b border-slate-200 transition-colors inline-flex items-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c-4.7-2.9-7.5-5.64-7.5-9a4.5 4.5 0 018.1-2.74A4.5 4.5 0 0119.5 11.25c0 3.36-2.8 6.1-7.5 9z" />
            </svg>
          </Link>
          <Link
            to="/account"
            onClick={closeMenu}
            aria-label={user ? 'Account' : 'Login'}
            className="text-black/80 hover:text-black py-3 border-b border-slate-200 transition-colors inline-flex items-center"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a7.5 7.5 0 0115 0" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => {
              onCartClick?.();
              closeMenu();
            }}
            aria-label="Cart"
            className="text-black/80 hover:text-black py-3 border-b border-slate-200 transition-colors inline-flex items-center text-left w-full"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a2 2 0 001.95 1.54h8.9a2 2 0 001.95-1.54L22 7H7.2" />
              <circle cx="10" cy="19" r="1.5" />
              <circle cx="18" cy="19" r="1.5" />
            </svg>
            {cartCount > 0 && (
              <span className="ml-2 rounded-full bg-[#7FAF73] px-2 py-0.5 text-[11px] font-semibold text-white">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="text-black/80 hover:text-black text-xl font-medium uppercase py-3 border-b border-slate-200 transition-colors"
          >
            Contact Us
          </Link>
        </nav>

        {/* Buy Now CTA at the bottom of the mobile menu */}
        <div className="mt-auto mb-10">
          <Link
            to="/shop"
            onClick={closeMenu}
            className="flex items-center justify-center w-full h-12 bg-slate-900 text-white text-sm font-semibold uppercase rounded-full hover:bg-slate-800 transition-colors"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </>
  );
}