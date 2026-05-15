import React from "react";
import Modal from "../Modal";
import Button from "./Button";
import { Trash2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <Trash2 className="text-red-500" size={32} />;
      default:
        return null;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case "danger":
        return "redFilled";
      default:
        return "gradient";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width="max-w-md">
      <div className="flex flex-col items-center text-center p-4 space-y-4">
        <div className={`p-4 rounded-full ${variant === "danger" ? "bg-red-50" : "bg-blue-50"}`}>
          {getIcon()}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#212B36]">{title}</h3>
          <p className="text-sm text-[#637381] leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex w-full gap-3 pt-4">
          <Button variant="white" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button 
            variant={getConfirmButtonVariant() as any} 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
