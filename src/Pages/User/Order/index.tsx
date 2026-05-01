import { useMemo, useState } from "react";
import { Tag } from "antd";

import { Queries } from "../../../Api";
import { CommonTablee } from "../../../Components";
import type { TransactionBase } from "../../../Types/Transaction";

const Order = () => {
  const [search, setSearch] = useState("");
  const [successOnly, setSuccessOnly] = useState(false);

  const { data: res, isLoading } = Queries.useGetTransaction({
    page: 1,
    limit: 50,
  });

  const data: TransactionBase[] = useMemo(() => {
    const raw =
      res?.data?.data?.data ??
      res?.data?.data ??
      [];

    if (!Array.isArray(raw)) return [];

    return raw.map((t: any) => ({
      orderId: t.orderId || "-",
      traId: t.traId || "-",
      type: t.type || "-",
      amount: Number(t.amount || 0),
      status: t.status || "PENDING",
      paymentStatus: t.paymentStatus || "UNPAID",
    }));
  }, [res]);

  /* ---------------- FILTER ---------------- */
  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((item) => {
      const matchSearch =
        item.orderId.toLowerCase().includes(keyword) ||
        item.traId.toLowerCase().includes(keyword);

      const matchStatus = successOnly
        ? item.status === "SUCCESS"
        : true;

      return matchSearch && matchStatus;
    });
  }, [data, search, successOnly]);

  /* ---------------- COLUMNS ---------------- */
  const columns = useMemo(
    () => [
      {
        title: "Order ID",
        dataIndex: "orderId",
        key: "orderId",
      },
      {
        title: "Transaction ID",
        dataIndex: "traId",
        key: "traId",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (val: number) => `₹ ${val}`,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <Tag color={status === "SUCCESS" ? "green" : "orange"}>
            {status}
          </Tag>
        ),
      },
      {
        title: "Payment",
        dataIndex: "paymentStatus",
        key: "paymentStatus",
        render: (status: string) => (
          <Tag color={status === "PAID" ? "green" : "red"}>
            {status}
          </Tag>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <CommonTablee<TransactionBase>
        rowKey="orderId"
        dataSource={filteredData}
        columns={columns}
        loading={isLoading}
        pagination={{ current: 1, pageSize: 10 }}

        /* 🔥 SAME FEATURES AS USER PAGE */
        onSearch={{
          value: search,
          onChange: setSearch,
        }}

        onActive={{
          value: successOnly,
          onChange: setSuccessOnly,
        }}
      />
    </div>
  );
};

export default Order;

// import React from "react";
// import { Tag, Space } from "antd";
// import type { TableProps } from "antd";
// import CommonTableControls from "../../../Components/Common/CommonTable/CommonTableControls";
// import CommonTable from "../../../Components/Common/CommonTable/CommonTable";
// import type { TransactionBase } from "../../../Types/Transaction";
// import { Queries } from "../../../Api";
// const columns: TableProps<TransactionBase>["columns"] = [
//   {
//     title: "Order ID",
//     dataIndex: "orderId",
//   },
//   {
//     title: "Transaction ID",
//     dataIndex: "traId",
//   },
//   {
//     title: "Type",
//     dataIndex: "type",
//   },
//   {
//     title: "Amount",
//     dataIndex: "amount",
//     render: (val: number) => `₹ ${val}`,
//   },
//   {
//     title: "Status",
//     dataIndex: "status",
//     render: (status: string) => (
//       <Tag color={status === "SUCCESS" ? "green" : "orange"}>
//         {status}
//       </Tag>
//     ),
//   },
//   {
//     title: "Payment",
//     dataIndex: "paymentStatus",
//     render: (status: string) => (
//       <Tag color={status === "PAID" ? "green" : "red"}>
//         {status}
//       </Tag>
//     ),
//   },
// ];



// const Order = () => {
//     const [bordered, setBordered] = React.useState(true);
//   const [fixed, setFixed] = React.useState(true);
//   const [expanded, setExpanded] = React.useState(false);
//   const [empty, setEmpty] = React.useState(false);
//   const [count, setCount] = React.useState(20);

//   const tblRef = React.useRef<any>(null);

//   const { data: res, isLoading } = Queries.useGetTransaction({
//     page: 1,
//     limit: Number.isFinite(count) && Number(count) > 0 ? Number(count) : 20,
//   });

// const data = Array.isArray(res?.data?.data?.data)
//   ? res.data.data.data
//   : Array.isArray(res?.data?.data)
//   ? res.data.data
//   : [];

//   return (
//     <div style={{ padding: 20 }}>
//       <Space direction="vertical" style={{ width: "100%" }}>
       
//         <CommonTableControls
//             bordered={bordered}
//             setBordered={setBordered}
//             fixed={fixed}
//             setFixed={setFixed}
//             expanded={expanded}
//             setExpanded={setExpanded}
//             empty={empty}
//             setEmpty={setEmpty}
//             count={count}
//             setCount={setCount}
//             onScrollTo10={() => tblRef.current?.scrollTo({ index: 10 })}
//             />
//         <CommonTable<TransactionBase>
//   ref={tblRef}
//   loading={isLoading}
//   columns={columns}
//   dataSource={empty ? [] : data}
//   rowKey="orderId"
//   pagination={false}
// />
//       </Space>
//     </div>
//   );
// }

// export default Order;