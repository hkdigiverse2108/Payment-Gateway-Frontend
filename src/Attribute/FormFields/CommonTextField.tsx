import { Input, Form } from "antd";
import { useField } from "formik";
import { useState, type FC } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import type { CommonInputProps } from "../../Types";

export const CommonInput: FC<CommonInputProps> = ({ name, label, required, type = "text", placeholder, className }) => {
  const [field, meta, helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = type === "password";
  const showType = isPassword && showPassword ? "text" : type;
  const hasError = meta.touched && !!meta.error;
  const hasValue = field.value !== undefined && field.value !== null && field.value !== "";
  const floating = isFocused || hasValue;
  return (
    <Form.Item required={required} validateStatus={hasError ? "error" : ""} help={hasError ? meta.error : ""} className="commoninput-wrapper" >
      <div className="commoninput-container">
        <Input {...field} value={field.value} type={showType} placeholder={placeholder} onChange={(e) => helpers.setValue(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={(e) => { setIsFocused(false); field.onBlur(e); }} className={`commoninput ${ label ? "commoninput-with-label" : "" } ${hasError ? "commoninput-error" : ""} ${className || ""}`} suffix={
            isPassword ? (
              showPassword ? ( <EyeInvisibleOutlined className="commoninput-icon" onClick={() => setShowPassword(false)} /> ) : ( <EyeOutlined className="commoninput-icon" onClick={() => setShowPassword(true)} /> )
            ) : ( <span className="commoninput-dummy" /> )
          }
        />
        {label && (
          <label className={`commoninput-label ${ floating ? "commoninput-label-floating" : "commoninput-label-default" } ${hasError ? "commoninput-label-error" : ""}`} >
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>
    </Form.Item>
  );
};

export const CommonSearchInput = ({ value, onChange, placeholder }: any) => {
  return (
    <div className="commonsearch-container">
    <Input
      value={value}
      placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        
      />
      </div>
  );
};