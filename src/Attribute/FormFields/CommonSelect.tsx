import { Select, Form } from "antd";
import { useField, useFormikContext } from "formik";
import { type FC } from "react";
import type { CommonSelectProps, CommonValidationSelectProps, SelectOptionType } from "../../Types";

export const CommonValidationSelect: FC<CommonValidationSelectProps> = ({ name, label, options = [], multiple = false, placeholder, disabled, isLoading }) => {
  const [field, meta, helpers] = useField(name);
  const { setFieldValue } = useFormikContext<any>();
  const value = multiple ? field.value || [] : field.value;
  return (
    <Form.Item
      label={label}
      validateStatus={meta.touched && meta.error ? "error" : ""}
      help={meta.touched && meta.error}
    >
      <Select
        mode={multiple ? "multiple" : undefined}
        value={value}
        options={options.map((o: SelectOptionType) => ({
          label: o.label,
          value: o.value,
        }))}
        placeholder={placeholder}
        disabled={disabled}
        loading={isLoading}
        onChange={(val) => {
          helpers.setValue(val);
          setFieldValue(name, val);
        }}
        onBlur={() => helpers.setTouched(true)}
        allowClear
      />
    </Form.Item>
  );
};

export const CommonSelect: FC<CommonSelectProps> = ({ label, options = [], value, onChange, multiple = false, placeholder, disabled, isLoading }) => {
  return (
    <Form.Item label={label}>
      <Select
        mode={multiple ? "multiple" : undefined}
        value={value}
        options={options.map((o: SelectOptionType) => ({
          label: o.label,
          value: o.value,
        }))}
        placeholder={placeholder}
        disabled={disabled}
        loading={isLoading}
        onChange={onChange}
        allowClear
      />
    </Form.Item>
  );
};