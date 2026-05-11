import { useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import CommonActionColumn from "../../Components/Common/CommonTable/CommonActionColumn";
import { Mutations, Queries } from "../../Api";
import type {  UserFormValues } from "../../Types";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";
import { useDebounce } from "../../Utils";
import CommonDeleteModal from "../../Components/Common/Modal/CommonDeleteModal";

const User = () => {
  const [search, setSearch] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; record: UserFormValues | null; }>({ open: false, record: null});
  const debouncedSearch = useDebounce(String(search), 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeOnly, setActiveOnly] = useState(true);
  const navigate = useNavigate();
  const { data: userData, isLoading } = Queries.useGetUser({ ...(debouncedSearch ? { search: debouncedSearch } : {}), page, limit: pageSize });
  const { mutate: deleteUser, isPending: isDeleting } =
  Mutations.useDeleteUser();
  const user = useMemo(() => {
    const rawUsers = userData?.data?.data || [];
    return rawUsers.filter((item: UserFormValues) => item.isActive === activeOnly);
  }, [userData, activeOnly]);
  const totalData = userData?.data?.totalData || 0;
  const columns = useMemo(
    () => [
      { title: "Name", dataIndex: "name", key: "name",},
      { title: "Email", dataIndex: "email", key: "email", },
      { title: "Phone", dataIndex: "mobileNumber", key: "mobileNumber", },
      { title: "Role", dataIndex: "role", key: "role", },
      { title: "Website Name", dataIndex: "websiteName", key: "websiteName", },
      { title: "Website URL", dataIndex: "websiteUrl", key: "websiteUrl", },
      { title: "Status", dataIndex: "isActive", key: "isActive",
        render: (value: boolean) =>
          value ? (
            <span className="text-green-600 font-medium">Active</span>
          ) : (
            <span className="text-red-500 font-medium">Inactive</span>
          ),
      },
      CommonActionColumn<UserFormValues>({
        onEdit: { onHandle: (record) => { navigate(ROUTES.USERS.ADD_EDIT, { state: { user: record }, }); } },
        onDelete: { onHandle: (record) => { setDeleteModal({ open: true, record})}},
      })
    ],
    [navigate]
  );
  const handleAdd = () => { navigate(ROUTES.USERS.ADD_EDIT); };
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USERS.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USERS.BASE} />
      <div className="pt-2">
        <CommonTable<UserFormValues>
          rowKey="_id"
          dataSource={user}
          columns={columns}
          loading={isLoading}
          pagination={{ current: page, pageSize, total: totalData, showSizeChanger: true, }}
          onPaginationChange={(newPage: number, newPageSize: number) => { setPage(newPage); setPageSize(newPageSize); }}
          onSearch={{ value: search, onChange: (value) => { setSearch(String(value)); setPage(1); },}}
          onActive={{ value: activeOnly, onChange: setActiveOnly, }}
          onAdd={handleAdd}
        />
      </div>
      <CommonDeleteModal
        open={deleteModal.open}
        loading={isDeleting}
        itemName={deleteModal.record?.name}
        onClose={() => setDeleteModal({ open: false, record: null })}
        onConfirm={() => {
          if (!deleteModal.record?.userId) return;
          deleteUser(deleteModal.record.userId, {
          onSuccess: () => { setDeleteModal({ open: false, record: null }); },
          });
        }}
      />
    </>
  );
};

export default User;