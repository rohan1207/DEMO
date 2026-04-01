import React from 'react';
import { Link } from 'react-router-dom';

const ASSETS = '/assets/images';

export default function Footer() {
  const year = new Date().getFullYear();

  const menuLinks = [
    { to: '/home', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const supportLinks = [
    { to: '/account', label: 'My Account' },
    { to: '/checkout', label: 'Checkout' },
    { to: '/policy', label: 'Returns Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
  ];

  return (
    <footer className="mt-14 w-full border-t border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-[1300px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-10">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" aria-label="DRIP home">
              <img src="/logo.png" alt="DRIP" className="h-11 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              Premium tumblers made for everyday carry - clean design, durable build, and performance you can trust.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 transition-colors hover:bg-slate-50"
            >
              Instagram
            </a>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900">Menu</h3>
            <div className="mt-3 space-y-2.5">
              {menuLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900">Support</h3>
            <div className="mt-3 space-y-2.5">
              {supportLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="block text-sm text-slate-600 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>DRIP, Pune, Maharashtra</p>
              <a href="mailto:customercare@trexstore.in" className="block transition-colors hover:text-slate-900">
                customercare@trexstore.in
              </a>
              <a href="tel:+910000000000" className="block transition-colors hover:text-slate-900">
                +91-00000-00000
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs tracking-[0.08em] text-slate-500">
            © {year} DRIP Store. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
            <Link to="/policy" className="transition-colors hover:text-slate-800">Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-slate-800">Terms</Link>
            <Link to="/contact" className="transition-colors hover:text-slate-800">Help</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
