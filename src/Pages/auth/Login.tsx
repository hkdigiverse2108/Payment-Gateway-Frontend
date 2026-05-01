import { Button, Card } from "antd";
import { useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";

import { LoginSchema } from "../../Utils";
import { EyeInvisibleFilled, EyeFilled } from "@ant-design/icons";
import { setLogin, useAppDispatch } from "../../Store";
import { Mutations } from "../../Api";
import type { LoginFormValues, LoginPayload } from "../../Types";
import { ROUTES } from "../../Constants";
import {
  CommonCheckbox,
  CommonInput,
} from "../../Attribute/FormFields";

const Login = () => {
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: isLoginPending } =
    Mutations.useLogin();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (
    values: LoginFormValues,
    { resetForm }: FormikHelpers<LoginFormValues>
  ) => {
    const payload: LoginPayload = {
      userName: values.email.toLowerCase(),
      password: values.password,
    };

    login(payload, {
      onSuccess: (response) => {
        const data = response?.data;

        if (!data?.token) {
          console.error("Invalid login response", response);
          return;
        }

        dispatch(setLogin(data));

        const role = data.user?.role;

        if (role === "admin") {
          navigate(ROUTES.DASHBOARDADMIN, { replace: true });
        } else {
          navigate(ROUTES.USER.HOME, { replace: true });
        }
console.log("LOGIN RESPONSE:", data);
        resetForm();
      },
    });
  };
  
  return (
    <div className="login-container">
      
      <div className="login-bg-glow-left" />
      <div className="login-bg-glow-right" />

      <Card className="login-card">

        <div className="login-header">
          <div className="login-logo-wrapper">
            <div className="login-logo">PG</div>
          </div>

          <h1 className="login-title">Payment Gateway</h1>
          <p className="login-subtitle">
            Secure access to your dashboard
          </p>
        </div>

        <Formik<LoginFormValues>
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          <Form className="login-form">

            <CommonInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <div className="login-password-wrapper">
              <CommonInput
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="login-password-toggle"
              >
                {showPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
              </span>
            </div>

            <div className="login-options">
              <CommonCheckbox
                label="Remember me"
                checked={remember}
                onChange={setRemember}
              />
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="login-button"
              loading={isLoginPending}
            >
              Login
            </Button>

          </Form>
        </Formik>

      </Card>
    </div>
  );
};

export default Login;
