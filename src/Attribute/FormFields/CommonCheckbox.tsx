import { Checkbox } from "antd";
import type { CommonCheckboxProps } from "../../Types";

export const CommonCheckbox = ({ label, checked, onChange, disabled = false, }: CommonCheckboxProps) => {
  return (
    <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className={` commoncheckbox ${disabled ? "commoncheckbox-disabled" : ""} `} >
      <span className="commoncheckbox-label">{label}</span>
    </Checkbox>
  );
};

export default CommonCheckbox;