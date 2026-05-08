import * as Yup from "yup";
import { Validation } from "./Validation";

//Login
export const LoginSchema = Yup.object({
    identifier: Validation("string", "Email or Username"),
    password: Validation("string", "Password", {
        extraRules: (s) =>
            s.matches(
                /[!@#$%^&*()_+={}:;"'<>,.?/-]/,
                "Password must include at least one special character"
            ),
    }),
});
//verfyOTP
export const VerifyOtpSchema = Yup.object({
    otp: Validation("string", "OTP", {
        extraRules: (s) => s.trim().length(6, "OTP must be 6 digits"),
    }),
});
//Reset Password
export const ResetPasswordSchema = Yup.object({
    oldPassword: Validation("string", "Old Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    newPassword: Validation("string", "New Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    confirmPassword: Validation("string", "Confirm Password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm Password is required"),
});
//Change Password
export const ChangePasswordSchema = Yup.object({
    email: Validation("string", "Email", {
        required: true,
        extraRules: (s) => s.trim().email("Invalid email address"),
    }),
    oldPassword: Validation("string", "Old Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    newPassword: Validation("string", "New Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    confirmPassword: Validation("string", "Confirm Password", {
        extraRules: (s) => s.oneOf([Yup.ref("newPassword")], "Passwords must match").required("Confirm Password is required"),
    }),
});
//profile
export const UserSchema = Yup.object({
    name: Validation("string", "First Name", { required: false }),
    email: Validation("string", "Email", {
        required: true,
        extraRules: (s) => s.trim().email("Invalid email address"),
    }),
    // mobileNumber: PhoneValidation(),
    username: Validation("string", "User Name", { required: false }),
    websiteName: Validation("string", "Website Name", { required: false }),
    websiteUrl: Validation("string", "Website Url", { required: false }),
    payinCallbackUrl: Validation("string", "Payin Callback Url", { required: false }),
    payoutCallbackUrl: Validation("string", "Pauout Callback Url", { required: false }),
});