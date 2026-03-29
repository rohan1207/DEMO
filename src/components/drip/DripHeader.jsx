import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ASSETS = '/assets/images';

export default function DRIPHeader({ onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      id="menu"
      className="fixed left-0 top-0 w-full h-[100px] z-[999] flex flex-row justify-between items-center bg-black transition-[height] duration-300 md:max-[1081px]:h-[60px]"
    >
      <nav className="flex flex-row justify-between items-center flex-1 px-4">
        <div className="flex flex-row gap-0">
          <Link to="/" className="px-6 text-white/50 text-sm font-medium uppercase tracking-normal flex items-center md:max-[1081px]:text-xl md:max-[1081px]:px-2">
            Home
          </Link>
          <Link to="/about" className="px-6 text-white/50 text-sm font-medium uppercase tracking-normal flex items-center md:max-[1081px]:hidden">
            About
          </Link>
          <Link to="/contact" className="px-6 text-white/50 text-sm font-medium uppercase tracking-normal flex items-center hidden md:max-[1081px]:block md:max-[1081px]:text-xl">
            Contact
          </Link>
          <Link to="/shop" className="px-6 text-white/50 text-sm font-medium uppercase tracking-normal flex items-center md:max-[1081px]:text-xl">
            Shop
          </Link>
          <Link to="/science" className="px-6 text-white/50 text-sm font-medium uppercase tracking-normal flex items-center hidden md:max-[1081px]:block md:max-[1081px]:text-xl">
            Science
          </Link>
        </div>

        <Link to="/" aria-label="T-REX logo" className="absolute left-1/2 -translate-x-1/2 md:max-[1081px]:left-4 md:max-[1081px]:translate-x-0 md:max-[1081px]:w-[125px]">
          <img src={`${ASSETS}/logo-wave.svg`} alt="T-REX" className="h-8 w-auto block" />
        </Link>

        <div className="flex flex-row items-center gap-4">
          <Link to="/login" aria-label="Profile" className="p-2 block">
            <img src={`${ASSETS}/btnProfile.svg`} alt="" className="block w-6 h-6" />
          </Link>
          <button type="button" onClick={onCartClick} aria-label="Cart" className="p-2 block">
            <img src={`${ASSETS}/btnCart.svg`} alt="" className="block w-6 h-6" />
          </button>
          <Link to="/shop" className="px-6 text-white/50 text-sm font-medium uppercase hidden md:max-[1081px]:inline-block md:max-[1081px]:text-white md:max-[1081px]:text-sm md:max-[1081px]:bg-[#1f1f1f] md:max-[1081px]:rounded-[20px] md:max-[1081px]:h-10 md:max-[1081px]:flex md:max-[1081px]:items-center">
            Buy Now
          </Link>
        </div>
      </nav>

      <button
        type="button"
        aria-label="Menu"
        className="hidden md:max-[1081px]:block absolute top-2 right-0 w-[115px] mr-2"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <img src={`${ASSETS}/btnBurgerMenu.svg`} alt="" className="block w-full" />
      </button>

      {menuOpen && (
        <div className="fixed inset-0 bg-black z-[998] md:max-[1081px]:block hidden pt-24 pl-4" style={{ paddingTop: '12vh' }}>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-white text-xl py-3" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-white text-xl py-3" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/contact" className="text-white text-xl py-3" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/shop" className="text-white text-xl py-3" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/science" className="text-white text-xl py-3" onClick={() => setMenuOpen(false)}>Science</Link>
          </div>
        </div>
      )}
    </header>
  );
}
