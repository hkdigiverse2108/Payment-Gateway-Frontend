import { Checkbox } from "antd";
import type { CommonCheckboxProps } from "../../Types";

export const CommonCheckbox = ({ label, checked, onChange, disabled = false }: CommonCheckboxProps) => {
  return (
    <Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} >
      {label}
    </Checkbox>
  );
};

export default CommonCheckbox;