import { Checkbox } from "antd";
import type { CommonCheckboxProps } from "../../Types";

export const CommonCheckbox = ({
  label,
  checked,
  onChange,
  disabled = false,
}: CommonCheckboxProps) => {

  return (
    <div className="checkbox-wrapper">
      <Checkbox
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="custom-checkbox"
      >
        <span className="checkbox-label">
          {label} 
        </span>
      </Checkbox>
    </div>
  );
};

export default CommonCheckbox;
