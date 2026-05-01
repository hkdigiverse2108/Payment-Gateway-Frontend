import React from "react";
import { Space, Switch, Segmented, Button } from "antd";

export type TableControlValue = "default" | "bordered";

export interface CommonTableControlsProps {
  bordered: boolean;
  setBordered: (value: boolean) => void;

  fixed: boolean;
  setFixed: (value: boolean) => void;

  expanded: boolean;
  setExpanded: (value: boolean) => void;

  empty: boolean;
  setEmpty: (value: boolean) => void;

  count: number;
  setCount: (value: number) => void;

  onScrollTo10?: () => void;
}

const CommonTableControls: React.FC<CommonTableControlsProps> = ({
  bordered,
  setBordered,
  fixed,
  setFixed,
  expanded,
  setExpanded,
  empty,
  setEmpty,
  count,
  setCount,
  onScrollTo10,
}) => {
  return (
    <Space wrap style={{ marginBottom: 12 }}>
      {/* Border Toggle */}
      <Switch
        checked={bordered}
        onChange={setBordered}
        checkedChildren="Bordered"
        unCheckedChildren="Bordered"
      />

      {/* Fixed Columns */}
      <Switch
        checked={fixed}
        onChange={setFixed}
        checkedChildren="Fixed"
        unCheckedChildren="Fixed"
      />

      {/* Expandable Rows */}
      <Switch
        checked={expanded}
        onChange={setExpanded}
        checkedChildren="Expandable"
        unCheckedChildren="Expandable"
      />

      {/* Empty State */}
      <Switch
        checked={empty}
        onChange={setEmpty}
        checkedChildren="Empty"
        unCheckedChildren="Empty"
      />

      {/* Row Count */}
      <Segmented
        value={count}
        onChange={(val) => setCount(val as number)}
        options={[
          { label: "None", value: 0 },
          { label: "Few", value: 5 },
          { label: "More", value: 20 },
        ]}
      />

      {/* Scroll Button */}
      {onScrollTo10 && (
        <Button onClick={onScrollTo10}>
          Scroll To 10
        </Button>
      )}
    </Space>
  );
};

export default CommonTableControls;