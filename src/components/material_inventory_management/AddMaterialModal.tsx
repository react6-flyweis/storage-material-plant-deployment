import React from "react";
import Modal from "../Modal";
import { ChevronDownIcon } from "lucide-react";

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMaterialModal: React.FC<AddMaterialModalProps> = ({
  isOpen,
  onClose,
}) => {
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Material Name*
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                  <option>Cement OPC 53</option>
                  <option>Steel TMT Bars</option>
                  <option>River Sand</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category*
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                  <option>Cement</option>
                  <option>Steel</option>
                  <option>Aggregates</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
                </div>
              </div>
            </div>

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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Unit of Measurement*
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                  <option>Bags</option>
                  <option>Metric Tons</option>
                  <option>Cubic Feet</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <ChevronDownIcon className="text-muted-foreground size-4 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="text"
                placeholder="50 Bags"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
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
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-[#F0F0F0] text-[#1A1A1A] font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-3 rounded-xl bg-[#2563EB] text-white font-normal hover:bg-blue-700 transition-colors shadow-sm"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddMaterialModal;
