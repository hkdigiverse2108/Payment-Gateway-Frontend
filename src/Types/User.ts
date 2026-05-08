import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface UserFormValues {
    userId?: string;
    name: string;
    email: string;
    mobileNumber: number;
    // userName?: string;
    userName: string;
    password?: string;
    websiteName?: string;
    websiteUrl?: string;
    payinCallbackUrl?: string;
    payoutCallbackUrl?: string;
    isActive?: boolean;
    _submitAction?: string;
}

export type AddUserPayload = UserFormValues;

export type UpdateUserPayload = Omit<UserFormValues, "mobileNumber" | "username"> & {
    mobileNumber: number;
};

export type UserBase = UserFormValues & CommonDataType;

export interface UserDataResponse extends PageStatus {
    user_data: UserBase[];
}

// export interface UserApiResponse extends MessageStatus {
//     data: UserBase;
// }

export interface UserApiResponse extends MessageStatus {
    data: {
        data: UserBase[];
        totalData: number;
        state: {
            page: number;
            limit: number;
            skip: number;
            hasLimit: boolean;
        };
    };
}

