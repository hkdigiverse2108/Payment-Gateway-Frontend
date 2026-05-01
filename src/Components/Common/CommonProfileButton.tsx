import { Avatar, Typography } from "antd";
import type { CommonProfileButtonProps } from "../../Types";

const { Text } = Typography;


const CommonProfileButton = ({ name, role, onClick, avatar }: CommonProfileButtonProps) => {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-2
        px-2 py-1 rounded-xl
        cursor-pointer
        hover:bg-(--accent)/10
        transition
      "
    >
      {avatar ?? (
        <Avatar className="profile-avatar">
          {name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
      )}
      <div className="hidden sm:block leading-tight">
        <Text className="profile-name">
          {name || "User"}
        </Text>

        <Text className="profile-role">
          {role || "Member"}
        </Text>
      </div>
    </div>
  );
};

export default CommonProfileButton;