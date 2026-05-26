import { Input, Switch, Dropdown, Checkbox } from "antd";
import { FiSearch, FiColumns } from "react-icons/fi";
import { CommonButton } from "../../../Attribute";
import { IoSettingsSharp } from "react-icons/io5";

const CommonTableToolbar = ({
  onSearch,
  onActive,
  onAdd,
  addLabel,
  columns,
  columnVisibility,
  setColumnVisibility,
}: any) => {
  const columnOptions = (columns ?? []).map((col: any) => ({
    label: col.title ?? col.dataIndex ?? "",
    value: col.key ?? col.dataIndex,
  }));

  const checkedList = Object.entries(columnVisibility || {})
    .filter(([, v]) => v !== false)
    .map(([k]) => k);

  const allSelected =
    checkedList.length === columnOptions.length && columnOptions.length > 0;

  const columnMenu = (
    <div className="column-menu">
      <Checkbox
        checked={allSelected}
        indeterminate={
          checkedList.length > 0 &&
          checkedList.length < columnOptions.length
        }
        onChange={(e) => {
          const checked = e.target.checked;
          const map: any = {};

          columns.forEach((col: any) => {
            const key = col.key ?? col.dataIndex;
            map[key] = checked;
          });

          setColumnVisibility(map);
              }}
      >
        Select All
      </Checkbox>

      <div className="mt-2 flex flex-col gap-1">
        {columnOptions.map((opt: any) => (
          <label key={opt.value} className="column-item">
            <Checkbox
              checked={checkedList.includes(opt.value)}
              onChange={(e) => {
                const checked = e.target.checked;

                const newList = checked
                  ? [...checkedList, opt.value]
                  : checkedList.filter((v) => v !== opt.value);

                const map: any = {};
                columns.forEach((col: any) => {
                  const key = col.key ?? col.dataIndex;
                  map[key] = newList.includes(key);
                });

                setColumnVisibility(map);
              }}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="table-toolbar">
      {/* LEFT */}
      <div className="toolbar-left">
        {onSearch && (
          <div className="toolbar-search">
            <FiSearch />
            <Input
              value={onSearch.value}
              placeholder="Search..."
              onChange={(e) => onSearch.onChange(e.target.value)}
              bordered={false}
            />
          </div>
        )}
      </div>

      <div className="toolbar-center">
        {onActive && (
          <div className="toolbar-active">
            <span>Active</span>
            <Switch
              size="small"
              checked={onActive.value}
              onChange={onActive.onChange}
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="toolbar-right">
        {columns && (
          <Dropdown trigger={["click"]} dropdownRender={() => columnMenu}>
            <CommonButton variant="icon-only" className="icon-btn">
              <IoSettingsSharp />
            </CommonButton>
          </Dropdown>
        )}

        {onAdd && (
          <CommonButton className="add-btn">
            {addLabel || "+ Add"}
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default CommonTableToolbar;