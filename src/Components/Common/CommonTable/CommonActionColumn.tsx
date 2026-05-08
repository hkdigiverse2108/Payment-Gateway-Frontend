import type { CommonActionColumnProps } from "../../../Types";
import { Flex, Tooltip } from "antd";
import { BiTrash } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { CommonButton } from "../../../Attribute";

const CommonActionColumn = <T extends { isActive?: boolean }>({ onActive, onEdit, onDelete }: CommonActionColumnProps<T>) => ({
  title: "Actions",
  key: "actions",
  width: 140,
  align: "center" as const,
  render: (_: unknown, record: T) => (
    <Flex gap="small" justify="center">
      {onActive &&
        (onActive.isPermission?.(record) ?? true) && (
          <Tooltip title={record.isActive ? "Deactivate" : "Activate"} >
            <CommonButton onClick={() => onActive.onHandle(record)} icon={record.isActive ? <FaEyeSlash /> : <FaEye />} variant="dashed" />
          </Tooltip>
        )}

      {onEdit &&
        (onEdit.isPermission?.(record) ?? true) && (
          <Tooltip title="Edit">
            <CommonButton onClick={() => onEdit.onHandle(record)} icon={<FiEdit3 />} variant="dashed" />
          </Tooltip>
        )}

      {onDelete &&
        (onDelete.isPermission?.(record) ?? true) && (
          <Tooltip title="Delete">
            <CommonButton onClick={() => onDelete.onHandle(record)} icon={<BiTrash />} variant="dashed" />
          </Tooltip>
        )}
    </Flex>
  ),
});

export default CommonActionColumn;