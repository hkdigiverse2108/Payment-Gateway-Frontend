import { useEffect, useMemo, useState } from "react";
import { CommonTable } from "../../Components";
import CommonActionColumn from "../../Components/Common/CommonTable/CommonActionColumn";
import { Queries } from "../../Api";
import type {  UserFormValues } from "../../Types";
import { useNavigate } from "react-router-dom";
import { PAGE_TITLE, ROUTES } from "../../Constants";
import CommonBreadcrumbs from "../../Components/Common/CommonBreadcrumbs";
import { BREADCRUMBS } from "../../Data";

const User = () => {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const navigate = useNavigate();
  const { data: userData, isLoading } = Queries.useGetUser();
  const tableData: UserFormValues[] = useMemo(() => {
  const raw = userData?.data?.data || [];

  if (!Array.isArray(raw)) return [];
  return raw.map((user: any) => ({
    ...user,
    isActive: Boolean(user.isActive),
  }));
  }, [userData]);
  const [users, setUsers] = useState<UserFormValues[]>([]);
  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();
    return users.filter((user) => {
      const matchSearch =
        (user.name || "").toLowerCase().includes(keyword) ||
        (user.email || "").toLowerCase().includes(keyword);
      const matchActive = activeOnly
        ? user.isActive === true
        : user.isActive === false;
      return matchSearch && matchActive;
    });
  }, [tableData, search, activeOnly]);
  const columns = useMemo(
    () => [
      {
        title: "Name", dataIndex: "name",
        key: "name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Phone",
        dataIndex: "mobileNumber",
        key: "mobileNumber",
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        render: (value: boolean) =>
          value ? (
            <span className="text-green-600 font-medium">Active</span>
          ) : (
            <span className="text-red-500 font-medium">Inactive</span>
          ),
      },
      CommonActionColumn<UserFormValues>({
        onActive: {
          onHandle: (record) => {
            setUsers((prev) =>
              prev.map((user: any) =>
                user._id === record._id
                  ? {
                      ...user,
                      isActive: !user.isActive,
                    }
                  : user
              )
            );
          },
        },
        onEdit: {
          onHandle: (record) => {
          navigate(ROUTES.USERS.ADD_EDIT, {
          state: { user: record },
            });
          },
        },
        onDelete: {
          onHandle: (record) =>  console.log("deleted", record),
        }
      }),
    ],
    []
  );
  useEffect(() => {
  setUsers(tableData);
}, [tableData]);
const handleAdd = () => {
  navigate(ROUTES.USERS.ADD_EDIT);
};
  return (
    <>
      <CommonBreadcrumbs title={PAGE_TITLE.USERS.BASE} maxItems={1} breadcrumbs={BREADCRUMBS.USERS.BASE} />
      <div className="pt-2">
        <CommonTable<UserFormValues>
          rowKey="_id"
          dataSource={filteredData}
          columns={columns}
          loading={isLoading}
          pagination={{ current: 1, pageSize: 10 }}
          onSearch={{
            value: search,
            onChange: setSearch,
          }}
          onActive={{
            value: activeOnly,
            onChange: setActiveOnly,
          }}
          onAdd={handleAdd}
        />
      </div>
    </>
  );
};

export default User;