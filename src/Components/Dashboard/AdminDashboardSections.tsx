import { Skeleton } from "antd";
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, LineChart, ShieldAlert, UsersRound, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, formatDay } from "../../Utils/FormatHelper";

export const AdminOperationsPanel = ({ loading, todayCount, todayVolume, uniqueCustomers, failedCount, pendingCount, successRate }: any) => {
  const items = [
    {
      label: "Today volume",
      value: formatCurrency(todayVolume),
      meta: `${todayCount || 0} transactions today`,
      icon: <WalletCards className="w-5 h-5" />,
      type: "brand",
    },
    {
      label: "Customers",
      value: uniqueCustomers || 0,
      meta: "Unique users in current data",
      icon: <UsersRound className="w-5 h-5" />,
      type: "info",
    },
    {
      label: "Review queue",
      value: failedCount || 0,
      meta: "Failed payments",
      icon: <AlertTriangle className="w-5 h-5" />,
      type: "danger",
    },
    {
      label: "Pending queue",
      value: pendingCount || 0,
      meta: "Awaiting gateway update",
      icon: <Clock3 className="w-5 h-5" />,
      type: "warning",
    },
    {
      label: "Gateway health",
      value: `${successRate || 0}%`,
      meta: "Success rate",
      icon: <CheckCircle2 className="w-5 h-5" />,
      type: "success",
    },
  ];

  return (
    <section className="admin-ops-panel">
      <div className="admin-panel-header">
        <div>
          <p>Operational snapshot</p>
          <h3>Payment Control Room</h3>
        </div>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="admin-ops-grid">
          {items.map((item) => (
            <article
              key={item.label}
              className={`admin-ops-item admin-ops-${item.type}`}
            >
              <div className="admin-ops-icon">{item.icon}</div>
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.meta}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export const AdminFinancialCharts = ({ loading, transactions = [], totalDeposit = 0, totalWithdraw = 0 }: any) => {
  const dailyData = transactions
    .reduce((acc: any[], transaction: any) => {
      const day = new Date(
        transaction.createdAt || "1970-01-01T00:00:00.000Z",
      ).toDateString();
      const existing = acc.find((item) => item.rawDay === day);
      const target = existing || { rawDay: day, day: formatDay(day), deposit: 0, withdraw: 0, revenue: 0, net: 0 };
      const amount = Number(transaction.amount || 0);
      const isWithdraw = transaction.type === "withdraw" || transaction.type === "debit";
      if (isWithdraw) { target.withdraw += amount; }
      else { target.deposit += amount; }
      if ( (transaction.paymentStatus || transaction.finalStatus || transaction.status) === "success") {
        target.revenue += amount;
      }
      target.net = target.deposit - target.withdraw;
      if (!existing) acc.push(target);
      return acc;
    }, [])
    .sort( (a: any, b: any) => new Date(a.rawDay).getTime() - new Date(b.rawDay).getTime(),
    );
  const netFlow = totalDeposit - totalWithdraw;
  return (
    <section className="admin-finance-section">
      <div className="admin-section-title">
        <div>
          <p>Business view</p>
          <h2>Financial Summary</h2>
        </div>
        <div className="admin-section-pill">
          <WalletCards className="w-4 h-4" />
          Net {formatCurrency(netFlow)}
        </div>
      </div>
      <div className="admin-finance-grid">
        <article className="admin-panel admin-finance-chart">
          <div className="admin-panel-header">
            <div>
              <p>Balance movement</p>
              <h3>Cashflow Line</h3>
            </div>
            <div className="admin-panel-icon">
              <LineChart className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : dailyData.length === 0 ? (
            <div className="chart-empty">No financial data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <ReLineChart data={dailyData} margin={{ top: 8, right: 14, left: 0, bottom: 0 }} >
                <CartesianGrid stroke="var(--dashboard-chart-grid)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis width={60} tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value)).replace(".00", "") } />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--dashboard-chart-border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }}
                  formatter={(value: any, name: any) => [ formatCurrency(Number(value)), name === "net" ? "Net Flow" : "Revenue" ]}/>
                <Line type="monotone" dataKey="net" stroke="var(--dashboard-chart-blue)" strokeWidth={3} dot={false}
                  activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={2} dot={false} />
              </ReLineChart>
            </ResponsiveContainer>
          )}
        </article>
        <article className="admin-panel admin-finance-chart">
          <div className="admin-panel-header">
            <div>
              <p>Deposit vs withdraw</p>
              <h3>Flow Comparison</h3>
            </div>
            <div className="admin-panel-icon">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : dailyData.length === 0 ? (
            <div className="chart-empty">No flow data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyData} margin={{ top: 8, right: 14, left: 0, bottom: 0 }} >
                <CartesianGrid stroke="var(--dashboard-chart-grid)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} />
                <YAxis width={60} tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value)).replace(".00", "") } />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--dashboard-chart-border)", borderRadius: "12px", fontSize: "12px", color: "var(--foreground)" }} formatter={(value: any, name: any) => [ formatCurrency(Number(value)), name === "deposit" ? "Deposit" : "Withdraw" ]} />
                <Bar dataKey="deposit" fill="var(--dashboard-chart-deposit)" barSize={18} />
                <Bar dataKey="withdraw" fill="var(--dashboard-chart-withdraw)" barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </article>
      </div>
    </section>
  );
};

export const AdminRiskUserInsights = ({ loading, transactions = [], failedCount = 0, failureRate = 0, pendingCount = 0, uniqueCustomers = 0, activeUsers = 0 }: any) => {
  const recentFailures = transactions.filter( (transaction: any) => (transaction.paymentStatus || transaction.finalStatus || transaction.status) === "failed" ) .slice(0, 3);
  const gatewayHealth = failureRate >= 20 ? "Needs attention" : failureRate >= 10 ? "Watch" : "Healthy";
  const alerts = [
    {
      label: "Failed payment spike",
      value: `${failureRate}%`,
      meta:
        failureRate >= 10 ? "Failure rate is elevated" : "Within normal range",
      icon: <ShieldAlert className="w-5 h-5" />,
      type: failureRate >= 10 ? "danger" : "success",
    },
    {
      label: "Pending processing",
      value: pendingCount,
      meta: pendingCount > 0 ? "Gateway callbacks pending" : "No pending queue",
      icon: <Clock3 className="w-5 h-5" />,
      type: pendingCount > 0 ? "warning" : "success",
    },
    {
      label: "Gateway status",
      value: gatewayHealth,
      meta: "Derived from payment outcomes",
      icon:
        failureRate >= 10 ? (
          <AlertTriangle className="w-5 h-5" />
        ) : (
          <CheckCircle2 className="w-5 h-5" />
        ),
      type: failureRate >= 10 ? "danger" : "success",
    },
  ];
  return (
    <section className="admin-risk-user-grid">
      <article className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <p>Risk and alerts</p>
            <h3>System Attention</h3>
          </div>
        </div>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="admin-alert-list">
            {alerts.map((alert) => (
              <div key={alert.label} className={`admin-alert-item admin-alert-${alert.type}`} >
                <div className="admin-alert-icon">{alert.icon}</div>
                <div>
                  <span>{alert.label}</span>
                  <strong>{alert.value}</strong>
                  <p>{alert.meta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>
      <article className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <p>User insight</p>
            <h3>Customers</h3>
          </div>
          <div className="admin-panel-icon">
            <UsersRound className="w-5 h-5" />
          </div>
        </div>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <div className="admin-user-insight">
            <div>
              <span>Active today</span>
              <strong>{activeUsers}</strong>
            </div>
            <div>
              <span>Total customers</span>
              <strong>{uniqueCustomers}</strong>
            </div>
            <div>
              <span>Failed attempts</span>
              <strong>{failedCount}</strong>
            </div>
            <p>
              {recentFailures.length > 0 ? `${recentFailures.length} recent failed payment attempts require review.` : "No recent failed payment attempts in the current data."}
            </p>
          </div>
        )}
      </article>
    </section>
  );
};
