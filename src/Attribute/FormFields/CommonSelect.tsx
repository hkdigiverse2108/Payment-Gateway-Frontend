import { Select, Form } from "antd";
import { useField, useFormikContext } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps } from "../../Types";

export const CommonValidationSelect:  FC<CommonValidationSelectProps> = ({ name, label, options = [], multiple = false, placeholder, disabled, isLoading }) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext<any>();
  const value = multiple ? field.value || [] : field.value;
  const hasError = meta.touched && meta.error;
  return (
    <Form.Item label={label} validateStatus={hasError ? "error" : ""} help={hasError && meta.error} className="commonselect-wrapper" >
      <Select mode={multiple ? "multiple" : undefined} value={value} options={options.map((o) => ({ label: o.label, value: o.value }))} placeholder={placeholder} disabled={disabled} loading={isLoading} onChange={(val) => { helpers.setValue(val); setFieldValue(name, val); }}onBlur={() => helpers.setTouched(true)} allowClear className={` commonselect ${label ? "commonselect-with-label" : ""} ${disabled ? "commonselect-disabled" : ""} ${hasError ? "commonselect-error" : ""} `} />
    </Form.Item>
  );
};
export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, placeholder, disabled, isLoading, limitTags }) => {
  return (
    <Form.Item label={label} className="commonselect-wrapper">
      <Select mode={multiple ? "multiple" : undefined} value={value} options={options.map((o) => ({ label: o.label, value: o.value }))} placeholder={placeholder} disabled={disabled} loading={isLoading} maxTagCount={limitTags} onChange={(val) => { if (multiple) onChange?.(val as string[]); else onChange?.(val as string); }} allowClear className={` commonselect ${label ? "commonselect-with-label" : ""} ${disabled ? "commonselect-disabled" : ""} `} />
    </Form.Item>
  );
};