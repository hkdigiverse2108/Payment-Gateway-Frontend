import { useEffect, useRef, useState } from "react";
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
import { CreditCard, UserCheck, ShieldCheck, ArrowLeft, ArrowRight } from "lucide-react";

const CreateDeposit = () => {
  useEffect(() => {
    localStorage.removeItem("selectedUserKeys");
  }, []);

  const [step, setStep] = useState(0);
  const currentUser = useAppSelector((state) => state.auth.user);
  const formRef = useRef<any>(null);
  const { data: userData } = Queries.useGetUser();
  const users = userData?.data?.data || [];
  const { mutate: createDeposit } = Mutations.useCreateDeposit();
  
  const [data, setData] = useState({ 
    gateway: "", 
    amount: "", 
    customerName: "", 
    customerPhone: "", 
    customerEmail: "", 
    userId: "" 
  });

  const back = () => setStep((s) => Math.max(s - 1, 0));
  const next = () => step === 1 ? formRef.current?.submitForm() : setStep((s) => Math.min(s + 1, 2));
  
  const onGatewaySelect = (gateway: string) => {
    setData((p) => ({ ...p, gateway }));
    setStep(1);
  };

  const onDetailsSubmit = (values: any) => {
    setData((p) => ({ ...p, ...values }));
    setStep(2);
  };

  const onConfirm = () => {
    const selectedUser = users.find((u: any) => u._id === data.userId || u.id === data.userId) as any;
    const userStorage = JSON.parse(localStorage.getItem("user") || "null");
    const apiKey = selectedUser?.apiKey || userStorage?.apiKey || "";
    const secretKey = selectedUser?.secretKey || userStorage?.secretKey || "";

    const payload = {
      amount: Number(data.amount),
      customerName: data.customerName,
      customerPhone: String(data.customerPhone),
      customerEmail: data.customerEmail,
      orderId: "ORD" + Date.now(),
      returnUrl: `${window.location.origin}/payment-status`,
      notifyUrl: window.location.origin + "/notify",
      gateway: data.gateway || "cashfree",
      apiKey,
      secretKey,
    };
  
    createDeposit(payload, {
      onSuccess: async (res: any) => {
        const session = res?.data?.paymentSession || res?.cashfreeSession || res?.data;
        const sessionId = session?.payment_session_id;
        if (!sessionId) {
          console.error("Invalid session response", res);
          return;
        }
        const cashfree = await load({ mode: "sandbox" });
        cashfree.checkout({
          paymentSessionId: sessionId,
          redirectTarget: "_self"
        });
      },
      onError: (err) => {
        console.error("ERROR →", err);
      },
    });
  };

  const stepItems = [
    {
      title: "Gateway",
      icon: <CreditCard className={`w-4 h-4 ${step === 0 ? 'text-brand-500' : 'text-muted'}`} />
    },
    {
      title: "Billing Details",
      icon: <UserCheck className={`w-4 h-4 ${step === 1 ? 'text-brand-500' : 'text-muted'}`} />
    },
    {
      title: "Review & Pay",
      icon: <ShieldCheck className={`w-4 h-4 ${step === 2 ? 'text-brand-500' : 'text-muted'}`} />
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade">
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.PAYIN} maxItems={1} breadcrumbs={BREADCRUMBS.TRANSACTIONS.PAYIN} />
      
      {/* Sleek Container */}
      <div className="bg-surface border border-border/20 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        
        {/* AntD steps override */}
        <div className="max-w-xl mx-auto px-4">
          <Steps 
            current={step} 
            items={stepItems} 
            size="small" 
            className="custom-steps"
          />
        </div>

        {/* Form Body */}
        <div className="min-h-[320px] py-4">
          {step === 0 && (
            <Gateway 
              selected={data.gateway} 
              onSelect={onGatewaySelect} 
              users={users} 
              isAdmin={currentUser?.role === "admin"}  
            />
          )}
          {step === 1 && (
            <DetailsForm 
              ref={formRef} 
              initialValues={data} 
              onNext={onDetailsSubmit} 
              users={users} 
              isAdmin={currentUser?.role === "admin"} 
            />
          )}
          {step === 2 && <Review data={data} />}
        </div>

        {/* Stepper Footer Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-border/10">
          <CommonButton 
            disabled={step === 0} 
            onClick={back}
            variant="ghost"
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </CommonButton>

          {step < 2 ? (
            <CommonButton 
              onClick={next}
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </CommonButton>
          ) : (
            <CommonButton 
              onClick={onConfirm}
              variant="primary"
              className="bg-brand-500 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 text-white font-bold h-11 px-6 rounded-xl border-none transition-all"
            >
              Confirm & Pay
            </CommonButton>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreateDeposit;