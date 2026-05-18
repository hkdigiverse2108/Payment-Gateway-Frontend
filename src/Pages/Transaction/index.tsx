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
import { Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import AdvancedSearch from "../../Components/Common/AdvancedSearch";
import ExportToExcel from "../../Components/Common/CommonTable/ExportToExcel";
import ExportToPDF from "../../Components/Common/CommonTable/ExportToPDF";
import { CommonButton } from "../../Attribute";
import TransactionStatusModal from "../../Components/Transaction/TransactionStatusModal";

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
  const navigate = useNavigate();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const handleCheckStatus = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsStatusModalOpen(true);
  };
  const queryParams = useMemo(() => ({ ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(paymentStatusFilter ? { paymentStatus: paymentStatusFilter } : {}),
      page, limit: pageSize,
    }),[debouncedSearch, typeFilter, statusFilter, paymentStatusFilter, page, pageSize]
  );
  const { data: userData } = Queries.useGetUser();
  const users = useMemo(() => { return userData?.data?.data || []; }, [userData]);
  const { data: transactionData, isLoading: isTransactionLoading, } = Queries.useGetTransaction(queryParams);
  const allTransactions = transactionData?.data?.data || [];
    const filteredTransactions = useMemo(() => {
    let data = [...allTransactions];
    const role = currentUser?.role?.toLowerCase();
    if (role === "user") {
      data = data.filter((t: any) => {
        const userId =
          typeof t.userId === "object" ? t.userId?._id : t.userId;
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
    users.forEach((u: any) => {map.set(String(u._id), u.username || u.userName || u.name); });
    return map;
  }, [users]);
  const columns = useMemo(() => [
      { title: "Transaction ID", dataIndex: "traId", key: "traId" },
      { title: "Order ID", dataIndex: "orderId", key: "orderId" },
      { title: "User Name", key: "userName", render: (_: any, record: any) => { console.log("CHECK:", record.userId, userMap.get(record.userId)); return userMap.get(record.userId) || "-"; } },
      { title: "Amount", dataIndex: "amount", key: "amount", sorter: true, showSorterTooltip: false },
      { title: "Transaction Type", dataIndex: "type", key: "type", render: (type: string) => {
          const isDeposit = type?.toLowerCase() === "deposit";
          return ( <Tag color={isDeposit ? "green" : "red"} style={{ background: isDeposit ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)", borderRadius: "6px", paddingInline: 10, }}> {type} </Tag>
          )}
      },
      { title: "Transaction Status", dataIndex: "status", key: "status", render: (status: string) => {
          const s = status?.toLowerCase();
          const color = s === "success" || s === "completed" ? ["rgba(34,197,94,0.12)", "#16a34a"] : s === "pending" ? ["rgba(249,115,22,0.12)", "#ea580c"] : s === "failed" ? ["rgba(239,68,68,0.12)", "#dc2626"] : ["rgba(148,163,184,0.12)", "#64748b"];
          return ( <Tag style={{ background: color[0], color: color[1], border: "none", borderRadius: "6px", paddingInline: 12 }}> {status} </Tag>);
        },
      },
     {
        title: "Action",
        key: "action",
        render: (_: any, record: any) => (
          <div className="flex gap-2">
            <EyeOutlined onClick={() => navigate(`${ROUTES.TRANSACTIONS.DETAILS}/${record._id}`)} />
            <CommonButton size="small" onClick={() => handleCheckStatus(record.orderId)} >Status</CommonButton>
          </div>
        )
      }
    ],  
    [userMap] 
  );
  const buildOptions = (obj: Record<string, string>) => {
    return Object.values(obj).map((val) => ({
      label: val.charAt(0).toUpperCase() + val.slice(1),
      value: val,
    }));
  };
  const handleCreateDeposit =  () => { navigate(ROUTES.TRANSACTIONS.DEPOSIT); };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.BASE} maxItems={1} breadcrumbs={ BREADCRUMBS.TRANSACTIONS.BASE } />
      <div className="pt-2 bg-surface rounded-md">
        <div className="flex justify-end gap-2 mb-2">
          <ExportToExcel params={queryParams} />
          <ExportToPDF params={queryParams} />
        </div>
        <AdvancedSearch defaultExpanded filter={[ { label: "Type", value: typeFilter, onChange: (val) => { setTypeFilter(val as string); setPage(1); }, options: buildOptions(TRANSACTION_TYPE)}, { label: "Status", value: statusFilter, onChange: (val) => { setStatusFilter(val as string); setPage(1); }, options: buildOptions(STATUS)}, { label: "Payment Status", value: paymentStatusFilter, onChange: (val) => { setPaymentStatusFilter(val as string); setPage(1); }, options: buildOptions(PAYMENT_STATUS)}]} />
        <CommonTable<TransactionFormValues> rowKey="_id" dataSource={filteredTransactions} columns={columns} loading={isTransactionLoading} pagination={{ current: page, pageSize, total: totalData, showSizeChanger: true }} onPaginationChange={(newPage: number, newPageSize: number) => { setPage(newPage); setPageSize(newPageSize); }} onSearch={{ value: search, onChange: (value) => { setSearch(String(value)); setPage(1); }, }} onAdd={handleCreateDeposit} onAddLabel="Create Deposit" sort={{ default: "amount:desc", onChange: setSort }} />
      </div>
      <TransactionStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default Transaction;