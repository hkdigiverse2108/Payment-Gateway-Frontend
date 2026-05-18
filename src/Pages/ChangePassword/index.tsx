import { Formik, Form, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store";
import { Mutations } from "../../Api";
import { ResetPasswordSchema } from "../../Utils";
import { CommonButton, CommonInput } from "../../Attribute";
import type { ResetPasswordPayload } from "../../Types";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import CommonCard from "../../Components/Common/CommonCard";
import CommonBottomActionBar from "../../Components/Common/CommonBottomActionBar";

const ChangePassword = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { mutate: resetPassword, isPending: isLoading } = Mutations.useResetPassword();
  const navigate = useNavigate();
  const initialValues: ResetPasswordPayload = {
    userId: user?.userId || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  };
  const handleSubmit = async ( values: ResetPasswordPayload, { resetForm }: FormikHelpers<ResetPasswordPayload> ) => {
    await resetPassword(values, { onSuccess: () => { resetForm(); navigate(-1); }});
  };
  return (
    <div className="change-password-page">
      <CommonBreadcrumbs title="Change Password" breadcrumbs={BREADCRUMBS.CHANGE_PASSWORD.BASE} />
      <div className="change-password-layout">
        <div className="change-password-card">
          <div className="change-password-profile">
            <div className="avatar">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="name"> {user?.name} </p>
              <p className="email"> {user?.email} </p>
            </div>
            <div className="role"> {user?.role} </div>
          </div>
          <Formik<ResetPasswordPayload> enableReinitialize initialValues={initialValues} validationSchema={ResetPasswordSchema} onSubmit={handleSubmit}>
             {({ dirty }) => (
               <Form noValidate>
                 <div className="flex justify-center">
                   <div className="w-full md:w-8/12 lg:w-6/12">
                     <CommonCard title="Change Password" >
                       <div className="p-4 flex flex-col gap-4">
                         <CommonInput name="oldPassword" label="Old Password" type="password" />
                         <CommonInput name="newPassword" label="New Password" type="password" />
                         <CommonInput name="confirmPassword" label="Confirm Password" type="password" />
                       </div>
                     </CommonCard>
                     <CommonBottomActionBar>
                       <div className="flex gap-2 ml-auto">
                         <CommonButton variant="outlined" onClick={() => navigate(-1)} title="Cancel" />
                         <CommonButton htmlType="submit" type="primary" title="Save" loading={isLoading} disabled={!dirty} />
                       </div>
                     </CommonBottomActionBar>
                   </div>
                 </div>
               </Form>
             )}
           </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;