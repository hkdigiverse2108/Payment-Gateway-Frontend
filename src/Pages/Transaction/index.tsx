import { useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import CommonActionColumn from "../../Components/Common/CommonTable/CommonActionColumn";
import { Queries } from "../../Api";
import type { TransactionFormValues } from "../../Types";
import { PAGE_TITLE } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";

const Transaction = () => {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch
        ? { search: debouncedSearch }
        : {}),
      page,
      limit: pageSize,
    }),
    [debouncedSearch, page, pageSize]
  );
  const { data: transactionData, isLoading, } = Queries.useGetTransaction(queryParams);
  const transaction = useMemo(() => { return transactionData?.data?.data || []; }, [transactionData]);
  const { data: userData } = Queries.useGetUser();
  const users = useMemo(() => { return userData?.data || []; }, [userData]);
  const totalData = transactionData?.data?.totalData || 0;
  const userMap = useMemo(() => {
    const map = new Map();
    users.forEach((u: any) => { map.set(u._id, u.username); }); return map;
  }, [users]);
  const columns = useMemo(
    () => [
      {
        title: "User Name",
        key: "userName",
        render: (_: any, record: any) => {
          return userMap.get(record.userId) || "-";
        }
      }
      { title: "Transaction Type", dataIndex: "type", key: "type" },
      { title: "Amount", dataIndex: "amount", key: "amount" },
      { title: "Transaction Status", dataIndex: "status", key: "status" },
      { title: "Payment Status", dataIndex: "paymentStatus", key: "paymentStatus" },
      CommonActionColumn<TransactionFormValues>({
        onEdit: {
          onHandle: (record) => { console.log( "Editing record:", record); },
        },
        onDelete: {
          onHandle: (record) => {
            console.log(
              "Deleting record:",
              record
            );
          },
        },
      }),
    ],
    []
  );

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.BASE} maxItems={1} breadcrumbs={ BREADCRUMBS.TRANSACTIONS.BASE } />
      <div className="pt-2">
        <CommonTable<TransactionFormValues>
          rowKey="_id"
          dataSource={transaction}
          columns={columns}
          loading={isLoading}
          pagination={{ current: page, pageSize, total: totalData, showSizeChanger: true }}
          onPaginationChange={( newPage: number, newPageSize: number ) => { setPage(newPage); setPageSize(newPageSize); }}
          onSearch={{ value: search, onChange: (value) => { setSearch(String(value)); setPage(1); }, }}
        />
      </div>
    </>
  );
};

export default Transaction;