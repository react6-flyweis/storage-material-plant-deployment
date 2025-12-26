import React from "react";
import Modal from "../Modal";

interface LogMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogMaintenanceModal: React.FC<LogMaintenanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Details"
      width="max-w-4xl"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Equipment Name*
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-[#D5D5D5] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>Concrete Mixer 350L</option>
                <option>Excavator CAT 320D</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Category*
            </label>
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-[#D5D5D5] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
                <option>Heavy Equipment</option>
                <option>Small Equipment</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Maintenance Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Maintenance Type*
            </label>
            <input
              type="text"
              placeholder="Repair"
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Service Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Service Date*
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 text-gray-700"
            />
          </div>

          {/* Vendor / Mechanic */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Vendor / Mechanic*
            </label>
            <input
              type="text"
              placeholder="Vendor / Mechanic Name"
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Cost */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Cost</label>
            <input
              type="text"
              placeholder="$400"
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Next Maintenance Due */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Next Maintenance Due*
            </label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <input
              type="text"
              placeholder=""
              className="w-full px-4 py-3 border border-[#D5D5D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end pt-4">
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium hover:opacity-90 transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LogMaintenanceModal;
