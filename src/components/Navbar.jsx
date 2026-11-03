import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Heart, Sparkles } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ cartCount = 0, wishlistCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=notebooks', label: 'Notebooks' },
    { to: '/shop?category=art', label: 'Art Supplies' },
    { to: '/shop?category=cute', label: 'Cute 🌸' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <span>PaperNest</span>
          </Link>

          {/* Desktop Links */}
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="navbar-link">{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="icon-btn icon-btn--badge" aria-label="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="icon-btn icon-btn--badge" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </Link>
            <button className="menu-btn" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch}>
              <Search size={20} className="search-icon" />
              <input
                autoFocus
                type="text"
                placeholder="Search for notebooks, pens, art supplies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                <X size={20} />
              </button>
            </form>
            <p className="search-hint">Press Enter to search</p>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="navbar-logo">
                <div className="logo-icon"><Sparkles size={18} /></div>
                PaperNest
              </span>
              <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
            </div>
            <ul className="mobile-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="mobile-link" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mobile-actions">
              <Link to="/cart" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                <ShoppingCart size={18} /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
