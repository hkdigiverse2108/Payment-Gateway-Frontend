export const handleStripe = ({ response, toast }: any) => {
    const url =
        response?.url ||
        response?.paymentSession?.url ||
        response?.data?.url;

    if (!url) {
        console.error("Stripe full response:", response); // 👈 debug
        toast.error("Stripe error", "Missing checkout URL");
        return;
    }

    window.location.href = url;
};