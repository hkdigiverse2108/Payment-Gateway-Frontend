import { useState } from "react";
import { Tooltip } from "antd";
import { 
  TrendingUp, 
  TrendingDown, 
  Copy, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from "lucide-react";
import { formatRelativeTime, formatAbsoluteDate } from "../../Utils";
import { useToast } from "../../Components/Common/ToastProvider";

export const Wallet = ({ balance, stats, grouped, filter, setFilter, activities = [] }: any) => {
  const toast = useToast();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Transaction ID Copied!");
  };

  // Counts for filters
  const allCount = activities.length;
  const creditCount = activities.filter((a: any) => a.type === "credit").length;
  const debitCount = activities.filter((a: any) => a.type === "debit").length;

  const getFilterBadge = (type: string) => {
    if (type === "all") return allCount;
    if (type === "credit") return creditCount;
    return debitCount;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade">
      
      {/* 1. TOP HERO CARD - BALANCE */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-brand-600 to-brand-900 p-6 md:p-8 text-white shadow-xl shadow-brand-500/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-brand-200 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Primary Balance Ledger
            </span>
            <span className="text-muted text-xs block opacity-80">Available Funds</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              {balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </h1>
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-white">
            <WalletIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Total Credit Stats */}
        <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Credit</span>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-500">
              {Number(stats.totalCredits || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Total Debit Stats */}
        <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Debit</span>
            <h3 className="text-xl md:text-2xl font-bold text-rose-500">
              {Number(stats.totalDebits || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. TAB INTERFACE WITH COUNT BADGES */}
      <div className="bg-surface border border-border/20 rounded-2xl p-4 shadow-sm flex items-center gap-2">
        {["all", "credit", "debit"].map((t) => {
          const isActive = filter === t;
          const badgeVal = getFilterBadge(t);
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive 
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/15" 
                  : "text-muted hover:bg-tableback/20 hover:text-foreground"
              }`}
            >
              <span className="uppercase">{t}</span>
              <span className={`px-1.5 py-0.5 text-[10px] rounded-md font-extrabold ${
                isActive ? "bg-white/20 text-white" : "bg-tableback text-muted"
              }`}>
                {badgeVal}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. DATE GROUPED LIST OF ACTIVITY */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([date, items]: any) => (
          <div key={date} className="space-y-3">
            <h4 className="text-xs font-extrabold text-muted uppercase tracking-wider pl-1">{date}</h4>
            
            <div className="bg-surface border border-border/20 rounded-2xl overflow-hidden shadow-sm divide-y divide-border/10">
              {items.map((i: any) => {
                const isOpen = openId === i._id;
                const isCredit = i.type === "credit";
                return (
                  <div key={i._id} className="transition-all hover:bg-tableback/5">
                    
                    {/* Activity Row */}
                    <div 
                      onClick={() => toggle(i._id)} 
                      className="p-4 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Circular indicators */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCredit ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {isCredit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        </div>
                        
                        <div className="flex flex-col min-w-0 space-y-0.5">
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> 
                            <Tooltip title={formatAbsoluteDate(i.createdAt)}>
                              <span>{formatRelativeTime(i.createdAt)}</span>
                            </Tooltip>
                          </span>
                          <p className="text-sm font-semibold text-foreground truncate">{i.description || "Ledger adjustment"}</p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end flex-shrink-0">
                        <span className={`text-base font-extrabold ${isCredit ? "text-emerald-500" : "text-rose-500"}`}>
                          {isCredit ? "+" : "-"} {i.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </span>
                        <span className="text-[10px] font-medium text-muted">
                          Bal: {i.newBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {isOpen && (
                      <div className="bg-tableback/10 px-4 py-5 border-t border-border/10 animate-fade">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Reference ID</span>
                            <span className="font-semibold text-foreground">{i._id}</span>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Transaction ID</span>
                            <span className="font-mono font-bold text-foreground flex items-center gap-1.5">
                              {i.transactionId ? i.transactionId : "N/A"}
                              {i.transactionId && (
                                <button 
                                  onClick={() => handleCopy(i.transactionId)} 
                                  className="p-1 hover:bg-tableback/30 rounded text-muted hover:text-foreground transition-colors"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              )}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-muted font-bold uppercase tracking-wider block">Balance After Event</span>
                            <span className="font-bold text-foreground">
                              {i.newBalance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-12 bg-surface border border-border/20 rounded-2xl text-muted space-y-2">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-semibold">No wallet activities found matching the filter</p>
          </div>
        )}
      </div>

    </div>
  );
};
