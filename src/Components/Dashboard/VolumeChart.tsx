import { Skeleton } from "antd";
import { BarChart3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../../Utils/FormatHelper";

const VolumeChart = ({ transactions = [], loading }: any) => {
  const chartData = transactions.reduce((acc: any[], transaction: any) => {
    const date = new Date(transaction.createdAt || "1970-01-01T00:00:00.000Z").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const existing = acc.find((item) => item.day === date);
    if (existing) {
      existing.amount += transaction.amount || 0;
      existing.count += 1;
      if ((transaction.paymentStatus || transaction.finalStatus || transaction.status) === "success") {
        existing.success += 1;
      }
    } else {
      acc.push({
        day: date,
        amount: transaction.amount || 0,
        count: 1,
        success: (transaction.paymentStatus || transaction.finalStatus || transaction.status) === "success" ? 1 : 0,
      });
    }
    return acc;
  }, []);
  return (
    <section className="admin-panel admin-chart-panel">
      <div className="admin-panel-header">
        <div>
          <p>Gateway throughput</p>
          <h3>Volume and Attempts</h3>
        </div>
        <div className="admin-panel-icon">
          <BarChart3 className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="chart-loading">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : chartData.length === 0 ? (
        <div className="chart-empty">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--dashboard-chart-blue)" stopOpacity={0.32} />
                <stop offset="95%" stopColor="var(--dashboard-chart-blue)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--dashboard-chart-grid)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} />
            <YAxis width={58} tick={{ fontSize: 11 }} stroke="var(--text-muted)" tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(Number(value)).replace(".00", "")} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--dashboard-chart-border)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
              formatter={(value: any, name: any) => [name === "amount" ? formatCurrency(value) : value, name === "amount" ? "Amount" : "Count"]}
            />
            <Area type="monotone" dataKey="amount" stroke="var(--dashboard-chart-blue)" strokeWidth={3} fill="url(#volumeFill)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </section>
  );
};

export default VolumeChart;