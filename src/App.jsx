import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Toast from './components/Toast';
import QuickViewModal from './components/QuickViewModal';

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('papernest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('papernest_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toasts, setToasts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('papernest_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('papernest_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    addToast(`"${product.name}" added to cart 🛒`);
  }, [addToast]);

  const handleUpdateCart = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  }, []);

  const handleRemoveFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
    addToast('Item removed from cart', 'info');
  }, [addToast]);

  const handleClearCart = useCallback(() => {
    setCart([]);
    addToast('Order confirmed! Cart cleared 🎉', 'success');
  }, [addToast]);

  const handleToggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const isWishlisted = prev.some(w => w.id === product.id);
      if (isWishlisted) {
        addToast('Removed from wishlist', 'info');
        return prev.filter(w => w.id !== product.id);
      } else {
        addToast(`"${product.name}" added to wishlist 💖`);
        return [...prev, product];
      }
    });
  }, [addToast]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onQuickView={setQuickViewProduct}
            />
          }
        />
        <Route
          path="/shop"
          element={
            <ShopPage
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onQuickView={setQuickViewProduct}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductPage
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              onQuickView={setQuickViewProduct}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onQuickView={setQuickViewProduct}
            />
          }
        />
      </Routes>
      <Footer />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlist.some(w => w.id === quickViewProduct.id)}
        />
      )}

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
    </BrowserRouter>
  );
}
