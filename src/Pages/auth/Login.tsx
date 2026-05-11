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
  <div className="login-main">
    <div className="login-container">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-logo">PG</div>
          <h2>Welcome Back To Payment Gateway</h2>
          <p>
            Secure access to your dashboard. Manage transactions, monitor activity,
            and keep your data protected with our encrypted system.
          </p>
          <span className="login-footer-text">
            Need help accessing your account? <b>Contact Support</b>
          </span>
        </div>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Log In</h2>
          <p>Hello There !</p>
          <Formik initialValues={{ identifier: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit} >
              <Form className="login-form">
                <CommonInput name="identifier" placeholder="Enter your Email or Username" required />
                <CommonInput name="password" type="password" placeholder="Enter your password" required showPasswordToggle clearable />
                <CommonCheckbox label="Remember Me" checked={remember} onChange={setRemember} />
                <Button type="primary" htmlType="submit" block loading={isPending} className="login-btn" >
                  Log In
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