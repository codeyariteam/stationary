import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, X } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import './CartPage.css';

const VALID_COUPONS = {
  'PAPERLOVE20': { type: 'percent', value: 20, desc: '20% OFF' },
  'STATIONERY10': { type: 'percent', value: 10, desc: '10% OFF' },
  'WELCOME10': { type: 'percent', value: 10, desc: '10% OFF' },
  'FREESHIP': { type: 'shipping', value: 100, desc: 'Free Delivery' },
};

export default function CartPage({ cart, onUpdateCart, onRemoveFromCart, onClearCart }) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeDeliveryThreshold = 499;

  let deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : 79;
  if (appliedCoupon && appliedCoupon.type === 'shipping') {
    deliveryFee = 0;
  }

  let couponDiscount = 0;
  if (appliedCoupon && appliedCoupon.type === 'percent') {
    couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
  }

  const total = Math.max(0, subtotal - couponDiscount + deliveryFee);
  const itemSavings = cart.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
  const totalSavings = itemSavings + couponDiscount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, ...VALID_COUPONS[code] });
      setPromoMessage({ type: 'success', text: `Coupon ${code} applied successfully! 🎉` });
      setPromoInput('');
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid coupon code. Try "PAPERLOVE20"!' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoMessage(null);
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Start exploring our cozy stationery collection!</p>
          <Link to="/shop" className="btn btn-primary">
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="cart-title">
          Shopping Cart <span className="cart-count-badge">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
        </h1>

        {subtotal < freeDeliveryThreshold && appliedCoupon?.type !== 'shipping' && (
          <div className="free-delivery-bar">
            <div className="free-delivery-progress" style={{ width: `${(subtotal / freeDeliveryThreshold) * 100}%` }} />
            <p>Add <strong>₹{freeDeliveryThreshold - subtotal}</strong> more for FREE delivery! 🚚</p>
          </div>
        )}

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item card">
                <Link to={`/product/${item.id}`} className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <p className="cart-item-category">{item.category}</p>
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-meta">
                    {item.originalPrice > item.price && (
                      <span className="cart-item-savings badge badge-green">
                        Save ₹{(item.originalPrice - item.price) * item.quantity}
                      </span>
                    )}
                  </div>
                </div>
                <div className="cart-item-controls">
                  <div className="cart-qty">
                    <button onClick={() => onUpdateCart(item.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateCart(item.id, item.quantity + 1)} aria-label="Increase">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="cart-item-price">
                    <span className="cart-price">₹{item.price * item.quantity}</span>
                    {item.originalPrice > item.price && (
                      <span className="cart-original">₹{item.originalPrice * item.quantity}</span>
                    )}
                  </div>
                  <button className="remove-btn" onClick={() => onRemoveFromCart(item.id)} aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3 className="summary-title">Order Summary</h3>

            {/* Promo Code Input or Applied Pill */}
            {!appliedCoupon ? (
              <form className="promo-input" onSubmit={handleApplyPromo}>
                <Tag size={16} />
                <input
                  type="text"
                  placeholder="Promo code (e.g. PAPERLOVE20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button type="submit" className="apply-btn">Apply</button>
              </form>
            ) : (
              <div className="applied-coupon-pill">
                <div className="coupon-left">
                  <Check size={16} className="coupon-check" />
                  <div>
                    <span className="coupon-code-name">{appliedCoupon.code}</span>
                    <span className="coupon-savings-tag">({appliedCoupon.desc})</span>
                  </div>
                </div>
                <button type="button" onClick={handleRemoveCoupon} className="coupon-remove" aria-label="Remove coupon">
                  <X size={16} />
                </button>
              </div>
            )}

            {promoMessage && (
              <p className={`promo-feedback ${promoMessage.type}`}>
                {promoMessage.text}
              </p>
            )}

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="summary-row savings-row">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              {itemSavings > 0 && (
                <div className="summary-row savings-row">
                  <span>Product Savings</span>
                  <span>-₹{itemSavings}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                  {deliveryFee === 0 ? '🎉 FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="btn btn-primary checkout-btn"
              onClick={() => setIsCheckoutOpen(true)}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <p className="secure-note">
              🔒 100% Secure Checkout
            </p>

            <div className="continue-shopping">
              <Link to="/shop">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          subtotal={subtotal}
          discount={couponDiscount}
          couponCode={appliedCoupon?.code}
          deliveryFee={deliveryFee}
          total={total}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={() => onClearCart?.()}
        />
      )}
    </main>
  );
}
