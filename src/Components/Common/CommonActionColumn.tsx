import { StarOutlined, StarFilled, EditOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined, KeyOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import type { CommonActionColumnProps } from "../../Types";

const CommonActionColumn = < T extends {
    _id?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    creditsRemaining?: number;
  }
>({
  onFeatured, onActive, editRoute, onDelete, onEdit, permissionRoute, }: CommonActionColumnProps<T>): ColumnsType<T>[number] => ({
  title: "Actions",
  key: "actions",
  align: "center",
  width: onFeatured ? 240 : 180,
  render: (_, row) => {
    const isActive = row.isActive;
    const isFeatured = row.isFeatured;
    return (
      <Space size="small">
        {onFeatured?.onHandle &&
          !onFeatured?.isPermission?.(row) && (
            <Button type="text" icon={ isFeatured ? <StarFilled /> : <StarOutlined />
              } onClick={() => onFeatured.onHandle(row)} />
          )}
        {onActive && (
          <Button type="text" icon={ isActive ? <EyeOutlined /> : <EyeInvisibleOutlined /> } onClick={() => onActive.onHandle(row)} />
        )}
        {editRoute && (
          <Link to={editRoute} state={{ data: row }}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
        )}
        {permissionRoute && (
          <Link to={permissionRoute} state={{ data: row }}>
            <Button type="text" icon={<KeyOutlined />} />
          </Link>
        )}
        {onEdit?.onHandle &&
          !onEdit?.isPermission?.(row) && (
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit.onHandle(row)} />
          )}
        {onDelete?.onHandle && (
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete.onHandle(row)} />
        )}
      </Space>
    );
  },
});

export default CommonActionColumn;