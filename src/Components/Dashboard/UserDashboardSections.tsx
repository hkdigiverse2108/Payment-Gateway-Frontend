import { ArrowDownOutlined, ArrowUpOutlined, BarChartOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, CreditCardOutlined, DollarOutlined, EyeOutlined, FireOutlined, LineChartOutlined, PieChartOutlined, RiseOutlined, SwapOutlined, ThunderboltOutlined, TrophyOutlined, WalletOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ROUTES } from "../../Constants/Routes";
import { formatAbsoluteDate } from "../../Utils/DateHelper";
import { formatCurrency, formatDateLabel } from "../../Utils/FormatHelper";

const statusColors = ["var(--success)", "var(--warning)", "#ef4444"];

const getStatusValue = (data: any, name: string) =>
  data?.statusData?.find((item: any) => item.name === name)?.value || 0;

const getStatusMeta = (status = "pending") => {
  switch (status.toLowerCase()) {
    case "success":
      return {
        label: "Success",
        icon: <CheckCircleOutlined />,
        row: "lasttxn-row-success",
        badge: "lasttxn-badge-success",
      };
    case "failed":
      return {
        label: "Failed",
        icon: <CloseCircleOutlined />,
        row: "lasttxn-row-failed",
        badge: "lasttxn-badge-failed",
      };
    default:
      return {
        label: "Pending",
        icon: <ClockCircleOutlined />,
        row: "lasttxn-row-pending",
        badge: "lasttxn-badge-pending",
      };
  }
};

const CashflowTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const deposit =
    payload.find((item: any) => item.dataKey === "deposit")?.value || 0;
  const withdraw =
    payload.find((item: any) => item.dataKey === "withdraw")?.value || 0;
  return (
    <div className="cashflow-tooltip">
      <strong>{formatDateLabel(label)}</strong>
      <div>
        <span className="cashflow-tooltip-dot cashflow-tooltip-dot-deposit" />
        <p>Deposit</p>
        <b>{formatCurrency(Math.abs(Number(deposit)))}</b>
      </div>
      <div>
        <span className="cashflow-tooltip-dot cashflow-tooltip-dot-withdraw" />
        <p>Withdraw</p>
        <b>{formatCurrency(Math.abs(Number(withdraw)))}</b>
      </div>
    </div>
  );
};

export const TopSummary = ({ data }: any) => {
  const stats = [
    {
      title: "Total Spent",
      value: formatCurrency(data?.totalSpent),
      icon: <RiseOutlined />,
      type: "primary",
    },
    {
      title: "Pending",
      value: data?.pendingPayments || 0,
      icon: <CreditCardOutlined />,
      type: "warning",
    },
    {
      title: "Success",
      value: `${data?.successRate || 0}%`,
      icon: <CheckCircleOutlined />,
      type: "success",
    },
  ];
  return (
    <section className="user-summary-grid">
      <div className="user-wallet-panel">
        <div className="user-wallet-content">
          <div className="wallet-tag">
            <WalletOutlined /> Main Wallet
          </div>
          <p className="user-wallet-label">Current balance</p>
          <h1 className="user-wallet-value">
            {formatCurrency(data?.walletBalance)}
          </h1>
          <div className="user-wallet-meta">
            <span>
              <ArrowUpOutlined /> {formatCurrency(data?.totalDeposit)} in
            </span>
            <span>
              <ArrowDownOutlined /> {formatCurrency(data?.totalWithdraw)} out
            </span>
          </div>
        </div>
        <div className="user-wallet-mark">
          <WalletOutlined />
        </div>
      </div>
      <div className="user-summary-stack">
        {stats.map((item) => (
          <article key={item.title} className={`user-summary-card user-summary-card-${item.type}`} >
            <div>
              <p>{item.title}</p> <strong>{item.value}</strong>
            </div>
            <div className={`user-summary-icon user-summary-icon-${item.type}`}> {item.icon} </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export const CashflowChart = ({ data }: any) => {
  const chartData = Array.isArray(data) ? data : [];
  const groupedData = chartData.reduce((acc: any[], item: any) => {
    const date = item.date || "Unknown";
    const existing = acc.find((row) => row.date === date);
    const target = existing || { date, deposit: 0, withdraw: 0 };
    const value = Number(item.value || 0);
    if (item.type === "deposit") { target.deposit += value; }
    else { target.withdraw -= Math.abs(value); }
    if (!existing) acc.push(target);
    return acc;
  }, []);
  const sortedData = groupedData.sort( (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime() );
  const totalDeposit = chartData.filter((item: any) => item.type === "deposit").reduce((sum: number, item: any) => sum + Number(item.value || 0), 0);
  const totalWithdraw = chartData.filter((item: any) => item.type !== "deposit").reduce((sum: number, item: any) => sum + Number(item.value || 0), 0);
  const netFlow = totalDeposit - totalWithdraw;
  const maxAbsValue = Math.max( ...sortedData.flatMap((item: any) => [
      Math.abs(item.deposit),
      Math.abs(item.withdraw),
    ]), 10,
  );
  return (
    <section className="cashflow-shell">
      <div className="user-panel-header">
        <div>
          <p className="user-panel-kicker">Money movement</p>
          <h3 className="user-panel-title">Cashflow</h3>
        </div>
        <div className="cashflow-net-pill">
          <LineChartOutlined />
          <span>{formatCurrency(netFlow)} net</span>
        </div>
      </div>
      <div className="cashflow-stat-grid">
        <div className="cashflow-metric cashflow-metric-in">
          <span>
            <ArrowUpOutlined /> Deposits
          </span>
          <strong>{formatCurrency(totalDeposit)}</strong>
        </div>
        <div className="cashflow-metric cashflow-metric-out">
          <span>
            <ArrowDownOutlined /> Withdrawals
          </span>
          <strong>{formatCurrency(totalWithdraw)}</strong>
        </div>
      </div>
      <div className="cashflow-chart-wrap">
        {sortedData.length === 0 ? (
          <div className="dashboard-empty-state">
            <LineChartOutlined />
            <p>No cashflow yet</p>
            <span>Deposit and withdrawal trends will appear here.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} stackOffset="sign" margin={{ top: 10, right: 8, left: -8, bottom: 0 }} >
              <CartesianGrid stroke="var(--dashboard-chart-grid)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" tickFormatter={formatDateLabel} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} tickLine={false} axisLine={false} width={70} domain={[-maxAbsValue, maxAbsValue]} tickFormatter={(value) => formatCurrency(Number(value)).replace(".00", "") } />
              <ReferenceLine y={0} stroke="var(--dashboard-chart-axis)" strokeWidth={2} />
              <Tooltip cursor={{ fill: "var(--dashboard-chart-hover)" }} content={<CashflowTooltip />} />
              <Bar dataKey="deposit" stackId="cashflow" barSize={28} fill="var(--dashboard-chart-deposit, #8b5cf6)" />
              <Bar dataKey="withdraw" stackId="cashflow" barSize={28} fill="var(--dashboard-chart-withdraw, #ef4444)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

export const UserActivityGraphs = ({ data }: any) => {
  const transactions = Array.isArray(data?.transactions) ? data.transactions : [];
  const statusData = Array.isArray(data?.statusData) ? data.statusData : [];
  const trendData = transactions.reduce((acc: any[], transaction: any) => {
    const day = new Date(
      transaction.createdAt || "1970-01-01T00:00:00.000Z",
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const existing = acc.find((item) => item.day === day);
    if (existing) {
      existing.amount += Number(transaction.amount || 0);
      existing.count += 1;
    } else {
      acc.push({ day, amount: Number(transaction.amount || 0), count: 1 });
    }
    return acc;
  }, []);
  const statusTotal = statusData.reduce(
    (sum: number, item: any) => sum + Number(item.value || 0),
    0,
  );
  return (
    <section className="user-graphs-grid">
      <div className="user-graph-panel user-graph-trend">
        <div className="user-panel-header">
          <div>
            <p className="user-panel-kicker">Daily activity</p>
            <h3 className="user-panel-title">Spending Trend</h3>
          </div>
          <div className="cashflow-net-pill">
            <RiseOutlined />
            <span>{transactions.length} txns</span>
          </div>
        </div>
        <div className="user-graph-canvas">
          {trendData.length === 0 ? (
            <div className="dashboard-empty-state">
              <RiseOutlined />
              <p>No trend data</p>
              <span>Your activity trend will appear here.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient
                    id="userTrendFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--dashboard-chart-blue)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--dashboard-chart-blue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="var(--dashboard-chart-grid)"
                  strokeDasharray="4 4"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(value) =>
                    formatCurrency(Number(value)).replace(".00", "")
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--dashboard-chart-border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                  formatter={(value: any, name: any) => [
                    name === "amount" ? formatCurrency(Number(value)) : value,
                    name === "amount" ? "Amount" : "Count",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--dashboard-chart-blue)"
                  strokeWidth={3}
                  fill="url(#userTrendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="user-graph-panel">
        <div className="user-panel-header">
          <div>
            <p className="user-panel-kicker">Payment mix</p>
            <h3 className="user-panel-title">Status Split</h3>
          </div>
          <div className="cashflow-net-pill">
            <PieChartOutlined />
            <span>{statusTotal} total</span>
          </div>
        </div>

        <div className="user-status-chart-wrap">
          {statusData.length === 0 ? (
            <div className="dashboard-empty-state">
              <PieChartOutlined />
              <p>No status data</p>
              <span>Status distribution will appear here.</span>
            </div>
          ) : (
            <>
              <div className="user-status-donut">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="82%"
                      paddingAngle={5}
                    >
                      {statusData.map((item: any, index: number) => (
                        <Cell
                          key={item.name}
                          fill={statusColors[index % statusColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--dashboard-chart-border)",
                        borderRadius: "12px",
                        color: "var(--foreground)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="user-status-center">
                  <strong>{statusTotal}</strong>
                  <span>Total</span>
                </div>
              </div>
              <div className="user-status-legend">
                {statusData.map((item: any, index: number) => (
                  <div key={item.name}>
                    <span
                      style={{
                        background: statusColors[index % statusColors.length],
                      }}
                    />
                    <p>{item.name}</p>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export const LastTransactions = ({ transactions }: any) => {
  const rows = Array.isArray(transactions) ? transactions.slice(0, 6) : [];

  return (
    <section className="user-panel user-panel-fill">
      <div className="user-panel-header">
        <div>
          <p className="user-panel-kicker">Latest activity</p>
          <h3 className="user-panel-title">Recent Transactions</h3>
        </div>
        <Link
          to={ROUTES.TRANSACTIONS.BASE}
          className="user-panel-action"
          aria-label="View all transactions"
        >
          <EyeOutlined />
          <span>View all</span>
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="dashboard-empty-state">
          <SwapOutlined />
          <p>No transactions yet</p>
          <span>Your latest payments will appear here.</span>
        </div>
      ) : (
        <div className="lasttxn-list">
          {rows.map((transaction: any) => {
            const status =
              transaction.status || transaction.paymentStatus || "pending";
            const meta = getStatusMeta(status);
            const orderId =
              transaction.orderId || transaction._id || "Transaction";

            return (
              <article
                key={transaction._id || orderId}
                className={`lasttxn-row ${meta.row}`}
              >
                <div className="lasttxn-icon">{meta.icon}</div>

                <div className="lasttxn-main">
                  <div className="lasttxn-topline">
                    <span className="lasttxn-id">
                      {String(orderId).length > 16
                        ? `${String(orderId).slice(0, 16)}...`
                        : orderId}
                    </span>
                    <span className={`lasttxn-badge ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="lasttxn-date">
                    {formatAbsoluteDate(transaction.createdAt)}
                  </p>
                </div>

                <div className="lasttxn-amount">
                  {formatCurrency(transaction.amount)}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export const SpendingSummary = ({ data }: any) => {
  const totalSpent = Number(data?.totalSpent || 0);
  const avgTxn = Number(data?.avgTxn || 0);
  const maxTxn = Number(data?.maxTxn || 0);
  const totalTrans = Number(data?.totalTrans || 0);
  const avgOfMax = maxTxn
    ? Math.min(Math.round((avgTxn / maxTxn) * 100), 100)
    : 0;
  const successRate = Number(data?.successRate || 0);

  const summaryItems = [
    {
      label: "Total spent",
      value: formatCurrency(totalSpent),
      icon: <FireOutlined />,
      className: "spend-item-primary",
    },
    {
      label: "Avg transaction",
      value: formatCurrency(avgTxn),
      icon: <CreditCardOutlined />,
      className: "spend-item-info",
    },
    {
      label: "Highest payment",
      value: formatCurrency(maxTxn),
      icon: <TrophyOutlined />,
      className: "spend-item-success",
    },
  ];

  return (
    <section className="user-panel user-panel-fill spending-panel">
      <div className="user-panel-header">
        <div>
          <p className="user-panel-kicker">Spending health</p>
          <h3 className="user-panel-title">Spending Summary</h3>
        </div>
        <div className="spend-count-pill">
          <BarChartOutlined />
          <span>{totalTrans} txns</span>
        </div>
      </div>

      <div className="spend-hero">
        <span className="spend-hero-label">Confirmed spend</span>
        <strong>{formatCurrency(totalSpent)}</strong>
        <div className="spend-hero-track">
          <span style={{ width: `${successRate}%` }} />
        </div>
        <div className="spend-hero-foot">
          <span>Success rate</span>
          <b>{successRate}%</b>
        </div>
      </div>

      <div className="spend-list">
        {summaryItems.map((item) => (
          <div key={item.label} className={`spend-item ${item.className}`}>
            <div className="spend-item-icon">{item.icon}</div>
            <div className="spend-item-copy">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="spend-footnote">
        <div>
          <span>Average vs highest</span>
          <strong>{avgOfMax}%</strong>
        </div>
        <div className="spend-footnote-track">
          <span style={{ width: `${avgOfMax}%` }} />
        </div>
      </div>
    </section>
  );
};

export const InsightsPanel = ({ data }: any) => {
  const successRate = Number(data?.successRate || 0);
  const totalTrans = Number(data?.totalTrans || 0);
  const successful = getStatusValue(data, "Success");
  const pending = getStatusValue(data, "Pending");
  const failed = getStatusValue(data, "Failed");

  const insights = [
    {
      title: "Successful",
      value: successful,
      desc: "Completed payments",
      icon: <CheckCircleOutlined />,
      className: "insight-card-success",
    },
    {
      title: "Pending",
      value: pending,
      desc: "Awaiting update",
      icon: <ClockCircleOutlined />,
      className: "insight-card-warning",
    },
    {
      title: "Failed",
      value: failed,
      desc: "Need attention",
      icon: <CloseCircleOutlined />,
      className: "insight-card-danger",
    },
    {
      title: "Average",
      value: formatCurrency(data?.avgTxn),
      desc: "Per transaction",
      icon: <DollarOutlined />,
      className: "insight-card-info",
    },
  ];

  return (
    <section className="user-panel insights-panel">
      <div className="user-panel-header">
        <div>
          <p className="user-panel-kicker">Account signals</p>
          <h3 className="user-panel-title">Insights</h3>
        </div>
        <div className="insight-live-pill">
          <ThunderboltOutlined />
          <span>{totalTrans} total</span>
        </div>
      </div>

      <div className="insights-layout">
        <div className="insight-score-card">
          <div
            className="insight-ring"
            style={{
              background: `conic-gradient(var(--success) ${
                successRate * 3.6
              }deg, rgba(102, 112, 133, 0.16) 0deg)`,
            }}
          >
            <div>
              <strong>{successRate}%</strong>
              <span>Success</span>
            </div>
          </div>
          <div className="insight-score-copy">
            <span>Reliability score</span>
            <p>
              {successful} of {totalTrans} transactions completed successfully.
            </p>
          </div>
        </div>

        <div className="insight-grid">
          {insights.map((item) => (
            <article
              key={item.title}
              className={`insight-card ${item.className}`}
            >
              <div className="insight-card-icon">{item.icon}</div>
              <div>
                <span>{item.title}</span>
                <strong>{item.value}</strong>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
