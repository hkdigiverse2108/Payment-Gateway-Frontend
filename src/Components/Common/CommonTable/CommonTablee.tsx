import type { CommonTableProps } from "../../../Types";
import { Col, Input, Row, Switch, Table } from "antd";
import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";

export const CommonTablee = <T extends object>({ loading = false, dataSource, columns = [], pagination = { current: 1, pageSize: 10 }, rowKey = "_id", bordered = false, size = "middle", scroll, onActive, onSearch, ...rest }: CommonTableProps<T>) => {
  const fixedColumns = useMemo(() => {
    const current = pagination?.current ?? 1;
    const pageSize = pagination?.pageSize ?? 10;

    return [
      {
        title: "Sr No.",
        key: "index",
        width: 60,
        render: (_: any, __: any, index: number) => (current - 1) * pageSize + index + 1,
      },
      ...(columns || []),
    ];
  }, [columns, pagination]);

  return (
    <Table<T> //
      loading={loading}
      dataSource={dataSource}
      columns={fixedColumns}
      pagination={{
        ...pagination, //
        showSizeChanger: true,
        size: "middle",
        showTotal: (total) => `Total ${total} items`,
        simple: true,
      }}
      rowKey={rowKey}
      bordered={bordered}
      size={size}
      scroll={scroll ?? { x: "max-content" }}
      title={() => {
        return (
          <Row gutter={[8, 8]}>
            {onSearch && (
              <Col xs={24} md={10} lg={8} xl={8} xxl={6}>
                <div className="flex items-center bg-gray-100 px-1 py-2 rounded-lg">
                  <Input value={onSearch?.value} type="text" placeholder="Search by name..." aria-label="Search by name" prefix={<FiSearch className="text-gray-400 mr-2" />} onChange={(e) => onSearch?.onChange?.(e.target.value)} className="bg-transparent! outline-none! border-none! shadow-none! w-full! text-sm!" />
                </div>
              </Col>
            )}
            {onActive && (
              <Col xs={24} md={4} xl={3} xxl={2}>
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-3 rounded-lg">
                  <span className="text-sm font-semibold text-gray-500 uppercase">Active</span>
                  <Switch size="small" checked={onActive?.value} aria-label="Toggle active status" onChange={onActive?.onChange} />
                </div>
              </Col>
            )}
          </Row>
        );
      }}
      {...rest}
    />
  );
};
