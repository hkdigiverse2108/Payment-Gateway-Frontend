import { CommonButton } from "../../../../Attribute";
import { Copy } from "lucide-react";

export const CopyableColumn = (
  label: string,
  toast: any
) => ({
  title: label,
  dataIndex: label,
  key: label,
  render: (val: string) => (
    <div className="font-mono text-xs flex items-center gap-1.5">
      {val ? val.substring(0, 12) + "..." : "-"}
      {val && (
        <CommonButton
          variant="icon-only"
          onClick={() => {
            navigator.clipboard.writeText(val);
            toast.success(`Copied ${label}`);
          }}
        >
          <Copy className="w-3 h-3" />
        </CommonButton>
      )}
    </div>
  ),
});