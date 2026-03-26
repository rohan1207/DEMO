import React, { createContext, useContext, useMemo, useState } from 'react';
import { products } from '../data/products';
import { api } from '../lib/api';

const StoreContext = createContext(null);

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
};

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => read('drip_user', null));
  const [cart, setCart] = useState(() => read('drip_cart', []));
  const [wishlist, setWishlist] = useState(() => read('drip_wishlist', []));
  const [orders, setOrders] = useState(() => read('drip_orders', []));
  const [token, setToken] = useState(() => localStorage.getItem('drip_token'));
  const [catalog, setCatalog] = useState(products);

  const persist = (nextUser, nextCart, nextWishlist, nextOrders) => {
    write('drip_user', nextUser);
    write('drip_cart', nextCart);
    write('drip_wishlist', nextWishlist);
    write('drip_orders', nextOrders);
  };

  const signup = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('drip_token', data.token);
      persist(data.user, cart, wishlist, orders);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('drip_token', data.token);
      persist(data.user, cart, wishlist, orders);
      await fetchMyOrders();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Invalid email or password' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('drip_token');
    persist(null, cart, wishlist, orders);
  };

  const addToCart = (productId, qty = 1) => {
    const nextCart = [...cart];
    const idx = nextCart.findIndex((i) => i.productId === productId);
    if (idx >= 0) nextCart[idx].qty += qty;
    else nextCart.push({ productId, qty });
    setCart(nextCart);
    persist(user, nextCart, wishlist, orders);
  };

  const updateQty = (productId, qty) => {
    const nextCart = cart
      .map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    setCart(nextCart);
    persist(user, nextCart, wishlist, orders);
  };

  const removeFromCart = (productId) => {
    const nextCart = cart.filter((i) => i.productId !== productId);
    setCart(nextCart);
    persist(user, nextCart, wishlist, orders);
  };

  const toggleWishlist = (productId) => {
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);
    persist(user, cart, next, orders);
  };

  const placeOrder = async (paymentMeta = {}) => {
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => {
      const p = products.find((x) => x.id === item.productId);
      return sum + (p?.price || 0) * item.qty;
    }, 0);

    if (token) {
      try {
        const payload = {
          items: cart.map((i) => ({ productId: i.productId, qty: i.qty })),
          shippingAddress: paymentMeta.shippingAddress ?? user?.address ?? '',
          razorpayOrderId: paymentMeta.razorpayOrderId,
          razorpayPaymentId: paymentMeta.razorpayPaymentId,
        };
        const { data } = await api.post('/orders', payload);
        const nextOrders = [
          {
            id: data._id,
            createdAt: data.createdAt,
            items: cart,
            total: total,
            status: data.status || 'Placed',
          },
          ...orders,
        ];
        setOrders(nextOrders);
        setCart([]);
        persist(user, [], wishlist, nextOrders);
        return { ok: true };
      } catch {
        return { ok: false, message: 'Order failed. Please try again.' };
      }
    }

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: cart,
      total,
      status: 'Confirmed',
    };
    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    setCart([]);
    persist(user, [], wishlist, nextOrders);
    return { ok: true };
  };

  const createRazorpayOrder = async () => {
    const amount = cart.reduce((sum, item) => {
      const p = catalog.find((x) => x.id === item.productId || x._id === item.productId);
      return sum + (p?.price || 0) * item.qty;
    }, 0);
    if (!token) return { ok: false, message: 'Please login to continue payment' };
    try {
      const { data } = await api.post('/orders/razorpay/create-order', { amount });
      return { ok: true, order: data, amount };
    } catch {
      return { ok: false, message: 'Unable to initiate Razorpay order' };
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      if (Array.isArray(data) && data.length) {
        setCatalog(
          data.map((p) => ({
            ...p,
            id: p._id || p.id,
            fallbackImage:
              p.fallbackImage ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><rect width='100%25' height='100%25' fill='%23f2f5f1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23608b58' font-size='52' font-family='Arial'>Drip Product</text></svg>",
          }))
        );
      }
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  const fetchProductBySlug = async (slug) => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      return {
        ok: true,
        product: {
          ...data,
          id: data._id || data.id,
          fallbackImage:
            data.fallbackImage ||
            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><rect width='100%25' height='100%25' fill='%23f2f5f1'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23608b58' font-size='52' font-family='Arial'>Drip Product</text></svg>",
        },
      };
    } catch {
      const fallback = products.find((p) => p.slug === slug);
      return { ok: !!fallback, product: fallback || null };
    }
  };

  const fetchMyOrders = async () => {
    if (!token) return { ok: false };
    try {
      const { data } = await api.get('/orders/my');
      const mapped = (data || []).map((o) => ({
        id: o._id,
        createdAt: o.createdAt,
        items: (o.items || []).map((i) => ({ productId: String(i.product), qty: i.qty })),
        total: o.subtotal || 0,
        status: o.status,
      }));
      setOrders(mapped);
      persist(user, cart, wishlist, mapped);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  React.useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (token) fetchMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = catalog.find((x) => x.id === item.productId || x._id === item.productId);
        return sum + (p?.price || 0) * item.qty;
      }, 0),
    [cart, catalog]
  );

  const value = {
    user,
    token,
    catalog,
    cart,
    wishlist,
    orders,
    cartCount,
    cartTotal,
    signup,
    login,
    logout,
    addToCart,
    updateQty,
    removeFromCart,
    toggleWishlist,
    placeOrder,
    createRazorpayOrder,
    fetchProducts,
    fetchProductBySlug,
    fetchMyOrders,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
