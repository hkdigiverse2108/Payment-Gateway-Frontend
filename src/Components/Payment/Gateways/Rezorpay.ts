import { Post } from "../../../Api/Method";
import { URL_KEYS } from "../../../Constants";

const RAZORPAY_TEST_KEY_ID = "rzp_test_SnfSml2XYuupia";

const getRazorpayKeyId = (...keys: unknown[]) =>
    keys.find((key) => typeof key === "string" && key.startsWith("rzp_")) as string | undefined;

export const handleRazorpay = async ({ response, payload, data, toast }: any) => {
    const activeKey = getRazorpayKeyId(
        response?.razorpayKeyId,
        response?.keyId,
        import.meta.env.VITE_RAZORPAY_KEY_ID,
        RAZORPAY_TEST_KEY_ID
    );

    if (!activeKey) {
        toast.error("Razorpay key missing");
        return;
    }
    console.log("FULL RESPONSE:", response);
    console.log("ORDER IDS:", {
        paymentSessionId: response?.paymentSession?.id,
        gatewayOrderId: response?.gatewayOrderId,
        razorpayOrderId: response?.razorpayOrderId,
        orderId: response?.orderId,
        payloadOrderId: payload?.orderId,
    });
    const rawOrderId =
        response?.id ||
        response?.razorpayOrderId ||
        response?.paymentSession?.id ||
        response?.gatewayOrderId;

    if (!rawOrderId) {
        console.error("Missing Razorpay order id");
        return;
    }

    const options: any = {
        key: activeKey,
        amount: Number(data.amount) * 100,
        currency: "INR",
        name: "Deposit Payment",
        prefill: {
            name: data.customerName,
            email: data.customerEmail,
            contact: data.customerPhone,
        },
        handler: async function (res: any) {
            try {
                await Post(
                    URL_KEYS.TRANSACTION.VERIFY_RAZORPAY,
                    {
                        razorpay_payment_id: res.razorpay_payment_id,
                        razorpay_order_id: res.razorpay_order_id,
                        razorpay_signature: res.razorpay_signature,
                        apiKey: payload.apiKey,
                        secretKey: payload.secretKey,
                    },
                    true,
                    true
                );

                toast.success("Payment verified");
            } catch (err) {
                console.error("Verification failed:", err);
                toast.error("Verification failed");
            } finally {
                window.location.href = `${window.location.origin}/transaction/all?order_id=${payload.orderId}`;
            }
        },
    };

    // Set order_id only if we have a valid Razorpay order id (starts with "order_")
    if (rawOrderId && rawOrderId.startsWith('order_')) {
      options.order_id = rawOrderId;
    } else {
      console.warn('Razorpay order_id not provided or invalid; proceeding without it');
    }

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
};