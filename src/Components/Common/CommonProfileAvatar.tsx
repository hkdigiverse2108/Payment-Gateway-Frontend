import type { CommonProfileAvatarProps } from "../../Types";
import { Avatar, theme } from "antd";
import { type FC } from "react";

const CommonProfileAvatar: FC<CommonProfileAvatarProps> = ({ fullName }) => {
  const { token } = theme.useToken();
  const nameWords = fullName?.trim()?.split(/\s+/) || [];
  const initials =
    ((nameWords[0]?.[0] || "") + (nameWords.at(-1)?.[0] || "")).toUpperCase();
  return (
    <Avatar style={{ backgroundColor: token.colorPrimary }} >
      {initials}
    </Avatar>
  );
};

export default CommonProfileAvatar;