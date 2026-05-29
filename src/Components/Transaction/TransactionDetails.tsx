import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Download, Mail, Phone, Printer, ReceiptText, RefreshCw, Share2, User, } from "lucide-react";
import { message } from "antd";
import { Queries } from "../../Api";
import CommonLoader from "../Common/CommonLoader";
import CommonBreadcrumbs from "../Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, statusStyles } from "../../Data";
import { CommonBadge, CommonStatusBadge } from "../Common/CommonStatusBadge";
import { CommonButton } from "../../Attribute";
import CopyableText from "../Common/CopyableText";
import { DetailItem } from "../Common/CommonDetailRow";

const normalizeStatus = (status?: string) => {
  const value = String(status || "failed").toLowerCase();
  if (["success", "completed", "succeeded"].includes(value)) return "success";
  if (["pending", "processing"].includes(value)) return "pending";
  return "failed";
};

const formatAmount = (amount?: string | number | null) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return "-";

  return numericAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
};

const TransactionDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = Queries.useGetTransaction();
  const transaction = useMemo(() => {
    return data?.data?.data?.find((tran: any) => String(tran._id) === String(id));
  }, [data, id]);
  if (isLoading) return <CommonLoader fullPage tip="Loading..." />;
  if (error || !transaction) return <CommonLoader fullPage tip="Not found" />;
  const isDeposit = transaction.type?.toLowerCase() === "deposit";
  const statusKey = normalizeStatus(transaction.status || transaction.paymentStatus);
  const StatusIcon = statusStyles[statusKey].icon;
  const customer = transaction?.metadata || {};
  const referenceId = transaction.orderId || transaction.traId || transaction._id;
  const handleExport = () => {
    const row = {
      id: transaction._id,
      orderId: transaction.orderId,
      transactionId: transaction.traId,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      paymentStatus: transaction.paymentStatus,
      utr: transaction.utr,
      customerName: customer.customerName,
      customerPhone: customer.customerPhone,
      customerEmail: customer.customerEmail,
    };

    const csv = Object.entries(row)
      .map(([key, value]) => `${key},${value ?? ""}`)
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `transaction-${id}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    message.success("Link copied");
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.DETAILS} maxItems={1} breadcrumbs={BREADCRUMBS.TRANSACTIONS.DETAILS} />
      <div className="space-y-6 animate-fade">
        <section className={`overflow-hidden rounded-2xl border ${statusStyles[statusKey].border} bg-surface shadow-sm`}>
          <div className={`border-b ${statusStyles[statusKey].border} ${statusStyles[statusKey].bg} p-5`}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm ${statusStyles[statusKey].text}`}>
                  <StatusIcon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-muted">Transaction Details</p>
                  <div className="mt-1">
                    <CopyableText value={String(referenceId)} label="Reference ID" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <CommonBadge label={transaction.type} variant={isDeposit ? "success" : "danger"} uppercase />
                    <CommonStatusBadge status={transaction.status || statusStyles[statusKey].label} />
                    {transaction.paymentStatus && <CommonStatusBadge status={transaction.paymentStatus} />}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <CommonButton variant="icon-only" icon={<Share2 className="h-4 w-4" />} onClick={handleShare}>
                  Share
                </CommonButton>
                <CommonButton variant="icon-only" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
                  Print
                </CommonButton>
                <CommonButton variant="icon-only" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
                  Export
                </CommonButton>
                <CommonButton variant="icon-only" icon={<RefreshCw className="h-4 w-4" />} onClick={() => window.location.reload()}>
                  Refresh
                </CommonButton>
              </div>
            </div>
          </div>
          <div className="responsive-grid p-[var(--space-5)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailItem label="Amount" value={formatAmount(transaction.amount)} />
              <DetailItem label="Type" value={transaction.type} />
              <DetailItem label="Status" value={statusStyles[statusKey].label} />
            </div>
            <div className="rounded-2xl border border-border/20 bg-tableback/20 p-4">
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted">
                <User className="h-4 w-4" />
                Customer
              </div>

              <p className="text-sm md:text-base font-black text-foreground">
                {customer.customerName || "Unknown"}
              </p>

              <div className="mt-3 space-y-2 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{customer.customerPhone || "-"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{customer.customerEmail || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REFERENCE SECTION */}
        <section className="rounded-2xl border border-border/20 bg-surface p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <ReceiptText className="h-5 w-5 text-muted" />
            <div>
              <h3 className="text-sm md:text-base font-black text-foreground">Reference Information</h3>
              <div className="text-xs md:text-sm text-muted">Identifiers and payment tracking values.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem label="Order ID" value={transaction.orderId} copyable />
            <DetailItem label="Transaction ID" value={transaction.traId} copyable />
            <DetailItem label="UTR" value={transaction.utr} copyable />
            <DetailItem label="Status" value={transaction.status} />
            <DetailItem label="Payment Status" value={transaction.gateway} />
          </div>
        </section>
      </div>
    </>
  );
};

export default TransactionDetails;