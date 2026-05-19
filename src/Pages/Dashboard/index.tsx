import { useState } from "react";
import { Row, Col, Skeleton, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store";
import { Queries } from "../../Api";
import { ROUTES } from "../../Constants";
import { formatRelativeTime, formatAbsoluteDate } from "../../Utils";
import { 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Copy, 
  ExternalLink,
  Wallet,
  TrendingUp,
  CreditCard,
  Plus,
  RefreshCw,
  Eye
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useToast } from "../../Components/Common/ToastProvider";

// Mock data for sparklines & charts to look rich
const mockSparklineData = {
  transactions: "M0,15 L10,8 L20,13 L30,5 L40,11 L50,4",
  volume: "M0,12 L10,14 L20,7 L30,15 L40,8 L50,3",
  success: "M0,6 L10,5 L20,8 L30,4 L40,5 L50,3",
  pending: "M0,15 L10,10 L20,12 L30,7 L40,14 L50,11"
};

const mockLineChartData = [
  { day: "01 May", Deposit: 40000, Withdrawal: 24000 },
  { day: "05 May", Deposit: 30000, Withdrawal: 13980 },
  { day: "10 May", Deposit: 20000, Withdrawal: 9800 },
  { day: "15 May", Deposit: 60000, Withdrawal: 39080 },
  { day: "20 May", Deposit: 18900, Withdrawal: 4800 },
  { day: "25 May", Deposit: 23900, Withdrawal: 3800 },
  { day: "30 May", Deposit: 84900, Withdrawal: 43000 }
];

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Queries
  const { data: transResponse, isLoading: transLoading, refetch: refetchTrans } = Queries.useGetTransaction({ limit: 100 });
  const { data: walletResponse, isLoading: walletLoading, refetch: refetchWallet } = Queries.useGetWalletBalance();

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Transaction ID Copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate Metrics from Live Data
  const transList = transResponse?.data?.data || [];
  const walletBalance = walletResponse?.data?.walletBalance ?? 0;

  const totalTrans = transResponse?.data?.totalData ?? transList.length;
  const successfulTrans = transList.filter(t => t.status === "success" || t.paymentStatus === "success");
  const totalVolume = successfulTrans.reduce((acc, t) => acc + t.amount, 0);
  
  const successRate = totalTrans > 0 
    ? Math.round((successfulTrans.length / totalTrans) * 100) 
    : 100;

  const pendingCount = transList.filter(t => t.status === "pending" || t.paymentStatus === "pending").length;

  const recentTransactions = transList.slice(0, 10);

  // Calculate Status breakdown for Pie Chart
  const successCount = successfulTrans.length || 15; // default fallback if 0
  const pendingChartCount = pendingCount || 4;
  const failedCount = transList.filter(t => t.status === "failed" || t.paymentStatus === "failed").length || 2;

  const statusPieData = [
    { name: "Success", value: successCount },
    { name: "Pending", value: pendingChartCount },
    { name: "Failed", value: failedCount }
  ];

  // Refresh helper
  const handleRefresh = () => {
    refetchTrans();
    refetchWallet();
    toast.info("Dashboard data refreshed!");
  };

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="space-y-6 pb-12 animate-fade">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-brand-900 p-6 md:p-8 text-white shadow-xl shadow-brand-500/10">
        {/* Abstract shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 -bottom-20 w-64 h-64 bg-brand-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold tracking-wide uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live system active
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Hello, {user?.name || "Admin"}!
              </h1>
              <p className="text-brand-100 text-sm md:text-base max-w-xl font-medium">
                Welcome back to your control center. Here's what's happening with your gateway today, {todayStr}.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8} className="flex justify-start md:justify-end gap-3">
            <button 
              onClick={() => navigate(ROUTES.TRANSACTIONS.DEPOSIT)}
              className="px-4 py-2.5 rounded-xl bg-white text-brand-900 font-bold text-sm shadow-md hover:bg-brand-50 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Deposit
            </button>
            <button 
              onClick={() => navigate(ROUTES.TRANSACTIONS.BASE)}
              className="px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" /> View Transactions
            </button>
            <button 
              onClick={handleRefresh}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95"
              aria-label="Refresh Dashboard"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </Col>
        </Row>
      </div>

      {/* 2. KPI CARDS */}
      <Row gutter={[20, 20]}>
        
        {/* KPI: Total Transactions */}
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
            {transLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Transactions</span>
                    <h3 className="text-2xl font-bold text-foreground">{totalTrans}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
                  </span>
                  <svg className="w-14 h-8 text-brand-500" viewBox="0 0 50 20">
                    <path d={mockSparklineData.transactions} fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </Col>

        {/* KPI: Total Volume */}
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
            {transLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Volume</span>
                    <h3 className="text-2xl font-bold text-foreground">
                      {totalVolume.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +8.2%
                  </span>
                  <svg className="w-14 h-8 text-emerald-500" viewBox="0 0 50 20">
                    <path d={mockSparklineData.volume} fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </Col>

        {/* KPI: Success Rate */}
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
            {transLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Success Rate</span>
                    <h3 className="text-2xl font-bold text-foreground">{successRate}%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +1.4%
                  </span>
                  <svg className="w-14 h-8 text-green-500" viewBox="0 0 50 20">
                    <path d={mockSparklineData.success} fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </Col>

        {/* KPI: Pending Count */}
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-36">
            {transLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-muted text-xs font-semibold uppercase tracking-wider">Pending Count</span>
                    <h3 className="text-2xl font-bold text-foreground">{pendingCount}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <span className="flex items-center gap-1 text-xs text-rose-500 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-lg">
                    <ArrowDownRight className="w-3.5 h-3.5" /> -4.1%
                  </span>
                  <svg className="w-14 h-8 text-amber-500" viewBox="0 0 50 20">
                    <path d={mockSparklineData.pending} fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </>
            )}
          </div>
        </Col>

      </Row>

      {/* 3. CHARTS ROW */}
      <Row gutter={[20, 20]}>
        
        {/* Left: Volume Chart */}
        <Col xs={24} lg={16}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Transaction Volume (last 30 days)</h4>
                <p className="text-xs text-muted">Deposit vs Withdrawal volumes processed daily</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Deposits</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Withdrawals</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.15} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }} 
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line type="monotone" dataKey="Deposit" stroke="#8B5CF6" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Withdrawal" stroke="#EF4444" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Right: Pie Chart */}
        <Col xs={24} lg={8}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm h-[400px] flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-foreground">Transaction Status breakdown</h4>
              <p className="text-xs text-muted">Overview of processing statuses</p>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Center Label */}
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-xs text-muted uppercase font-bold tracking-wider">Total</span>
                <span className="text-3xl font-extrabold text-foreground">{totalTrans}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                <p className="text-emerald-500 font-bold uppercase text-[9px] tracking-wider">Success</p>
                <p className="font-extrabold text-foreground text-sm mt-0.5">{successCount}</p>
              </div>
              <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                <p className="text-amber-500 font-bold uppercase text-[9px] tracking-wider">Pending</p>
                <p className="font-extrabold text-foreground text-sm mt-0.5">{pendingChartCount}</p>
              </div>
              <div className="bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
                <p className="text-rose-500 font-bold uppercase text-[9px] tracking-wider">Failed</p>
                <p className="font-extrabold text-foreground text-sm mt-0.5">{failedCount}</p>
              </div>
            </div>
          </div>
        </Col>

      </Row>

      {/* 4. RECENT TRANSACTIONS TABLE & 5. WALLET SUMMARY */}
      <Row gutter={[20, 20]}>
        
        {/* Recent Transactions Table */}
        <Col xs={24} lg={17}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Recent Transactions</h4>
                <p className="text-xs text-muted">Latest 10 payment events across gateways</p>
              </div>
              <Link to={ROUTES.TRANSACTIONS.BASE} className="text-brand-500 hover:text-brand-600 font-bold text-sm flex items-center gap-1">
                View All Transactions <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {transLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/10 text-xs font-bold text-muted uppercase tracking-wider">
                      <th className="pb-3 pl-2">Transaction ID</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/5 text-sm">
                    {recentTransactions.map((t, idx) => (
                      <tr key={t._id || idx} className="hover:bg-tableback/10 transition-colors">
                        <td className="py-3 pl-2 font-mono flex items-center gap-1.5 text-xs text-foreground">
                          {t.orderId ? t.orderId.substring(0, 12) + "..." : "N/A"}
                          <Tooltip title={copiedId === t.orderId ? "Copied!" : "Copy ID"}>
                            <button onClick={() => handleCopy(t.orderId)} className="p-1 hover:bg-tableback/30 rounded text-muted hover:text-foreground">
                              <Copy className="w-3 h-3" />
                            </button>
                          </Tooltip>
                        </td>
                        <td className="py-3 font-semibold text-foreground">
                          {t.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full uppercase ${
                            t.type === "deposit" || t.type === "credit"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            t.status === "success" || t.paymentStatus === "success"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : t.status === "pending" || t.paymentStatus === "pending"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              t.status === "success" || t.paymentStatus === "success"
                                ? "bg-emerald-500"
                                : t.status === "pending" || t.paymentStatus === "pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`} />
                            {t.status || t.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 text-muted text-xs">
                          <Tooltip title={formatAbsoluteDate(t.createdAt)}>
                            <span>{formatRelativeTime(t.createdAt)}</span>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                    {recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted">
                          No recent transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>

        {/* Wallet Summary Card */}
        <Col xs={24} lg={7}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[460px] relative overflow-hidden">
            {/* Soft decorative background gradient */}
            <div className="absolute right-0 top-0 w-44 h-44 bg-brand-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-foreground">Wallet Summary</h4>
                <div className="p-2 bg-brand-500/10 rounded-xl text-brand-500">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              {/* Wallet Balance Display */}
              <div className="bg-gradient-to-tr from-brand-500/10 to-brand-500/0 rounded-2xl p-5 border border-brand-500/20">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">Available Balance</span>
                {walletLoading ? <Skeleton.Button active size="large" className="mt-2 block" /> : (
                  <h2 className="text-3xl font-black text-foreground mt-1">
                    {walletBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </h2>
                )}
              </div>

              {/* Today's Stats */}
              <div className="space-y-3">
                <span className="text-xs text-muted font-bold uppercase tracking-wider block">Today's Activity</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Today's Credits</span>
                    <span className="text-base font-bold text-emerald-500 mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-4 h-4" /> ₹1.2L
                    </span>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Today's Debits</span>
                    <span className="text-base font-bold text-rose-500 mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-4 h-4 rotate-180" /> ₹45k
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 mt-6">
              <button 
                onClick={() => navigate(ROUTES.WALLET.BALANCE)}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/10 transition-all active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Top Up Wallet
              </button>
              <button 
                onClick={() => navigate(ROUTES.WALLET.BALANCE)}
                className="w-full py-3 rounded-xl border border-border/20 text-foreground hover:bg-tableback/20 font-bold text-sm transition-all active:scale-98"
              >
                View Detailed Ledgers
              </button>
            </div>

          </div>
        </Col>

      </Row>

    </div>
  );
};

export default Dashboard;