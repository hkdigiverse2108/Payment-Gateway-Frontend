
import type { CommonActionColumnProps } from "./../../../Types";
import { Flex, Tooltip } from "antd";
import { BiTrash } from "react-icons/bi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import CommonButton from "../../../Attribute/FormFields/CommonButton";

const CommonActionColumn = <T,>({ onActive, onEdit, onDelete }: CommonActionColumnProps<T>) => ({
  title: "Option",
  key: "actionIcons",
  width: 120,
  render: (_: T, record: T & { isActive?: boolean }) => (
    <Flex gap="small" justify="center">
      {!!onActive && (onActive?.isPermission?.(record) ?? true) && (
        <Tooltip title={record?.isActive ? "Deactivate" : "Activate"} color={record?.isActive ? "red" : "green"}>
          <CommonButton onClick={() => onActive?.onHandle(record)} aria-label={record?.isActive ? "Deactivate" : "Activate"} icon={record?.isActive ? <FaEyeSlash /> : <FaEye />} size="middle" color={record?.isActive ? "danger" : "green"} variant="dashed" />
        </Tooltip>
      )}

      {!!onEdit && (onEdit?.isPermission?.(record) ?? true) && (
        <Tooltip title="Edit">
                  <CommonButton onClick={() => onEdit?.onHandle(record)} aria-label="Edit item" icon={<FiEdit3 />} size="middle" color="default" variant="dashed" />
        </Tooltip>
      )}

      {!!onDelete && (onDelete?.isPermission?.(record) ?? true) && (
        <Tooltip title="Delete">
          <CommonButton onClick={() => onDelete?.onHandle(record)} aria-label="Delete item" icon={<BiTrash /> } size="middle" color="default" variant="dashed"  />
        </Tooltip>
      )}
    </Flex>
  ),
});

export default CommonActionColumn;
