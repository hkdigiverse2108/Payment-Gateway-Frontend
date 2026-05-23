import { handlePayment } from "../../Components/Payment/Gateways";


export const useCreateDepositHandler = ({
    users,
    currentUser,
    createDeposit,
    toast,
    data,
}: any) => {
    return () => {
        const selectedUser = users.find(
            (u: any) => u._id === data.userId || u.id === data.userId
        );

        const activeGateway = String(data.gateway || "cashfree").toLowerCase();

        const payload: any = {};
        // Amount handling – Stripe requires amount in the smallest currency unit (paise)
        if (activeGateway === "stripe") {
          const stripeAmount = Math.round(Number(data.amount) * 100);
          if (isNaN(stripeAmount) || stripeAmount < 50) {
            toast.error("Amount must be at least 0.5 INR (50 paise) and a valid number");
            return;
          }
          payload.amount = stripeAmount;
        } else {
          const amt = Number(data.amount);
          if (isNaN(amt) || amt <= 0) {
            toast.error("Please enter a valid amount");
            return;
          }
          payload.amount = amt;
        }
        payload.customerName = data.customerName;
        payload.customerPhone = String(data.customerPhone);
        payload.customerEmail = data.customerEmail;
        payload.returnUrl = `${window.location.origin}/transaction/all`;
        payload.gateway = activeGateway;
        payload.apiKey = selectedUser?.apiKey || currentUser?.apiKey || "";
        payload.secretKey = selectedUser?.secretKey || currentUser?.secretKey || "";

        payload.orderId = "ORD" + Date.now();

        console.log('🔎 Submitting payload for', activeGateway, payload);
        createDeposit(payload, {
            onSuccess: async (res: any) => {
                const dataRes = res?.data;

                if (!dataRes) {
                    toast.error("Error", "No response from payment gateway.");
                    return;
                }
                const sessionData = dataRes?.paymentSession || dataRes;
                // Use orderId from response for Razorpay, fallback to paymentSession.id if needed
                const razorpayOrderId = dataRes?.orderId || dataRes?.paymentSession?.id;
                console.log("FULL BACKEND RESPONSE:", dataRes);

                if (activeGateway === "razorpay" && !razorpayOrderId) {
                    console.error("Razorpay order id missing in response", dataRes);
                }

                // Store correct orderId for later use
                localStorage.setItem(
                    "paymentSession",
                    JSON.stringify({
                        orderId: dataRes?.orderId || dataRes?.traId,
                        traId: dataRes?.traId,
                        gateway: activeGateway,
                    })
                );

                await handlePayment(activeGateway, {
                    response: {
                        ...sessionData,
                        // Preserve the original paymentSession object for gateways that need it (e.g., Razorpay)
                        paymentSession: sessionData,
                    },
                    toast,
                    data,
                    payload,
                    traId: dataRes.traId,
                });
            },
            onError: () => {
                toast.error("Payment failed", "Something went wrong.");
            },
        });
    };
};