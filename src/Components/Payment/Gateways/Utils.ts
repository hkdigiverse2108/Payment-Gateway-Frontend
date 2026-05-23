export const submitPaymentForm = (action: string, fields: Record<string, unknown>) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.target = "_self";
    form.acceptCharset = "UTF-8";
    form.style.display = "none";

    Object.entries(fields).forEach(([name, value]) => {
        if (value === undefined || value === null || name === "action") return;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = String(value);
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
};

export const getMissingPayUFields = (fields: Record<string, unknown>) =>
    ["key", "txnid", "amount", "productinfo", "firstname", "email", "phone", "surl", "furl", "hash"]
        .filter((field) => !fields[field]);