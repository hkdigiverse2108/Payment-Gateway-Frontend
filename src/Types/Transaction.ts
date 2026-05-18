import type { CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface TransactionFormValues {
    orderId?: string;
    amount?: number;
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
    amount: number;
    status: string;
    paymentStatus: string;
    utr?: string;
    brand?: string;
    userId?: string;
    metadata?: {
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
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