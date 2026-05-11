import { Input, Form } from "antd";
import { useField } from "formik";
import { useState, type FC } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import type { CommonInputProps } from "../../Types";

export const CommonInput: FC<CommonInputProps> = ({ name, label, required, type = "text", placeholder, className }) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const showType = isPassword && showPassword ? "text" : type;
  const hasError = meta.touched && !!meta.error;
  return (
    <Form.Item label={label} required={required} validateStatus={hasError ? "error" : ""} help={hasError ? meta.error : ""} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} >
      <Input {...field} value={field.value} type={showType} placeholder={placeholder} onChange={(e) => helpers.setValue(e.target.value)} onBlur={field.onBlur} className={className}
        suffix={
          <>
            {isPassword &&
              (showPassword ? (
                <EyeInvisibleOutlined onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
              ) : (
                <EyeOutlined onClick={() => setShowPassword(true)} style={{ cursor: "pointer" }} />
              ))}
          </>
        }
      />
    </Form.Item>
  );
};