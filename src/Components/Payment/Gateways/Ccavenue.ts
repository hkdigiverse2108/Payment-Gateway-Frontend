export const handleCCAvenue = ({ response }: any) => {
    const { encRequest, access_code, action } = response;

    console.log("CCAvenue submit:", response);

    if (!encRequest || !access_code || !action) {
        console.error("CCAvenue missing fields", response);
        alert("CCAvenue payment initialization failed");
        return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.target = "_self";

    const addField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    };

    addField("encRequest", encRequest);
    addField("access_code", access_code);

    document.body.appendChild(form);
    form.submit();
};