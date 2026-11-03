import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import './ProductCard.css';

const BADGE_STYLES = {
  'Best Seller': 'badge-pink',
  'New': 'badge-purple',
  'Sale': 'badge-orange',
  'Hot': 'badge-red',
  'Premium': 'badge-blue',
  'Best Value': 'badge-green',
};

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) {
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <div className="product-overlay">
          <button className="overlay-btn" title="Quick view" onClick={handleQuickView}>
            <Eye size={16} />
          </button>
        </div>
        {product.badge && (
          <span className={`badge product-badge ${BADGE_STYLES[product.badge] || 'badge-pink'}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="discount-tag">-{discount}%</span>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
              />
            ))}
          </div>
          <span className="rating-num">{product.rating}</span>
          <span className="rating-reviews">({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <div className="product-prices">
            <span className="product-price">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="product-original-price">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {addedToCart ? (
              <span>✓</span>
            ) : (
              <ShoppingCart size={16} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
