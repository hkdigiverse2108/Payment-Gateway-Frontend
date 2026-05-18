const Gateway = ({ selected, onSelect }: any) => {
  const cardClass = (key: string) =>
    `gateway-card ${selected === key ? "active" : ""}`;

  return (
    <div>
      <h2 className="gateway-title">Select Gateway</h2>
      <p className="gateway-subtitle">Choose payment method to continue</p>
      <div className="gateway-grid">
        <div onClick={() => onSelect("cashfree")} className={cardClass("cashfree")}>
          <div className="gateway-card-header">
            <span className="gateway-name">Cashfree</span>
            <span className="gateway-badge">Active</span>
          </div>
          <p className="gateway-desc">UPI • Cards • Net Banking</p>
        </div>
        <div className="gateway-card disabled">Razorpay (Coming Soon)</div>
        <div className="gateway-card disabled">PayU (Coming Soon)</div>
      </div>
    </div>
  );
};

export default Gateway;