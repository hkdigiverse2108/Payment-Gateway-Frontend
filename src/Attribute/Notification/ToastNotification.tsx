import { notification } from "antd";
import type { NotificationType } from "../../Types";

export const showNotification = ( type: NotificationType, title: string, description?: string ) => {
  notification[type]({
    title,
    description,
    placement: "topRight",
    duration: 3,
  });
};