import type { CommonTableProps } from "../../../Types";
import { Col, Input, Row, Switch, Table } from "antd";
import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";

export const CommonTable = <T extends object>({ loading = false, dataSource, columns = [], pagination = { current: 1, pageSize: 10 }, rowKey = "_id", bordered = false, size = "middle", scroll, onActive, onAdd, onSearch, ...rest }: CommonTableProps<T>) => {
  const current = pagination?.current ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const fixedColumns = useMemo(() => {
    return [
      {
        title: "Sr No.",
        key: "index",
        width: 70,
        render: (_: unknown, __: T, index: number) =>
          (current - 1) * pageSize + index + 1,
      },
      ...columns,
    ];
  }, [columns, current, pageSize]);

  return (
    <Table<T> loading={loading} dataSource={dataSource} columns={fixedColumns} rowKey={rowKey as keyof T} bordered={bordered} size={size}
      scroll={scroll ?? { x: "max-content" }} pagination={{ ...pagination, showSizeChanger: true, showTotal: (total) => `Total ${total} items`,
      onChange: (page, pageSize) => { rest.onPaginationChange?.(page, pageSize); }, }} className="common-table"
      title={() => (
          <Row
            className="rounded-lg p-2 items-center"
            gutter={8}
            justify="space-between"
          >
            {onSearch && (
              <Col xs={24} md={10} lg={8} xl={8} xxl={6}>
                <div className="flex items-center bg-surface rounded-lg border border-border/30">
                  <Input value={onSearch?.value} type="text" placeholder="Search by name..." aria-label="Search by name" prefix={<FiSearch className="text-foreground mr-2" />} onChange={(e) => onSearch?.onChange?.(e.target.value)} className="bg-transparent text-foreground placeholder:text-muted border-none shadow-none w-full text-sm" />
                </div>
              </Col>
            )}
            {onActive && (
              <Col xs={24} md={4} xl={3} xxl={2}>
                <div className="flex items-center gap-3 bg-surface px-3 py-3 rounded-lg border border-border/30">
                  <span className="text-sm font-semibold text-foreground uppercase">Active</span>
                  <Switch size="small" checked={onActive?.value} aria-label="Toggle active status" onChange={onActive?.onChange} />
                </div>
              </Col>
          )}
          {onAdd && (
            <Col>
              <div className="flex justify-end w-full">
                <button
                  onClick={onAdd}
                  className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  + Add
                </button>
              </div>
            </Col>
          )}
        </Row>
      )}
      {...rest}
    />
  );
};
