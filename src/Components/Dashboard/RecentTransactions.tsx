import { Skeleton } from "antd";
import { CheckCircle2, Clock3, ReceiptText, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { formatAbsoluteDate } from "../../Utils/DateHelper";
import { formatCurrency } from "../../Utils/FormatHelper";

const statusMap: any = {
  success: {
    label: "Success",
    icon: <CheckCircle2 className="w-4 h-4" />,
    badge: "admin-status-success",
  },
  pending: {
    label: "Pending",
    icon: <Clock3 className="w-4 h-4" />,
    badge: "admin-status-pending",
  },
  failed: {
    label: "Failed",
    icon: <XCircle className="w-4 h-4" />,
    badge: "admin-status-failed",
  },
  default: {
    label: "Unknown",
    icon: <Clock3 className="w-4 h-4" />,
    badge: "admin-status-default",
  },
};

const RecentTransactions = ({ data = [], loading }: any) => {
  const safeData = Array.isArray(data) ? data.slice(0, 8) : [];
  return (
    <section className="admin-panel admin-transactions-panel">
      <div className="admin-panel-header">
        <div>
          <p>Latest payment activity</p>
          <h3>Recent Transactions</h3>
        </div>
        <Link to={ROUTES.TRANSACTIONS.BASE} className="admin-panel-link">
          View all
        </Link>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 7 }} />
      ) : safeData.length === 0 ? (
        <div className="chart-empty">No transactions found</div>
      ) : (
        <div className="admin-transaction-table">
          <div className="admin-transaction-head">
            <span>Order</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {safeData.map((transaction: any) => {
            const statusKey = transaction.paymentStatus || transaction.finalStatus || transaction.status || "default";
            const status = statusMap[statusKey] || statusMap.default;
            const orderId = transaction.orderId || transaction._id || "N/A";
            const customer = transaction.user?.name || transaction.user?.email || transaction.customerName || transaction.customerEmail || transaction.userId || "Customer";
            return (
              <article key={transaction._id || orderId} className="admin-transaction-row">
                <div className="admin-transaction-icon">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <div className="admin-transaction-main">
                  <strong>{String(orderId).length > 18 ? `${String(orderId).slice(0, 18)}...` : orderId}</strong>
                  <span>{formatAbsoluteDate(transaction.createdAt)}</span>
                </div>
                <div className="admin-transaction-customer">
                  <strong>{String(customer).length > 18 ? `${String(customer).slice(0, 18)}...` : customer}</strong>
                  <span>{transaction.type || "payment"}</span>
                </div>
                <div className="admin-transaction-side">
                  <strong>{formatCurrency(transaction.amount)}</strong>
                  <span className={`admin-status-badge ${status.badge}`}>
                    {status.icon}
                    {status.label}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentTransactions;

  