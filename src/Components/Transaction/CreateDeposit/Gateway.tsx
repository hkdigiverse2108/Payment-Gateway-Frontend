const Gateway = ({ selected, onSelect }: any) => {
  const cardClass = (key: string) =>
    `gateway-card ${selected === key ? "active" : ""}`;

  return (
    <div>
      <h2 className="gateway-title">Select Gateway</h2>
      <p className="gateway-subtitle">Choose payment method to continue</p>

      <div className="gateway-grid">

        <div
          onClick={() => onSelect("cashfree")}
          className={cardClass("cashfree")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">Cashfree</span>
            <span className="gateway-badge">Active</span>
          </div>
          <p className="gateway-desc">UPI • Cards • Net Banking</p>
        </div>

        <div
          onClick={() => onSelect("razorpay")}
          className={cardClass("razorpay")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">Razorpay</span>
          </div>
          <p className="gateway-desc">Cards • UPI • Wallets</p>
        </div>

        <div
          onClick={() => onSelect("phonepe")}
          className={cardClass("phonepe")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">PhonePe</span>
          </div>
          <p className="gateway-desc">UPI Payments</p>
        </div>

        <div
          onClick={() => onSelect("payu")}
          className={cardClass("payu")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">PayU</span>
          </div>
          <p className="gateway-desc">Cards • UPI</p>
        </div>

        <div
          onClick={() => onSelect("paytm")}
          className={cardClass("paytm")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">Paytm</span>
          </div>
          <p className="gateway-desc">Wallet • UPI</p>
        </div>

        <div
          onClick={() => onSelect("stripe")}
          className={cardClass("stripe")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">Stripe</span>
          </div>
          <p className="gateway-desc">International Cards</p>
        </div>

        <div
          onClick={() => onSelect("ccavenue")}
          className={cardClass("ccavenue")}
        >
          <div className="gateway-card-header">
            <span className="gateway-name">CCAvenue</span>
          </div>
          <p className="gateway-desc">All India Payments</p>
        </div>

      </div>
    </div>
  );
};

export default Gateway;