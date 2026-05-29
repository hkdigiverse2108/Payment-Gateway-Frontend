import { Building2, Globe2, Mail, Phone, User, WalletCards } from "lucide-react";
import type { FieldSection } from "../Types";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

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
        badge: "Active",
    },
    {
        key: "phonepe",
        name: "PhonePe",
        logo: "/assets/image/payment-gateway/PhonePe_logo.svg",
        desc: "UPI Payments",
        badge: "Active",
    },
    {
        key: "payu",
        name: "PayU",
        logo: "/assets/image/payment-gateway/PayU_logo.svg",
        desc: "Cards • UPI",
        badge: "Active",
    },
    {
        key: "paytm",
        name: "Paytm",
        logo: "/assets/image/payment-gateway/Paytm_logo.svg",
        desc: "Wallet • UPI",
        badge: "Active",
    },
    {
        key: "stripe",
        name: "Stripe",
        logo: "/assets/image/payment-gateway/Stripe_logo.svg",
        desc: "International Cards",
        badge: "Active",
    },
    {
        key: "ccavenue",
        name: "CCAvenue",
        logo: "/assets/image/payment-gateway/CCAvenue_logo.png",
        desc: "All India Payments",
    },
];


export const profileSections: FieldSection[] = [
    {
        title: "Basic Information",
        description: "Account identity and contact details.",
        icon: User,
        fields: [
            { name: "name", label: "Full Name", icon: User },
            { name: "email", label: "Email", type: "email", icon: Mail },
            { name: "mobileNumber", label: "Mobile", icon: Phone },
            { name: "username", label: "Username", icon: User, prefix: "@" },
        ],
    },
    {
        title: "Website Settings",
        description: "Merchant website information used around payments.",
        icon: Globe2,
        fields: [
            { name: "websiteName", label: "Website Name", icon: Building2 },
            { name: "websiteUrl", label: "Website URL", icon: Globe2 },
        ],
    },
    {
        title: "Payment Settings",
        description: "Callback endpoints for transaction updates.",
        icon: WalletCards,
        fields: [
            { name: "payinCallbackUrl", label: "Payin Callback URL", icon: WalletCards },
            { name: "payoutCallbackUrl", label: "Payout Callback URL", icon: WalletCards },
        ],
    },
];


export const statusStyles = {
    success: {
        label: "SUCCESS",
        icon: CheckCircle2,
        text: "text-emerald-700 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/20",
        border: "border-emerald-100 dark:border-emerald-900/30",
        ring: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    pending: {
        label: "PENDING",
        icon: Clock3,
        text: "text-amber-700 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/20",
        border: "border-amber-100 dark:border-amber-900/30",
        ring: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    failed: {
        label: "FAILED",
        icon: XCircle,
        text: "text-rose-700 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-950/20",
        border: "border-rose-100 dark:border-rose-900/30",
        ring: "bg-rose-500/10 dark:bg-rose-500/20",
    },
};

