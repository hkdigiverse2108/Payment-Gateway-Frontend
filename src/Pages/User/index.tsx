import { useEffect, useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import { Mutations, Queries } from "../../Api";
import type { UserFormValues } from "../../Types";
import { PAGE_TITLE } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";
import CommonDeleteModal from "../../Components/Common/Modal/CommonDeleteModal";
import { Tooltip, Switch } from "antd";
import { Edit2, Trash2 } from "lucide-react";
import { CommonButton } from "../../Attribute";
import UserForm from "./UserForm";
import StatCard from "../../Components/Common/StatCard";
import { Row, Col } from "antd";
import { Users, CheckCircle2, UserX } from "lucide-react";
import { getGradientFromString } from "../../Utils/ColorUtils";
import CommonTableToolbar from "../../Components/Common/CommonTable/CommonTableToolbar";

const User = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeOnly, setActiveOnly] = useState(true);
  const [columnVisibility, setColumnVisibility] = useState<any>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>({ open: false, record: null });
  const debouncedSearch = useDebounce(search, 500);
  const { data: userData, isLoading, refetch } =
    Queries.useGetUser({
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
      page,
      limit: pageSize,
    });
  const { mutate: deleteUser } = Mutations.useDeleteUser();
  const { mutate: addUser, isPending: isAddLoading } = Mutations.useAddUser();
  const { mutate: editUser, isPending: isEditLoading } = Mutations.useUpdateUser();
  const { mutate: updateStatus } = Mutations.useUpdateUser();
  const allUsers = userData?.data?.data || [];
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter((u: any) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const userList = useMemo(() => {
    const raw = userData?.data?.data || [];
    return raw.filter((u: UserFormValues) => u.isActive === activeOnly);
  }, [userData, activeOnly]); 
  const handleToggleStatus = (checked: boolean, record: any) => {
    const payload = {
      userId: record._id,
      name: record.name,
      username: record.username,
      email: record.email,
      password: record.password,
      mobileNumber: record.mobileNumber,
      websiteName: record.websiteName,
      websiteUrl: record.websiteUrl,
      payinCallbackUrl: record.payinCallbackUrl,
      payoutCallbackUrl: record.payoutCallbackUrl,
      isActive: checked,
    };

    updateStatus(payload, {
      onSuccess: () => refetch(),
    });
  };
  const columns = useMemo(
    () => [
      {
        title: "User",
        key: "user",
        render: (_: any, record: any) => (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                style={{ background: getGradientFromString(record.name) }}
              >
                {record.name?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <div className="font-semibold">{record.name}</div>
              <div className="text-xs text-muted">{record.email}</div>
            </div>
          </div>
        ),
      },
      { title: "Mobile", dataIndex: "mobileNumber" },
      { title: "Role", dataIndex: "role" },
      {
        title: "Domain",
        key: "domain",
        render: (_: any, record: any) => (
            <div className="text-xs">
              <div>{record.websiteName}</div>
              {record.websiteUrl ? (
                <a href={record.websiteUrl} target="_blank" className="text-brand-500">
                  {record.websiteUrl}
                </a>
              ) : (
                <span className="text-muted">-</span>
              )}
            </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "isActive",
        render: (val: boolean, record: any) => (
          <Switch checked={!!val} onChange={(v) => handleToggleStatus(v, record)} />
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (_: any, record: any) => (
          <div className="flex gap-2">
            <Tooltip title="Edit">
              <CommonButton variant="icon-only"
                onClick={() => { setEditingRecord(record); setDrawerOpen(true); }} >
                <Edit2 size={14} />
              </CommonButton>
            </Tooltip>
            <Tooltip title="Delete">
              <CommonButton variant="icon-only" onClick={() => setDeleteModal({ open: true, record })} >
                <Trash2 size={14} />
              </CommonButton>
            </Tooltip>
          </div>
        ),
      },
    ],
    [refetch]
  );
  const columnKey = (col: any) => col.key || col.dataIndex;
  const initialVisibility = useMemo(() => {
    return Object.fromEntries(
      columns.map((col: any) => [columnKey(col), true])
    );
  }, [columns]);

  useEffect(() => {
    setColumnVisibility(initialVisibility);
  }, [initialVisibility]);
  const filteredColumns = useMemo(() => {
    return columns.filter((col: any) => {
      const key = columnKey(col);
      return columnVisibility[key] !== false;
    });
  }, [columns, columnVisibility]);
  return (
    <div className="space-y-6">
      <CommonBreadcrumbs title={PAGE_TITLE.USERS.BASE} breadcrumbs={BREADCRUMBS.USERS.BASE} />
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <StatCard title="Total Users" value={totalUsers} icon={<Users className="w-5 h-5" />} color="blue" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Active Users" value={activeUsers} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Inactive Users" value={inactiveUsers} icon={<UserX className="w-5 h-5" />} color="red" />
        </Col>
      </Row>
      <div className="bg-surface border border-border/20 rounded-2xl p-6 shadow-sm">
        <CommonTableToolbar
          onSearch={{
            value: search,
            onChange: (val: any) => setSearch(String(val)),
          }}
          onActive={{ value: activeOnly, onChange: setActiveOnly }}
          onAdd={() => {
            setEditingRecord(null);
            setDrawerOpen(true);
          }}
          onAddLabel="Add User"
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
      />
        <CommonTable<UserFormValues>
          rowKey={(record) => record._id?.toString() ?? ''}
          dataSource={userList}
          columns={filteredColumns}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize,
            total: userData?.data?.totalData || 0,
          }}
          onPaginationChange={(p, ps) => {
            setPage(p);
            setPageSize(ps);
          }}
          onSearch={{
            value: search,
            onChange: (v) => setSearch(String(v)),
          }}
          onActive={{ value: activeOnly, onChange: setActiveOnly }}
          onAdd={() => {
            setEditingRecord(null);
            setDrawerOpen(true);
          }}
          onAddLabel="Add User"
        />
      </div>
      <CommonDeleteModal
        open={deleteModal.open}
        itemName={deleteModal.record?.name}
        onClose={() => setDeleteModal({ open: false, record: null })}
        onConfirm={() => {
          if (deleteModal.record?._id) {
            deleteUser(deleteModal.record._id, {
              onSuccess: () => {
                setDeleteModal({ open: false, record: null });
                refetch();
              },
            });
          }
        }}
      />
      <UserForm
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingRecord={editingRecord}
        onAdd={addUser}
        onEdit={editUser}
        isAddLoading={isAddLoading}
        isEditLoading={isEditLoading}
      />
    </div>
  );
};

export default User;