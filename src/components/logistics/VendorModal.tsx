import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";
import CommonDropdown from "../common_component/CommonDropdown";

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode: "add" | "edit";
  entityType?: string;
}

const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  entityType = "Vendor",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    materialTypes: "All Materials",
    status: "",
    notes: "",
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name || "",
        contact: initialData.contact || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        address: initialData.address || "789 Industrial Park, Austin, TX 78728",
        materialTypes: initialData.materialTypes?.join(", ") || "All Materials",
        status: initialData.status || "",
        notes:
          initialData.notes ||
          `Additional notes about this ${entityType.toLowerCase()}...`,
      });
    } else {
      setFormData({
        name: "",
        contact: "",
        email: "",
        phone: "",
        address: "",
        materialTypes: "All Materials",
        status: "",
        notes: `Additional notes about this ${entityType.toLowerCase()}...`,
      });
    }
  }, [initialData, isOpen, mode, entityType]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? `Add ${entityType}` : `Edit ${entityType}`}
      width="max-w-2xl"
      height="h-[60vh]"
    >
      <div className="p-2 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2">
            <CommonInput
              label={`${entityType} Name`}
              required
              value={formData.name}
              onChange={(val) => handleChange("name", val)}
              placeholder={
                entityType === "Vendor"
                  ? "Steel Shippers Inc."
                  : "IronHaul Logistics"
              }
            />
          </div>
          <div className="md:col-span-2">
            <CommonInput
              label="Contact Name"
              required
              value={formData.contact}
              onChange={(val) => handleChange("contact", val)}
              placeholder="Robert Anderson"
            />
          </div>
          <CommonInput
            label="Email"
            required
            value={formData.email}
            onChange={(val) => handleChange("email", val)}
            placeholder={`${entityType.toLowerCase()}@company.com`}
          />
          <CommonInput
            label="Phone"
            required
            value={formData.phone}
            onChange={(val) => handleChange("phone", val)}
            placeholder="(555) 111-2222"
          />
          <div className="md:col-span-2">
            <CommonInput
              label="Address"
              required
              value={formData.address}
              onChange={(val) => handleChange("address", val)}
              placeholder="789 Industrial Park, Austin, TX 78728"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <CommonDropdown
              label="Material Types"
              options={[
                { label: "All Materials", value: "All Materials" },
                { label: "Steel & Metal", value: "Steel & Metal" },
                { label: "Concrete", value: "Concrete" },
              ]}
              value={formData.materialTypes}
              onChange={(val) => handleChange("materialTypes", val)}
              placeholder="Select Materials"
            />
            <p className="text-xs text-[#919EAB] px-1">
              Please add at least one material type
            </p>
          </div>

          <div className="md:col-span-2">
            <CommonInput
              label="Status"
              required
              value={formData.status}
              onChange={(val) => handleChange("status", val)}
              placeholder=""
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-[#212B36]">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder={`Additional notes about this ${entityType.toLowerCase()}...`}
              className="w-full h-32 px-6 py-4 bg-white border-[0.7px] border-[#D1D5DC] rounded-[11px] text-sm focus:border-[#4A5565] outline-none shadow-xs transition-all resize-none placeholder:text-[#919EAB]"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            {mode === "add" ? `Add ${entityType}` : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VendorModal;
