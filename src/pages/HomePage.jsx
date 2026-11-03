import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, Shield, RotateCcw, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { products, categories, testimonials } from '../data/products';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage({ onAddToCart, onToggleWishlist, wishlist, onQuickView }) {
  const featuredProducts = products.filter(p => p.badge === 'Best Seller' || p.badge === 'Hot').slice(0, 8);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <main className="homepage">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-blob blob-1" />
          <div className="hero-blob blob-2" />
          <div className="hero-blob blob-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>New arrivals every week!</span>
            </div>
            <h1 className="hero-title">
              Discover Your <br />
              <span className="hero-gradient">Perfect Stationery</span>
            </h1>
            <p className="hero-desc">
              From dreamy bullet journals to premium art supplies — find everything you need to bring your creative vision to life. ✨
            </p>
            <div className="hero-ctas">
              <Link to="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/shop?category=cute" className="btn btn-secondary">
                Explore Cute 🌸
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">500+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">50k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Average Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card-grid">
              {[
                { img: products[0].image, name: products[0].name, price: products[0].price, badge: '🏆 Best Seller' },
                { img: products[7].image, name: products[7].name, price: products[7].price, badge: '⭐ Top Rated' },
                { img: products[10].image, name: products[10].name, price: products[10].price, badge: '🎨 Art Pick' },
              ].map((item, i) => (
                <div key={i} className={`hero-mini-card hero-card-${i}`}>
                  <img src={item.img} alt={item.name} />
                  <div className="hero-mini-info">
                    <span className="hero-mini-badge">{item.badge}</span>
                    <span className="hero-mini-price">₹{item.price}</span>
                  </div>
                </div>
              ))}
              <div className="hero-floating-tag tag-1">
                <span>🔥 Trending</span>
              </div>
              <div className="hero-floating-tag tag-2">
                <Truck size={14} /><span>Free Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container trust-bar-inner">
          {[
            { icon: <Truck size={20} />, title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: <Shield size={20} />, title: 'Secure Payment', desc: '100% safe transactions' },
            { icon: <RotateCcw size={20} />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <ShoppingBag size={20} />, title: 'Premium Quality', desc: 'Curated just for you' },
          ].map((item, i) => (
            <div key={i} className="trust-item">
              <div className="trust-icon">{item.icon}</div>
              <div>
                <p className="trust-title">{item.title}</p>
                <p className="trust-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <div className="cat-icon">{cat.icon}</div>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                </div>
                <ArrowRight size={18} className="cat-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-pill"><TrendingUp size={14} /> Trending Now</div>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: 0 }}>Our most loved products</p>
            </div>
            <Link to="/shop" className="btn btn-secondary">View All <ArrowRight size={16} /></Link>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist?.some(w => w.id === product.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <div className="promo-pill"><Zap size={14} /> Limited Time Offer</div>
            <h2>Get 20% off on your first order</h2>
            <p>Use code <code>PAPERLOVE20</code> at checkout. Valid until November 30!</p>
            <Link to="/shop" className="btn btn-primary">Shop Now <ArrowRight size={18} /></Link>
          </div>
          <div className="promo-visual">
            {['📓', '✏️', '🎨', '📌', '🖌️'].map((emoji, i) => (
              <div key={i} className={`promo-emoji emoji-${i}`}>{emoji}</div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-pill"><Sparkles size={14} /> Just Arrived</div>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop?filter=new" className="btn btn-secondary">See All New <ArrowRight size={16} /></Link>
          </div>
          <div className="products-grid products-grid--4">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlist?.some(w => w.id === product.id)}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">What Our Customers Say 💬</h2>
            <p className="section-subtitle">Real reviews from real stationery lovers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }, (_, i) => <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />)}
                </div>
                <p className="testimonial-text">"{t.comment}"</p>
                <div className="testimonial-author">
                  <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-meta">{t.location} · {t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
