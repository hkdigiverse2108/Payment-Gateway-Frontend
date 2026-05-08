import { Switch, Form } from "antd";
import { useField } from "formik";

export const CommonValidationSwitch = ({ name, label, disabled }: any) => {
  const [field, meta, helpers] = useField<boolean>(name);
  return (
    <Form.Item
      label={label}
      validateStatus={meta.touched && meta.error ? "error" : ""}
      help={meta.touched && meta.error}
    >
      <Switch
        checked={!!field.value}
        disabled={disabled}
        onChange={(val) => helpers.setValue(val)}
      />
    </Form.Item>
  );
};

export const CommonSwitch = ({ value, onChange, label }: any) => {
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Switch checked={value} onChange={onChange} />
      {label}
    </label>
  );
};