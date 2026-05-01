import { useMemo, useState } from "react";
import { CommonTablee } from "../../../Components";
import CommonActionColumn from "../../../Components/Common/CommonTable/CommonActionColumn";
import { Queries } from "../../../Api";
import type {  UserFormValues } from "../../../Types";

const User = () => {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const { data: res, isLoading } = Queries.useGetUser();

  const data: UserFormValues[] = useMemo(() => {
    const raw =
      res?.data?.data?.data ??
      res?.data?.data ??
      [];

    if (!Array.isArray(raw)) return [];

    return raw.map((u: any) => ({
      _id: u._id,

      name: u.name || u.username || "N/A",
      role: u.role || "user",

      email: u.email || "-",
      mobileNumber: u.mobileNumber ? String(u.mobileNumber) : "-",
      isActive: !!u.isActive,
    }));
  }, [res]);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return data.filter((user) => {
      const matchSearch =
        (user.name || "").toLowerCase().includes(keyword) ||
        (user.email || "").toLowerCase().includes(keyword) ||
        (user.mobileNumber || "").toLowerCase().includes(keyword);

      const matchActive = activeOnly ? user.isActive : true;

      return matchSearch && matchActive;
    });
  }, [data, search, activeOnly]);

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
          onHandle: (record) => console.log("toggle active", record),
        },
        onEdit: {
          onHandle: (record) => console.log("edit user", record),
        },
        onDelete: {
          onHandle: (record) => console.log("delete user", record),
        },
      }),
    ],
    []
  );

  return (
    <div className="p-4">
      <CommonTablee<UserFormValues>
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
      />
    </div>
  );
};

export default User;