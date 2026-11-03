import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import './WishlistPage.css';

export default function WishlistPage({ wishlist, onToggleWishlist, onAddToCart, onQuickView }) {
  const totalSavings = wishlist.reduce((sum, p) => sum + (p.originalPrice - p.price), 0);

  const handleAddAllToCart = () => {
    wishlist.forEach(p => onAddToCart?.(p));
  };

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-hero">
          <div className="wishlist-hero-bg" />
          <div className="container wishlist-hero-inner">
            <div className="wishlist-hero-icon">
              <Heart size={36} />
            </div>
            <h1>My Wishlist</h1>
            <p>Save items you love and come back to them anytime</p>
          </div>
        </div>
        <div className="container empty-wishlist">
          <div className="empty-heart">💔</div>
          <h2>Your wishlist is empty</h2>
          <p>Browse our collection and save your favorite items!</p>
          <Link to="/shop" className="btn btn-primary">
            <Sparkles size={18} /> Start Exploring
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-hero">
        <div className="wishlist-hero-bg" />
        <div className="container wishlist-hero-inner">
          <div className="wishlist-hero-icon">
            <Heart size={36} />
          </div>
          <h1>My Wishlist</h1>
          <p>Save items you love and come back to them anytime</p>
        </div>
      </div>

      <div className="container">
        <div className="wishlist-toolbar">
          <div className="wishlist-meta">
            <span className="wishlist-count-badge">{wishlist.length} saved items</span>
            {totalSavings > 0 && (
              <span className="wishlist-savings">💰 Total savings: ₹{totalSavings}</span>
            )}
          </div>
          <div className="wishlist-actions">
            <button
              className="btn btn-primary add-all-btn"
              onClick={handleAddAllToCart}
            >
              <ShoppingCart size={16} /> Add All to Cart
            </button>
            <button
              className="btn btn-ghost clear-btn"
              onClick={() => wishlist.forEach(p => onToggleWishlist(p))}
            >
              <Trash2 size={16} /> Clear All
            </button>
          </div>
        </div>

        <div className="products-grid">
          {wishlist.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={true}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        <div className="wishlist-cta">
          <p>Want to discover more? <Link to="/shop">Continue Shopping →</Link></p>
        </div>
      </div>
    </main>
  );
}
