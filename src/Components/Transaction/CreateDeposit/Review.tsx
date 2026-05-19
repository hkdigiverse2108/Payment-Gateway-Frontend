import { ShieldCheck, Mail, Phone, User, Landmark } from "lucide-react";

const Review = ({ data }: any) => {
  const formattedAmount = Number(data.amount || 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });

  return (
    <div className="review-wrapper max-w-md mx-auto space-y-6 animate-fade">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-foreground">Review & Confirm</h2>
        <p className="text-xs text-muted">
          Please verify your billing details before initiating payment
        </p>
      </div>

      {/* Premium Receipt Card */}
      <div className="relative bg-surface border border-border/30 rounded-3xl shadow-xl overflow-hidden p-6 space-y-6">
        
        {/* Receipt Header Style */}
        <div className="flex justify-between items-center pb-4 border-b border-border/10">
          <div>
            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider">Deposit Invoice</span>
            <h4 className="text-xs font-mono text-muted mt-0.5">INV-{Date.now().toString().slice(-8)}</h4>
          </div>
          <span className="inline-flex px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase bg-brand-500/10 text-brand-500 border border-brand-500/20">
            {data.gateway || "SANDBOX"}
          </span>
        </div>

        {/* Big Amount */}
        <div className="text-center py-4 bg-tableback/10 rounded-2xl border border-border/10">
          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Payable Amount</span>
          <h2 className="text-3xl font-black text-foreground mt-1 flex items-center justify-center gap-1">
            {formattedAmount}
          </h2>
        </div>

        {/* Dotted Divider */}
        <div className="relative h-px border-t border-dashed border-border/30 my-4">
          <div className="absolute -left-[30px] -top-2 w-4 h-4 bg-backgroundlight rounded-full border-r border-border/20" />
          <div className="absolute -right-[30px] -top-2 w-4 h-4 bg-backgroundlight rounded-full border-l border-border/20" />
        </div>

        {/* Details Grid */}
        <div className="space-y-4 text-sm">
          
          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> Customer</span>
            <span className="font-semibold text-foreground text-xs">{data.customerName || "-"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5 text-xs"><Phone className="w-3.5 h-3.5" /> Mobile Phone</span>
            <span className="font-mono font-semibold text-foreground text-xs">{data.customerPhone || "-"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5" /> Email Address</span>
            <span className="font-semibold text-foreground text-xs">{data.customerEmail || "-"}</span>
          </div>

          {data.userId && (
            <div className="flex justify-between items-center">
              <span className="text-muted flex items-center gap-1.5 text-xs"><Landmark className="w-3.5 h-3.5" /> Merchant User</span>
              <span className="font-semibold text-foreground text-xs">{data.userId}</span>
            </div>
          )}
          
        </div>

        {/* Barcode mockup */}
        <div className="pt-4 border-t border-border/10 text-center space-y-2">
          <div className="h-8 bg-foreground/5 dark:bg-white/5 rounded mx-auto flex items-center justify-between px-4 opacity-50 select-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <span 
                key={i} 
                className="bg-foreground dark:bg-white inline-block" 
                style={{ 
                  width: i % 3 === 0 ? "1px" : i % 5 === 0 ? "3px" : "2px", 
                  height: i % 2 === 0 ? "18px" : "14px" 
                }} 
              />
            ))}
          </div>
          <p className="text-[9px] font-mono text-muted tracking-widest uppercase">Secured by SSL Encryption</p>
        </div>

      </div>
    </div>
  );
};

export default Review;