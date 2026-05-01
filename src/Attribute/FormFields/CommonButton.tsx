import { Button } from "antd";
import type { CommonButtonProps } from "../../Types";

const CommonButton = ({
  text,
  type = "primary",
  htmlType = "button",
  loading = false,
  disabled = false,
  onClick,
  className = "",

  icon,
  size = "middle",
  color,
  variant,
}: CommonButtonProps) => {
  return (
    <Button
      type={type}
      htmlType={htmlType}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      icon={icon}
      size={size}
      className={`common-button ${className}`}
      style={
        color
          ? {
              backgroundColor: variant === "solid" ? color : undefined,
              borderColor: color,
              color: variant === "text" ? color : undefined,
            }
          : undefined
      }
    >
      {text}
    </Button>
  );
};

export default CommonButton;

// import { Button } from "antd";
// import type { CommonButtonProps } from "../../Types";

// const CommonButton = ({
//   text,
//   type = "primary",
//   htmlType = "button",
//   loading = false,
//   disabled = false,
//   onClick,
//   className = "",
// }: CommonButtonProps) => {
//   return (
//     <Button
//       type={type}
//       htmlType={htmlType}
//       loading={loading}
//       disabled={disabled}
//       onClick={onClick}
//       className={`common-button ${className}`}
//     >
//       {text}
//     </Button>
//   );
// };

// export default CommonButton;