import { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote, Building, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import './CheckoutModal.css';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', icon: Smartphone, desc: 'Instant & Zero Transaction Fee' },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: Building, desc: 'All Indian banks supported' },
  { id: 'cod', name: 'Cash on Delivery', icon: Banknote, desc: 'Pay when your package arrives' },
];

export default function CheckoutModal({
  cart,
  subtotal,
  discount,
  couponCode,
  deliveryFee,
  total,
  onClose,
  onOrderSuccess
}) {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [formData, setFormData] = useState({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543210',
    address: '42 Lotus Blossom Lane, Apt 3B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [orderInfo, setOrderInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill in all required shipping address fields.');
      return;
    }

    setStep('processing');

    setTimeout(() => {
      const orderId = 'PN-' + Math.floor(100000 + Math.random() * 900000);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      setOrderInfo({
        orderId,
        deliveryDate: formattedDate,
        itemsCount: cart.reduce((s, i) => s + i.quantity, 0),
        amountPaid: total,
        paymentMethodName: PAYMENT_METHODS.find(p => p.id === paymentMethod)?.name,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
      });

      setStep('success');
      onOrderSuccess();
    }, 1500);
  };

  return (
    <div className="checkout-overlay" onClick={step !== 'processing' ? onClose : undefined}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {step !== 'processing' && step !== 'success' && (
          <button className="checkout-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        )}

        {step === 'processing' && (
          <div className="checkout-processing">
            <Loader2 size={48} className="spinner" />
            <h3>Processing Your Order...</h3>
            <p>Please wait while we secure your payment and confirm with the warehouse.</p>
          </div>
        )}

        {step === 'success' && orderInfo && (
          <div className="checkout-success-view">
            <div className="success-icon-wrap">
              <CheckCircle2 size={56} className="success-check" />
            </div>
            <div className="success-badge-pill">
              <Sparkles size={14} /> Order Placed Successfully!
            </div>
            <h2>Thank You, {formData.name.split(' ')[0]}!</h2>
            <p className="success-subtitle">
              We've received your order and are lovingly packing your stationery items.
            </p>

            <div className="order-details-card">
              <div className="order-detail-row">
                <span className="label">Order ID:</span>
                <span className="value order-id-value">#{orderInfo.orderId}</span>
              </div>
              <div className="order-detail-row">
                <span className="label">Estimated Delivery:</span>
                <span className="value delivery-date">🚚 {orderInfo.deliveryDate}</span>
              </div>
              <div className="order-detail-row">
                <span className="label">Payment Mode:</span>
                <span className="value">{orderInfo.paymentMethodName}</span>
              </div>
              <div className="order-detail-row">
                <span className="label">Total Paid:</span>
                <span className="value total-paid">₹{orderInfo.amountPaid}</span>
              </div>
              <div className="order-detail-row address-row">
                <span className="label">Delivering to:</span>
                <span className="value address-val">{orderInfo.shippingAddress}</span>
              </div>
            </div>

            <p className="order-confirm-note">
              A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>

            <button className="btn btn-primary success-btn" onClick={onClose}>
              Continue Shopping <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <div className="checkout-header">
              <h2>Express Checkout</h2>
              <div className="secure-badge">
                <ShieldCheck size={16} /> 256-Bit SSL Encrypted
              </div>
            </div>

            <div className="checkout-grid">
              {/* Left Column: Address & Payment */}
              <div className="checkout-left">
                <div className="checkout-section">
                  <h3 className="section-subtitle">
                    <Truck size={18} /> 1. Shipping Details
                  </h3>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="10-digit mobile"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@domain.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="House / Flat / Street"
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="checkout-section">
                  <h3 className="section-subtitle">
                    <CreditCard size={18} /> 2. Payment Method
                  </h3>
                  <div className="payment-options">
                    {PAYMENT_METHODS.map((pm) => {
                      const Icon = pm.icon;
                      return (
                        <label
                          key={pm.id}
                          className={`payment-option ${paymentMethod === pm.id ? 'active' : ''}`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={pm.id}
                            checked={paymentMethod === pm.id}
                            onChange={() => setPaymentMethod(pm.id)}
                          />
                          <Icon size={20} className="payment-icon" />
                          <div className="payment-text">
                            <span className="payment-title">{pm.name}</span>
                            <span className="payment-desc">{pm.desc}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="upi-input-box">
                      <label>Enter Virtual Payment Address (UPI ID)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okaxis"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="checkout-right">
                <div className="checkout-summary-box">
                  <h3>Order Summary</h3>
                  <div className="checkout-items-preview">
                    {cart.map((item) => (
                      <div key={item.id} className="preview-item">
                        <img src={item.image} alt={item.name} />
                        <div className="preview-item-info">
                          <p className="preview-item-name">{item.name}</p>
                          <span className="preview-item-qty">Qty: {item.quantity}</span>
                        </div>
                        <span className="preview-item-price">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-price-breakdown">
                    <div className="breakdown-row">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="breakdown-row discount-row">
                        <span>Coupon Discount ({couponCode})</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="breakdown-row">
                      <span>Shipping Fee</span>
                      <span className={deliveryFee === 0 ? 'free-text' : ''}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="breakdown-total">
                      <span>Total Payable</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary place-order-btn">
                    Place Order (₹{total}) <ArrowRight size={18} />
                  </button>

                  <p className="guarantee-text">
                    🔒 100% Buyer Protection & Easy 7-Day Returns
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
