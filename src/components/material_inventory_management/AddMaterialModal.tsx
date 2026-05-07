import React, { useState } from "react";
import Modal from "../Modal";
import CommonDropdown from "../common_component/CommonDropdown";
import Button from "../common_component/Button";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
  onSubmit, 
}) => {
  const [material, setMaterial] = useState("Cement OPC 53");
  const [category, setCategory] = useState("Cement");
  const [unit, setUnit] = useState("Bags");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Material Stock"
      width="max-w-xl"
    >
      <form className="flex flex-col h-full max-h-[400px]">
        <div className="overflow-y-auto pr-2 max-h-[600px] scrollbar-thin scrollbar-thumb-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            {/* Material Name */}
            <CommonDropdown
              label="Material Name*"
              value={material}
              onChange={setMaterial}
              options={[
                { label: "Cement OPC 53", value: "Cement OPC 53" },
                { label: "Steel TMT Bars", value: "Steel TMT Bars" },
                { label: "River Sand", value: "River Sand" },
              ]}
              className="w-full"
            />

            {/* Category */}
            <CommonDropdown
              label="Category*"
              value={category}
              onChange={setCategory}
              options={[
                { label: "Cement", value: "Cement" },
                { label: "Steel", value: "Steel" },
                { label: "Aggregates", value: "Aggregates" },
              ]}
              className="w-full"
            />

            {/* Description - Full Width */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Used for slab casting and RCC work."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700 resize-none"
              />
            </div>

            {/* Unit of Measurement */}
            <CommonDropdown
              label="Unit of Measurement*"
              value={unit}
              onChange={setUnit}
              options={[
                { label: "Bags", value: "Bags" },
                { label: "Metric Tons", value: "Metric Tons" },
                { label: "Cubic Feet", value: "Cubic Feet" },
              ]}
              className="w-full"
            />

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="text"
                placeholder="50 Bags"
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Storage Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Storage Location*
              </label>
              <input
                type="text"
                placeholder="Central Yard"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Linked Project */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Linked Project
              </label>
              <input
                type="text"
                placeholder="ABC Warehouse Project"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Minimum Stock Threshold */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Minimum Stock Threshold
              </label>
              <input
                type="text"
                placeholder="300 bags"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Date of Stock Entry */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Date of Stock Entry*
              </label>
              <input
                type="date"
                placeholder="dd - mm - yyyy"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-5 pt-6 border-t border-gray-100 mt-4">
            <Button
            variant="outline"
            size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
            variant="primary"
            size="md"
              onClick={onSubmit}
            >
              Create
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddMaterialModal;
