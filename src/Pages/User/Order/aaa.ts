import React from "react";
import { Tag, Space, Typography } from "antd";
import type { TableProps } from "antd";
import CommonTableControls from "../../../Components/Common/CommonTable/CommonTableControls";
import CommonTable from "../../../Components/Common/CommonTable/CommonTable";


// ✅ Order Data Type
interface OrderType {
  id: number;
  product: string;
  customer: string;
  amount: number;
  status: "Pending" | "Delivered" | "Cancelled";
}

// ✅ Base Columns
const normalColumns: TableProps<OrderType>["columns"] = [
  { title: "Order ID", dataIndex: "id", width: 100 },
  { title: "Product", dataIndex: "product" },
  { title: "Customer", dataIndex: "customer" },
];

// ✅ Advanced Columns (fixed + actions)
const fixedColumns: TableProps<OrderType>["columns"] = [
  { title: "Order ID", dataIndex: "id", width: 100, fixed: "left" },
  { title: "Product", dataIndex: "product", fixed: "left" },
  { title: "Customer", dataIndex: "customer" },
  {
    title: "Amount",
    dataIndex: "amount",
    render: (val: number) => `₹ ${val.toLocaleString()}`,
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: OrderType["status"]) => {
      const color =
        status === "Delivered"
          ? "green"
          : status === "Pending"
            ? "orange"
            : "red";
      return <Tag color={ color }> { status } </Tag>;
    },
  },
  {
    title: "Action",
    fixed: "right",
    render: (_, record) => (
      <Space>
      <Typography.Link onClick= {() => console.log("View", record)}>
        View
        </Typography.Link>
        < Typography.Link onClick = {() => console.log("Edit", record)}>
          Edit
          </Typography.Link>
          </Space>
    ),
  },
];

// ✅ Data Generator
const getOrders = (count: number): OrderType[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    product: `Product ${index + 1}`,
    customer: `Customer ${index + 1}`,
    amount: 1000 + index * 250,
    status:
      index % 3 === 0
        ? "Delivered"
        : index % 3 === 1
          ? "Pending"
          : "Cancelled",
  }));

// ✅ Main Component
const Order: React.FC = () => {
  const [bordered, setBordered] = React.useState(true);
  const [fixed, setFixed] = React.useState(true);
  const [expanded, setExpanded] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [count, setCount] = React.useState(20);

  const tblRef = React.useRef<any>(null);

  const data = React.useMemo(() => getOrders(count), [count]);

  // 🔥 Column switching logic
  const mergedColumns = React.useMemo(() => {
    if (!fixed) return normalColumns;
    if (!expanded) return fixedColumns;

    return fixedColumns.map((col) => ({ ...col, onCell: undefined }));
  }, [fixed, expanded]);

  // 🔥 Expandable logic
  const expandableProps = React.useMemo(() => {
    if (!expanded) return undefined;

    return {
      expandedRowRender: (record: OrderType) => (
        <p style= {{ margin: 0 }
  }>🎉 Order { record.product } </p>
  ),
    rowExpandable: (record: OrderType) => record.id % 2 === 0,
    };
  }, [expanded]);

return (
  <div style= {{ padding: 20 }}>
    <Space direction="vertical" style = {{ width: "100%" }}>

      {/* 🔥 SWITCH CONTROLS */ }
{/* <Space wrap>
          <Switch
            checked={bordered}
            onChange={setBordered}
            checkedChildren="Bordered"
            unCheckedChildren="Bordered"
          />

          <Switch
            checked={fixed}
            onChange={setFixed}
            checkedChildren="Fixed"
            unCheckedChildren="Fixed"
          />

          <Switch
            checked={expanded}
            onChange={setExpanded}
            checkedChildren="Expandable"
            unCheckedChildren="Expandable"
          />

          <Switch
            checked={empty}
            onChange={setEmpty}
            checkedChildren="Empty"
            unCheckedChildren="Empty"
          />

          <Segmented
            value={count}
            onChange={(val) => setCount(val as number)}
            options={[
              { label: "None", value: 0 },
              { label: "Few", value: 5 },
              { label: "More", value: 20 },
            ]}
          />

          {data.length >= 10 && (
            <Button onClick={() => tblRef.current?.scrollTo({ index: 10 })}>
              Scroll To 10
            </Button>
          )}
        </Space> */}
<CommonTableControls
            bordered={ bordered }
setBordered = { setBordered }
fixed = { fixed }
setFixed = { setFixed }
expanded = { expanded }
setExpanded = { setExpanded }
empty = { empty }
setEmpty = { setEmpty }
count = { count }
setCount = { setCount }
onScrollTo10 = {() => tblRef.current?.scrollTo({ index: 10 })}
            />
  < CommonTable<OrderType>
ref = { tblRef }
variant = { bordered? "bordered": "default" }
columns = { mergedColumns }
dataSource = { empty? []: data }
rowKey = "id"
pagination = { false}
expandable = { expandableProps }
rowSelection = {
  expanded? undefined: { type: "radio", columnWidth: 48 }
}
  />
  </Space>
  </div>
  );
};

export default Order;