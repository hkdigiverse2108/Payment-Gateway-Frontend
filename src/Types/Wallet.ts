import type { PageState, CommonDataType, MessageStatus, PageStatus } from "./Common";

export interface WalletActivityBase extends CommonDataType {
    userId: string;
    transactionId?: string;

    type: "credit" | "debit" | string;

    amount: number;
    previousBalance: number;
    newBalance: number;

    description?: string;
    brand?: string;
}

export interface WalletActivityDataResponse extends PageStatus {
    data: WalletActivityBase[];
    totalData: number;
    stats?: {
        totalActivities: number;
        totalCredits: number;
        totalDebits: number;
    };
    state: PageState;
}

export interface WalletActivityApiResponse extends MessageStatus {
    data: WalletActivityDataResponse;
}

export interface WalletActivityDetailResponse extends MessageStatus {
    data: {
        data: WalletActivityBase;
    };
}

export interface WalletActivityFormValues {
    userId?: string;
    transactionId?: string;
    type?: "credit" | "debit";
    amount?: number;
    description?: string;
    brand?: string;
}
export interface WalletBalanceResponse {
    data: {
        walletBalance: number;
    };
}