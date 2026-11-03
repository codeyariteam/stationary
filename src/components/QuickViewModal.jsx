import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Heart, Star, Check, Minus, Plus, ExternalLink, Truck, Shield } from 'lucide-react';
import './QuickViewModal.css';

export default function QuickViewModal({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          <div className="quickview-image-wrap">
            <img src={product.image} alt={product.name} className="quickview-img" />
            {product.badge && (
              <span className="badge quickview-badge">{product.badge}</span>
            )}
            {discount > 0 && (
              <span className="quickview-discount">-{discount}% OFF</span>
            )}
          </div>

          <div className="quickview-details">
            <span className="quickview-category">{product.category}</span>
            <h2 className="quickview-title">{product.name}</h2>

            <div className="quickview-rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                    stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
              <span className="rating-num">{product.rating}</span>
              <span className="rating-reviews">({product.reviews} reviews)</span>
            </div>

            <div className="quickview-price-row">
              <span className="quickview-price">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="quickview-orig-price">₹{product.originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="quickview-savings">Save ₹{(product.originalPrice - product.price) * quantity}</span>
              )}
            </div>

            <p className="quickview-desc">{product.description}</p>

            <div className="quickview-actions">
              <div className="quickview-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus size={14} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} aria-label="Increase">
                  <Plus size={14} />
                </button>
              </div>

              <button
                className={`btn btn-primary quickview-add ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {added ? (
                  <><Check size={16} /> Added ({quantity})</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart</>
                )}
              </button>

              <button
                className={`quickview-wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={() => onToggleWishlist(product)}
                aria-label="Wishlist"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="quickview-perks">
              <span><Truck size={14} /> Free delivery on orders ₹499+</span>
              <span><Shield size={14} /> 100% genuine stationery</span>
            </div>

            <div className="quickview-footer">
              <Link to={`/product/${product.id}`} onClick={onClose} className="quickview-full-link">
                View Full Product Details <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
