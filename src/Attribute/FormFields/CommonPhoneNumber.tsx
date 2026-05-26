import { Form, Input, Select } from "antd";
import { useField } from "formik";
import { useMemo, useState } from "react";
import * as countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import type { CommonPhoneNumberProps } from "../../Types";

countries.registerLocale(en);

export const CommonPhoneNumber = ({ name, label, required }: CommonPhoneNumberProps) => {
  const [field, meta, helpers] = useField(name);
  const [country, setCountry] = useState("IN");
  const [isFocused, setIsFocused] = useState(false);

  const countryOptions = useMemo(() => {
    return Object.entries(
      countries.getNames("en", { select: "official" })
    ).map(([code, name]) => ({
      value: code,
      label: name,
    }));
  }, []);

  const handlePhoneChange = (e: any) => {
    helpers.setValue(e.target.value);
  };

  const hasError = meta.touched && !!meta.error;
  const hasValue = field.value !== undefined && field.value !== null && field.value !== "";
  const floating = isFocused || hasValue;

  return (
    <Form.Item
      required={required}
      validateStatus={hasError ? "error" : ""}
      help={hasError ? meta.error : ""}
      className="commoninput-wrapper"
    >
      <div
        className={`commoninput-container flex items-center border rounded-lg bg-surface transition-all h-12 relative ${
          hasError ? "border-red-500" : isFocused ? "border-brand-500 ring-4 ring-brand-500/20" : "border-border/50"
        }`}
      >
        {/* Country Selector */}
        <Select
          showSearch
          value={country}
          onChange={(val) => setCountry(val)}
          options={countryOptions}
          placeholder="Country"
          variant="borderless"
          dropdownStyle={{ zIndex: 10000 }}
          style={{
            width: 130,
            height: "100%",
            paddingTop: label && floating ? 14 : 0,
            background: "transparent",
            color: "var(--foreground)",
          }}
          className="phone-country-select"
        />

        {/* Divider */}
        <div className="w-[1px] h-6 bg-border/30 self-center" />

        {/* Phone Input */}
        <Input
          value={field.value}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            field.onBlur(e);
          }}
          placeholder={floating ? "Enter mobile number" : ""}
          variant="borderless"
          style={{
            flex: 1,
            height: "100%",
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: label && floating ? 14 : 0,
            background: "transparent",
            color: "var(--foreground)",
          }}
          className="phone-number-input"
        />

        {label && (
          <label
            className={`commoninput-label ${
              floating ? "commoninput-label-floating" : "commoninput-label-default"
            } ${hasError ? "commoninput-label-error" : ""}`}
            style={{
              left: 146,
            }}
          >
            {label} {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
      </div>
    </Form.Item>
  );
};