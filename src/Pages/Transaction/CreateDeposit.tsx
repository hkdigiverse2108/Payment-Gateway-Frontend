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
import { useAppSelector } from "../../Store";
import { CreditCard, UserCheck, ShieldCheck, ArrowLeft, ArrowRight, } from "lucide-react";
import { useToast } from "../../Components/Common/ToastProvider";
import { useCreateDepositHandler } from "../../Utils/Hooks/useCreateDepositHandler";

const stepItems = [
  { title: "Gateway", icon: <CreditCard className="w-4 h-4" /> },
  { title: "Billing Details", icon: <UserCheck className="w-4 h-4" /> },
  { title: "Review & Pay", icon: <ShieldCheck className="w-4 h-4" /> },
];

const CreateDeposit = () => {
  const toast = useToast();
  useEffect(() => { localStorage.removeItem("selectedUserKeys");}, []);
  const [step, setStep] = useState(0);
  const formRef = useRef<any>(null);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: userData } = Queries.useGetUser();
  const users = userData?.data?.data || [];
  const { mutate: createDeposit } = Mutations.useCreateDeposit();
  const [data, setData] = useState({ gateway: "", amount: "", customerName: "", customerPhone: "", customerEmail: "", userId: "" });
  const [clientSecret] = useState<string | null>(null);
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const next = () => {
    if (step === 1) formRef.current?.submitForm();
    else setStep((s) => Math.min(s + 1, 2));
  };
  const onGatewaySelect = (gateway: string) => {
    setData((prev) => ({ ...prev, gateway }));
    setStep(1);
  };
  const onDetailsSubmit = (values: any) => {
    setData((prev) => ({ ...prev, ...values }));
    setStep(2);
  };
  const onConfirm = useCreateDepositHandler({ users, currentUser, createDeposit, toast, data });
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade">
      <CommonBreadcrumbs title={PAGE_TITLE.TRANSACTIONS.PAYIN} maxItems={1} breadcrumbs={BREADCRUMBS.TRANSACTIONS.PAYIN} />
      <div className="bg-surface border border-border/20 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        <div className="max-w-xl mx-auto px-4">
          <Steps current={step} items={stepItems} size="small" />
        </div>
        {!clientSecret && (
          <div className="min-h-[320px] py-4">
            {step === 0 && (
              <Gateway selected={data.gateway} onSelect={onGatewaySelect} users={users} isAdmin={currentUser?.role === "admin"} />
            )}
            {step === 1 && (
              <DetailsForm ref={formRef} initialValues={data} onNext={onDetailsSubmit} users={users} isAdmin={currentUser?.role === "admin"} />
            )}
            {step === 2 && <Review data={data} />}
          </div>
        )}
        {!clientSecret && (
          <div className="flex justify-between items-center pt-6 border-t border-border/10">
            <CommonButton disabled={step === 0} onClick={back} variant="ghost" icon={<ArrowLeft className="w-4 h-4" />} > Back </CommonButton>
            {step < 2 ? (
              <CommonButton onClick={next} variant="primary" icon={<ArrowRight className="w-4 h-4" />} >
                Continue
              </CommonButton>
            ) : (
              <CommonButton onClick={onConfirm} variant="primary" className="bg-brand-500 hover:bg-brand-600 text-white font-bold h-11 px-6 rounded-xl" >
                {data.gateway === "stripe" ? "Proceed to Payment" : "Confirm & Pay"}
              </CommonButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDeposit;