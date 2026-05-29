import type { DetailItemProps } from "../../Types";
import CopyableText from "./CopyableText";

export const DetailRow = ({ label, value, copyable }: any) => {
  const displayValue = value || "-";

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/20 bg-tableback/20 px-4 py-3">
      <span className="text-xs font-semibold uppercase text-muted">
        {label}
      </span>
      <div className="max-w-[62%] text-right font-mono text-xs font-semibold break-all text-foreground">
        {copyable && value ? (
          <CopyableText value={String(value)} label={label} />
        ) : (
          displayValue
        )}
      </div>
    </div>
  );
};


export const DetailItem = ({ label, value, copyable }: DetailItemProps) => (
  <div className="rounded-2xl border border-border/20 bg-tableback/20 p-4">
    <div className="mb-2 text-xs font-bold uppercase text-muted">{label}</div>
    {copyable ? (
      <CopyableText value={String(value)} label={label} />
    ) : (
      <p className="min-h-6 break-words font-mono text-sm font-semibold text-foreground">
        {value || "-"}
      </p>
    )}
  </div>
);
