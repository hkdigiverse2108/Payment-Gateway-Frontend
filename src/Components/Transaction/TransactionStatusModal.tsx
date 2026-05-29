import { useEffect, useMemo, useState } from "react";
import { Alert, Skeleton } from "antd";
import { CreditCard, IndianRupee, ReceiptText, XCircle } from "lucide-react";
import CommonModal from "../Common/Modal/CommonModal";
import { Queries } from "../../Api";
import { statusStyles } from "../../Data";
import type { TransactionStatusModalProps } from "../../Types";
import { DetailRow } from "../Common/CommonDetailRow";

const formatAmount = (amount?: string | number | null) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return "-";
  return numericAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

const getStatusKey = (status: string) => {
  if (status === "SUCCESS" || status === "SUCCEEDED") return "success";
  if (status === "PENDING" || status === "PROCESSING") return "pending";
  return "failed";
};

const TransactionStatusModal = ({ isOpen, onClose, orderId }: TransactionStatusModalProps) => {
  const [resolvedOrderId, setResolvedOrderId] = useState<string | null>(orderId);
  const [fallbackTransactionId, setFallbackTransactionId] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const urlOrderId = params.get("orderId") || params.get("order_id");
      const urlTransactionId = params.get("transaction_id");
      setResolvedOrderId(urlOrderId || orderId);
      setFallbackTransactionId(urlTransactionId);
    }
  }, [isOpen, orderId]);
  const urlParams = new URLSearchParams(window.location.search);
  const customApiKey = urlParams.get("apiKey");
  const customSecretKey = urlParams.get("secretKey");
  const customKeys = customApiKey && customSecretKey ? { apiKey: customApiKey, secretKey: customSecretKey } : undefined;
  const storedSession = useMemo(() => {
    try {
      const raw = localStorage.getItem("paymentSession");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [isOpen]);
  const isTransactionIdFromRedirect = resolvedOrderId && storedSession?.traId && String(resolvedOrderId) === String(storedSession.traId);
  const effectiveOrderId = isTransactionIdFromRedirect && storedSession?.orderId ? storedSession.orderId : resolvedOrderId || storedSession?.orderId || null;
  const statusParams = effectiveOrderId ? { orderId: effectiveOrderId } : undefined;
  const { data, isFetching, isError } = Queries.useTransactionStatus( statusParams, customKeys,
    {
      refetchInterval: isOpen ? 2500 : false,
      refetchOnWindowFocus: true,
      enabled: !!effectiveOrderId,
      onError: (err: any) => {
        console.error("Transaction status fetch error:", err);
      },
    }
  );
  const responseData = data as any;
  const transaction = responseData?.data?.data || responseData?.data;
  const rawStatus = String(
    transaction?.status ||
      transaction?.paymentStatus ||
      transaction?.paymentIntentStatus ||
      transaction?.payment_intent_status ||
      "PENDING"
  ).toUpperCase();
  const normalizedStatus = rawStatus === "SUCCEEDED" ? "SUCCESS" : rawStatus;
  const statusKey = getStatusKey(normalizedStatus);
  const statusMeta = statusStyles[statusKey];
  const StatusIcon = statusMeta.icon;
  const transactionId = transaction?.traId || transaction?.transactionId || fallbackTransactionId;
  const paymentStatus = transaction?.paymentStatus || transaction?.status || "-";
  return (
    <CommonModal isOpen={isOpen} onClose={onClose} width={640} className="transaction-status-modal">
      {isFetching && !transaction ? (
        <div className="space-y-5 p-1">
          <Skeleton.Avatar active size={56} shape="circle" />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : isError ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Status unavailable</h3>
                <p className="text-sm text-muted">Could not verify this transaction right now.</p>
              </div>
            </div>
          </div>
          <Alert message="Check the order ID and API keys used for this transaction." type="error" showIcon />
        </div>
      ) : transaction ? (
        <div className="space-y-5">
          <div className={`rounded-2xl border ${statusMeta.border} ${statusMeta.bg} p-5`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statusMeta.ring} ${statusMeta.text}`}>
                  <StatusIcon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted">Transaction status</p>
                  <h3 className={`mt-1 text-2xl font-black ${statusMeta.text}`}>{statusMeta.label}</h3>
                  {statusKey === "pending" && (
                    <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">Auto-refreshing while payment is verified</p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 dark:border-border/20 bg-white/70 dark:bg-tableback/20 px-4 py-3 text-left shadow-sm sm:text-right">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-muted sm:justify-end">
                  <IndianRupee className="h-3.5 w-3.5" />
                  Amount
                </div>
                <p className="mt-1 text-2xl font-black text-foreground">{formatAmount(transaction.amount)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/20 bg-surface p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <ReceiptText className="h-4 w-4 text-muted" />
                Reference
              </div>
              <div className="space-y-3">
                <DetailRow label="Order ID" value={transaction.orderId || effectiveOrderId} copyable />
                <DetailRow label="Transaction ID" value={transactionId} copyable />
              </div>
            </div>
            <div className="rounded-2xl border border-border/20 bg-surface p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <CreditCard className="h-4 w-4 text-muted" />
                Payment
              </div>
              <div className="space-y-3">
                <DetailRow label="Payment" value={paymentStatus} />
                <DetailRow label="UTR" value={transaction.utr} copyable />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/20 bg-tableback/20 p-8 text-center">
          <ReceiptText className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm font-semibold text-foreground">No transaction data found.</p>
          <p className="mt-1 text-xs text-muted">The status will appear here once the transaction is available.</p>
        </div>
      )}
    </CommonModal>
  );
};

export default TransactionStatusModal;