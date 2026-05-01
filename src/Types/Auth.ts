import type { CommonDataType, MessageStatus } from "./Common";

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface LoginPayload {
    userName: string;
    password: string;
}
export interface ChangePasswordPayload {
    email?: string;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}
// export interface User extends LoginPayload, CommonDataType {
//     fullName: string;
//     phoneNumber: string;
//     profileImage: string;
//     role: string;
// }

export interface User extends CommonDataType {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    role: string;
    isActive: boolean;
}
export interface LoginResponse extends MessageStatus {
    data: {
        token: string;
        user: User;
    };
}



export interface ResetPasswordPayload {
    userId: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword?: string;
}