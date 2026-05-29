import { Skeleton } from "antd";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const StatusPieChart = ({ data = [], total = 0, loading }: any) => {
  const safeData = Array.isArray(data) ? data : [];
  const safeTotal = total || 0;
  return (
    <section className="admin-panel status-chart-card">
      <div className="admin-panel-header">
        <div>
          <p>Backend status</p>
          <h3>Transaction Status</h3>
        </div>
        <div className="admin-panel-icon">
          <PieChartIcon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <div className="status-chart-loading">
          <Skeleton active />
        </div>
      ) : safeData.length === 0 ? (
        <div className="status-chart-empty">No status data available</div>
      ) : (
        <>
          <div className="status-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={safeData} dataKey="value" cx="50%" cy="50%" innerRadius="62%" outerRadius="86%" paddingAngle={5}>
                  {safeData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  wrapperClassName="status-chart-tooltip"
                  formatter={(value: any) => [value, "Transactions"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="status-chart-center">
              <span className="status-chart-total-label">Total</span>
              <span className="status-chart-total">{safeTotal}</span>
            </div>
          </div>
          <div className="status-chart-legend">
            {safeData.map((item: any, index: number) => (
              <div key={item.name} className="status-chart-legend-card">
                <div className="status-chart-legend-top">
                  <span className={`status-dot status-dot-${index}`} />
                  <p className="status-chart-legend-title">{item.name}</p>
                </div>
                <p className="status-chart-legend-value">{item.value}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default StatusPieChart;