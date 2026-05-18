import { useState } from "react";
import { Formik, Form } from "formik";
import { FiEdit2, FiGlobe, FiLock, FiMail, FiPhone, FiUser, FiCopy } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS } from "../../Data";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setUserUpdate } from "../../Store";
import { Mutations } from "../../Api";
import type { UserFormValues } from "../../Types";
import { CommonInput, CommonButton } from "../../Attribute";
import { message } from "antd";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { mutate: editUser, isPending } = Mutations.useUpdateUser();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState< "api" | "secret" | null>(null);
  const initialValues: UserFormValues = {
    userId: user?.userId || "",
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    username: user?.username || "",
    password: user?.password || "",
    websiteName: user?.websiteName || "",
    websiteUrl: user?.websiteUrl || "",
    payinCallbackUrl: user?.payinCallbackUrl || "",
    payoutCallbackUrl: user?.payoutCallbackUrl || "",
  };
  const copyText = async (text?: string) => { if (!text) return; await navigator.clipboard.writeText(text); message.success("Copied"); };
  const handleSubmit = (values: UserFormValues) => {
    const payload = {...values,
      mobileNumber: Number(values.mobileNumber),
      name: values.name?.trim(),
      email: values.email?.trim(),
      username: values.username?.trim(),
    };
    editUser(payload, {
      onSuccess: (response) => {
        const updatedUser = response?.data?.data || response?.data;
        dispatch(setUserUpdate(updatedUser));
        setEditingField(null);
      },
    });
  };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PROFILE.BASE} breadcrumbs={ BREADCRUMBS.PROFILE.BASE } />
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit} >
        {({ values, submitForm }) => (
          <Form className="profile-page">
            <div className="profile-layout">
              <div className="profile-main">
                <div className="profile-hero ">
                  <div className="profile-hero-content">
                    <div className="profile-avatar"> {values?.name?.charAt(0)} </div>
                    <div className="profile-hero-info">
                      <h2> {values?.name} </h2>
                      <p> @{values?.username} </p>
                    </div>
                    <div className="profile-hero-keys">
                      <div className="profile-mini-key" onClick={() => setActiveKey( activeKey === "api" ? null : "api" ) } >
                        <span> {activeKey === "api" ? user?.apiKey : "Show API Key"} </span>
                        {activeKey === "api" && (<CommonButton type="default" onClick={(e) => { e.stopPropagation(); copyText(user?.apiKey); }} className="profile-copy-btn"> <FiCopy /> </CommonButton>)}
                      </div>
                      <div className="profile-mini-key" onClick={() => setActiveKey( activeKey === "secret" ? null : "secret" ) } >
                        <span> {activeKey === "secret" ? user?.secretKey : "Show Secret Key"} </span>
                        {activeKey === "secret" && ( <CommonButton type="default" onClick={(e) => { e.stopPropagation(); copyText(user?.secretKey); }} className="profile-copy-btn"> <FiCopy /> </CommonButton> )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div>
                      <h3> Basic Information </h3>
                      <p> Manage your account details </p>
                    </div>
                  </div>
                  <div className="profile-fields">
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiUser />
                        <div>
                          <span> Full Name </span>
                          {editingField === "name" ? (
                            <CommonInput name="name" type="text" />) : (
                            <p> {values.name} </p> )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "name" ? null : "name" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiMail />
                        <div>
                          <span> Email </span>
                          {editingField === "email" ? ( <CommonInput name="email" type="email" className="w-full" /> ) : ( <p> { values.email } </p> )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "email" ? null : "email" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiPhone />
                        <div>
                          <span> Mobile </span>
                          {editingField === "mobileNumber" ? ( <CommonInput name="mobileNumber" type="text" /> ) : ( <p> { values.mobileNumber } </p> )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "mobileNumber" ? null : "mobileNumber" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiUser />
                        <div>
                          <span> Username </span>
                          {editingField === "username" ? ( <CommonInput name="username" type="text" /> ) : ( <p> @ { values.username } </p>
                          )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "username" ? null : "username" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                  </div>
                </div>
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div>
                      <h3> Website Settings </h3>
                      <p> Manage website configuration </p>
                    </div>
                  </div>
                  <div className="profile-fields">
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiGlobe />
                        <div>
                          <span> Website Name </span>
                          {editingField === "websiteName" ? ( <CommonInput name="websiteName" type="text" /> ) : ( <p> { values.websiteName } </p> )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "websiteName" ? null : "websiteName" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <FiGlobe />
                        <div>
                          <span> Website URL </span>
                          {editingField === "websiteUrl" ? ( <CommonInput name="websiteUrl" type="text" /> ) : ( <p> { values.websiteUrl } </p>
                          )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "websiteUrl" ? null : "websiteUrl" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                  </div>
                </div>
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div>
                      <h3> Payment Settings </h3>
                      <p> Manage payment configuration </p>
                    </div>
                  </div>
                  <div className="profile-fields">
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <MdPayment />
                        <div>
                          <span> Payin Callback Url </span>
                          {editingField === "payinCallbackUrl" ? ( <CommonInput name="payinCallbackUrl" type="text" /> ) : ( <p> { values.payinCallbackUrl } </p> )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "payinCallbackUrl" ? null : "payinCallbackUrl" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                    <div className="profile-field">
                      <div className="profile-field-left">
                        <MdPayment />
                        <div>
                          <span> Payout Callback Url </span>
                          {editingField === "payoutCallbackUrl" ? ( <CommonInput name="payoutCallbackUrl" type="text" /> ) : ( <p> { values.payoutCallbackUrl } </p>
                          )}
                        </div>
                      </div>
                      <CommonButton type="text" className="profile-edit-btn" onClick={() => setEditingField( editingField === "payoutCallbackUrl" ? null : "payoutCallbackUrl" ) } >
                        <FiEdit2 className="edit-profile" />
                      </CommonButton>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-sidebar">
                <div className="profile-security-card">
                  <div className="profile-security-icon">
                    <FiLock />
                  </div>
                  <h3>Security</h3>
                  <p> Manage password and account security settings. </p>
                  <CommonButton onClick={() => navigate( "/settings/change-password" ) } className="w-full colored-button" > Change Password
                  </CommonButton>
                </div>
                <div className="profile-save-card">
                  <h4> Ready to save? </h4>
                  <p> Save your latest changes. </p>
                  <CommonButton onClick={() => submitForm() } loading={isPending} className="w-full colored-button" > Save Changes </CommonButton>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Profile;