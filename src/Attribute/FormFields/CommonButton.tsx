import { Button } from "antd";
import { type FC } from "react";
import type { CommonButtonProps } from "../../Types";

export const CommonButton: FC<CommonButtonProps> = ({ loading, title, children, disabled, className = "", variant = "primary", ...props }) => {
  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses = "commonbtn-primary";
      break;
    case "plain":
      variantClasses = "commonbtn-plain";
      break;
    case "ghost":
      variantClasses = "commonbtn-ghost";
      break;
    case "danger":
      variantClasses = "commonbtn-danger";
      break;
    case "icon-only":
      variantClasses = "commonbtn-icon-only";
      break;
  }

  return (
    <Button {...props} loading={loading} disabled={disabled || loading} className={`commonbtn ${variant !== "icon-only" ? "commonbtn-base" : ""} ${variantClasses} ${(disabled || loading) ? "commonbtn-disabled" : ""} ${className}`} >
      {children || title}
    </Button>
  );
};