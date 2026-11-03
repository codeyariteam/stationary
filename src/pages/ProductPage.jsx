import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ArrowLeft, Truck, Shield, RotateCcw, Check, Minus, Plus, MessageSquare, ThumbsUp } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './ProductPage.css';

const BADGE_STYLES = {
  'Best Seller': 'badge-pink',
  'New': 'badge-purple',
  'Sale': 'badge-orange',
  'Hot': 'badge-red',
  'Premium': 'badge-blue',
  'Best Value': 'badge-green',
};

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Ananya Roy',
    rating: 5,
    date: '2 days ago',
    title: 'Exceeded my expectations!',
    comment: 'The paper quality is thick with zero bleed-through even with my fountain pens and wet highlighters. Packaging was also super aesthetic!',
    verified: true,
    likes: 12
  },
  {
    id: 2,
    name: 'Karan Mehra',
    rating: 5,
    date: '1 week ago',
    title: 'Top notch stationery piece',
    comment: 'Been using this daily for my work bullet journal. The binding lays completely flat, and the texture feels truly premium.',
    verified: true,
    likes: 8
  },
  {
    id: 3,
    name: 'Simran Kaur',
    rating: 4,
    date: '2 weeks ago',
    title: 'Lovely pastel design',
    comment: 'Super cute color, exactly as pictured! Arrived in 2 days in Mumbai. Would definitely recommend to fellow stationery addicts 💖',
    verified: true,
    likes: 5
  }
];

export default function ProductPage({ onAddToCart, onToggleWishlist, wishlist, onQuickView }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reviews state
  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newHoverRating, setNewHoverRating] = useState(0);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const isWishlisted = wishlist?.some(w => w.id === product.id);
  const catName = categories.find(c => c.id === product.category)?.name;

  const productImages = [
    product.image,
    // Variations / angle mockups
    product.image + '&auto=format&fit=crop&w=600&q=80',
    product.image + '&auto=format&fit=crop&w=600&q=70',
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: newName.trim(),
      rating: newRating,
      date: 'Just now',
      title: 'Customer Review',
      comment: newComment.trim(),
      verified: true,
      likes: 0
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewName('');
    setNewComment('');
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <main className="product-page">
      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{catName}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container product-layout">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>

        <div className="product-main">
          {/* Image Gallery */}
          <div className="product-image-section">
            <div className="product-image-main">
              <img src={productImages[activeImageIndex]} alt={product.name} />
              {product.badge && (
                <span className={`badge product-badge ${BADGE_STYLES[product.badge] || 'badge-pink'}`}>
                  {product.badge}
                </span>
              )}
              {discount > 0 && <span className="discount-tag-lg">-{discount}% OFF</span>}
            </div>
            <div className="product-image-thumbs">
              {productImages.map((src, i) => (
                <div
                  key={i}
                  className={`thumb ${i === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(i)}
                >
                  <img src={src} alt={`Angle ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="product-details">
            <p className="product-detail-category">{catName}</p>
            <h1 className="product-detail-name">{product.name}</h1>

            <div className="product-detail-rating">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                    stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                  />
                ))}
              </div>
              <span className="rating-num">{product.rating}</span>
              <span className="rating-reviews">({product.reviews} reviews)</span>
            </div>

            <div className="product-detail-price">
              <span className="price-big">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="price-original">₹{product.originalPrice}</span>
                  <span className="price-savings">You save ₹{product.originalPrice - product.price}!</span>
                </>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            {/* Tags */}
            <div className="product-tags">
              {product.tags.map(tag => (
                <span key={tag} className="product-tag">{tag}</span>
              ))}
            </div>

            {/* Quantity & Actions */}
            <div className="product-actions">
              <div className="quantity-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease">
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} aria-label="Increase">
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={`btn add-to-cart-main ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {added ? (
                  <><Check size={18} /> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </button>

              <button
                className={`wishlist-btn-lg ${isWishlisted ? 'wishlisted' : ''}`}
                onClick={() => onToggleWishlist?.(product)}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Guarantees */}
            <div className="product-guarantees">
              <div className="guarantee-item">
                <Truck size={16} /> Free delivery on orders ₹499+
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} /> 7-day easy returns
              </div>
              <div className="guarantee-item">
                <Shield size={16} /> 100% authentic curated products
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-nav">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'reviews' ? `Reviews (${reviewsList.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-desc">
                <p>{product.description}</p>
                <ul>
                  <li>✓ Premium archival-grade stationery paper and materials</li>
                  <li>✓ Ergonomic construction designed for students, creatives, and daily journaling</li>
                  <li>✓ Carefully packaged in eco-friendly bubble wrapping for safe shipping</li>
                  <li>✓ Sourced from trusted ethical manufacturers</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-reviews">
                <div className="reviews-header-block">
                  <div className="review-summary">
                    <span className="review-big-num">{product.rating}</span>
                    <div>
                      <div className="stars">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={20}
                            fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                            stroke={i < Math.floor(product.rating) ? '#fbbf24' : '#d1d5db'}
                          />
                        ))}
                      </div>
                      <p>{product.reviews} total ratings · {reviewsList.length} verified reviews</p>
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary write-review-btn"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    <MessageSquare size={16} /> {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {reviewSubmitted && (
                  <div className="review-success-banner">
                    <Check size={18} /> Thank you! Your review has been published.
                  </div>
                )}

                {showReviewForm && (
                  <form className="write-review-form" onSubmit={handleSubmitReview}>
                    <h4>Share Your Experience</h4>
                    <div className="rating-select-row">
                      <span>Your Rating:</span>
                      <div className="stars-interactive">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            className="star-pick-btn"
                            onMouseEnter={() => setNewHoverRating(star)}
                            onMouseLeave={() => setNewHoverRating(0)}
                            onClick={() => setNewRating(star)}
                          >
                            <Star
                              size={22}
                              fill={(newHoverRating || newRating) >= star ? '#fbbf24' : 'none'}
                              stroke={(newHoverRating || newRating) >= star ? '#fbbf24' : '#cbd5e1'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="review-form-fields">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Meera S.)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                      />
                      <textarea
                        rows={3}
                        placeholder="What did you love about this item? Paper quality, feel, color..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary submit-review-btn">
                      Post Review
                    </button>
                  </form>
                )}

                <div className="reviews-list">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="review-item">
                      <div className="review-item-header">
                        <div className="review-item-user">
                          <div className="review-avatar">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <span className="reviewer-name">{rev.name}</span>
                            {rev.verified && (
                              <span className="verified-badge">✓ Verified Buyer</span>
                            )}
                          </div>
                        </div>
                        <span className="review-date">{rev.date}</span>
                      </div>

                      <div className="review-stars-row">
                        <div className="stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rev.rating ? '#fbbf24' : 'none'}
                              stroke={i < rev.rating ? '#fbbf24' : '#d1d5db'}
                            />
                          ))}
                        </div>
                        {rev.title && <strong className="review-title">{rev.title}</strong>}
                      </div>

                      <p className="review-comment-text">{rev.comment}</p>

                      <div className="review-footer">
                        <button className="like-review-btn" onClick={(e) => e.currentTarget.classList.toggle('liked')}>
                          <ThumbsUp size={14} /> Helpful ({rev.likes})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="tab-shipping">
                <p><strong>Standard Delivery:</strong> 3-5 business days — FREE on orders ₹499+</p>
                <p><strong>Express Delivery:</strong> 1-2 business days — ₹99 flat rate across major Indian cities</p>
                <p><strong>7-Day Returns:</strong> If you are not completely enchanted with your stationery, return it in original condition for a full refund or replacement. No questions asked.</p>
                <p><strong>Packaging:</strong> All notebooks, pens, and inks are shipped in sturdy, damage-resistant corrugated packaging with moisture-proof wrapping.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="related-products">
            <h2 className="section-title">You Might Also Like</h2>
            <div className="products-grid products-grid--4">
              {related.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist?.some(w => w.id === p.id)}
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
