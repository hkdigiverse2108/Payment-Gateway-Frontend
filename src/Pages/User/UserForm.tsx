import { Drawer } from "antd";
import { Formik, Form } from "formik";
import { CommonInput } from "../../Attribute/FormFields/CommonTextField";
import { CommonPhoneNumber, CommonButton } from "../../Attribute";
import { RemoveEmptyFields } from "../../Utils/FormHelpers";
import type { UserFormProps } from "../../Types";

const UserForm = ({ open, onClose, editingRecord, onAdd, onEdit, isAddLoading, isEditLoading }: UserFormProps) => {
  const initialValues = {
    name: editingRecord?.name || "",
    email: editingRecord?.email || "",
    username: editingRecord?.username || "",
    mobileNumber: editingRecord?.mobileNumber || "",
    password: editingRecord?.password || "",
    websiteName: editingRecord?.websiteName || "",
    websiteUrl: editingRecord?.websiteUrl || "",
    payinCallbackUrl: editingRecord?.payinCallbackUrl || "",
    payoutCallbackUrl: editingRecord?.payoutCallbackUrl || "",
    isActive: editingRecord?.isActive ?? true,
  };
  const handleSubmit = (values: any, { resetForm }: any) => {
    const payload = RemoveEmptyFields(values);
    if (editingRecord) {
      onEdit(
        { ...payload, userId: editingRecord._id },
        { onSuccess: () => { resetForm(); onClose(); } }
      );
    } else {
      onAdd(payload, {
        onSuccess: () => { resetForm(); onClose(); }
      });
    }
  };
  return (
    <Drawer
      title={editingRecord ? "Edit User" : "Create User"}
      open={open}
      onClose={onClose}
      size={500}
      mask={true}
      styles={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
      }}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <Form className="space-y-4">
            <CommonInput name="name" label="Name" />
            <CommonInput name="email" label="Email" />
            <CommonInput name="username" label="Username" />
            <CommonPhoneNumber name="mobileNumber" label="Mobile" />
            {/* {!editingRecord && (
              <CommonInput name="password" label="Password" type="password" />
            )} */}
            <CommonInput name="password" label="Password" type="password" />
            <CommonInput name="websiteName" label="Website Name" />
            <CommonInput name="websiteUrl" label="Website URL" />
            <CommonInput name="payinCallbackUrl" label="Payin URL" />
            <CommonInput name="payoutCallbackUrl" label="Payout URL" />
            <div className="flex gap-2 pt-4">
              <CommonButton onClick={onClose} variant="ghost" className="flex-1">
                Cancel
              </CommonButton>
              <CommonButton onClick={submitForm} loading={isAddLoading || isEditLoading} className="flex-1" >
                {editingRecord ? "Update" : "Create"}
              </CommonButton>
            </div>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

export default UserForm;