import { handleCashfree } from "./Cashfree";
import { handleCCAvenue } from "./Ccavenue";
import { handlePaytm } from "./Paytm";
import { handlePayU } from "./Payu";
import { handlePhonePe } from "./PhonePe";
import { handleRazorpay } from "./Rezorpay";
import { handleStripe } from "./Stripe";

export const handlePayment = async (gateway: string, ctx: any) => {
    const { dataRes } = ctx;

    const session = dataRes?.paymentSession || dataRes;

    const commonCtx = {
        ...ctx,
        session,
    };

    switch (gateway) {
        case "cashfree":
            return handleCashfree(commonCtx);

        case "payu":
            return handlePayU(commonCtx);

        case "razorpay":
            return handleRazorpay(commonCtx);

        case "phonepe":
            return handlePhonePe(commonCtx);

        case "paytm":
            return handlePaytm(commonCtx);

        case "ccavenue":
            return handleCCAvenue(commonCtx);

        case "stripe":
            return handleStripe(commonCtx); 

        default:
            console.error("Unsupported gateway:", gateway);
    }
};