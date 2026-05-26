import { Formik, Form, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store";
import { Mutations } from "../../Api";
import { ResetPasswordSchema } from "../../Utils";
import { CommonButton } from "../../Attribute";
import { CommonInput } from "../../Attribute/FormFields/CommonTextField"; // use same component as login
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
    userId: user?._id || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const handleSubmit = async ( values: ResetPasswordPayload, { resetForm }: FormikHelpers<ResetPasswordPayload>, ) => {
    await resetPassword(values, {
      onSuccess: () => {
        resetForm();
        navigate(-1);
      },
    });
  };
  return (
    <div className="space-y-6">
      <CommonBreadcrumbs title="Change Password" breadcrumbs={BREADCRUMBS.CHANGE_PASSWORD.BASE} />
      <CommonCard className="p-0">
        <div className="password-card-wrapper">
          <div className="password-profile-header">
            <div className="password-avatar"> {user?.name?.charAt(0)?.toUpperCase()} </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted">{user?.email}</p>
            </div>
            <span className="password-role-badge">{user?.role}</span>
          </div>
          <Formik enableReinitialize initialValues={initialValues} validationSchema={ResetPasswordSchema} onSubmit={handleSubmit} >
            {({ dirty }) => (
              <Form noValidate className="password-form-container">
                <div className="password-form-fields">
                  <CommonInput name="oldPassword" type="password" label="Old Password" required showPasswordToggle className="border border-red" />
                  <CommonInput name="newPassword" label="New Password" type="password" required showPasswordToggle />
                  <CommonInput name="confirmPassword" label="Confirm Password" type="password" required showPasswordToggle />
                </div>
                <CommonBottomActionBar>
                  <div className="password-actions">
                    <CommonButton variant="ghost" onClick={() => navigate(-1)} title="Cancel" />
                    <CommonButton htmlType="submit" type="primary" title="Save" loading={isLoading} disabled={!dirty} />
                  </div>
                </CommonBottomActionBar>
              </Form>
            )}
          </Formik>
        </div>
      </CommonCard>
    </div>
  );
};

export default ChangePassword;