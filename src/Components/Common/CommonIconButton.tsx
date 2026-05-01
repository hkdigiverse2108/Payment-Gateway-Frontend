/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "antd";
import type { CommonIconButtonProps } from "../../Types";

const CommonIconButton = ({ icon: Icon, onClick, badge }: CommonIconButtonProps) => {
  return (
    <Button
      type="default"
      onClick={onClick}
      className="
        relative flex items-center justify-center
        w-10 h-10 rounded-xl
        bg-surface!
        text-(--foreground)!
        border border-(--border)
        hover:bg-(--accent)!
        transition
        overflow-hidden
      "
      icon={
        <span className="text-(--foreground)">
          <Icon style={{ fontSize: 18 }} />
        </span>
      }
    >
      {badge && (
        <span
          className="
            absolute top-1 right-1 w-2 h-2
            rounded-full
          "
          style={{ backgroundColor: "var(--success)" }}
        />
      )}
    </Button>
  );
};

export default CommonIconButton;