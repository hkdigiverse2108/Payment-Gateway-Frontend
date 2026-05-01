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
}

export interface TransactionDataResponse extends PageStatus {
    data: TransactionBase[];
    totalData: number;
}

export interface TransactionApiResponse extends MessageStatus {
    data: TransactionDataResponse;
}