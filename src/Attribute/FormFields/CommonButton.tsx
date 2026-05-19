import { Button } from "antd";
import { type FC } from "react";
import type { CommonButtonProps } from "../../Types";

export const CommonButton: FC<CommonButtonProps> = ({ loading, title, children, disabled, className = "", variant = "primary", ...props }) => {
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "bg-brand-500 text-white hover:bg-brand-600 border-none";
      break;
    case "ghost":
      variantClasses = "bg-transparent text-brand-500 border border-brand-500 hover:bg-brand-50 hover:text-brand-600";
      break;
    case "danger":
      variantClasses = "bg-red-500 text-white hover:bg-red-600 border-none";
      break;
    case "icon-only":
      variantClasses = "p-2 flex items-center justify-center bg-transparent border-none shadow-none text-foreground hover:text-brand-500";
      break;
  }

  return (
    <Button {...props} loading={loading} disabled={disabled || loading} className={`rounded-md font-semibold transition-all ${variant !== "icon-only" ? "h-10 px-4" : ""} ${variantClasses} ${className}`} >
      {children || title}
    </Button>
  );
};