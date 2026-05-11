import { Button } from "antd";
import { type FC } from "react";
import type { CommonButtonProps } from "../../Types";

export const CommonButton: FC<CommonButtonProps> = ({ loading, title, children, disabled, className = "", ...props }) => {
  return (
    <Button {...props} loading={loading} disabled={disabled || loading} className={`rounded-md font-semibold h-10 ${className}`} >
      {children || title}
    </Button>
  );
};