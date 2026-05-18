import { useRef, useState } from "react";
import { Steps } from "antd";
import Gateway from "../../Components/Transaction/CreateDeposit/Gateway";
import DetailsForm from "../../Components/Transaction/CreateDeposit/DetailsForm";
import Review from "../../Components/Transaction/CreateDeposit/Review";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { CommonButton } from "../../Attribute";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { Mutations, Queries } from "../../Api";
import { load } from "@cashfreepayments/cashfree-js";
import { useAppSelector } from "../../Store";

const STEPS = [{ title: "Gateway" }, { title: "Details" }, { title: "Review" }];
const CreateDeposit = () => {
  const [step, setStep] = useState(0);
  const currentUser = useAppSelector((state) => state.auth.user);
  const formRef = useRef<any>(null);
  const { data: userData } = Queries.useGetUser();
  const users = userData?.data?.data || [];
  const { mutate: createDeposit } = Mutations.useCreateDeposit();
  const [data, setData] = useState({ gateway: "", amount: "", customerName: "", customerPhone: "", customerEmail: "", userId: "" });
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const next = () => step === 1 ? formRef.current?.submitForm() : setStep((s) => Math.min(s + 1, 2));
  const onGatewaySelect = (gateway: string) => (setData((p) => ({ ...p, gateway })), setStep(1));
  const onDetailsSubmit = (values: any) => (setData((p) => ({ ...p, ...values })), setStep(2));
  const onConfirm = () => {
    const payload = {
      // userId: data.userId,
    amount: Number(data.amount),
    customerName: data.customerName,
    customerPhone: String(data.customerPhone),
      customerEmail: data.customerEmail,
    // gateway: data.gateway,
    orderId: "ORD" + Date.now(),
    returnUrl: `${window.location.origin}/payment-status`,
    notifyUrl: window.location.origin + "/notify",
  };
  
  createDeposit(payload, {
    onSuccess: async (res) => {
      const session = res?.cashfreeSession;

      if (!session?.payment_session_id) {
        console.error("Invalid session response", res);
        return;
      }

      const cashfree = await load({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: session.payment_session_id,
        redirectTarget: "_self"
      });
    },
    onError: (err) => {
      console.error("ERROR →", err);
    },
  });
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.PAYIN} maxItems={1} breadcrumbs={BREADCRUMBS.TRANSACTIONS.PAYIN} />
      <div className="deposit-page rounded-md">
        <div className="deposit-header">
          <Steps current={step} items={STEPS} size="small" />
        </div>
        <div className="deposit-body">
          <div className="deposit-container">
            <div className="deposit-card">
              {step === 0 && <Gateway selected={data.gateway} onSelect={onGatewaySelect} users={users} isAdmin={currentUser?.role === "admin"}  />}
              {step === 1 && <DetailsForm ref={formRef} initialValues={data} onNext={onDetailsSubmit} users={users} isAdmin={currentUser?.role === "admin"} />}
              {step === 2 && <Review data={data} />}
            </div>
          </div>
        </div>
        <div className="deposit-footer">
          <CommonButton disabled={step === 0} onClick={back}>Back</CommonButton>
          {step < 2 ? (
            <CommonButton onClick={next}>Continue</CommonButton>
          ) : (
            <CommonButton type="primary" onClick={onConfirm}>Confirm & Pay</CommonButton>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateDeposit;