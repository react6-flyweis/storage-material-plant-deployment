import React from "react";
import Modal from "../Modal";
import { ChevronDownIcon } from "lucide-react";

interface AssignEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssignEquipmentModal: React.FC<AssignEquipmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Equipment"
      width="max-w-xl"
      height="max-h-[calc(100vh-20rem)]"
    >
      <form className="flex flex-col max-h-full">
        <div className="overflow-y-auto pr-2 max-h-[400px] scrollbar-thin scrollbar-thumb-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            {/* Equipment Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Equipment Name*
              </label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                  <option>Concrete Mixer 350L</option>
                  <option>Excavator CAT 320D</option>
                  <option>Generator 25 kVA</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Assigned Operator
              </label>
              <input
                type="text"
                placeholder="EX-302, DG-065"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Equipment ID / Asset Code*
              </label>
              <input
                type="text"
                placeholder="Honda"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Equipment Status*
              </label>
              <input
                type="text"
                placeholder="CAT 320D"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>

            {/* Serial Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Assign Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-5 pt-6 border-t border-gray-300 mt-4">
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
              Assign
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AssignEquipmentModal;
