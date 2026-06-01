import { Eye, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { CommonButton } from "../../Attribute/FormFields/CommonButton";

const WelcomeBanner = ({ user, onRefresh, totalTrans = 0, successRate = 0, todayCount = 0, }: any) => {
  const navigate = useNavigate();
  return (
    <section className="admin-hero">
      <div className="admin-hero-copy">
        <p className="admin-hero-kicker">Admin command center</p>
        <h1>Hello, {user?.name || "Admin"}</h1>
        <span> Track transaction health, wallet movement, and payment status in one place. </span>
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
        <CommonButton title="Deposit" variant="plain" onClick={() => navigate(ROUTES.TRANSACTIONS.DEPOSIT)} className="ct-add-btn" >
          <Plus className="w-4 h-4" />
          <span className="text-sm pb-2">Deposit</span>
        </CommonButton>
        <CommonButton variant="plain" title="Transactions" onClick={() => navigate(ROUTES.TRANSACTIONS.BASE)} className="ct-add-btn">
          <Eye className="w-4 h-4" />
          <span className="text-sm pb-2">Transactions</span>
        </CommonButton>
        <CommonButton variant="icon-only" title="Refresh dashboard" aria-label="Refresh dashboard" onClick={onRefresh} className="ct-add-btn" >
          <RefreshCw className="w-4 h-4" />
        </CommonButton>
      </div>
    </section>
  );
};

export default WelcomeBanner;