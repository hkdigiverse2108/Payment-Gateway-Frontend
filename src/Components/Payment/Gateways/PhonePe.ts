export const handlePhonePe = ({ response }: any) => {
    const redirectUrl = response?.redirectUrl;
    if (!redirectUrl) {
        alert("Payment initiation failed");
        return;
    }

    const merchantTransactionId =
        response?.merchantTransactionId ||
        response?.merchantOrderId ||
        response?.merchant_transaction_id;
    const orderId = response?.orderId || response?.order_id;
    const transactionId = response?.transactionId || response?.transaction_id;

    if (merchantTransactionId) {
        localStorage.setItem(
            "phonePePendingPayment",
            JSON.stringify({
                merchantTransactionId,
                orderId,
                transactionId,
                createdAt: Date.now(),
            })
        );
    }

    window.location.assign(redirectUrl);
};
