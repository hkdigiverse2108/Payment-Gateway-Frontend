import { useEffect, useMemo, useState } from "react";
import { AdvancedSearch, CommonTable } from "../../Components";
import { Mutations, Queries } from "../../Api";
import { PAYMENT_STATUS, STATUS, TRANSACTION_TYPE, type TransactionFormValues } from "../../Types";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";
import { useAppSelector } from "../../Store";
import { Row, Col } from "antd";
import { Eye, RefreshCw, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TransactionStatusModal from "../../Components/Transaction/TransactionStatusModal";
import StatCard from "../../Components/Common/StatCard";
import CommonActionColumn from "../../Components/Common/CommonActionColumn";
import CopyableText from "../../Components/Common/CopyableText";
import { CommonBadge, CommonStatusBadge } from "../../Components/Common/CommonStatusBadge";
import CommonTableToolbar from "../../Components/Common/CommonTable/CommonTableToolbar";
import { useDateRangeFilter } from "../../Utils/Hooks/useDateRangeFilter";
import CommonDateRangePicker from "../../Attribute/FormFields/CommonDateRangePicker";

const Transaction = () => {
  const [search, setSearch] = useState<string>("");
  const currentUser = useAppSelector((state) => state.auth.user);
  const debouncedSearch = useDebounce(search, 500);
  const [typeFilter, setTypeFilter] = useState<string>();
  const [sort, setSort] = useState<{ field?: string; order?: string }>({});
  const [statusFilter, setStatusFilter] = useState<string>();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { dateRange, setDateRange, dateQuery } = useDateRangeFilter();
  const orderIdFromUrl = searchParams.get("order_id");
  const isStatusModalOpen = Boolean(orderIdFromUrl);
  const handleCheckStatus = (orderId: string) => { setSearchParams({ order_id: orderId })};
  const queryParams = useMemo(() => ({ 
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(paymentStatusFilter ? { paymentStatus: paymentStatusFilter } : {}),
    ...dateQuery,
    page, limit: pageSize,
  }), [debouncedSearch, typeFilter, statusFilter, paymentStatusFilter, dateQuery, page, pageSize]);
  const { mutate: verifyPhonePe } = Mutations.useVerifyPhonePe();
  const { data: userData } = Queries.useGetUser();
  const users = useMemo(() => { return userData?.data?.data || []; }, [userData]);
  const { data: transactionData, isLoading: isTransactionLoading } = Queries.useGetTransaction(queryParams);
  const allTransactions = transactionData?.data?.data || [];
  const { data: transAllData } = Queries.useGetTransaction({ limit: 1000 });
  const transAllList = transAllData?.data?.data || [];
  const stats = useMemo(() => {
  const isSuccess = (t: any) =>
    t.status === "success" || t.paymentStatus === "success";
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let successCount = 0;
  for (const t of transAllList) {
    if (isSuccess(t)) { successCount++}
    if (t.type?.toLowerCase() === "deposit" && isSuccess(t)) { totalDeposits += t.amount }
    if (t.type?.toLowerCase() === "withdrawal" && isSuccess(t)) { totalWithdrawals += t.amount;}
  }
  return { totalDeposits, totalWithdrawals, successCount };
}, [transAllList]);
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
        title: "Transaction ID",  dataIndex: "traId", key: "traId",
        render: (val: string) => <CopyableText value={val} label="Transaction ID" />
      },
      { 
        title: "Order ID", dataIndex: "orderId", key: "orderId",
        render: (val: string) => <CopyableText value={val} label="Order ID" />
      },
      { 
        title: "User Name",  key: "userName", render: (_: any, record: any) => { return userMap.get(record.userId) || "-"} 
      },
      { 
        title: "Amount", dataIndex: "amount", key: "amount", sorter: true, showSorterTooltip: false,
        render: (val: number) => ( <span className="font-bold text-foreground"> {val.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} </span> )
      },
      { 
        title: "Type", dataIndex: "type", key: "type", 
        render: (type: string) => {
          const isDeposit = type?.toLowerCase() === "deposit";
          return (
            <CommonBadge label={type} variant={isDeposit ? "success" : "danger"} uppercase />
          );
        },
      },
      { 
        title: "Status", 
        dataIndex: "status", 
        key: "status", 
        render: (status: string) => <CommonStatusBadge status={status} />,
      },
      CommonActionColumn<TransactionFormValues>({
        extraActions: [
          {
            icon: <Eye className="w-3.5 h-3.5" />,
            tooltip: "View Transaction Details",
            onClick: (record) => {navigate(`${ROUTES.TRANSACTIONS.DETAILS}/${record._id}`)},
          },
          {
            icon: <RefreshCw className="w-3.5 h-3.5" />,
            tooltip: "Check Live Status",
            onClick: (record) => {if (record.orderId) {handleCheckStatus(record.orderId)}},
          }
        ],
      })
    ], [userMap, navigate]);
  const buildOptions = (obj: Record<string, string>) => {
    return Object.values(obj).map((val) => ({
      label: val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
    }));
  };
  useEffect(() => {
    const merchantTxnId = searchParams.get("txn") || searchParams.get("merchantTransactionId");
    if (!merchantTxnId) return;

    verifyPhonePe(
      { merchantTransactionId: merchantTxnId },
      {
        onSuccess: (res: any) => {
          console.log("PhonePe Verified:", res);
          const transaction = res?.data?.transaction || res?.data?.data?.transaction || res?.transaction;
          const orderId = transaction?.orderId;
          if (orderId) {
            setSearchParams({ order_id: orderId }, { replace: true });
          }
        },
        onError: (err: any) => {
          console.error("PhonePe verify failed:", err);
        },
      }
    );
  }, [searchParams, setSearchParams, verifyPhonePe]);
  const handleCreateDeposit = () => { navigate(ROUTES.TRANSACTIONS.DEPOSIT) };
  const initialVisibility = useMemo(() => {
    const obj: any = {};
    columns.forEach((col: any) => {
      const key = col.key ?? col.dataIndex;
      obj[key] = true;
    });
    return obj;
  }, [columns]);

  useEffect(() => {
    setColumnVisibility(initialVisibility);
  }, [initialVisibility]);
  const filteredColumns = useMemo(() => {
    return columns.filter((col: any) => {
      const key = col.key ?? col.dataIndex;
      return columnVisibility[key] !== false;
    });
  }, [columns, columnVisibility]);
  // const activeFiltersCount = [typeFilter, statusFilter, paymentStatusFilter].filter(Boolean).length;
  return (
    <div className="space-y-6 animate-fade">
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.BASE} maxItems={1} breadcrumbs={ BREADCRUMBS.TRANSACTIONS.BASE } />
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <StatCard title="Total Deposits" value={stats.totalDeposits.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} icon={<ArrowUpRight className="w-5 h-5" />} color="green" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Total Withdrawals" value={stats.totalWithdrawals.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} icon={<ArrowDownRight className="w-5 h-5" />} color="red" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Successful Payments" value={stats.successCount} icon={<CheckCircle2 className="w-5 h-5" />} color="blue" />
        </Col>
      </Row>
      <div className="bg-surface border border-border/20 rounded-2xl p-6 shadow-sm">
        <AdvancedSearch  defaultExpanded  filter={[ 
            { label: "Type", value: typeFilter, onChange: (val) => { setTypeFilter(val as string); setPage(1); }, options: buildOptions(TRANSACTION_TYPE)}, 
            { label: "Status", value: statusFilter, onChange: (val) => { setStatusFilter(val as string); setPage(1); }, options: buildOptions(STATUS)}, 
            { label: "Payment Status", value: paymentStatusFilter, onChange: (val) => { setPaymentStatusFilter(val as string); setPage(1); }, options: buildOptions(PAYMENT_STATUS)}
          ]} 
        />
        <CommonDateRangePicker
  value={dateRange}
  onChange={(dates) => {
    setDateRange(dates);
    setPage(1);
  }}
/>
        <CommonTableToolbar
          onSearch={{
            value: search,
            onChange: (val: any) => {
              setSearch(String(val));
              setPage(1);
            },
          }}
          onAdd={handleCreateDeposit}
          addLabel="Create Deposit"
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
        />
        
        <div className="mt-6">
          <CommonTable<TransactionFormValues> 
            rowKey="_id" 
            dataSource={filteredTransactions} 
            columns={filteredColumns} 
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
      <TransactionStatusModal isOpen={isStatusModalOpen} onClose={() => { const newParams = new URLSearchParams(searchParams); newParams.delete("order_id"); setSearchParams(newParams, { replace: true }); }} orderId={orderIdFromUrl} />
    </div>
  );
};

export default Transaction;
