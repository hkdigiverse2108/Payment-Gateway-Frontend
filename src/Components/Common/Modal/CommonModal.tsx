import { Modal } from "antd";
import type { FC } from "react";
import type { CommonModalProps } from "../../../Types";

const CommonModal: FC<CommonModalProps> = ({ isOpen, onClose, children, title, subTitle, className, width = 600 }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      closable
      width={width}
      className={["common-modal", className, "rounded-3xl"].filter(Boolean).join(" ")}
    >
      {(title || subTitle) && (
        <div className="common-modal-title mb-3 border-b pb-2">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subTitle && (
            <p className="text-sm text-backgroundlight">{subTitle}</p>
          )}
        </div>
      )}
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {children}
      </div>
    </Modal>
  );
};

export default CommonModal;
