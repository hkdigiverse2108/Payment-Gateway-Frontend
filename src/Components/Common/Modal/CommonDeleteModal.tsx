import { useState, type FC, useEffect } from "react";
import type { CommonDeleteModalProps } from "../../../Types";
import CommonModal from "./CommonModal";
import { CommonButton } from "../../../Attribute";
import { Input } from "antd";

const CommonDeleteModal: FC<CommonDeleteModalProps> = ({ open, title, description, itemName, loading = false, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");

  // Clear input when modal closes/opens
  useEffect(() => {
    if (!open) {
      setConfirmText("");
    }
  }, [open]);

  const isConfirmed = confirmText === "DELETE";

  return (
    <CommonModal isOpen={open} onClose={onClose} title={title || "Confirm Delete"} >
      <div className="space-y-4">
        <p className="text-foreground">
          {description || "Are you sure you want to delete"}
          {itemName && <span className="font-semibold text-red-500"> "{itemName}"</span>}? This action is permanent and cannot be undone.
        </p>
        
        <div className="bg-tableback/30 p-3 rounded-lg border border-border/20">
          <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wider">
            Type <span className="text-red-500 font-bold">DELETE</span> to confirm
          </label>
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here..."
            className="h-10 text-foreground bg-surface border-border/40 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
          />
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <CommonButton variant="ghost" onClick={onClose}>
            Cancel
          </CommonButton>
          <CommonButton 
            variant="danger" 
            loading={loading} 
            disabled={!isConfirmed || loading} 
            onClick={onConfirm} 
            className={`shadow-md shadow-red-500/10 ${!isConfirmed ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Delete Permanently
          </CommonButton>
        </div>
      </div>
    </CommonModal>
  );
};

export default CommonDeleteModal;