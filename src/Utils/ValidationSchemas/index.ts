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
    name: Validation("string", "Name"),
    email: Validation("string", "Email", {
        required: true,
        extraRules: (s) => s.trim().email("Invalid email address"),
    }),
    // mobileNumber: PhoneValidation(),
    username: Validation("string", "User Name"),
    password: Validation("string", "Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
    mobileNumber: Validation("string", "Mobile Number", {
        extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    }),
    websiteName: Validation("string", "Website Name"),
    websiteUrl: Validation("string", "Website Url", { required: true }),
    payinCallbackUrl: Validation("string", "Payin Callback Url", { required: true }),
    payoutCallbackUrl: Validation("string", "Payout Callback Url", { required: true }),
});

//payin customer deails form
export const CustDetailsSchema = Yup.object({
    amount: Yup.number()
        .typeError("Amount must be a number")
        .required("Amount is required")
        .min(1, "Minimum amount is 1"),

    customerName: Yup.string()
        .required("Name is required")
        .min(2, "Name is too short"),

    customerPhone: Yup.string()
        .required("Phone is required")
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit phone"),

    customerEmail: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
});