import type { UserFormValues } from "../../../Types";
import { Switch, Tooltip } from "antd";
import { Edit2, Trash2, Globe } from "lucide-react";

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

export const getUserColumns = ({
  handleToggleStatus,
  handleOpenEdit,
  setDeleteModal,
}: any) => [
  {
    title: "User",
    key: "avatarName",
    width: 250,
    render: (_: any, record: UserFormValues) => (
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl text-white font-bold text-sm flex items-center justify-center shadow-sm select-none flex-shrink-0"
          style={{ backgroundColor: getDeterministicColor(record.name) }}
        >
          {getInitials(record.name)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground truncate text-sm">
            {record.name}
          </span>
          <span className="text-muted text-xs truncate">{record.email}</span>
        </div>
      </div>
    ),
  },

  {
    title: "Mobile",
    dataIndex: "mobileNumber",
    render: (val: string) => (
      <span className="font-mono text-xs text-foreground">{val || "-"}</span>
    ),
  },

  {
    title: "Role",
    dataIndex: "role",
    render: (role: string) => {
      const isMerchant =
        role?.toLowerCase() === "user" || role?.toLowerCase() === "merchant";

      return (
        <span
          className={`inline-flex px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
            isMerchant
              ? "bg-slate-500/10 text-slate-500 border border-slate-500/20"
              : "bg-brand-500/10 text-brand-500 border border-brand-500/20"
          }`}
        >
          {role || "Merchant"}
        </span>
      );
    },
  },

  {
    title: "Domain",
    render: (_: any, record: any) => (
      <div className="flex flex-col min-w-0 max-w-[180px]">
        <span className="font-semibold text-foreground truncate text-xs flex items-center gap-1">
          <Globe className="w-3 h-3 text-muted" />
          {record.websiteName || "-"}
        </span>

        {record.websiteUrl && (
          <a
            href={
              record.websiteUrl.startsWith("http")
                ? record.websiteUrl
                : `https://${record.websiteUrl}`
            }
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-brand-500 hover:underline truncate mt-0.5"
          >
            {record.websiteUrl}
          </a>
        )}
      </div>
    ),
  },

  {
    title: "Status",
    dataIndex: "isActive",
    width: 120,
    render: (isActive: boolean, record: any) => (
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(checked, record)}
          size="small"
        />
        <span
          className={`text-xs font-semibold ${
            isActive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
    ),
  },

  {
    title: "Action",
    width: 120,
    render: (_: any, record: any) => (
      <div className="flex gap-1.5">
        <Tooltip title="Edit User">
          <button
            onClick={() => handleOpenEdit(record)}
            className="p-1.5 rounded-lg border border-border/20 text-muted hover:text-foreground hover:bg-tableback/30"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip title="Delete User">
          <button
            onClick={() => setDeleteModal({ open: true, record })}
            className="p-1.5 rounded-lg border border-border/20 text-red-500 hover:bg-red-500/5"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
    ),
  },
];