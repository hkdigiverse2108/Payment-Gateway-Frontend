import * as Yup from "yup";
import { Validation } from "./Validation";
import type { Primitive } from "../../Types";

export const RequiredWhen = (dependentField: string, requiredValues: Primitive[], label: string, type: "string" | "number" | "array" = "string", options?: { extraRules?: (schema: Yup.AnySchema) => Yup.AnySchema }) => {
    let schema: Yup.AnySchema;

    if (type === "number") schema = Yup.number();
    else if (type === "array") schema = Yup.array();
    else schema = Yup.string();

    if (options?.extraRules) schema = options.extraRules(schema);

    return schema.test("required-when", `${label} is required`, (value, { from }) => {
        const root = from?.[from.length - 1]?.value;
        const dependentValue = root?.[dependentField];
        const match = requiredValues.includes(dependentValue);

        if (match) {
            if (type === "array") return Array.isArray(value) && value.length > 0;
            if (type === "number") return value !== undefined && value !== null;
            return !!value;
        }

        return true;
    });
};

// Reusable helpers

export const PhoneValidation = (label = "Phone No", options?: { requiredCountryCode?: boolean; requiredNumber?: boolean }) =>
    Yup.object({
        countryCode: Validation("string", "Country code", {
            required: options?.requiredCountryCode ?? true,
        }),

        number: Validation("string", label, {
            required: options?.requiredNumber ?? true,
            extraRules: (s) => s.trim().matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
        }),
    });

//Login
export const LoginSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
    }),
    password: Validation("string", "Password", {
        extraRules: (s) => s.matches(/[!@#$%^&*()_+={}:;"'<>,.?/-]/, "Password must include at least one special character"),
    }),
});

//verfyOTP
export const VerifyOtpSchema = Yup.object({
    otp: Validation("string", "OTP", {
        extraRules: (s) => s.trim().length(6, "OTP must be 6 digits"),
    }),
});

//Forgot Password
export const ForgotPasswordSchema = Yup.object({
    email: Validation("string", "Email", {
        extraRules: (s) => s.email("Invalid email address"),
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
    userName: Validation("string", "User Name", { required: false }),
    websiteName: Validation("string", "Website Name", { required: false }),
    websiteUrl: Validation("string", "Website Url", { required: false }),
    payinCallbackUrl: Validation("string", "Payin Callback Url", { required: false }),
    payoutCallbackUrl: Validation("string", "Pauout Callback Url", { required: false }),
});