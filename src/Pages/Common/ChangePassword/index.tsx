import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../Store";
import { Mutations } from "../../../Api";
import { ResetPasswordSchema } from "../../../Utils";
import { CommonInput } from "../../../Components";

/* ---------- CONFIG ---------- */
const steps = [
  { key: "oldPassword", label: "Enter current password" },
  { key: "newPassword", label: "Create a new password" },
  { key: "confirmPassword", label: "Confirm your password" },
];

/* ---------- HELPERS ---------- */
const getRules = (password: string) => [
  { label: "At least 8 characters", valid: password.length >= 8 },
  { label: "Contains a number", valid: /\d/.test(password) },
  { label: "Contains a symbol", valid: /[!@#$%^&*]/.test(password) },
];

const ChangePassword = () => {
  const { user } = useAppSelector((s) => s.auth);
  const { mutate } = Mutations.useResetPassword();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  /* ---------- AUTO FOCUS ---------- */
  useEffect(() => {
    document.querySelector<HTMLInputElement>(".custom-input input")?.focus();
  }, [step]);

  return (
    <div className="cp-root">

      {step > 0 && !done && (
        <button onClick={() => setStep(s => s - 1)} className="cp-back">
          ← Back
        </button>
      )}

      <Formik
        initialValues={{
          userId: user?._id || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={ResetPasswordSchema}
        onSubmit={(values) =>
          mutate(values, { onSuccess: () => setDone(true) })
        }
      >
        {({ values, handleSubmit }) => {
          const { key, label } = steps[step];
          const value = values[key]?.trim();

          if (done) {
            return (
              <div className="cp-success">
                <div className="cp-success-icon">✔</div>
                <h2>Password Updated</h2>
                <button
                  className="cp-submit mt-4"
                  onClick={() => navigate("/profile")}
                >
                  Go Back
                </button>
              </div>
            );
          }

          return (
            <Form
              onSubmit={handleSubmit}
              className="cp-flow"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!value) return;
                  step < 2 ? setStep(s => s + 1) : handleSubmit();
                }
                if (e.key === "Backspace" && !value) {
                  setStep(s => Math.max(0, s - 1));
                }
              }}
            >
              <h1 className="cp-title">{label}</h1>

              <CommonInput
                name={key}
                label=""
                type={show ? "text" : "password"}
                placeholder="Type here..."
                suffix={
                  <span
                    className="cp-eye"
                    onClick={() => setShow(p => !p)}
                  >
                    {show ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                  </span>
                }
              />

              {step === 1 && (
                <div className="cp-rules">
                  {getRules(values.newPassword).map((r, i) => (
                    <div key={i} className={r.valid ? "valid" : ""}>
                      {r.valid ? "✔" : "•"} {r.label}
                    </div>
                  ))}
                </div>
              )}

              <div className="cp-progress">
                {steps.map((_, i) => (
                  <div key={i} className={`cp-dot ${i <= step ? "active" : ""}`} />
                ))}
              </div>

              <div className="cp-actions">
                <button
                  type={step < 2 ? "button" : "submit"}
                  disabled={!value}
                  onClick={() => step < 2 && setStep(s => s + 1)}
                  className="cp-next"
                >
                  {step < 2 ? "Continue →" : "Update Password"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ChangePassword;

// import { useState } from "react";
// import { Formik, Form, type FormikHelpers } from "formik";

// import { useNavigate } from "react-router-dom";
// import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

// import { Mutations } from "../../../Api";
// import { useAppSelector } from "../../../Store";
// import type { ResetPasswordPayload } from "../../../Types";
// import { CommonInput } from "../../../Components";
// import CommonButton from "../../../Attribute/FormFields/CommonButton";
// import { ResetPasswordSchema } from "../../../Utils";


// const ChangePassword = () => {
//   const navigate = useNavigate();
//   const { user } = useAppSelector((state) => state.auth);
//   const { mutate: resetPassword } = Mutations.useResetPassword();

//   const [show, setShow] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const initialValues: ResetPasswordPayload = {
//     userId: user?._id || "",
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   };

//  const handleSubmit = (
//   values: ResetPasswordPayload,
//   { resetForm }: FormikHelpers<ResetPasswordPayload>
// ) => {
//   const payload = {
//     userId: user?._id,
//     oldPassword: values.oldPassword,
//     newPassword: values.newPassword,
//     confirmPassword: values.confirmPassword,
//   };

//   resetPassword(payload, {
//     onSuccess: () => {
//       resetForm();
//       navigate(-1);
//     },
//     onError: (err: any) => {
//       console.log("RESET PASSWORD ERROR:", err);
//     },
//   });
// };

//   return (
//     <div className="cp-container">
//       <div className="cp-card">
//         <h2 className="cp-title">Change Password</h2>
//         <p className="cp-subtitle">
//           Update your password to keep your account secure
//         </p>

//         <Formik<ResetPasswordPayload>
//           enableReinitialize
//           initialValues={initialValues}
//           validationSchema={ResetPasswordSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="cp-form">

//               {/* Current Password */}
//               <CommonInput
//                 name="oldPassword"
//                 label="Current Password"
//                 type={show.current ? "text" : "password"}
//                 suffix={
//                   <span onClick={() =>
//                     setShow((p) => ({ ...p, current: !p.current }))
//                   }>
//                     {show.current ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                   </span>
//                 }
//               />

//               {/* New Password */}
//               <CommonInput
//                 name="newPassword"
//                 label="New Password"
//                 type={show.new ? "text" : "password"}
//                 suffix={
//                   <span onClick={() =>
//                     setShow((p) => ({ ...p, new: !p.new }))
//                   }>
//                     {show.new ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                   </span>
//                 }
//               />

//               {/* Confirm Password */}
//               <CommonInput
//                 name="confirmPassword"
//                 label="Confirm Password"
//                 type={show.confirm ? "text" : "password"}
//                 suffix={
//                   <span onClick={() =>
//                     setShow((p) => ({ ...p, confirm: !p.confirm }))
//                   }>
//                     {show.confirm ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                   </span>
//                 }
//               />

//               {/* Actions */}
//               <div className="cp-actions">
//                 <CommonButton
//                   text="Cancel"
//                   type="default"
//                   onClick={() => navigate("/profile")}
//                 />

//                 <CommonButton
//                   text={isSubmitting ? "Updating..." : "Update Password"}
//                   htmlType="submit"
//                   loading={isSubmitting}
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;