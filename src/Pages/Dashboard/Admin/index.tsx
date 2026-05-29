import { useMemo } from "react";
import { useToast } from "../../../Components/Common/ToastProvider";
import { useAppSelector } from "../../../Store";
import { Queries } from "../../../Api";
import WelcomeBanner from "../../../Components/Dashboard/WelcomeBanner";
import KpiCards from "../../../Components/Dashboard/StatsCards";
import VolumeChart from "../../../Components/Dashboard/VolumeChart";
import StatusPieChart from "../../../Components/Dashboard/StatusPieChart";
import RecentTransactions from "../../../Components/Dashboard/RecentTransactions";
import WalletSummary from "../../../Components/Dashboard/WalletSummary";
import {
  AdminFinancialCharts,
  AdminOperationsPanel,
  AdminRiskUserInsights,
} from "../../../Components/Dashboard/AdminDashboardSections";

const AdminDashboard = () => {
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { data: transResponse, isLoading: transLoading, refetch, } = Queries.useGetTransaction({ limit: 100 });
  const { data: walletResponse, isLoading: walletLoading, refetch: refetchWallet, } = Queries.useGetWalletBalance();
  const transList = useMemo(() => transResponse?.data?.data || [], [transResponse]);
  const totalTrans = transResponse?.data?.totalData ?? transList.length;
  const walletBalance = walletResponse?.data?.walletBalance ?? 0;
  const normalizedTrans = useMemo(() => {
    return transList.map((t: any) => ({
      ...t,
      finalStatus: t.paymentStatus || t.status,
    }));
  }, [transList]);
  /** FILTERS */
  const successfulTrans = useMemo(() => normalizedTrans.filter((t: any) => t.finalStatus === "success"),
    [normalizedTrans]
  );
  const pendingTrans = useMemo(() => normalizedTrans.filter((t: any) => t.finalStatus === "pending"),
    [normalizedTrans]
  );
  const failedTrans = useMemo(() => normalizedTrans.filter((t: any) => t.finalStatus === "failed"),
    [normalizedTrans]
  );
  const totalVolume = useMemo( () => successfulTrans.reduce((acc: number, t: any) => acc + (t.amount || 0), 0),
    [successfulTrans]
  );
  const allVolume = useMemo(() => normalizedTrans.reduce((acc: number, t: any) => acc + (t.amount || 0), 0), [normalizedTrans]);
  const successRate = totalTrans ? Math.round((successfulTrans.length / totalTrans) * 100) : 100;
  const pendingCount = pendingTrans.length;
  const failedCount = failedTrans.length;
  const avgTxn = totalTrans ? Math.round(allVolume / totalTrans) : 0;
  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTransactions = normalizedTrans.filter(
      (transaction: any) => new Date(transaction.createdAt).toDateString() === today,
    );
    const todayVolume = todayTransactions.reduce((sum: number, transaction: any) => sum + Number(transaction.amount || 0), 0);
    const todayRevenue = todayTransactions
      .filter((transaction: any) => transaction.finalStatus === "success")
      .reduce((sum: number, transaction: any) => sum + Number(transaction.amount || 0), 0);
    const activeUsers = new Set(
      todayTransactions
        .map((transaction: any) => transaction.userId || transaction.user?._id || transaction.user?.id || transaction.customerId)
        .filter(Boolean)
        .map(String),
    ).size;

    return {
      count: todayTransactions.length,
      volume: todayVolume,
      revenue: todayRevenue,
      activeUsers,
    };
  }, [normalizedTrans]);
  const monthRevenue = useMemo(() => {
    const now = new Date();

    return successfulTrans
      .filter((transaction: any) => {
        const date = new Date(transaction.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum: number, transaction: any) => sum + Number(transaction.amount || 0), 0);
  }, [successfulTrans]);
  const uniqueCustomers = useMemo(() => {
    const ids = new Set(
      normalizedTrans
        .map((transaction: any) => transaction.userId || transaction.user?._id || transaction.user?.id || transaction.customerId)
        .filter(Boolean)
        .map(String),
    );

    return ids.size;
  }, [normalizedTrans]);
  const statusData = useMemo(() => {
    return [
      { name: "Success", value: successfulTrans.length },
      { name: "Pending", value: pendingTrans.length },
      { name: "Failed", value: failedTrans.length },
    ];
  }, [successfulTrans, pendingTrans, failedTrans]);
  const failureRate = totalTrans ? Math.round((failedTrans.length / totalTrans) * 100) : 0;

  /** REFRESH */
  const handleRefresh = () => {
    refetch();
    refetchWallet();
    toast.info("Dashboard refreshed");
  };

  return (
    <div className="admin-dashboard-page">
      <WelcomeBanner
        user={user}
        onRefresh={handleRefresh}
        totalTrans={totalTrans}
        successRate={successRate}
        todayCount={todayStats.count}
      />

      <KpiCards
        loading={transLoading}
        totalTrans={totalTrans}
        totalVolume={totalVolume}
        todayRevenue={todayStats.revenue}
        monthRevenue={monthRevenue}
        successRate={successRate}
        failureRate={failureRate}
        pendingCount={pendingCount}
        failedCount={failedCount}
        avgTxn={avgTxn}
        activeUsers={todayStats.activeUsers}
      />

      <AdminFinancialCharts
        loading={transLoading}
        transactions={normalizedTrans}
        totalDeposit={totalVolume}
        totalWithdraw={normalizedTrans
          .filter((transaction: any) => transaction.type === "withdraw" || transaction.type === "debit")
          .reduce((sum: number, transaction: any) => sum + Number(transaction.amount || 0), 0)}
      />

      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-main">
          <VolumeChart transactions={normalizedTrans} loading={transLoading} />
        </div>
        <div className="admin-dashboard-side">
          <StatusPieChart data={statusData} total={totalTrans} loading={transLoading} />
        </div>
      </div>

      <AdminOperationsPanel
        loading={transLoading}
        todayCount={todayStats.count}
        todayVolume={todayStats.volume}
        uniqueCustomers={uniqueCustomers}
        failedCount={failedCount}
        pendingCount={pendingCount}
        successRate={successRate}
      />

      <AdminRiskUserInsights
        loading={transLoading}
        transactions={normalizedTrans}
        failedCount={failedCount}
        failureRate={failureRate}
        pendingCount={pendingCount}
        uniqueCustomers={uniqueCustomers}
        activeUsers={todayStats.activeUsers}
      />

      <div className="admin-dashboard-grid admin-dashboard-lower">
        <div className="admin-dashboard-table">
          <RecentTransactions data={normalizedTrans} loading={transLoading} />
        </div>
        <div className="admin-dashboard-wallet">
          <WalletSummary balance={walletBalance} loading={walletLoading} transactions={normalizedTrans} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
