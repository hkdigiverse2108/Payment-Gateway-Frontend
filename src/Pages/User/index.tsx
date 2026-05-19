import { useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import { Mutations, Queries } from "../../Api";
import type { UserFormValues } from "../../Types";
import { PAGE_TITLE } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";
import CommonDeleteModal from "../../Components/Common/Modal/CommonDeleteModal";
import { Drawer, Switch, Tooltip } from "antd";
import { Formik, Form } from "formik";
import { UserSchema } from "../../Utils";
import { RemoveEmptyFields } from "../../Utils/FormHelpers";
import { CommonInput } from "../../Attribute/FormFields/CommonTextField";
import { CommonPhoneNumber } from "../../Attribute";
import { CommonButton } from "../../Attribute";
import { useToast } from "../../Components/Common/ToastProvider";
import { UserPlus, Edit2, Trash2, Globe } from "lucide-react";

const getInitials = (name?: string) => {
  if (!name) return "?";
  const words = name.trim().split(/\s+/);
  return ((words[0]?.[0] || "") + (words.at(-1)?.[0] || "")).toUpperCase();
};

const getDeterministicColor = (name?: string) => {
  if (!name) return "#8B5CF6";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 50%)`;
};

const User = () => {
  const toast = useToast();
  const [search, setSearch] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; record: UserFormValues | null; }>({ open: false, record: null});
  const debouncedSearch = useDebounce(String(search), 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeOnly, setActiveOnly] = useState(true);

  // Drawer Form State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Queries & Mutations
  const { data: userData, isLoading, refetch } = Queries.useGetUser({ 
    ...(debouncedSearch ? { search: debouncedSearch } : {}), 
    page, 
    limit: pageSize 
  });
  
  const { mutate: deleteUser, isPending: isDeleting } = Mutations.useDeleteUser();
  const { mutate: updateUserStatus } = Mutations.useUpdateUser();
  const { mutate: addUser, isPending: isAddLoading } = Mutations.useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useUpdateUser();

  const userList = useMemo(() => {
    const rawUsers = userData?.data?.data || [];
    return rawUsers.filter((item: UserFormValues) => item.isActive === activeOnly);
  }, [userData, activeOnly]);

  const totalData = userData?.data?.totalData || 0;

  const handleToggleStatus = (checked: boolean, record: any) => {
    updateUserStatus({ userId: record._id, isActive: checked } as any, {
      onSuccess: () => {
        toast.success(`User "${record.name}" status set to ${checked ? 'Active' : 'Inactive'}`);
        refetch();
      },
      onError: (_err: any) => {
        toast.error("Failed to update user status");
      }
    });
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingRecord(record);
    setDrawerOpen(true);
  };

  const columns = useMemo(
    () => [
      { 
        title: "User", 
        key: "avatarName",
        width: 250,
        render: (_: any, record: any) => (
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl text-white font-bold text-sm flex items-center justify-center shadow-sm select-none flex-shrink-0"
              style={{ backgroundColor: getDeterministicColor(record.name) }}
            >
              {getInitials(record.name)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground truncate text-sm">{record.name}</span>
              <span className="text-muted text-xs truncate">{record.email}</span>
            </div>
          </div>
        )
      },
      { 
        title: "Mobile", 
        dataIndex: "mobileNumber", 
        key: "mobileNumber",
        render: (val: string) => <span className="font-mono text-xs text-foreground">{val || "-"}</span>
      },
      { 
        title: "Role", 
        dataIndex: "role", 
        key: "role",
        render: (role: string) => {
          const isMerchant = role?.toLowerCase() === "user" || role?.toLowerCase() === "merchant";
          return (
            <span className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
              isMerchant 
                ? "bg-slate-500/10 text-slate-500 border border-slate-500/20" 
                : "bg-brand-500/10 text-brand-500 border border-brand-500/20"
            }`}>
              {role || "Merchant"}
            </span>
          );
        }
      },
      { 
        title: "Domain", 
        key: "website",
        render: (_: any, record: any) => (
          <div className="flex flex-col min-w-0 max-w-[180px]">
            <span className="font-semibold text-foreground truncate text-xs flex items-center gap-1">
              <Globe className="w-3 h-3 text-muted" /> {record.websiteName || "-"}
            </span>
            {record.websiteUrl && (
              <a 
                href={record.websiteUrl.startsWith("http") ? record.websiteUrl : `https://${record.websiteUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-brand-500 hover:underline truncate mt-0.5"
              >
                {record.websiteUrl}
              </a>
            )}
          </div>
        )
      },
      { 
        title: "Status", 
        dataIndex: "isActive", 
        key: "isActive",
        width: 100,
        render: (isActive: boolean, record: any) => (
          <div className="flex items-center gap-2">
            <Switch 
              checked={isActive} 
              onChange={(checked) => handleToggleStatus(checked, record)}
              className="custom-switch"
              size="small"
            />
            <span className={`text-xs font-semibold ${isActive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 120,
        render: (_: any, record: any) => (
          <div className="flex gap-1.5">
            <Tooltip title="Edit User">
              <button 
                onClick={() => handleOpenEdit(record)}
                className="p-1.5 rounded-lg border border-border/20 text-muted hover:text-foreground hover:bg-tableback/30 transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            <Tooltip title="Delete User">
              <button 
                onClick={() => setDeleteModal({ open: true, record })}
                className="p-1.5 rounded-lg border border-border/20 text-red-500 hover:bg-red-500/5 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
          </div>
        )
      }
    ],
    [toast, refetch]
  );

  const initialValues = useMemo(() => {
    return {
      name: editingRecord?.name || "",
      email: editingRecord?.email || "",
      mobileNumber: editingRecord?.mobileNumber || "",
      username: editingRecord?.username || "",
      password: "",
      websiteName: editingRecord?.websiteName || "",
      websiteUrl: editingRecord?.websiteUrl || "",
      payinCallbackUrl: editingRecord?.payinCallbackUrl || "",
      payoutCallbackUrl: editingRecord?.payoutCallbackUrl || "",
      isActive: editingRecord?.isActive ?? true,
    };
  }, [editingRecord]);

  const handleSubmitDrawer = async (values: any, { resetForm }: any) => {
    const { _submitAction, ...rest } = values;
    const payload = { ...rest };
    const isEditing = Boolean(editingRecord?._id);

    const handleSuccess = () => {
      toast.success(isEditing ? "User updated successfully" : "User created successfully");
      resetForm();
      setDrawerOpen(false);
      refetch();
    };

    if (isEditing) {
      await editUser(
        RemoveEmptyFields({ ...payload, userId: editingRecord._id }) as any,
        { onSuccess: handleSuccess }
      );
    } else {
      await addUser(
        RemoveEmptyFields(payload) as any,
        { onSuccess: handleSuccess }
      );
    }
  };

  return (
    <div className="space-y-6 animate-fade">
      <CommonBreadcrumbs title={PAGE_TITLE.USERS.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USERS.BASE} />
      
      <div className="bg-surface border border-border/20 rounded-2xl p-6 shadow-sm">
        <CommonTable<UserFormValues>
          rowKey="userId"
          dataSource={userList}
          columns={columns}
          loading={isLoading}
          pagination={{ current: page, pageSize, total: totalData, showSizeChanger: true }}
          onPaginationChange={(newPage: number, newPageSize: number) => { setPage(newPage); setPageSize(newPageSize); }}
          onSearch={{ value: search, onChange: (value) => { setSearch(String(value)); setPage(1); } }}
          onActive={{ value: activeOnly, onChange: setActiveOnly }}
          onAdd={handleOpenAdd}
          onAddLabel="Add New User"
        />
      </div>

      {/* Confirmation Modal */}
      <CommonDeleteModal
        open={deleteModal.open}
        loading={isDeleting}
        itemName={deleteModal.record?.name}
        onClose={() => setDeleteModal({ open: false, record: null })}
        onConfirm={() => {
          if (!deleteModal.record?.userId) return;
          deleteUser(deleteModal.record.userId, {
            onSuccess: () => { 
              toast.success("User deleted successfully");
              setDeleteModal({ open: false, record: null }); 
              refetch();
            },
          });
        }}
      />

      {/* side Drawer for User Form */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="font-bold text-foreground">
              {editingRecord ? "Edit User Profile" : "Create New Merchant"}
            </span>
          </div>
        }
        placement="right"
        width={480}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        destroyOnClose
        className="custom-drawer bg-surface text-foreground"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={UserSchema}
          onSubmit={handleSubmitDrawer}
        >
          {({ submitForm, dirty, resetForm }) => (
            <Form className="space-y-6 flex flex-col justify-between h-full">
              
              <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                <CommonInput name="name" label="Full Name" placeholder="e.g. John Doe" required />
                <CommonInput name="username" label="Username" placeholder="e.g. johndoe123" required />
                <CommonPhoneNumber name="mobileNumber" label="Mobile Number" required />
                <CommonInput name="email" label="Email Address" type="email" placeholder="e.g. john@example.com" required />
                
                {!editingRecord && (
                  <CommonInput name="password" label="Account Password" type="password" placeholder="••••••••" required />
                )}

                <div className="h-px bg-border/10 my-4" />
                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider block">Website & Merchant URLs</span>

                <CommonInput name="websiteName" label="Website Name" placeholder="e.g. Storefront Portal" />
                <CommonInput name="websiteUrl" label="Website URL" placeholder="e.g. storefront.com" />
                <CommonInput name="payinCallbackUrl" label="Payin Callback URL" placeholder="e.g. api.storefront.com/payin" />
                <CommonInput name="payoutCallbackUrl" label="Payout Callback URL" placeholder="e.g. api.storefront.com/payout" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border/10">
                <CommonButton 
                  onClick={() => { resetForm(); setDrawerOpen(false); }} 
                  variant="ghost" 
                  className="flex-1"
                >
                  Cancel
                </CommonButton>
                <CommonButton 
                  onClick={submitForm} 
                  disabled={!dirty}
                  variant="primary" 
                  className="flex-1"
                  loading={isAddLoading || isEditLoading}
                >
                  {editingRecord ? "Save Changes" : "Create Account"}
                </CommonButton>
              </div>

            </Form>
          )}
        </Formik>
      </Drawer>
    </div>
  );
};

export default User;