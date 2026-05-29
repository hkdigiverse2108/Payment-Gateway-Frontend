import { Input, Switch, Dropdown, Checkbox } from "antd";
import { FiSearch } from "react-icons/fi";
import { CommonButton } from "../../../Attribute";
import { IoSettingsSharp, IoDownloadOutline } from "react-icons/io5";

const CommonTableToolbar = ({
  onSearch,
  onActive,
  onAdd,
  addLabel,
  columns,
  columnVisibility,
  setColumnVisibility,
  onExport,
}: any) => {

  const columnOptions = (columns ?? []).map((col: any) => ({
    label: col.title ?? col.dataIndex ?? "",
    value: col.key ?? col.dataIndex,
  }));

  const checkedList = Object.entries(columnVisibility || {})
    .filter(([, v]) => v !== false)
    .map(([k]) => k);

  const allSelected =
    checkedList.length === columnOptions.length &&
    columnOptions.length > 0;

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

  const exportMenu = (
    <div className="column-menu">
      <div className="column-item cursor-pointer" onClick={onExport?.csv}>
        Download CSV
      </div>
      <div className="column-item cursor-pointer" onClick={onExport?.excel}>
        Download Excel
      </div>
    </div>
  );
return (
  <div className="ct-toolbar flex items-center w-full justify-between">

    {/* LEFT SIDE */}
    <div className="ct-mobile-search flex-1 min-w-0">
      {onSearch && (
        <div className="ct-search-box flex items-center w-full">
          <FiSearch className="ct-search-icon" />

          <Input
            className="ct-search-input border-none w-full"
            value={onSearch.value}
            placeholder="Search..."
            onChange={(e) => onSearch.onChange(e.target.value)}
          />
        </div>
      )}
    </div>

    {/* RIGHT SIDE */}
    <div className="ct-toolbar-actions flex items-center gap-2 flex-shrink-0">

      {/* ACTIVE SWITCH */}
      {onActive && (
        <>
          <div className="hidden lg:flex items-center gap-2">
            <span>Active</span>
            <Switch
              size="small"
              checked={onActive.value}
              onChange={onActive.onChange}
            />
          </div>

          <div className="lg:hidden">
            <Switch
              size="small"
              checked={onActive.value}
              onChange={onActive.onChange}
            />
          </div>
        </>
      )}

      {/* EXPORT */}
      {onExport && (
        <Dropdown trigger={["click"]} popupRender={() => exportMenu}>
          <div>
            <CommonButton variant="icon-only" className="ct-icon-btn">
              <IoDownloadOutline />
            </CommonButton>
          </div>
        </Dropdown>
      )}

      {/* SETTINGS */}
      {columns && (
        <Dropdown trigger={["click"]} popupRender={() => columnMenu}>
          <div>
            <CommonButton variant="icon-only" className="ct-icon-btn">
              <IoSettingsSharp />
            </CommonButton>
          </div>
        </Dropdown>
      )}

      {/* ADD BUTTON */}
      {onAdd && (
        <CommonButton className="ct-add-btn" onClick={onAdd}>
          {addLabel || "+ Add"}
        </CommonButton>
      )}

    </div>
  </div>
);
};

export default CommonTableToolbar;