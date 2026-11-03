import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, ArrowRight } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function ShopPage({ onAddToCart, onToggleWishlist, wishlist, onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('');

  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const filterNew = searchParams.get('filter') === 'new';

  const setCategory = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId) params.set('category', catId);
    else params.delete('category');
    params.delete('search');
    setSearchParams(params);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) result = result.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filterNew) result = result.filter(p => p.isNew);
    if (activeTag) result = result.filter(p => p.badge === activeTag);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': return result.sort((a, b) => a.price - b.price);
      case 'price-high': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'newest': return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return result.sort((a, b) => b.reviews - a.reviews);
    }
  }, [activeCategory, searchQuery, filterNew, priceRange, sortBy, activeTag]);

  const activeCatName = categories.find(c => c.id === activeCategory)?.name;

  return (
    <main className="shop-page">
      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <div className="container breadcrumb-inner">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Shop</span>
          {activeCatName && <><span>/</span><span>{activeCatName}</span></>}
        </div>
      </div>

      <div className="container shop-layout">
        {/* Sidebar */}
        <aside className={`shop-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="sidebar-close" onClick={() => setFiltersOpen(false)}><X size={20} /></button>
          </div>

          <div className="filter-group">
            <h4 className="filter-label">
              <span>Categories</span>
              <ChevronDown size={16} />
            </h4>
            <ul className="filter-options">
              <li>
                <button
                  className={`filter-option ${!activeCategory ? 'active' : ''}`}
                  onClick={() => setCategory('')}
                >
                  All Products
                  <span className="filter-count">{products.length}</span>
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`filter-option ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span>{cat.icon} {cat.name}</span>
                    <span className="filter-count">{products.filter(p => p.category === cat.id).length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h4 className="filter-label">
              <span>Price Range</span>
              <ChevronDown size={16} />
            </h4>
            <div className="price-range">
              <div className="price-display">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="price-slider"
              />
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-label"><span>Quick Filters</span></h4>
            <div className="quick-filters">
              {['Best Seller', 'New', 'Sale', 'Hot', 'Premium', 'Best Value'].map(badge => (
                <button
                  key={badge}
                  className={`quick-filter-tag ${activeTag === badge ? 'active' : ''}`}
                  onClick={() => setActiveTag(prev => prev === badge ? '' : badge)}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <div className="toolbar-left">
              <button className="btn btn-ghost filter-toggle" onClick={() => setFiltersOpen(true)}>
                <SlidersHorizontal size={18} /> Filters
              </button>
              {(activeCategory || searchQuery || filterNew || activeTag) && (
                <div className="active-filters">
                  {activeCatName && (
                    <span className="active-filter">
                      {activeCatName}
                      <button onClick={() => setCategory('')}><X size={12} /></button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="active-filter">
                      "{searchQuery}"
                      <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('search'); setSearchParams(p); }}><X size={12} /></button>
                    </span>
                  )}
                  {activeTag && (
                    <span className="active-filter">
                      {activeTag}
                      <button onClick={() => setActiveTag('')}><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="toolbar-right">
              <p className="results-count">{filteredProducts.length} products</p>
              <div className="sort-select-wrap">
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="sort-arrow" />
              </div>
            </div>
          </div>

          {/* Search Query headline */}
          {searchQuery && (
            <div className="search-headline">
              <Search size={18} />
              <span>Results for "<strong>{searchQuery}</strong>"</span>
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 ? (
            <div className="shop-products-grid">
              {filteredProducts.map((product) => (
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
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-primary" onClick={() => { setSearchParams({}); setPriceRange([0, 2000]); setActiveTag(''); }}>
                Clear Filters <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
