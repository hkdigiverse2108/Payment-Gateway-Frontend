import { submitPaymentForm, getMissingPayUFields } from "./Utils";

export const handlePayU = ({ response, toast }: any) => {
    const payuSession =
        response?.paymentSession?.data ||
        response?.paymentSession ||
        response;

    const action =
        payuSession?.action ||
        `${import.meta.env.VITE_PAYU_BASE_URL || "https://test.payu.in"}/_payment`;

    const missingFields = getMissingPayUFields(payuSession);

    if (missingFields.length) {
        toast.error("PayU setup missing", missingFields.join(", "));
        return;
    }

    submitPaymentForm(action, payuSession);
};