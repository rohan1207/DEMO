import React, { createContext, useContext, useMemo, useState } from 'react';
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
  const [user, setUser] = useState(() => read('DRIP_user', null));
  const [cart, setCart] = useState(() => read('DRIP_cart', []));
  const [wishlist, setWishlist] = useState(() => read('DRIP_wishlist', []));
  const [orders, setOrders] = useState(() => read('DRIP_orders', []));
  const [token, setToken] = useState(() => localStorage.getItem('DRIP_token'));
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [returnRequests, setReturnRequests] = useState([]);

  const resolveCatalogProduct = (productId, productsList = catalog) =>
    productsList.find(
      (x) =>
        String(x.id) === String(productId) ||
        String(x._id) === String(productId) ||
        String(x.slug) === String(productId)
    );

  const persist = (nextUser, nextCart, nextWishlist, nextOrders) => {
    write('DRIP_user', nextUser);
    write('DRIP_cart', nextCart);
    write('DRIP_wishlist', nextWishlist);
    write('DRIP_orders', nextOrders);
  };

  const signup = async ({ name, email, password }) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('DRIP_token', data.token);
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
      localStorage.setItem('DRIP_token', data.token);
      persist(data.user, cart, wishlist, orders);
      await fetchMyOrders();
      await fetchMyReturns();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Invalid email or password' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('DRIP_token');
    persist(null, cart, wishlist, orders);
    setReturnRequests([]);
  };

  const checkEmailExists = async (email) => {
    try {
      const { data } = await api.post('/auth/check-email', { email });
      return { ok: true, exists: Boolean(data.exists) };
    } catch (err) {
      return { ok: false, exists: false, message: err.response?.data?.message || 'Unable to verify email' };
    }
  };

  const updateProfile = async (payload) => {
    if (!token) return { ok: false, message: 'Please login first' };
    try {
      const { data } = await api.patch('/auth/me', payload);
      setUser(data.user);
      persist(data.user, cart, wishlist, orders);
      return { ok: true, user: data.user };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Unable to update profile' };
    }
  };

  const addToCart = (productId, qty = 1) => {
    const nextCart = [...cart];
    const idx = nextCart.findIndex((i) => i.productId === productId);
    if (idx >= 0) nextCart[idx].qty += qty;
    else nextCart.push({ productId, qty });
    setCart(nextCart);
    persist(user, nextCart, wishlist, orders);
  };

  /** Replaces the cart with a single line item (checkout path for “Buy now”). */
  const buyNow = (productId, qty = 1) => {
    const nextCart = [{ productId, qty }];
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
    const validCartItems = cart
      .map((item) => {
        const p = resolveCatalogProduct(item.productId);
        if (!p) return null;
        return { ...item, productId: p.id };
      })
      .filter(Boolean);
    if (!validCartItems.length) {
      setCart([]);
      persist(user, [], wishlist, orders);
      return { ok: false, message: 'Cart items are outdated. Please add products again.' };
    }
    const total = validCartItems.reduce((sum, item) => {
      const p = resolveCatalogProduct(item.productId);
      return sum + (p?.price || 0) * item.qty;
    }, 0);

    if (token) {
      try {
        const payload = {
          items: validCartItems.map((i) => ({ productId: i.productId, qty: i.qty })),
          shippingAddress: paymentMeta.shippingAddress ?? null,
          razorpayOrderId: paymentMeta.razorpayOrderId,
          razorpayPaymentId: paymentMeta.razorpayPaymentId,
        };
        const { data } = await api.post('/orders', payload);
        const nextOrders = [
          {
            id: data._id,
            createdAt: data.createdAt,
            items: validCartItems.map((item) => {
              const p = resolveCatalogProduct(item.productId);
              return {
                productId: item.productId,
                qty: item.qty,
                name: p?.shortName || p?.name || '',
                image: p?.heroImage || p?.images?.[0] || '',
              };
            }),
            total: total,
            status: data.status || 'Placed',
          },
          ...orders,
        ];
        setOrders(nextOrders);
        setCart([]);
        persist(user, [], wishlist, nextOrders);
        await refreshMe();
        return { ok: true };
      } catch {
        return { ok: false, message: 'Order failed. Please try again.' };
      }
    }

    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items: validCartItems.map((item) => {
        const p = resolveCatalogProduct(item.productId);
        return {
          productId: item.productId,
          qty: item.qty,
          name: p?.shortName || p?.name || '',
          image: p?.heroImage || p?.images?.[0] || '',
        };
      }),
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
      const p = resolveCatalogProduct(item.productId);
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
    setCatalogLoading(true);
    try {
      const { data } = await api.get('/products');
      const mapped = Array.isArray(data)
        ? data.map((p) => {
            const heroImage = p.heroImage || p.images?.[0] || '';
            const galleryImages = Array.isArray(p.galleryImages)
              ? p.galleryImages
              : Array.isArray(p.images)
              ? p.images.slice(1)
              : [];
            return {
              ...p,
              id: p._id || p.id,
              heroImage,
              galleryImages,
              images: [heroImage, ...galleryImages].filter(Boolean),
            };
          })
        : [];
      setCatalog(mapped);

      // Normalize persisted cart/wishlist IDs from old dummy slug IDs to backend _id IDs.
      const normalizedCart = cart
        .map((item) => {
          const matched = resolveCatalogProduct(item.productId, mapped);
          if (!matched) return null;
          return { ...item, productId: matched.id };
        })
        .filter(Boolean);

      const normalizedWishlist = wishlist
        .map((id) => {
          const matched = resolveCatalogProduct(id, mapped);
          return matched ? matched.id : null;
        })
        .filter(Boolean);

      setCart(normalizedCart);
      setWishlist(normalizedWishlist);
      persist(user, normalizedCart, normalizedWishlist, orders);

      return { ok: true };
    } catch {
      setCatalog([]);
      return { ok: false };
    } finally {
      setCatalogLoading(false);
    }
  };

  const refreshMe = async () => {
    if (!token) return { ok: false };
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      persist(data.user, cart, wishlist, orders);
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
          heroImage: data.heroImage || data.images?.[0] || '',
          galleryImages: Array.isArray(data.galleryImages)
            ? data.galleryImages
            : Array.isArray(data.images)
            ? data.images.slice(1)
            : [],
          images: [
            data.heroImage || data.images?.[0] || '',
            ...(Array.isArray(data.galleryImages)
              ? data.galleryImages
              : Array.isArray(data.images)
              ? data.images.slice(1)
              : []),
          ].filter(Boolean),
        },
      };
    } catch {
      return { ok: false, product: null };
    }
  };

  const fetchMyOrders = async () => {
    if (!token) return { ok: false };
    try {
      const { data } = await api.get('/orders/my');
      const mapped = (data || []).map((o) => ({
        id: o._id,
        createdAt: o.createdAt,
        items: (o.items || []).map((i) => ({
          productId: String(i.product),
          qty: i.qty,
          name: i.name || '',
          image: i.image || '',
        })),
        total: o.subtotal || 0,
        status: o.status,
        shippingAddress: o.shippingAddress || null,
      }));
      setOrders(mapped);
      persist(user, cart, wishlist, mapped);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  const fetchMyReturns = async () => {
    if (!token) return { ok: false };
    try {
      const { data } = await api.get('/orders/returns/my');
      setReturnRequests(Array.isArray(data) ? data : []);
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  const uploadReturnImage = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post('/orders/returns/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  };

  const submitReturnRequest = async ({ orderId, reason, imageFile }) => {
    if (!token) return { ok: false, message: 'Please login first' };
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadReturnImage(imageFile);
      await api.post('/orders/returns', { orderId, reason, imageUrl });
      await fetchMyReturns();
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Unable to submit return request' };
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

  React.useEffect(() => {
    if (token) {
      refreshMe();
      fetchMyReturns();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = resolveCatalogProduct(item.productId);
        return sum + (p?.price || 0) * item.qty;
      }, 0),
    [cart, catalog]
  );

  const value = {
    user,
    token,
    catalog,
    catalogLoading,
    cart,
    wishlist,
    orders,
    cartCount,
    cartTotal,
    signup,
    login,
    logout,
    addToCart,
    buyNow,
    updateQty,
    removeFromCart,
    toggleWishlist,
    placeOrder,
    createRazorpayOrder,
    fetchProducts,
    fetchProductBySlug,
    fetchMyOrders,
    checkEmailExists,
    updateProfile,
    refreshMe,
    returnRequests,
    fetchMyReturns,
    submitReturnRequest,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
