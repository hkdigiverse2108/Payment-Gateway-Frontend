import { load } from "@cashfreepayments/cashfree-js";

export const handleCashfree = async ({ response, traId, payload }: any) => {
    const session = response?.paymentSession;
    const sessionId = session?.payment_session_id || response?.payment_session_id;

    if (!sessionId) {
        console.error("Missing Cashfree Session ID");
        return;
    }

    const cashfree = await load({ mode: "sandbox" });

    cashfree.checkout({
        paymentSessionId: sessionId,
        returnUrl: `${window.location.origin}/transaction/all?order_id=${payload?.orderId || traId}`,
        redirectTarget: "_self",
    });
};