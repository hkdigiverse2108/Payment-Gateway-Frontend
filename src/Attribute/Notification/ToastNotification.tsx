import { useEffect } from "react";
import { App } from "antd";
import type { NotificationType } from "../../Types";
import { setNotificationApi, getNotificationApi } from "./NotificationHelper";

const ToastNotification = () => {
  const { notification } = App.useApp();
  useEffect(() => {
    setNotificationApi(notification);
  }, [notification]);
  return null;
};

export default ToastNotification;

// eslint-disable-next-line react-refresh/only-export-components
export const showNotification = ( type: NotificationType, title: string, description?: string ) => {
  const notificationApi = getNotificationApi();
  const isMobile = window.innerWidth < 768;
  notificationApi?.[type]({
    message: title,
    description,
    placement: isMobile ? "top" : "topRight",
    duration: 3,
    className: isMobile
      ? `common-notification common-notification-${type} notification-mobile`
      : `common-notification common-notification-${type}`,
  });
};