import { Formik, Form } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { CommonInput, CommonSelect } from "../../../Attribute";
import { CustDetailsSchema } from "../../../Utils";
import { useAppSelector } from "../../../Store";

const DetailsForm = forwardRef( ({ onNext, initialValues, users = [], isAdmin }: any, ref) => {
    const formikRef = useRef<any>(null);
    const currentUser = useAppSelector((state) => state.auth.user);
    useImperativeHandle(ref, () => ({ submitForm: () => formikRef.current?.submitForm(), }));
    return (
      <Formik innerRef={formikRef} enableReinitialize validationSchema={CustDetailsSchema} initialValues={{
          userId: currentUser.userId,
          amount: initialValues.amount || "",
          customerName: initialValues.customerName || (currentUser?.role === "user" ? currentUser.name : ""),
          customerPhone: initialValues.customerPhone || (currentUser?.role === "user" ? currentUser.mobileNumber : ""),
          customerEmail: initialValues.customerEmail || (currentUser?.role === "user" ? currentUser.email : ""), }}
        onSubmit={(vals) => onNext(vals)}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Payment Details</h2>
              <p className="text-sm text-gray-500">
                Live preview updates while typing
              </p>
            </div>
            <div className="border border-border/50 rounded-2xl p-4 bg-surface space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gateway</span>
                <span className="font-medium capitalize">
                  {initialValues.gateway || "-"}
                </span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                <span className="text-gray-500 text-sm">Amount</span>
                <span className="text-xl font-semibold"> ₹ {values.amount || 0} </span>
              </div>
            </div>
            <div className="space-y-4">
              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium mb-1"> Select Website / User </label>
                  <CommonSelect
                    value={values.userId || undefined}
                    options={users.map((user: any) => ({ label: user.websiteName || user.name, value: user._id, }))}
                    onChange={(val: any) => {
                      const selectedUser = users.find((u: any) => u._id === val);
                      setFieldValue("userId", val);
                      setFieldValue("customerName", selectedUser?.name || "");
                      setFieldValue("customerPhone", selectedUser?.mobileNumber || "");
                      setFieldValue("customerEmail", selectedUser?.email || "");
                      
                      if (selectedUser) {
                        localStorage.setItem("selectedUserKeys", JSON.stringify({
                          apiKey: selectedUser.apiKey || "",
                          secretKey: selectedUser.secretKey || ""
                        }));
                      } else {
                        localStorage.removeItem("selectedUserKeys");
                      }
                    }}
                    placeholder="Choose a website..."
                  />
                </div>
              )}
              <div className="text-xs uppercase tracking-wide text-gray-400"> Payment Info </div>
              <CommonInput name="amount" label="Amount" />
              <div className="text-xs uppercase tracking-wide text-gray-400 pt-2"> Customer Info </div>
              <div className="grid grid-cols-2 gap-4">
                <CommonInput name="customerName" label="Full Name" />
                <CommonInput name="customerPhone" label="Phone" />
                <div className="col-span-2">
                  <CommonInput name="customerEmail" label="Email" />
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
);

export default DetailsForm;