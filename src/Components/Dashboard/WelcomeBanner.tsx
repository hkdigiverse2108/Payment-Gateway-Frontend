import { Eye, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";

const WelcomeBanner = ({ user, onRefresh, totalTrans = 0, successRate = 0, todayCount = 0 }: any) => {
  const navigate = useNavigate();
  return (
    <section className="admin-hero">
      <div className="admin-hero-copy">
        <p className="admin-hero-kicker">Admin command center</p>
        <h1>Hello, {user?.name || "Admin"}</h1>
        <span>Track transaction health, wallet movement, and payment status in one place.</span>
      </div>
      <div className="admin-hero-metrics">
        <div>
          <span>Total txns</span>
          <strong>{totalTrans}</strong>
        </div>
        <div>
          <span>Success</span>
          <strong>{successRate}%</strong>
        </div>
        <div>
          <span>Today</span>
          <strong>{todayCount}</strong>
        </div>
      </div>
      <div className="admin-hero-actions">
        <button type="button" className="admin-hero-btn admin-hero-btn-primary" onClick={() => navigate(ROUTES.TRANSACTIONS.DEPOSIT)}>
          <Plus className="w-4 h-4" />
          <span>Deposit</span>
        </button>
        <button type="button" className="admin-hero-btn" onClick={() => navigate(ROUTES.TRANSACTIONS.BASE)}>
          <Eye className="w-4 h-4" />
          <span>Transactions</span>
        </button>
        <button type="button" className="admin-hero-icon" onClick={onRefresh} title="Refresh dashboard" aria-label="Refresh dashboard">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};

export default WelcomeBanner;