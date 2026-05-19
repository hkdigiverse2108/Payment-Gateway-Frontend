import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatRelativeTime = (date?: string | Date) => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

export const formatAbsoluteDate = (date?: string | Date) => {
  if (!date) return "";
  return dayjs(date).format("DD MMM YYYY, hh:mm A");
};
