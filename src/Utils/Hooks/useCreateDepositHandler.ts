import { handlePayment } from "../../Components/Payment/Gateways";

export const useCreateDepositHandler = ({ users, currentUser, createDeposit, toast, data }: any) => {
    return () => {
        const selectedUser = users.find((user: any) => user._id === data.userId || user.id === data.userId );
        const activeGateway = String(data.gateway || "cashfree").toLowerCase();
        const payload: any = {};
        if (activeGateway === "stripe") {
          const stripeAmount = Math.round(Number(data.amount) * 1);
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
        payload.returnUrl =
          activeGateway === "phonepe"
            ? `${window.location.origin}/payment-success`
            : `${window.location.origin}/transaction/all`;
        payload.gateway = activeGateway;
        payload.apiKey = selectedUser?.apiKey || currentUser?.apiKey || "";
        payload.secretKey = selectedUser?.secretKey || currentUser?.secretKey || "";
        payload.orderId = "ORD" + Date.now();
        console.log('Submitting payload for', activeGateway, payload);
        createDeposit(payload, {
            onSuccess: async (res: any) => {
                const dataRes = res?.data;
                if (!dataRes) {
                    toast.error("Error", "No response from payment gateway.");
                    return;
                }
                const sessionData = dataRes?.paymentSession || dataRes;
                const razorpayOrderId = dataRes?.orderId || dataRes?.paymentSession?.id;
                console.log("FULL BACKEND RESPONSE:", dataRes);
                if (activeGateway === "razorpay" && !razorpayOrderId) {
                    console.error("Razorpay order id missing in response", dataRes);
                }
                localStorage.setItem(
                    "paymentSession",
                    JSON.stringify({
                        orderId: dataRes?.orderId || payload.orderId,
                        traId: dataRes?.traId,
                        gateway: activeGateway,
                        merchantTransactionId: dataRes?.merchantTransactionId || sessionData?.merchantTransactionId,
                    })
                );
                await handlePayment(activeGateway, {
                    response: {
                        ...sessionData,
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
