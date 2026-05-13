import React from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonInput from "../common_component/CommonInput";

interface PartCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode: "add" | "edit";
}

const PartCostModal: React.FC<PartCostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = React.useState({
    partName: "",
    partColor: "",
    costUnit: "",
    mbsCost: "",
    currentMarketCost: "",
    description: "",
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        partName: initialData.partName || "",
        partColor: initialData.partColour || "",
        costUnit: initialData.costUnit || "",
        mbsCost: initialData.mbsCost?.toString() || "",
        currentMarketCost: initialData.currentMarketCost?.toString() || "",
        description: initialData.description || "",
      });
    } else {
      setFormData({
        partName: "",
        partColor: "",
        costUnit: "",
        mbsCost: "",
        currentMarketCost: "",
        description: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New Part Cost" : "Edit Part Cost"}
      width="max-w-xl"
    >
      <div className="p-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div className="md:col-span-2">
            <CommonInput
              label="Part Name"
              value={formData.partName}
              onChange={(val) => handleChange("partName", val)}
              placeholder="'30_VRR48'"
            />
          </div>
          <CommonInput
            label="Part Color"
            value={formData.partColor}
            onChange={(val) => handleChange("partColor", val)}
            placeholder="'--'"
          />
          <CommonInput
            label="Cost Unit"
            value={formData.costUnit}
            onChange={(val) => handleChange("costUnit", val)}
            placeholder="'FT'"
          />
          <CommonInput
            label="MBS Cost"
            value={formData.mbsCost}
            onChange={(val) => handleChange("mbsCost", val)}
            placeholder="2.9"
          />
          <CommonInput
            label="Current Market Cost"
            value={formData.currentMarketCost}
            onChange={(val) => handleChange("currentMarketCost", val)}
            placeholder="-"
          />
          <div className="md:col-span-2">
            <CommonInput
              label="Description"
              value={formData.description}
              onChange={(val) => handleChange("description", val)}
              placeholder="'VRR+ Insul R10'"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button variant="white" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="purpleFilled" onClick={handleSave} >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PartCostModal;
