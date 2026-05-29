import { Skeleton } from "antd";
import { Activity, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import { formatCurrency } from "../../Utils/FormatHelper";

const WalletSummary = ({ balance, loading, transactions }: any) => {
  const today = new Date().toDateString();
  const todayTxns = useMemo(() => {
    return (transactions || []).filter(
      (transaction: any) => new Date(transaction.createdAt).toDateString() === today,
    );
  }, [transactions, today]);
  const credits = useMemo(() => {
    return todayTxns
      .filter((transaction: any) => transaction.type === "deposit" || transaction.type === "credit")
      .reduce((sum: number, transaction: any) => sum + (transaction.amount || 0), 0);
  }, [todayTxns]);
  const debits = useMemo(() => {
    return todayTxns
      .filter((transaction: any) => transaction.type === "withdraw" || transaction.type === "debit")
      .reduce((sum: number, transaction: any) => sum + (transaction.amount || 0), 0);
  }, [todayTxns]);
  const net = credits - debits;
  const totalToday = credits + debits;
  const creditRatio = totalToday ? Math.round((credits / totalToday) * 100) : 0;
  const rows = [
    {
      label: "Credits today", value: formatCurrency(credits), icon: <TrendingUp className="w-4 h-4" />, type: "credit",
    },
    {
      label: "Debits today", value: formatCurrency(debits), icon: <TrendingDown className="w-4 h-4" />, type: "debit",
    },
    {
      label: "Net flow", value: formatCurrency(net), icon: <Activity className="w-4 h-4" />, type: "net",
    },
  ];

  return (
    <section className="admin-panel wallet-summary-card">
      <div className="admin-panel-header">
        <div>
          <p>Wallet</p>
          <h3>Overview</h3>
        </div>
        <div className="admin-panel-icon">
          <Wallet className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <>
          <div className="admin-wallet-balance">
            <span>Available balance</span>
            <strong>{formatCurrency(balance)}</strong>
            <div className="admin-wallet-meter">
              <i style={{ width: `${creditRatio}%` }} />
            </div>
            <p>{creditRatio}% of today's movement is credit flow</p>
          </div>
          <div className="admin-wallet-list">
            {rows.map((row) => (
              <div key={row.label} className={`admin-wallet-row admin-wallet-${row.type}`}>
                <div>
                  {row.icon}
                  <span>{row.label}</span>
                </div>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
          <p className="wallet-summary-footer">Based on today's transaction activity</p>
        </>
      )}
    </section>
  );
};

export default WalletSummary;