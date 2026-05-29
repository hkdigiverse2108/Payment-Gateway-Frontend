import { useState } from "react";
import { Formik, Form } from "formik";
import { message } from "antd";
import { Copy, KeyRound, LockKeyhole, Save, ShieldCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { PAGE_TITLE } from "../../Constants";
import { BREADCRUMBS, profileSections } from "../../Data";
import { useAppDispatch, useAppSelector } from "../../Store";
import { setUserUpdate } from "../../Store";
import { Mutations } from "../../Api";
import type { UserFormValues } from "../../Types";
import { CommonButton } from "../../Attribute";
import { ProfileSection } from "../../Components/Profile/ProfileSection";
import CommonBottomActionBar from "../../Components/Common/CommonBottomActionBar";

const maskKey = (v?: string) => !v ? "Not available" : v.length <= 10 ? v : `${v.slice(0, 6)}...${v.slice(-4)}`;

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { mutate: editUser, isPending } = Mutations.useUpdateUser();
  const [editingField, setEditingField] = useState<keyof UserFormValues | null>(null);
  const [revealedKeys, setRevealedKeys] = useState({ api: false, secret: false });
  const initialValues: UserFormValues = {
    userId: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || 0,
    username: user?.username || "",
    password: user?.password || "",
    websiteName: user?.websiteName || "",
    websiteUrl: user?.websiteUrl || "",
    payinCallbackUrl: user?.payinCallbackUrl || "",
    payoutCallbackUrl: user?.payoutCallbackUrl || "",
  };
  const copyText = (text?: string) =>
    text && navigator.clipboard.writeText(text).then(() => message.success("Copied"));
  const handleSubmit = (values: UserFormValues) => {
    const payload: any = {
      ...values,
      mobileNumber: Number(values.mobileNumber),
      name: values.name?.trim(),
      email: values.email?.trim(),
      username: values.username?.trim(),
    };

    editUser(
      payload,
      {
        onSuccess: (res) => {
          dispatch(setUserUpdate(res?.data?.data || res?.data));
          setEditingField(null);
        },
      }
    );
  };

  const renderCredential = (label: string, value: string | undefined, key: "api" | "secret") => {
    const isRevealed = revealedKeys[key];
    return (
      <div className="rounded-2xl border border-border/20 bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tableback/40 text-muted">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{label}</p>
              <p className="text-xs text-muted">Used for signed API requests</p>
            </div>
          </div>
          <CommonButton
            variant="icon-only"
            className="icon-btn"
            onClick={() => setRevealedKeys((p) => ({ ...p, [key]: !p[key] }))}
          >
            {isRevealed ? <X className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
          </CommonButton>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/20 bg-tableback/20 px-3 py-2.5">
          <span className="min-w-0 flex-1 break-all font-mono text-xs font-semibold text-foreground">
            {isRevealed ? value || "Not available" : maskKey(value)}
          </span>
          <CommonButton variant="icon-only" className="icon-btn shrink-0" onClick={() => copyText(value)}>
            <Copy className="h-4 w-4" />
          </CommonButton>
        </div>
      </div>
    );
  };

  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.PROFILE.BASE} breadcrumbs={BREADCRUMBS.PROFILE.BASE} />
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, submitForm }) => (
          <Form className="space-y-6 animate-fade">
            <section className="rounded-2xl border border-border/20 bg-surface p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-black text-white shadow-lg">
                    {(values.name || values.username || "U").charAt(0)}
                  </div>
                  <div>
                    <h2 className="truncate text-2xl font-black">{values.name || "User"}</h2>
                    <p className="text-sm text-muted">@{values.username} - {user?.role}</p>
                  </div>
                </div>
              {/* <div className="flex gap-2">
                <CommonButton variant="ghost" icon={<LockKeyhole className="h-4 w-4" />} onClick={() => navigate("/settings/change-password")} >
                  <span className="hidden lg:inline">Change Password</span>
                </CommonButton>
                <CommonButton variant="primary" loading={isPending} icon={<Save className="h-4 w-4" />} onClick={submitForm} >
                  <span className="hidden lg:inline">Save Changes</span>
                </CommonButton>
              </div> */}
              </div>
            </section>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                {profileSections.map((section) => (
                  <ProfileSection
                    key={section.title}
                    section={section}
                    values={values}
                    editingField={editingField}
                    setEditingField={setEditingField}
                  />
                ))}
              </div>
              <aside className="space-y-4 xl:sticky xl:top-6">
                <section className="rounded-2xl border border-border/20 bg-surface p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-black">API Credentials</h3>
                  <div className="space-y-3">
                    {renderCredential("API Key", user?.apiKey, "api")}
                    {renderCredential("Secret Key", user?.secretKey, "secret")}
                  </div>
                </section>
                <section className="rounded-2xl border border-border/20 bg-surface p-5 shadow-sm flex gap-3">
                  <ShieldCheck className="h-5 w-5" />
                  <div>
                    <h3 className="font-black">Security</h3>
                    <p className="text-sm text-muted">Keep credentials private and rotate regularly.</p>
                  </div>
                </section>
              </aside>
            </div>
            <CommonBottomActionBar>
              <div className="password-actions">
                <CommonButton variant="ghost" icon={<LockKeyhole className="h-4 w-4" />} onClick={() => navigate("/settings/change-password")} >
                  <span className="hidden lg:inline">Change Password</span>
                </CommonButton>
                <CommonButton variant="primary" loading={isPending} icon={<Save className="h-4 w-4" />} onClick={submitForm} >
                  <span className="hidden lg:inline">Save Changes</span>
                </CommonButton>
               </div>
            </CommonBottomActionBar>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Profile;
