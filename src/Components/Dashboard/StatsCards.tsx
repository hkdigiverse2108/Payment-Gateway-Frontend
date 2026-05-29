import { Skeleton } from "antd";
import { AlertTriangle, CheckCircle2, Clock, CreditCard, IndianRupee, UsersRound } from "lucide-react";
import { formatCurrency } from "../../Utils/FormatHelper";

const KpiCards = ({ loading, totalTrans, totalVolume, todayRevenue, monthRevenue, successRate, failureRate, pendingCount, activeUsers }: any) => {
  const cards = [
    {
      title: "Revenue Today",
      value: formatCurrency(todayRevenue),
      detail: `${formatCurrency(monthRevenue)} this month`,
      icon: <IndianRupee className="w-5 h-5" />,
      type: "success",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalVolume),
      detail: "Successful value",
      icon: <IndianRupee className="w-5 h-5" />,
      type: "brand",
    },
    {
      title: "Transactions",
      value: totalTrans,
      detail: "All payment attempts",
      icon: <CreditCard className="w-5 h-5" />,
      type: "info",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      detail: "Completed payments",
      icon: <CheckCircle2 className="w-5 h-5" />,
      type: "green",
    },
    {
      title: "Failure Rate",
      value: `${failureRate}%`,
      detail: "Failed payment ratio",
      icon: <AlertTriangle className="w-5 h-5" />,
      type: "danger",
    },
    {
      title: "Pending Queue",
      value: pendingCount,
      detail: "Awaiting settlement",
      icon: <Clock className="w-5 h-5" />,
      type: "warning",
    },
    {
      title: "Active Users",
      value: activeUsers,
      detail: "Users today",
      icon: <UsersRound className="w-5 h-5" />,
      type: "info",
    },
  ];

  return (
    <div className="admin-kpi-grid">
      {cards.map((card) => (
        <article key={card.title} className={`admin-kpi-card admin-kpi-${card.type}`}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <>
              <div className="admin-kpi-top">
                <div className="admin-kpi-icon">{card.icon}</div>
                <span>{card.detail}</span>
              </div>
              <p>{card.title}</p>
              <strong>{card.value}</strong>
            </>
          )}
        </article>
      ))}
    </div>
  );
};

export default KpiCards;
