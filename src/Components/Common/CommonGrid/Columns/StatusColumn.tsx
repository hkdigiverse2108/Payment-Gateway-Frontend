export const StatusColumn = (dataIndex: string) => ({
  title: "Status",
  dataIndex,
  key: dataIndex,
  render: (status: string) => {
    const s = status?.toLowerCase();

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
          s === "success"
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
            : s === "pending"
            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            s === "success"
              ? "bg-emerald-500"
              : s === "pending"
              ? "bg-amber-500"
              : "bg-rose-500"
          }`}
        />
        {status}
      </span>
    );
  },
});