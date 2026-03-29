import React from 'react';
import { Link } from 'react-router-dom';

const ASSETS = '/assets/images';

export default function Footer() {
  return (
    <footer className="DRIP-footer mt-10 w-full text-left">
      <div className="flex flex-row flex-wrap gap-8 w-full">
        <div className="DRIP-column">
          <Link to="/"><img src={`${ASSETS}/logo-wave.svg`} alt="DRIP" className="DRIP-logo block" /></Link>
          <p className="text-[#9ca3af]">
            At DRIP, we engineer everyday carry through clean design, structural durability, and premium usability.
          </p>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src={`${ASSETS}/btnInstagram.svg`} alt="Instagram" className="block mt-2" /></a>
        </div>
        <div className="DRIP-column">
          <p className="font-bold text-white uppercase">Menu</p>
          <p className="flex flex-col">
            <Link to="/home">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/about">About Us</Link>
            <Link to="/login">Account</Link>
          </p>
        </div>
        <div className="DRIP-column">
          <p className="font-bold text-white uppercase">Policies</p>
          <p className="text-[#9ca3af]">
            Read our policy and legal pages before purchasing.
          </p>
          <p className="flex flex-col mt-2">
            <Link to="/policy">Cancellation & Returns Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </p>
        </div>
        <div className="DRIP-column">
          <p className="font-bold text-white uppercase">Contact</p>
          <p className="text-[#9ca3af]">
            DRIP
            <br />
            B3+4, Navswarajya Housing Society,
            <br />
            Paud Road, Kothrud, Pune – 411 038
          </p>
          <p className="text-[#9ca3af] mt-2">
            customercare@trexstore.in
            <br />
            +91-00000-00000
          </p>
        </div>
      </div>
      <p className="DRIP-footer-info text-center text-[#9ca3af]">© 2026 DRIP Store. All rights reserved.</p>
    </footer>
  );
}
