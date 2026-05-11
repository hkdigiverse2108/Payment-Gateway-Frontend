import type { FC } from "react";
import type { CommonDeleteModalProps } from "../../../Types";
import CommonModal from "./CommonModal";
import { CommonButton } from "../../../Attribute";

const CommonDeleteModal: FC<CommonDeleteModalProps> = ({ open, title, description, itemName, loading = false, onClose, onConfirm }) => {
  return (
    <CommonModal isOpen={open} onClose={onClose} title={title || "Confirm Delete"} >
      <p className="text-foreground">
        {description || "Are you sure you want to delete"}
        {itemName && <span className="font-semibold"> "{itemName}"</span>}?
      </p>
      <div className="flex justify-end gap-2 mt-5">
        <CommonButton onClick={onClose}>
          Cancel
        </CommonButton>
        <CommonButton danger type="primary" loading={loading} onClick={onConfirm} >
          Delete
        </CommonButton>
      </div>
    </CommonModal>
  );
};

export default CommonDeleteModal;