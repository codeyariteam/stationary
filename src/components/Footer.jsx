import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, Phone, Check } from 'lucide-react';
import InfoModal from './InfoModal';
import './Footer.css';

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TwitterIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const openModal = (e, type) => {
    e.preventDefault();
    setModalType(type);
  };

  return (
    <>
      <footer className="footer">
        <div className="footer-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg-subtle)" />
          </svg>
        </div>
        <div className="footer-body">
          <div className="container footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon"><Sparkles size={18} /></div>
                <span>PaperNest</span>
              </div>
              <p className="footer-tagline">
                Your cozy corner for all things stationery. Curating the finest notebooks, pens, and art supplies since 2020.
              </p>
              <div className="footer-social">
                <a href="#instagram" aria-label="Instagram"><InstagramIcon size={18} /></a>
                <a href="#twitter" aria-label="Twitter"><TwitterIcon size={18} /></a>
                <a href="#facebook" aria-label="Facebook"><FacebookIcon size={18} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/shop?category=notebooks">Notebooks & Diaries</Link></li>
                <li><Link to="/shop?category=pens">Pens & Markers</Link></li>
                <li><Link to="/shop?category=art">Art Supplies</Link></li>
                <li><Link to="/shop?category=cute">Cute Stationery 🌸</Link></li>
                <li><Link to="/shop?category=school">School Essentials</Link></li>
                <li><Link to="/shop?category=office">Office Supplies</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Help & Information</h4>
              <ul>
                <li><a href="#tracking" onClick={(e) => openModal(e, 'tracking')}>Order Tracking 🚚</a></li>
                <li><a href="#returns" onClick={(e) => openModal(e, 'returns')}>Returns & Exchanges</a></li>
                <li><a href="#shipping" onClick={(e) => openModal(e, 'shipping')}>Shipping Policy</a></li>
                <li><a href="#faq" onClick={(e) => openModal(e, 'faq')}>FAQ</a></li>
                <li><a href="#contact" onClick={(e) => openModal(e, 'contact')}>Contact Us</a></li>
                <li><a href="#about" onClick={(e) => openModal(e, 'about')}>About PaperNest</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-contact">
                <li><MapPin size={16} /> 14 Paper Lane, Mumbai 400001</li>
                <li><Phone size={16} /> +91 98765 43210</li>
                <li><Mail size={16} /> hello@papernest.in</li>
              </ul>
              <div className="footer-newsletter">
                <p>Get 10% off your first order!</p>
                {subscribed ? (
                  <div className="newsletter-success">
                    <Check size={16} />
                    <span>You're subscribed! Check your inbox 💌</span>
                  </div>
                ) : (
                  <form className="newsletter-form" onSubmit={handleSubscribe}>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary">Subscribe</button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="footer-bottom container">
            <p>© 2026 PaperNest. All rights reserved. Made with 💖 for stationery lovers.</p>
            <div className="footer-bottom-links">
              <a href="#privacy" onClick={(e) => openModal(e, 'faq')}>Privacy Policy</a>
              <a href="#terms" onClick={(e) => openModal(e, 'faq')}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {modalType && (
        <InfoModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </>
  );
}
