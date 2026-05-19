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
    <Form.Item required={required} validateStatus={hasError ? "error" : ""} help={hasError ? meta.error : ""} wrapperCol={{ span: 24 }} className="relative mb-5">
      <div className="relative w-full">
        <Input 
          {...field} 
          value={field.value} 
          type={showType} 
          placeholder={placeholder} 
          onChange={(e) => helpers.setValue(e.target.value)} 
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => { setIsFocused(false); field.onBlur(e); }} 
          className={`h-12 ${label ? 'pt-4 pb-1' : ''} px-3 text-base rounded-lg bg-surface text-foreground transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 focus:shadow-none hover:border-brand-400 placeholder-transparent focus:placeholder-muted ${hasError ? '!border-red-500 focus:!ring-red-500/20' : ''} ${className || ""}`}
          suffix={
            isPassword ? (
              showPassword ? (
                <EyeInvisibleOutlined className="text-muted hover:text-foreground" onClick={() => setShowPassword(false)} style={{ cursor: "pointer" }} />
              ) : (
                <EyeOutlined className="text-muted hover:text-foreground" onClick={() => setShowPassword(true)} style={{ cursor: "pointer" }} />
              )
            ) : undefined
          }
        />
        {label && (
          <label 
            className={`absolute left-3 transition-all duration-200 pointer-events-none select-none z-10 ${
              floating 
                ? 'top-1 text-[11px] text-brand-500 font-medium' 
                : 'top-3 text-sm text-muted'
            } ${hasError ? '!text-red-500' : ''}`}
          >
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>
    </Form.Item>
  );
};