import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { Form as AntForm, Row, Col } from "antd";
import { Formik, type FormikHelpers } from "formik";
import { Mutations } from "../../Api";
import type { UserFormValues } from "../../Types";
import { RemoveEmptyFields } from "../../Utils/FormHelpers";
import { UserSchema } from "../../Utils";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import CommonBottomActionBar from "../../Components/Common/CommonBottomActionBar";
import { CommonInput } from "../../Attribute/FormFields/CommonTextField";
import { CommonPhoneNumber, CommonValidationSwitch } from "../../Attribute";

const UserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.user;
  const { mutate: addUser, isPending: isAddLoading } = Mutations.useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useUpdateUser();
  const isEditing = Boolean(data?._id);
  const pageMode = isEditing ? "EDIT" : "ADD";
  const initialValues = useMemo(
    () => ({
      name: data?.name || "",
      email: data?.email || "",
      mobileNumber: data?.mobileNumber || "",
      username: data?.username || "",
      password: data?.password || "",
      websiteName: data?.websiteName || "",
      websiteUrl: data?.websiteUrl || "",
      payinCallbackUrl: data?.payinCallbackUrl || "",
      payoutCallbackUrl: data?.payoutCallbackUrl || "",
      isActive: data?.isActive ?? true,
    }),
    [data],
  );
  const handleSubmit = async (
    values: UserFormValues,
    { resetForm }: FormikHelpers<UserFormValues>
  ) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };
    const handleSuccess = () => {
      if (_submitAction === "saveAndNew") resetForm(); else navigate(-1); };
      if (isEditing) {
        await editUser(
          RemoveEmptyFields({ ...payload, userId: data._id, }) as UserFormValues,
          { onSuccess: handleSuccess}
        );
      } else {
        await addUser( RemoveEmptyFields(payload) as UserFormValues, {onSuccess: handleSuccess} );
      }
};
  return (
    <>
      <CommonBreadcrumbs  title={PAGE_TITLE.USERS[pageMode]} maxItems={3} breadcrumbs={BREADCRUMBS.USERS[pageMode]} />
      <div style={{ padding: 24, backgroundColor: "var(--surface)"}} className="rounded-md">
        <Formik<UserFormValues> enableReinitialize initialValues={initialValues} validationSchema={UserSchema} onSubmit={handleSubmit} >
          {({ setFieldValue, resetForm, dirty, submitForm }) => {
            return (
                <AntForm layout="vertical">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <CommonInput name="name" label="Name" placeholder="Enter name" required />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonInput name="username" label="User Name" placeholder="Enter username" required />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonPhoneNumber name="mobileNumber" label="Mobile Number"  required />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonInput name="email" label="Email" type="email" placeholder="Enter email" required />
                    </Col>
                    {!isEditing && (
                      <Col xs={24} sm={12}>
                        <CommonInput name="password" label="Password" type="password" placeholder="Enter password" required />
                      </Col>
                    )}
                    <Col xs={24} sm={12}>
                      <CommonInput name="websiteName" label="Website Name" placeholder="Enter website name" />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonInput name="websiteUrl" label="Website URL" placeholder="Enter website URL" />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonInput name="payinCallbackUrl" label="Payin Callback URL" placeholder="Enter payin callback URL" />
                    </Col>
                    <Col xs={24} sm={12}>
                      <CommonInput name="payoutCallbackUrl" label="Payout Callback URL" placeholder="Enter payout callback URL" />
                  </Col>
                  {isEditing && (
                    <Col xs={24} sm={12}>
                      <CommonValidationSwitch name="isActive" label="Active Status" />
                    </Col>
                  )}
                  </Row>
                <CommonBottomActionBar save={isEditing} clear={!isEditing} disabled={!dirty} isLoading={isAddLoading || isEditLoading} onClear={() => resetForm({ values: initialValues })} onSave={() => { setFieldValue("_submitAction", "save"); submitForm(); }} onSaveAndNew={() => { setFieldValue("_submitAction", "saveAndNew"); submitForm(); }}/>
                </AntForm>
            )
          }}
        </Formik>
      </div>
    </>
  );
};

export default UserForm;