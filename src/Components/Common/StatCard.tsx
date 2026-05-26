import { type ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "green" | "red" | "blue" | "default";
};

const colorMap = {
  green: {
    text: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  red: {
    text: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  blue: {
    text: "text-brand-500",
    bg: "bg-brand-500/10",
  },
  default: {
    text: "text-foreground",
    bg: "bg-muted",
  },
};

const StatCard = ({ title, value, icon, color = "default" }: StatCardProps) => {
  const styles = colorMap[color];

  return (
    <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-muted text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        <h3 className={`text-2xl font-bold ${styles.text}`}>
          {value}
        </h3>
      </div>

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.bg} ${styles.text}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;