import React from "react";
import Modal from "../Modal";

interface ViewDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  drawing: {
    name: string;
    id: string;
    location: string;
    uploadedBy: string;
    receivedDate: string;
    imageUrl: string;
  };
}

const ViewDrawingModal: React.FC<ViewDrawingModalProps> = ({
  isOpen,
  onClose,
  drawing,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" width="max-w-6xl">
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-100 bg-white sticky top-0 z-10 gap-4 md:gap-6">
          <div>
            <h2 className="xl:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {drawing.name}
            </h2>
            <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">
              {drawing.id}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap md:flex-nowrap gap-4 md:gap-12 text-left md:text-right">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Pune,
              </p>
              <p className="text-xs md:text-sm font-semibold text-gray-900 mt-1">
                {drawing.location}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Uploaded By:
              </p>
              <p className="text-xs md:text-sm font-semibold text-gray-900 mt-1">
                {drawing.uploadedBy}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Received on
              </p>
              <p className="text-xs md:text-sm font-semibold text-gray-600 mt-1">
                {drawing.receivedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Content - Image Preview */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full flex items-center justify-center">
            <img
              src={drawing.imageUrl}
              alt={drawing.name}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-6 md:px-8 md:py-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-t border-gray-100 bg-white sticky bottom-0 z-10 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#94A3B8] text-white rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download
          </button>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="px-8 py-2.5 bg-[#F59E0B] text-white rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-all">
              Revision Required
            </button>
            <button className="px-10 py-2.5 bg-[#3AB449] text-white rounded-full text-sm font-bold shadow-sm hover:opacity-90 transition-all">
              Approve
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDrawingModal;
