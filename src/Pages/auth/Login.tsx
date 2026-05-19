import { Button } from "antd";
import { useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import "../../../public/assets/css/layout.css";
import { LoginSchema } from "../../Utils";
import { setLogin, useAppDispatch } from "../../Store";
import { Mutations } from "../../Api";
import type { LoginFormValues, LoginPayload } from "../../Types";
import { ROUTES } from "../../Constants";
import { CommonCheckbox } from "../../Attribute/FormFields";
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
    <div className="login-main min-h-screen flex items-center justify-center p-4 bg-backgroundlight select-none">
      <div className="login-container flex flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden bg-surface border border-border/20 shadow-2xl">
        
        {/* Left Panel */}
        <div className="login-left relative overflow-hidden bg-brand-900 md:w-1/2 flex items-center justify-center p-12 text-white min-h-[500px]">
          {/* Background SVGs */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="absolute top-10 left-10 w-48 h-48 text-brand-400" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
            <svg className="absolute -bottom-20 -right-20 w-80 h-80 text-brand-300" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
            </svg>
            <svg className="absolute top-1/3 right-10 w-24 h-24 text-brand-400" viewBox="0 0 100 100" fill="none">
              <rect x="10" y="10" width="80" height="80" rx="10" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
            </svg>
          </div>

          <div className="login-left-content relative z-10 flex flex-col gap-6 max-w-md w-full">
            <div className="login-logo w-14 h-14 rounded-2xl bg-white text-brand-900 font-black text-xl flex items-center justify-center shadow-lg shadow-black/10 select-none">
              PG
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight">Secure & Seamless Payment Gateway</h2>
              <p className="text-brand-100 text-sm leading-relaxed">
                Real-time processing, multi-currency support, and state-of-the-art fraud protection designed for high-growth businesses.
              </p>
            </div>

            {/* Floating Stat Cards */}
            <div className="relative h-44 mt-8">
              <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-xl rotate-[-4deg] flex items-center gap-2 select-none">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ₹2.4Cr processed today
              </div>
              <div className="absolute top-14 right-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-xl rotate-[3deg] flex items-center gap-2 select-none">
                <span className="text-base">⚡</span>
                99.9% uptime guaranteed
              </div>
              <div className="absolute bottom-4 left-6 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-xl rotate-[-2deg] flex items-center gap-2 select-none">
                <span className="text-base">🔒</span>
                256-bit AES encryption
              </div>
            </div>

            <span className="login-footer-text text-xs text-brand-200 mt-6 select-none">
              Need help? <b>Contact Partner Support</b>
            </span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-surface">
          <div className="login-box w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-foreground relative inline-block">
                Log In
                <span className="absolute bottom-[-6px] left-1/4 right-1/4 h-[3px] bg-brand-500 rounded-full" />
              </h2>
              <p className="text-sm text-muted mt-3">Welcome back! Please enter your details below.</p>
            </div>
            
            <Formik initialValues={{ identifier: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit} >
              <Form className="login-form space-y-6">
                <CommonInput name="identifier" label="Email or Username" placeholder="e.g. admin@gateway.com" required />
                <CommonInput name="password" type="password" label="Password" placeholder="••••••••" required showPasswordToggle clearable />
                
                <div className="flex justify-between items-center text-sm mb-4">
                  <CommonCheckbox label="Keep me signed in" checked={remember} onChange={setRemember} />
                  <span className="text-brand-500 hover:text-brand-600 font-semibold cursor-pointer select-none">Forgot password?</span>
                </div>
                
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={isPending} 
                  className="login-btn h-12 w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl border-none shadow-lg shadow-brand-500/20 text-base font-semibold transition-all mt-4" 
                >
                  Sign In to Dashboard
                </Button>
              </Form>
            </Formik>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;