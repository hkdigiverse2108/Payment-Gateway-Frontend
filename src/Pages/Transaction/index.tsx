import { useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import { Queries } from "../../Api";
import { PAYMENT_STATUS, STATUS, TRANSACTION_TYPE, type TransactionFormValues } from "../../Types";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store";
import { Row, Col, Tooltip } from "antd";
import { Eye, RefreshCw, Copy, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AdvancedSearch from "../../Components/Common/AdvancedSearch";
import ExportToExcel from "../../Components/Common/CommonTable/ExportToExcel";
import ExportToPDF from "../../Components/Common/CommonTable/ExportToPDF";

import TransactionStatusModal from "../../Components/Transaction/TransactionStatusModal";
import { useToast } from "../../Components/Common/ToastProvider";

const Transaction = () => {
  const toast = useToast();
  const [search, setSearch] = useState<string>("");
  const currentUser = useAppSelector((state) => state.auth.user);
  const debouncedSearch = useDebounce(search, 500);
  const [typeFilter, setTypeFilter] = useState<string>();
  const [sort, setSort] = useState<{ field?: string; order?: string }>({});
  const [statusFilter, setStatusFilter] = useState<string>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleCheckStatus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsStatusModalOpen(true);
  };

  const queryParams = useMemo(() => ({ 
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(paymentStatusFilter ? { paymentStatus: paymentStatusFilter } : {}),
    page, 
    limit: pageSize,
  }), [debouncedSearch, typeFilter, statusFilter, paymentStatusFilter, page, pageSize]);

  const { data: userData } = Queries.useGetUser();
  const users = useMemo(() => { return userData?.data?.data || []; }, [userData]);
  
  const { data: transactionData, isLoading: isTransactionLoading } = Queries.useGetTransaction(queryParams);
  const allTransactions = transactionData?.data?.data || [];

  // Fetch a larger set to calculate accurate KPIs at the top
  const { data: transAllData } = Queries.useGetTransaction({ limit: 1000 });
  const transAllList = transAllData?.data?.data || [];

  const totalDeposits = transAllList
    .filter(t => t.type?.toLowerCase() === "deposit" && (t.status === "success" || t.paymentStatus === "success"))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalWithdrawals = transAllList
    .filter(t => t.type?.toLowerCase() === "withdrawal" && (t.status === "success" || t.paymentStatus === "success"))
    .reduce((acc, t) => acc + t.amount, 0);

  const successTransCount = transAllList
    .filter(t => t.status === "success" || t.paymentStatus === "success")
    .length;

  const filteredTransactions = useMemo(() => {
    let data = [...allTransactions];
    const role = currentUser?.role?.toLowerCase();
    if (role === "user") {
      data = data.filter((t: any) => {
        const userId = typeof t.userId === "object" ? t.userId?._id : t.userId;
        return String(userId) === String(currentUser._id);
      });
    }
    if (sort.field && sort.order) {
      data = data.sort((a: any, b: any) => {
        const aVal = a?.[sort.field!];
        const bVal = b?.[sort.field!];
        if (typeof aVal === "number") {
          return sort.order === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sort.order === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return data;
  }, [allTransactions, currentUser, sort]);

  const totalData = currentUser?.role === "user" ? filteredTransactions.length : transactionData?.data?.totalData || 0;

  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((u: any) => {
      map.set(String(u._id), u.username || u.userName || u.name); 
    });
    return map;
  }, [users]);

  const columns = useMemo(() => [
      { 
        title: "Transaction ID", 
        dataIndex: "traId", 
        key: "traId",
        render: (val: string) => (
          <div className="font-mono text-xs flex items-center gap-1.5">
            {val ? val.substring(0, 12) + "..." : "-"}
            {val && (
              <button 
                onClick={() => { navigator.clipboard.writeText(val); toast.success("Copied Transaction ID"); }} 
                className="p-1 hover:bg-tableback/30 rounded text-muted hover:text-foreground transition-all"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
        )
      },
      { 
        title: "Order ID", 
        dataIndex: "orderId", 
        key: "orderId",
        render: (val: string) => (
          <div className="font-mono text-xs flex items-center gap-1.5">
            {val ? val.substring(0, 12) + "..." : "-"}
            {val && (
              <button 
                onClick={() => { navigator.clipboard.writeText(val); toast.success("Copied Order ID"); }} 
                className="p-1 hover:bg-tableback/30 rounded text-muted hover:text-foreground transition-all"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
        )
      },
      { 
        title: "User Name", 
        key: "userName", 
        render: (_: any, record: any) => { 
          return userMap.get(record.userId) || "-"; 
        } 
      },
      { 
        title: "Amount", 
        dataIndex: "amount", 
        key: "amount", 
        sorter: true, 
        showSorterTooltip: false,
        render: (val: number) => (
          <span className="font-bold text-foreground">
            {val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </span>
        )
      },
      { 
        title: "Type", 
        dataIndex: "type", 
        key: "type", 
        render: (type: string) => {
          const isDeposit = type?.toLowerCase() === "deposit";
          return (
            <span className={`inline-flex px-2.5 py-0.5 text-xs font-bold rounded-full uppercase ${
              isDeposit 
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
            }`}>
              {type}
            </span>
          );
        }
      },
      { 
        title: "Status", 
        dataIndex: "status", 
        key: "status", 
        render: (status: string) => {
          const s = status?.toLowerCase();
          return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
              s === "success" || s === "completed"
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : s === "pending"
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                s === "success" || s === "completed"
                  ? "bg-emerald-500"
                  : s === "pending"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`} />
              {status}
            </span>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        width: 150,
        render: (_: any, record: any) => (
          <div className="flex items-center gap-2">
            <Tooltip title="View Transaction Details">
              <button 
                onClick={() => navigate(`${ROUTES.TRANSACTIONS.DETAILS}/${record._id}`)}
                className="px-2.5 py-1.5 rounded-lg border border-border/20 text-xs font-bold text-foreground hover:bg-tableback/20 transition-all flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </Tooltip>
            <Tooltip title="Check Live Status">
              <button
                onClick={() => handleCheckStatus(record.orderId)}
                className="p-1.5 rounded-lg border border-border/20 text-brand-500 hover:text-brand-600 hover:bg-brand-500/5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        )
      }
    ], [userMap, toast, navigate]);

  const buildOptions = (obj: Record<string, string>) => {
    return Object.values(obj).map((val) => ({
      label: val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
    }));
  };

  const handleCreateDeposit = () => { 
    navigate(ROUTES.TRANSACTIONS.DEPOSIT); 
  };

  // Calculate active filter badge count
  const activeFiltersCount = [typeFilter, statusFilter, paymentStatusFilter].filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade">
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.BASE} maxItems={1} breadcrumbs={ BREADCRUMBS.TRANSACTIONS.BASE } />

      {/* 3 Metric Summary Cards at the Top */}
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Deposits</span>
              <h3 className="text-2xl font-bold text-emerald-500">
                {totalDeposits.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-muted text-xs font-semibold uppercase tracking-wider">Total Withdrawals</span>
              <h3 className="text-2xl font-bold text-rose-500">
                {totalWithdrawals.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-surface border border-border/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-muted text-xs font-semibold uppercase tracking-wider">Successful Payments</span>
              <h3 className="text-2xl font-bold text-foreground">
                {successTransCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Col>
      </Row>

      <div className="bg-surface border border-border/20 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">Filter Transactions</span>
            {activeFiltersCount > 0 && (
              <span className="bg-brand-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <ExportToExcel params={queryParams} />
            <ExportToPDF params={queryParams} />
          </div>
        </div>

        <AdvancedSearch 
          defaultExpanded 
          filter={[ 
            { label: "Type", value: typeFilter, onChange: (val) => { setTypeFilter(val as string); setPage(1); }, options: buildOptions(TRANSACTION_TYPE)}, 
            { label: "Status", value: statusFilter, onChange: (val) => { setStatusFilter(val as string); setPage(1); }, options: buildOptions(STATUS)}, 
            { label: "Payment Status", value: paymentStatusFilter, onChange: (val) => { setPaymentStatusFilter(val as string); setPage(1); }, options: buildOptions(PAYMENT_STATUS)}
          ]} 
        />

        <div className="mt-6">
          <CommonTable<TransactionFormValues> 
            rowKey="_id" 
            dataSource={filteredTransactions} 
            columns={columns} 
            loading={isTransactionLoading} 
            pagination={{ current: page, pageSize, total: totalData, showSizeChanger: true }} 
            onPaginationChange={(newPage: number, newPageSize: number) => { setPage(newPage); setPageSize(newPageSize); }} 
            onSearch={{ 
              value: search, 
              onChange: (value) => { setSearch(String(value)); setPage(1); }, 
            }} 
            onAdd={handleCreateDeposit} 
            onAddLabel="Create Deposit" 
            sort={{ default: "amount:desc", onChange: setSort }} 
          />
        </div>
      </div>

      <TransactionStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        orderId={selectedOrderId}
      />
    </div>
  );
};

export default Transaction;