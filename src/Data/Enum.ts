export const PROFILE_FIELDS = [
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "mobileNumber", label: "Phone" },
    { name: "username", label: "Username" },
    { name: "websiteName", label: "Website Name" },
    { name: "websiteUrl", label: "Website URL" },
    { name: "payinCallbackUrl", label: "Payin Callback URL" },
    { name: "payoutCallbackUrl", label: "Payout Callback URL" },
];

export const PROFILE_SECTIONS = [
    {
        title: "Basic Info",
        fields: ["name", "email", "mobileNumber", "username"],
    },
    {
        title: "Website Info",
        fields: ["websiteName", "websiteUrl"],
    },
    {
        title: "Callbacks",
        fields: ["payinCallbackUrl", "payoutCallbackUrl"],
    },
];

export const GATEWAYS = [
    {
        key: "cashfree",
        name: "Cashfree",
        logo: "/assets/image/payment-gateway/Cashfree_logo.svg",
        desc: "UPI • Cards • Net Banking",
        badge: "Active",
    },
    {
        key: "razorpay",
        name: "Razorpay",
        logo: "/assets/image/payment-gateway/Razorpay_logo.svg",
        desc: "Cards • UPI • Wallets",
    },
    {
        key: "phonepe",
        name: "PhonePe",
        logo: "/assets/image/payment-gateway/PhonePe_logo.svg",
        desc: "UPI Payments",
    },
    {
        key: "payu",
        name: "PayU",
        logo: "/assets/image/payment-gateway/PayU_logo.svg",
        desc: "Cards • UPI",
    },
    {
        key: "paytm",
        name: "Paytm",
        logo: "/assets/image/payment-gateway/Paytm_logo.svg",
        desc: "Wallet • UPI",
    },
    {
        key: "stripe",
        name: "Stripe",
        logo: "/assets/image/payment-gateway/Stripe_logo.svg",
        desc: "International Cards",
    },
    {
        key: "ccavenue",
        name: "CCAvenue",
        logo: "/assets/image/payment-gateway/CCAvenue_logo.png",
        desc: "All India Payments",
    },
];