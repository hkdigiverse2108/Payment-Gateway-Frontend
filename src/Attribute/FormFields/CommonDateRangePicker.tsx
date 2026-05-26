import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";

const { RangePicker } = DatePicker;

type Props = {
  value?: RangePickerProps["value"];
  onChange?: RangePickerProps["onChange"];
};

const CommonDateRangePicker = ({ value, onChange }: Props) => {
  return (
    <RangePicker
      value={value}
      onChange={onChange}
      className="common-date-range"
    />
  );
};

export default CommonDateRangePicker;