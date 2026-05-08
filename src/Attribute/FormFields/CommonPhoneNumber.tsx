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
  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={meta.touched && meta.error ? "error" : ""}
      help={meta.touched && meta.error}
      style={{ marginBottom: 0 }}
    >
      <div style={{ display: "flex", gap: 8 }}>
        <Select
          showSearch
          value={country}
          onChange={(val) => setCountry(val)}
          options={countryOptions}
          style={{ width: 180 }}
          placeholder="Country"
        />
        <Input
          value={field.value}
          onChange={handlePhoneChange}
          placeholder="Mobile number"
        />
      </div>
    </Form.Item>
  );
};