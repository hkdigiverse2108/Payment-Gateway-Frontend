export const handlePhonePe = async ({ response }: any) => {
    console.log("PhonePe Handler Received:", response);
    const redirectUrl = response?.redirectUrl;

    if (!redirectUrl) {
        console.error("PhonePe Error: redirectUrl is missing in the response object.");
        alert("Payment initiation failed: No redirect URL received.");
        return;
    }
    window.location.href = redirectUrl;
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id") || response?.orderId;
    if (orderId) {
        // Small delay to allow backend processing
        setTimeout(async () => {
            try {
                const apiBase = import.meta.env.VITE_API_BASE_URL || "";
                const res = await fetch(`${apiBase}/transaction/status?order_id=${orderId}`);
                const data = await res.json();
                console.log("PhonePe status after return:", data);
            } catch (e) {
                console.error("Failed to fetch PhonePe transaction status:", e);
            }
        }, 2000);
    }
};