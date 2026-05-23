export const handlePaytm = ({ response }: any) => {
    const { txnToken, redirectUrl, merchantId, merchantTransactionId } = response;

    if (!redirectUrl || !txnToken || !merchantId) {
        console.error("Paytm: Missing required parameters", { txnToken, redirectUrl, merchantId });
        return;
    }
    const form = document.createElement("form");
    // Ensure redirectUrl includes a protocol; if missing, prepend current origin
    const resolvedRedirectUrl = redirectUrl && !/^https?:\/\//i.test(redirectUrl) ? `${window.location.origin}${redirectUrl.startsWith('/') ? '' : '/'}${redirectUrl}` : redirectUrl;
    form.action = resolvedRedirectUrl;
    form.style.display = "none"; // Hide the form
    const fields: Record<string, string> = {
        mid: merchantId,
        orderId: merchantTransactionId,
        txnToken: txnToken,
    };

    Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });
    document.body.appendChild(form);
    setTimeout(() => {
        form.submit();
    }, 50);
};