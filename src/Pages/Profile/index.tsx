import { useMemo } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import { useAppSelector, useAppDispatch } from "../../Store";
import { Mutations } from "../../Api";
import { useNavigate } from "react-router-dom";
import { setUserUpdate } from "../../Store";
import type { UserFormValues } from "../../Types";
import { CommonInput } from "../../Attribute";
import CommonBottomActionBar from "../../Components/Common/CommonBottomActionBar";
import { getToken, UserSchema } from "../../Utils";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, PROFILE_FIELDS, PROFILE_SECTIONS } from "../../Data";

const decodeToken = (token?: string) => {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

const Profile = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useUpdateUser();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authToken = token || user?.token || getToken() || "";
  const tokenData = useMemo(() => decodeToken(authToken), [authToken]);
  const normalizedUser = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || tokenData?.email || "",
      mobileNumber: user?.mobileNumber || "",
      userName:
        user?.username || user?.username || tokenData?.username || "",
      websiteName: user?.websiteName || tokenData?.websiteName || "",
      websiteUrl: user?.websiteUrl || tokenData?.websiteUrl || "",
      payinCallbackUrl:
        user?.payinCallbackUrl || tokenData?.payinCallbackUrl || "",
      payoutCallbackUrl:
        user?.payoutCallbackUrl || tokenData?.payoutCallbackUrl || "",
    }),
    [user, tokenData]
  );
  const handleSubmit = async (
    values: UserFormValues,
    { resetForm }: FormikHelpers<UserFormValues>
  ) => {
    const { ...rest } = values; 

    const payload = {
      userId: user?._id,
      ...rest,
      mobileNumber: Number(values.mobileNumber),
      password: tokenData?.password || "",
    };
    editUser(payload, {
      onSuccess: (response) => {
        const updatedUser = response?.data; 

        dispatch(setUserUpdate(updatedUser));
        resetForm({ values: updatedUser });
      },
      onError: (error) => {
        console.log("Profile update error:", error);
      },
    });
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PROFILE.BASE} breadcrumbs={BREADCRUMBS.PROFILE.BASE} />
      <div className="profilepage-container bg-surface p-4 rounded-lg">
        <Formik<UserFormValues>
          enableReinitialize
          key={user?._id}
          initialValues={normalizedUser}
          onSubmit={handleSubmit}
          validationSchema={UserSchema}
        >
          {({ dirty }) => (
            <Form noValidate id="profileForm">
              <div className="profilepage-layout">
                <div className="space-y-6">
                  {PROFILE_SECTIONS.map((section) => (
                    <div key={section.title} className="profilepage-card">
                      <h3 className="profilepage-card-title">
                        {section.title}
                      </h3>
                      <div className="profilepage-grid-2">
                        {section.fields.map((name) => {
                          const field = PROFILE_FIELDS.find(
                            (field) => field.name === name
                          );
                          if (!field) return null;
                          return (
                            <div key={field.name}>
                              <CommonInput name={field.name} label={field.label} type="text" required={false} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="profilepage-side">
                  <div className="profilepage-card">
                    <h3 className="profilepage-card-title">Profile</h3>
                    <div className="text-sm text-muted space-y-1">
                      <p><b>Name:</b> {user?.name}</p>
                      <p><b>Email:</b> {user?.email}</p>
                      <p><b>Username:</b> {user?.userName}</p>
                    </div>
                  </div>

                  <div className="profilepage-card">
                    <h3 className="profilepage-card-title">Security</h3>
                    <p className="profilepage-muted">
                      Password is managed separately.
                    </p>
                    <button
                      type="button"
                      className="profilepage-btn-secondary w-full mt-4"
                      onClick={() =>
                        navigate("/settings/change-password")
                      }
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
              <div className="profilepage-savebar">
                <CommonBottomActionBar submit disabled={!dirty}
                  isLoading={isEditLoading}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Profile;