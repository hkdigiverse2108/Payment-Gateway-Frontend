import { Input } from "antd";
import { useField } from "formik";
import type { CommonInputProps } from "../../Types";

export const CommonInput = ({
  name,
  label,
  required,
  placeholder,
  prefix,
  suffix,
  type = "text",
  disabled = false,
}: CommonInputProps) => {
  const [field, meta] = useField(name);

  const hasError = meta.touched && Boolean(meta.error);

  return (
    <div className="input-wrapper">
      <label className="input-label">
        {label} {required && <span className="required">*</span>}
      </label>

      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        size="large"
        prefix={prefix}
        suffix={suffix} 
        disabled={disabled}
        status={hasError ? "error" : undefined}
        className="custom-input"
      />

      {hasError && (
        <p className="input-error">
          <span className="error-dot" />
          {meta.error}
        </p>
      )}
    </div>
  );
};

// import { Input } from "antd";
// import { useField } from "formik";
// import type { CommonInputProps } from "../../Types";


// export const CommonInput = ({
//   name,
//   label,
//   required,
//   placeholder,
//   prefix,
//   type = "text",
//   disabled = false,
// }: CommonInputProps) => {
//   const [field, meta] = useField(name);

//   const hasError = meta.touched && Boolean(meta.error);

//   return (
//     <div className="input-wrapper">
//       <label className="input-label">
//         {label} {required && <span className="required">*</span>}
//       </label>

//       <Input
//         {...field}
//         type={type}
//         placeholder={placeholder}
//         size="large"
//         prefix={prefix}
//         disabled={disabled}
//         status={hasError ? "error" : undefined}
//         className="custom-input"
//       />

//       {hasError && (
//         <p className="input-error">
//           <span className="error-dot" />
//           {meta.error}
//         </p>
//       )}
//     </div>
//   );
// };

// export default CommonInput;
