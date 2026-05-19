import type { CommonTableProps } from "../../../Types";
import { Col, Input, Row, Switch, Table } from "antd";
import { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { CommonButton } from "../../../Attribute";

export const CommonTable = <T extends object>({ loading = false, dataSource, columns = [], pagination = { current: 1, pageSize: 10 }, rowKey = "userId", bordered = false, size = "middle", scroll, onActive, onAdd, onSearch, ...rest }: CommonTableProps<T>) => {
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
    <Table<T> loading={loading} dataSource={dataSource} columns={fixedColumns} rowKey={rowKey as keyof T} bordered={bordered} size={size} scroll={scroll ?? { x: "max-content" }} onChange={(_, __, sorter: any) => { if (!rest.sort?.onChange) return; const order = sorter.order === "ascend" ? "asc" : sorter.order === "descend" ? "desc" : "desc"; rest.sort.onChange({ field: sorter.field, order, }); }} pagination={{ ...pagination, showSizeChanger: true, showTotal: (total) => `Total ${total} items`, onChange: (page, pageSize) => { rest.onPaginationChange?.(page, pageSize); }, }} className="common-table font-medium"
      rowClassName={(_, index) => index % 2 === 0 ? 'bg-surface' : 'bg-tableback/30'}
      locale={{
        emptyText: (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 mb-4 opacity-50 bg-brand-100 rounded-full flex items-center justify-center">
               <FiSearch className="w-10 h-10 text-brand-500" />
            </div>
            <p className="text-muted text-base mb-4 font-normal">No records found</p>
            {onAdd && (
              <CommonButton variant="primary" onClick={onAdd}>
                {rest.onAddLabel || "+ Add New"}
              </CommonButton>
            )}
          </div>
        )
      }}
      title={() => (
          <Row className="rounded-lg p-2 items-center" gutter={8} justify="space-between" >
            {onSearch && (
              <Col xs={24} md={10} lg={8} xl={8} xxl={6}>
                <div className="flex items-center bg-surface rounded-lg border border-border/30">
                  <Input value={onSearch?.value} type="text" placeholder="Search..." aria-label="Search" prefix={<FiSearch className="text-foreground mr-2" />} onChange={(e) => onSearch?.onChange?.(e.target.value)} className="bg-transparent text-foreground placeholder:text-muted border-none shadow-none w-full text-sm" />
                </div>
              </Col>
            )}
            {onActive && (
              <Col xs={24} md={4} xl={3} xxl={2}>
                <div className="flex items-center gap-3 bg-surface px-3 py-3 rounded-lg ">
                  <span className="text-sm font-semibold text-foreground uppercase">Active</span>
                  <Switch size="small" checked={onActive?.value} aria-label="Toggle active status" onChange={onActive?.onChange} />
                </div>
              </Col>
          )}
          {onAdd && (
            <Col>
              <div className="flex justify-end w-full">
                <CommonButton
                  variant="primary"
                  onClick={onAdd}
                  className="text-sm px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  {rest.onAddLabel || "+ Add"}
                </CommonButton>
              </div>
            </Col>
          )}
        </Row>
      )}
      {...rest}
    />
  );
};
