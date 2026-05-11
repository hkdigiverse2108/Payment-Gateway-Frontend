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