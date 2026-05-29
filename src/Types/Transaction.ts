import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface TransactionFormValues {
    _id?: string;
    orderId?: string;
    amount?: number;
    userId?: string;
    type?: string;
    status?: string;
    paymentStatus?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    returnUrl?: string;
    notifyUrl?: string;
    _submitAction?: string;
}
export interface TransactionBase extends CommonDataType {
    orderId: string;
    traId: string;
    type: string;
    gateway?: string;
    paymentMethod?: string;
    amount: number;
    status: string;
    paymentStatus: string;
    accountDetails?: {
        bankName?: string;
        accountNumber?: string;
        ifscCode?: string;
        accountHolderName?: string;
        branch?: string;
    };
    utr?: string;
    brand?: string;
    remarks?: string;
    rejectionReason?: string;
    isSandbox?: boolean;
    userId?: string;
    metadata?: {
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        [key: string]: unknown;
    };
}
export interface TransactionDataResponse extends PageStatus {
    data: TransactionBase[];
    totalData: number;
}
export interface TransactionApiResponse extends MessageStatus {
    data: TransactionDataResponse;
}

export interface CreateDepositResponse {
    orderId: string;
    traId: string;
    amount: number;
    cashfreeSession: {
        cf_order_id: string;
        payment_session_id: string;
        order_status: string;
    };
}
export interface CreateDepositPayload {
    orderId: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    returnUrl?: string;
    notifyUrl?: string;
    gateway?: string;
    apiKey?: string;
    secretKey?: string;
}

export interface VerifyPayuPayload {
    txnid: string;
}

export interface TransactionStatusData {
    orderId: string;
    traId: string;
    amount: number;
    status: string;
    paymentStatus: string;
    utr?: string;
}

export interface TransactionStatusResponse extends MessageStatus {
    data: TransactionStatusData;
}
