import { Tooltip } from "antd";
import { Edit2, Trash2 } from "lucide-react";
import { CommonButton } from "../../../../Attribute";

export const CommonUserActionColumn = (props: {
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
}) => ({
  title: "Action",
  key: "action",
  width: 120,
  render: (_: any, record: any) => (
    <div className="flex gap-1.5">
      <Tooltip title="Edit User">
        <CommonButton
          onClick={() => props.onEdit(record)}
          className="p-1.5 rounded-lg border border-border/20 text-muted hover:text-foreground hover:bg-tableback/30"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </CommonButton>
      </Tooltip>

      <Tooltip title="Delete User">
        <CommonButton
          onClick={() => props.onDelete(record)}
          className="p-1.5 rounded-lg border border-border/20 text-red-500 hover:bg-red-500/5"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </CommonButton>
      </Tooltip>
    </div>
  ),
});