import { load } from "@cashfreepayments/cashfree-js";

export const handleCashfree = async ({ response, traId, payload }: any) => {
    const session = response?.paymentSession;
    const sessionId = session?.payment_session_id || response?.payment_session_id;
    const cashfreeOrderId = session?.order_id || response?.order_id;
    const statusOrderId = traId || cashfreeOrderId || payload?.orderId;

    if (!sessionId) {
        console.error("Missing Cashfree Session ID");
        return;
    }

    const cashfree = await load({ mode: "sandbox" });

    cashfree.checkout({
        paymentSessionId: sessionId,
        returnUrl: `${window.location.origin}/transaction/all?order_id=${encodeURIComponent(statusOrderId)}${cashfreeOrderId ? `&cashfree_order_id=${encodeURIComponent(cashfreeOrderId)}` : ""}`,
        redirectTarget: "_self",
    });
};
