import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Store";
import { CommonButton } from "../../Attribute";
import type { CommonBottomActionBarProps } from "../../Types";

const CommonBottomActionBar: FC<CommonBottomActionBarProps> = ({ children, isLoading, disabled, save, submit, clear, onClear, onSave, onSaveAndNew }) => {
  const { isExpanded, isHovered } = useAppSelector((state) => state.layout);
  const navigate = useNavigate();
  return (
    <div
      className={`commonbutton-actionbar-main ${isExpanded || isHovered
        ? "lg:ml-[290px] lg:w-[calc(100%-290px)]"
        : "lg:ml-[90px] lg:w-[calc(100%-90px)]"
      }`}
    >
      <div className="commonbutton-actionbar-inner">
        {children}
        {clear && (
          <>
            <div className="flex gap-2">
              <CommonButton variant="outlined" onClick={() => navigate(-1)}  title="Cancel" />
              <CommonButton type="primary" onClick={onClear} title="Clear" />
            </div>
            <div className="commonbutton-actionbar-div">
              <CommonButton htmlType="submit" type="primary" title="Save" onClick={onSave} loading={isLoading} disabled={disabled} />
              <CommonButton htmlType="button" type="default" title="Save & Create New" onClick={onSaveAndNew} loading={isLoading} disabled={disabled} />
            </div>
          </>
        )}
        {save && (
          <div className="commonbutton-actionbar-div">
            <CommonButton type="default" onClick={() => navigate(-1)} title="Back" />
            <CommonButton htmlType="submit" title="Save" onClick={onSave} loading={isLoading} disabled={disabled} />
          </div>
        )}
        {submit && (
          <div className="commonbutton-actionbar-div">
            <CommonButton htmlType="submit" title="Save" loading={isLoading} disabled={disabled} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonBottomActionBar;