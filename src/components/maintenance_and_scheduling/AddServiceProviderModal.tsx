import React from "react";
import Modal from "../Modal";

interface AddServiceProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const AddServiceProviderModal: React.FC<AddServiceProviderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Service Provider"
      width="w-xl"
      height="h-[50vh]"
    >
      <form className="flex flex-col h-full max-h-[70vh]">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Provider Name*
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Services
                </label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700">
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

              {/* Breakdown Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  placeholder="Repair"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Severity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Rating
                </label>
                <input
                  max="5"
                  min="1"
                  type="number"
                  placeholder="Rating"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Avg Cost
                </label>
                <input
                  type="number"
                  placeholder="Avg Cost"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
              </div>

              {/* Upload Images */}
              {/* <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    placeholder="Upload"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div> */}

              {/* Reported By */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Last Service
                </label>
                <input
                  type="date"
                  placeholder="Last Service"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end pt-4 border-t border-gray-300 mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  className="px-8 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium hover:opacity-90 transition-colors shadow-sm"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddServiceProviderModal;
