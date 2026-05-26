import { useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import "../../../public/assets/css/layout.css";
import { LoginSchema } from "../../Utils";
import { setLogin, useAppDispatch } from "../../Store";
import { Mutations } from "../../Api";
import type { LoginFormValues, LoginPayload } from "../../Types";
import { ROUTES } from "../../Constants";
import { CommonButton, CommonCheckbox } from "../../Attribute/FormFields";
import { CommonInput } from "../../Attribute/FormFields/CommonTextField";

const Login = () => {
  const [remember, setRemember] = useState(false);
  const { mutate: login, isPending } = Mutations.useLogin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = ( values: LoginFormValues, { resetForm }: FormikHelpers<LoginFormValues> ) => {
    const payload: LoginPayload = {
      username: values.identifier.toLowerCase(),
      password: values.password,
    };
    login(payload, {
      onSuccess: (response) => {
        const data = response?.data;
        if (!data?.token) return;
        dispatch(setLogin(response.data));
        navigate(ROUTES.DASHBOARD, { replace: true });
        resetForm();
      },
    });
  };

  return (
    <div className="login-main">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-main">
            <svg className="login-svg1" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
            <svg className="login-svg2" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
            </svg>
            <svg className="login-svg3" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
            </svg>
          </div>
          <div className="login-left-content">
            <div className="login-logo"> PG </div>
            <div className="space-y-3 login-left-text">
              <h2 className="login-left-text-main">Secure & Seamless Payment Gateway</h2>
              <p className="login-left-text-base">
                Real-time processing, multi-currency support, and state-of-the-art fraud protection designed for high-growth businesses.
              </p>
            </div>
            <div className="login-left-stats-card">
              <div className="login-left-stats-card1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ₹2.4Cr processed today
              </div>
              <div className="login-left-stats-card2">
                <span className="text-base">⚡</span>
                99.9% uptime guaranteed
              </div>
              <div className="login-left-stats-card3">
                <span className="text-base">🔒</span>
                256-bit AES encryption
              </div>
            </div>
            <span className="login-footer-text">
              Need help? <b>Contact Partner Support</b>
            </span>
          </div>
        </div>
        <div className="login-right">
          <div className="login-box">
            <div className="text-center mb-8">
              <h2 className="loginin-text">
                Log In
                <span className="loginin-span" />
              </h2>
              <p className="loginin-welcome">Welcome back! Please enter your details below.</p>
            </div>
            <Formik initialValues={{ identifier: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit} >
              <Form className="login-form">
                <CommonInput name="identifier"  label="Email or Username" required />
                <CommonInput name="password" type="password" label="Password"  required showPasswordToggle clearable />
                <div className="login-from-below">
                  <CommonCheckbox label="Keep me signed in" checked={remember} onChange={setRemember} />
                  <span className="login-form-spanb">Forgot password?</span>
                </div>
                <CommonButton type="primary" htmlType="submit" block loading={isPending} >
                  Sign In to Dashboard
                </CommonButton>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;