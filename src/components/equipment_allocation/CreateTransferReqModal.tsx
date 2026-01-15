import React from "react";
import Modal from "../Modal";
import { ChevronDownIcon, Upload } from "lucide-react";

interface CreateTransferReqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const CreateTransferReqModal: React.FC<CreateTransferReqModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Transfer Request"
      width="max-w-xl"
      height="max-h-[calc(100vh-20rem)]"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Equipment Name*
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>Concrete Mixer 350L</option>
                <option>Excavator CAT 320D</option>
                <option>Generator 25 kVA</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <ChevronDownIcon className="w-4 h-4" />
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
                <option>Heavy Equipment</option>
                <option>Light Machinery</option>
                <option>Vehicles</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Equipment ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              From Site*
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>Heavy Equipment</option>
                <option>Light Machinery</option>
                <option>Vehicles</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Manufacturer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">To Site</label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>Heavy Equipment</option>
                <option>Light Machinery</option>
                <option>Vehicles</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Model Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Priority
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Serial Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Purpose / Reason*
            </label>
            <input
              required
              type="text"
              placeholder="SN-45SD778812"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Power / Capacity */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Requsted By (auto-fill)
            </label>
            <input
              type="text"
              placeholder="PM Rakesh"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Fuel Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Expected Transfer Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <input
              type="text"
              placeholder="Notes"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Upload Supporting File (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder="Upload"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 cursor-pointer"
              />
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <Upload className="w-5 h-5" />
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-lg bg-(--button-bg-primary-color) text-white font-medium hover:opacity-90 transition-colors shadow-sm"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTransferReqModal;
