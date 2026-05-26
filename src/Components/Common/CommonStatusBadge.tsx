import type { CommonBadgeProps, CommonBadgeVariant, CommonStatusBadgeProps } from "../../Types";

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  success: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  completed: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  pending: {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-500",
    dot: "bg-amber-500",
  },
  failed: {
    bg: "bg-rose-500/10 border-rose-500/20",
    text: "text-rose-500",
    dot: "bg-rose-500",
  },
};

const VARIANT_STYLES: Record<CommonBadgeVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  danger: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  default: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const CommonBadge = ({ label, variant = "default", uppercase }: CommonBadgeProps) => {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full border ${
        VARIANT_STYLES[variant]
      } ${uppercase ? "uppercase" : ""}`}
    >
      {label || "-"}
    </span>
  );
};

export const CommonStatusBadge = ({ status }: CommonStatusBadgeProps) => {
  const key = status?.toLowerCase() || "failed";
  const style = STATUS_MAP[key] || STATUS_MAP.failed;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${style.bg} ${style.text}`} >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status || "-"}
    </span>
  );
};
