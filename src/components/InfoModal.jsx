import { useState } from 'react';
import { X, HelpCircle, Truck, RotateCcw, Mail, Search, Sparkles, Check, ChevronDown, PackageCheck } from 'lucide-react';
import './InfoModal.css';

const FAQ_ITEMS = [
  {
    q: 'How long does standard delivery take?',
    a: 'We ship orders within 24 hours of placement. Standard shipping takes 3-5 business days across India. Express shipping takes 1-2 business days.'
  },
  {
    q: 'Is delivery free on all orders?',
    a: 'Delivery is 100% FREE on all orders of ₹499 and above. For orders under ₹499, a nominal flat fee of ₹79 applies.'
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We offer a 7-day hassle-free return and exchange policy. If any item is damaged, defective, or not what you ordered, let us know within 7 days for a full refund or free replacement.'
  },
  {
    q: 'Do you offer bulk discounts for schools or corporate gifting?',
    a: 'Yes! We support custom stationery hampers, corporate branded notebooks, and school orders. Contact us at hello@papernest.in with your requirements for special volume pricing.'
  },
  {
    q: 'What payment modes are accepted?',
    a: 'We accept all major UPI apps (GPay, PhonePe, Paytm), Credit & Debit cards (Visa, Mastercard, RuPay), Net Banking for 50+ Indian banks, and Cash on Delivery (COD).'
  }
];

export default function InfoModal({ type, onClose }) {
  const [activeFaq, setActiveFaq] = useState(0);
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState(null);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    setTrackResult({
      id: trackQuery.trim().toUpperCase(),
      status: 'In Transit 🚚',
      location: 'Central Hub, Mumbai',
      expectedDate: 'In 2 days',
      updates: [
        { time: 'Today, 08:30 AM', note: 'Out for local sorting at Central Hub' },
        { time: 'Yesterday, 06:15 PM', note: 'Package dispatched from PaperNest Warehouse' },
        { time: 'Yesterday, 11:00 AM', note: 'Order packed and sealed with love 🌸' }
      ]
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMsg.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="info-overlay" onClick={onClose}>
      <div className="info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="info-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {type === 'faq' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><HelpCircle size={22} /></div>
              <h2>Frequently Asked Questions</h2>
              <p>Everything you need to know about shopping with PaperNest</p>
            </div>

            <div className="faq-accordion">
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className={`faq-card ${activeFaq === idx ? 'expanded' : ''}`}>
                  <button className="faq-question" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                    <span>{item.q}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  {activeFaq === idx && (
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'tracking' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><Truck size={22} /></div>
              <h2>Track Your Order</h2>
              <p>Enter your Order ID (e.g. PN-123456) or phone number</p>
            </div>

            <form className="track-form" onSubmit={handleTrack}>
              <div className="track-input-wrap">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Enter Order ID or mobile number..."
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary track-btn">Track</button>
            </form>

            {trackResult && (
              <div className="tracking-status-card">
                <div className="track-status-header">
                  <div>
                    <span className="track-id">Order #{trackResult.id}</span>
                    <h4>Status: {trackResult.status}</h4>
                  </div>
                  <span className="track-expected">Expected: {trackResult.expectedDate}</span>
                </div>
                <div className="track-timeline">
                  {trackResult.updates.map((u, i) => (
                    <div key={i} className="timeline-step">
                      <div className="timeline-bullet" />
                      <div className="timeline-info">
                        <span className="timeline-time">{u.time}</span>
                        <p className="timeline-note">{u.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {type === 'returns' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><RotateCcw size={22} /></div>
              <h2>Returns & Exchanges</h2>
              <p>Easy, friendly returns because we want you to love your stationery</p>
            </div>

            <div className="policy-boxes">
              <div className="policy-box">
                <h4>7-Day Free Returns</h4>
                <p>Eligible on all unopened notebooks, pens, and art supplies within 7 days of delivery.</p>
              </div>
              <div className="policy-box">
                <h4>Damaged or Incorrect Items</h4>
                <p>If an item arrives damaged or incomplete, contact us within 48 hours for immediate instant replacement.</p>
              </div>
              <div className="policy-box">
                <h4>Quick Refunds</h4>
                <p>Refunds are initiated within 24 hours of receiving the returned item back into your original payment method.</p>
              </div>
            </div>
          </div>
        )}

        {type === 'shipping' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><Truck size={22} /></div>
              <h2>Shipping Policy</h2>
              <p>Safe, prompt, and protective delivery across India</p>
            </div>

            <div className="policy-boxes">
              <div className="policy-box">
                <h4>Free Shipping Over ₹499</h4>
                <p>Enjoy free standard delivery on all orders ₹499 and above. Flat ₹79 for smaller orders.</p>
              </div>
              <div className="policy-box">
                <h4>Delivery Timelines</h4>
                <p>Metro cities: 2-3 business days. Rest of India: 3-5 business days. Express delivery available at checkout (1-2 days).</p>
              </div>
              <div className="policy-box">
                <h4>Damage-Proof Packaging</h4>
                <p>All items are securely packed in moisture-resistant bubble envelopes and reinforced boxes to avoid corner dings and bent covers.</p>
              </div>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><Mail size={22} /></div>
              <h2>Contact PaperNest Support</h2>
              <p>Have questions about a product or order? We'd love to chat!</p>
            </div>

            {contactSent ? (
              <div className="contact-success-msg">
                <Check size={32} />
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out, {contactName}. We usually reply within 2-4 hours.</p>
              </div>
            ) : (
              <form className="contact-modal-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Aanya Verma"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="aanya@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="How can we help you today?"
                  />
                </div>
                <button type="submit" className="btn btn-primary contact-submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {type === 'about' && (
          <div className="info-content">
            <div className="info-header">
              <div className="info-icon-badge"><Sparkles size={22} /></div>
              <h2>About PaperNest</h2>
              <p>Celebrating the tactile joy of paper, ink, and creativity</p>
            </div>
            <div className="about-text">
              <p>
                Founded in 2020 by passionate journalers and artists, <strong>PaperNest</strong> was born out of a desire for stationery that inspires. We believe that putting pen to paper is a mindful practice in a fast-paced digital world.
              </p>
              <p>
                Every notebook, fountain pen, washi tape, and ceramic mug in our shop is handpicked for aesthetic beauty, tactile pleasure, and enduring durability.
              </p>
              <div className="about-highlights">
                <div className="about-hl-item">
                  <PackageCheck size={20} />
                  <span>Curated Japanese & European brands</span>
                </div>
                <div className="about-hl-item">
                  <Sparkles size={20} />
                  <span>Eco-conscious archival paper</span>
                </div>
                <div className="about-hl-item">
                  <Truck size={20} />
                  <span>Plastic-free packaging wherever possible</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
