import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";

interface AddShipperMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { name: string; email: string; phone: string }) => void;
}

const AddShipperMailModal: React.FC<AddShipperMailModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "Steel Investment",
    email: "steelinvestment@gmail.com",
    phone: "0987654321",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    onAdd(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new Shipper mail"
      width="max-w-md"
    >
      <div className="space-y-5 py-2">
        <CommonInput
          label="Shipper Name"
          value={formData.name}
          onChange={(val) => handleChange("name", val)}
          placeholder="Enter shipper name"
        />
        <CommonInput
          label="Add Email"
          value={formData.email}
          onChange={(val) => handleChange("email", val)}
          placeholder="Enter email address"
        />
        <CommonInput
          label="Add Phone Number"
          value={formData.phone}
          onChange={(val) => handleChange("phone", val)}
          placeholder="Enter phone number"
        />

        <div className="flex items-center justify-between gap-3 pt-6">
          <Button 
            variant="white" 
            size="sm"
            onClick={onClose} 
          >
            Cancel
          </Button>
          <Button 
            variant="purpleFilled" 
            onClick={handleAdd} 
            size="sm"
          >
            Select & Add
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddShipperMailModal;
