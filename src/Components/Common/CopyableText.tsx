import { Copy } from "lucide-react";
import { CommonButton, showNotification } from "../../Attribute";
import type { CopyableTextProps } from "../../Types";

const CopyableText = ({ value, label = "Text" }: CopyableTextProps) => {
  if (!value) return <span>-</span>;
  return (
    <div className="font-mono text-xs flex items-center gap-1.5">
      {value.substring(0, 12)}...
      <CommonButton
        onClick={() => {
          navigator.clipboard.writeText(value);
          showNotification("success", `Copied ${label}`);
        }}
        variant="icon-only"
      >
        <Copy className="w-3 h-3" />
      </CommonButton>
    </div>
  );
};

export default CopyableText;
