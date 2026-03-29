import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DripMiniCart from './components/drip/DripMiniCart';
import { StoreProvider } from './context/StoreContext';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import PolicyPage from './pages/PolicyPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopPage from './pages/ShopPage';
import TermsPage from './pages/TermsPage';
import WishlistPage from './pages/WishlistPage';
import './styles/DRIP.css';

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef(null);
  const isLandingLoaderRoute = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  return (
    <div className="app-layout">
      {!isLandingLoaderRoute && <Navbar onCartClick={() => setCartOpen(true)} />}
      <main
        ref={mainContentRef}
        className={isLandingLoaderRoute ? 'min-h-screen bg-white' : 'main-content bg-white'}
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/hone" element={<Navigate to="/home" replace />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isLandingLoaderRoute && <Footer />}
      </main>
      {!isLandingLoaderRoute && <DripMiniCart open={cartOpen} onClose={() => setCartOpen(false)} />}
    </div>
  );
}

function AppContent() {
  const [isPhoneScreen, setIsPhoneScreen] = useState(() => window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleScreenChange = (event) => {
      setIsPhoneScreen(event.matches);
    };

    setIsPhoneScreen(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleScreenChange);

    return () => {
      mediaQuery.removeEventListener('change', handleScreenChange);
    };
  }, []);

  const phoneAllowedRoutes = ['/account', '/checkout', '/shop', '/about', '/wishlist', '/contact'];
  const allowPhoneAccess =
    phoneAllowedRoutes.some((route) => location.pathname.startsWith(route)) ||
    location.pathname.startsWith('/product/');

  if (isPhoneScreen && !allowPhoneAccess) {
    return (
      <div className="phone-block-screen">
        <div className="phone-block-content">
          <h1>Please open on desktop.</h1>
          <p>Phone coming very soon.</p>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}

export default function App() {
  return <AppContent />;
}
