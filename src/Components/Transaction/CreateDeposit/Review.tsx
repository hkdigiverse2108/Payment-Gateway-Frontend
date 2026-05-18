const Review = ({ data }: any) => {
  return (
    <div className="review-wrapper">
      <div className="review-header">
        <h2 className="review-title">Review & Confirm</h2>
        <p className="review-subtitle">
          Please verify details before payment
        </p>
      </div>
      <div className="review-card">
        <div className="review-amount">
          <p className="review-amount-label">Payable Amount</p>
          <p className="review-amount-value">₹ {data.amount || 0}</p>
        </div>
        <div className="review-body">
          <div className="review-row">
            <span className="review-label">Gateway</span>
            <span className="review-badge">
              {data.gateway || "-"}
            </span>
          </div>
          <div className="review-grid">
            <div className="review-item">
              <p className="review-item-label">Full Name</p>
              <p className="review-item-value">{data.customerName || "-"}</p>
            </div>
            <div className="review-item">
              <p className="review-item-label">Phone</p>
              <p className="review-item-value">{data.customerPhone || "-"}</p>
            </div>
            <div className="review-item review-full">
              <p className="review-item-label">Email</p>
              <p className="review-item-value">{data.customerEmail || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;