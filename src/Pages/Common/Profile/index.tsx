import { useMemo } from "react";import {
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Formik, Form, type FormikHelpers } from "formik";
import { useAppSelector, useAppDispatch } from "../../../Store";
import { Mutations } from "../../../Api";
import { useNavigate } from "react-router-dom";
import { setUserUpdate } from "../../../Store";
import type { UserFormValues } from "../../../Types";
import { CommonInput } from "../../../Components";
import { getToken, UserSchema } from "../../../Utils";

const profileFields = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "mobileNumber", label: "Phone" },
  { name: "userName", label: "Username" },
  { name: "websiteName", label: "Website Name" },
  { name: "websiteUrl", label: "Website URL" },
  { name: "payinCallbackUrl", label: "Payin Callback URL" },
  { name: "payoutCallbackUrl", label: "Payout Callback URL" },
];

const profileSections = [
  {
    title: "Basic Info",
    fields: ["name", "email", "mobileNumber", "userName"],
  },
  {
    title: "Website Info",
    fields: ["websiteName", "websiteUrl"],
  },
  {
    title: "Callbacks",
    fields: ["payinCallbackUrl", "payoutCallbackUrl"],
  },
];

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
  const { mutate: editUser } = Mutations.useUpdateUser();
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
        user?.userName || user?.username || tokenData?.userName || "",
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
    const { username, ...rest } = values; 

    const payload = {
      userId: user?._id,
      ...rest,
      mobileNumber: Number(values.mobileNumber),
      password: tokenData?.password || "",
    };
    editUser(payload, {
      onSuccess: (response) => {
        const updatedUser = response?.data || payload;

        dispatch(setUserUpdate(updatedUser));
        resetForm({ values: updatedUser });
      },
      onError: (error) => {
        console.log("Profile update error:", error);
      },
    });
  };

  return (
    <div className="profilepage-container">
      <div className="profilepage-hero">
        <div className="profilepage-hero-bg" />

        <div className="profilepage-hero-content">
          <div className="profilepage-user">
            <div className="profilepage-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="profilepage-name flex items-center gap-2">
                {user?.name}
                <span className="profilepage-badge">{user?.role}</span>
              </h2>
              <p className="profilepage-email">{user?.email}</p>
            </div>
          </div>

          <div className="profilepage-actions">
            <button
              type="submit"
              form="profileForm"
              className="profilepage-btn-primary"
            >
              <EditOutlined /> Save Changes
            </button>

            <button
              className="profilepage-btn-secondary"
              onClick={() => navigate("/settings")}
            >
              <SettingOutlined /> Settings
            </button>
          </div>
        </div>
      </div>
      <Formik
        enableReinitialize
        key={user?._id}
        initialValues={normalizedUser}
        onSubmit={handleSubmit}
        validationSchema={UserSchema}
      >
        {() => (
          <Form id="profileForm">
            <div className="profilepage-layout">
              <div className="space-y-6">
                {profileSections.map((section) => (
                  <div key={section.title} className="profilepage-card">
                    <h3 className="profilepage-card-title">
                      {section.title}
                    </h3>

                    <div className="profilepage-grid-2">
                      {section.fields.map((name) => {
                        const field = profileFields.find(
                          (f) => f.name === name
                        );
                        if (!field) return null;

                        return (
                          <div key={field.name}>
                            <CommonInput
                              name={field.name}
                              label={field.label}
                              disabled={field.name === "email"}
                            />
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
                    <p><b>Username:</b> {user?.username}</p>
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
              <button type="submit" className="profilepage-btn-primary">
                <EditOutlined /> Save Profile
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Profile;

// import {
//   UserOutlined,
//   EditOutlined,
//   SettingOutlined,
// } from "@ant-design/icons";
// import { Formik, Form, type FormikHelpers } from "formik";
// import { useAppSelector } from "../../../Store";
// import type { UserFormValues } from "../../../Types";
// import { Mutations } from "../../../Api";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../../Store";
// import { setUserUpdate } from "../../../Store"; 
// import { useRef } from "react";

// const getPasswordFromToken = (token?: string) => {
//   if (!token) return "";

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.password || "";
//   } catch {
//     return "";
//   } 
// };



// const Profile = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   const { mutate: editUser } = Mutations.useUpdateUser();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const isEqual = (a: any, b: any) =>
//   String(a ?? "").trim() === String(b ?? "").trim();
// const normalizedUser = {
//   name: user?.name || "",
//   email: user?.email || "",
//   mobileNumber: user?.mobileNumber || "",
//   username: user?.username || user?.userName || "",
//   websiteName: user?.websiteName || "",
//   websiteUrl: user?.websiteUrl || "",
//   payinCallbackUrl: user?.payinCallbackUrl || "",
//   payoutCallbackUrl: user?.payoutCallbackUrl || "",
// };
// const initialValues: UserFormValues = {
//   name: user?.name || "",
//   email: user?.email || "",
//   mobileNumber: user?.mobileNumber || "",
//   userName: user?.userName || "",
//   username: user?.username || "",
//   websiteName: user?.websiteName || "",
//   websiteUrl: user?.websiteUrl || "",
//   payinCallbackUrl: user?.payinCallbackUrl || "",
//   payoutCallbackUrl: user?.payoutCallbackUrl || "",
// };
//   const handleSubmit = async (
//   values: UserFormValues,
//   { resetForm }: FormikHelpers<UserFormValues>
// ) => {
//   const original = useRef(initialValues).current;

//   const isSame =
//     isEqual(values.name, original.name) &&
//     isEqual(values.username, original.username) &&
//     isEqual(values.email, original.email) &&
//     isEqual(values.mobileNumber, original.mobileNumber) &&
//     isEqual(values.websiteName, original.websiteName) &&
//     isEqual(values.websiteUrl, original.websiteUrl) &&
//     isEqual(values.payinCallbackUrl, original.payinCallbackUrl) &&
//     isEqual(values.payoutCallbackUrl, original.payoutCallbackUrl);

//   // console.log(" FORM VALUES:", values);
//   // console.log(" ORIGINAL DATA:", original);
//   // console.log(" IS SAME?:", isSame);

//   if (isSame) {
//     console.log(" No changes detected");
//     return;
//   }

//   const payload = {
//     userId: user?._id,
//     name: values.name || "",
//     userName: values.username || "",
//     email: values.email || "",
//     mobileNumber: Number(values.mobileNumber) || 0,
//     password: getPasswordFromToken(user?.token),
//     websiteName: values.websiteName || "",
//     websiteUrl: values.websiteUrl || "",
//     payinCallbackUrl: values.payinCallbackUrl || "",
//     payoutCallbackUrl: values.payoutCallbackUrl || "",
//   };

//   console.log("🚀 FINAL PAYLOAD SENT TO API:", payload);

//   await editUser(payload, {
//     onSuccess: (res: any) => {

//       const updatedUser = res?.data?.user;
            
//       dispatch(setUserUpdate(updatedUser));
//       // localStorage.setItem("user", JSON.stringify(updatedUser));
//         resetForm({
//   values: {
//     name: updatedUser?.name || "",
//     email: updatedUser?.email || "",
//     mobileNumber: String(updatedUser?.mobileNumber || ""),
//     userName: updatedUser?.userName || "",
//     username: updatedUser?.username || "",
//     websiteName: updatedUser?.websiteName || "",
//     websiteUrl: updatedUser?.websiteUrl || "",
//     payinCallbackUrl: updatedUser?.payinCallbackUrl || "",
//     payoutCallbackUrl: updatedUser?.payoutCallbackUrl || "",
//   },
// });
//       },
//           onError: (err: any) => {
//         console.log("API ERROR RESPONSE:", err);
//       },
//     });
//   };
//   console.log("CURRENT REDUX USER:", user);
// //   console.log("USER ID:", user?._id);
// // console.log("USER FULL:", user);
//   return (
//     <div className="profilepage-container">

//       {/* HERO */}
//       <div className="profilepage-hero">
//         <div className="profilepage-hero-bg" />

//         <div className="profilepage-hero-content">

//           {/* USER */}
//           <div className="profilepage-user">
//             <div className="profilepage-avatar">
//               {user?.name?.charAt(0)?.toUpperCase() || "U"}
//             </div>

//             <div>
//               <h2 className="profilepage-name">{user?.name}</h2>
//               <p className="profilepage-email">{user?.email}</p>
//             </div>
//           </div>

//           {/* ACTIONS */}
//           <div className="profilepage-actions">
//             <button
//               type="submit"
//               form="profileForm"
//               className="profilepage-btn-primary"
//             >
//               <EditOutlined /> Save Profile
//             </button>

//             <button className="profilepage-btn-secondary">
//               <SettingOutlined /> Settings
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* FORM */}
//       <Formik
//         enableReinitialize
//         key={JSON.stringify(user)} 
//         initialValues={normalizedUser}
//         onSubmit={handleSubmit}
//       >
//         {({ handleChange, values }) => (
//           <Form id="profileForm">

//             <div className="profilepage-grid">

//               {/* LEFT */}
//               <div className="profilepage-card">
//                 <h3 className="profilepage-card-title">
//                   <UserOutlined /> Account Details
//                 </h3>

//                 {/* Name */}
//                 <div className="profilepage-field">
//                   <label className="profilepage-label">Name</label>
//                   <input
//                     name="name"
//                     value={values.name}
//                     onChange={handleChange}
//                     className="profilepage-input"
//                   />
//                 </div>
//                 <div className="profilepage-field">
//                   <label className="profilepage-label">Email</label>
//                   <input
//                     name="email"
//                     value={values.email}
                    
//                     onChange={handleChange}
//                     className="profilepage-input"
//                   />
//                 </div>
//                 {/* Phone */}
//                 <div className="profilepage-field">
//                   <label className="profilepage-label">Phone</label>
//                   <input
//                     name="mobileNumber"
//                     value={values.mobileNumber}
//                     onChange={handleChange}
//                     className="profilepage-input"
//                   />
//                 </div>

//                 {/* Username */}
//                 <div className="profilepage-field">
//                   <label className="profilepage-label">Username</label>
//                   <input
//                     name="username"
//                     value={values.username}
//                     onChange={handleChange}
//                     className="profilepage-input"
//                   />
//                 </div>

                
//                 {/* Website Name */}
//                   <div className="profilepage-field">
//                     <label className="profilepage-label">Website Name</label>
//                     <input
//                       name="websiteName"
//                       value={values.websiteName}
//                       onChange={handleChange}
//                       className="profilepage-input"
//                     />
//                   </div>

//                   {/* Website URL */}
//                   <div className="profilepage-field">
//                     <label className="profilepage-label">Website URL</label>
//                     <input
//                       name="websiteUrl"
//                       value={values.websiteUrl}
//                       onChange={handleChange}
//                       className="profilepage-input"
//                     />
//                   </div>

//                   {/* Payin Callback */}
//                   <div className="profilepage-field">
//                     <label className="profilepage-label">Payin Callback URL</label>
//                     <input
//                       name="payinCallbackUrl"
//                       value={values.payinCallbackUrl}
//                       onChange={handleChange}
//                       className="profilepage-input"
//                     />
//                   </div>

//                   {/* Payout Callback */}
//                   <div className="profilepage-field">
//                     <label className="profilepage-label">Payout Callback URL</label>
//                     <input
//                       name="payoutCallbackUrl"
//                       value={values.payoutCallbackUrl}
//                       onChange={handleChange}
//                       className="profilepage-input"
//                     />
//                   </div>
//               </div>

//               {/* RIGHT */}
//               <div className="profilepage-side">

//                 <div className="profilepage-card">
//                   <h3 className="profilepage-card-title">Security</h3>

//                   <p className="profilepage-muted">
//                     Password is managed separately.
//                   </p>

//                   <button
//                     type="button"
//                     className="profilepage-btn-secondary w-full mt-4"
//                     onClick={() => navigate("/settings/change-password")}
//                   >
//                     Change Password
//                   </button>
//                 </div>

//               </div>

//             </div>

//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default Profile;
