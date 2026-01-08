import React from "react";
import Modal from "../Modal";
import DrawingImg from "../../assets/drawingImg.svg";
import { ArrowDown, Paperclip, X } from "lucide-react";

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
    status: string;
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
            <button
              onClick={onClose}
              className="rounded-full hover:bg-gray-100 p-2 absolute sm:-top-3 sm:right-0 top-0 right-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Image Preview */}
        <div className="flex-1 overflow-y-auto py-4 md:py-8 bg-gray-50 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full flex items-center justify-center">
            <img
              src={DrawingImg}
              alt={drawing.name}
              className="max-w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sm:py-6 py-2 mt-2 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2 sm:px-6">
            <button className="flex items-center gap-2 md:px-4 px-2 py-1 bg-[#9CA3AF] hover:bg-[#E2E8F0] text-white rounded-full md:text-base text-sm font-medium transition-all">
              <ArrowDown className="md:w-5 md:h-5 w-4 h-4" />
              Download
            </button>

            <div className="flex items-center gap-3 ml-auto flex-wrap">
              {drawing.status === "Approved" ? (
                <div className="flex items-center gap-2">
                  <p className="text-black text-sm font-normal">
                    31-April-2025
                  </p>
                  <span className="px-5 py-1.5 bg-[#DCFCE7] text-[#16A34A] rounded-full text-sm font-normal border border-[#BBF7D0]">
                    Approved
                  </span>
                </div>
              ) : drawing.status === "Revision Required" ? (
                <span className="px-5 py-1.5 bg-[#FFF7ED] text-[#FF9409] rounded-full text-sm font-normal border border-[#FFEDD5]">
                  Sent for Revision
                </span>
              ) : (
                <>
                  <button className="px-5 py-1.5 bg-[#FF9409] text-white rounded-full text-sm font-normal shadow-sm shadow-orange-100">
                    Revision Required
                  </button>
                  <button className="px-5 py-1.5 bg-[#3AB449]  text-white rounded-full text-sm font-normal shadow-sm shadow-green-100">
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Comment box only for Pending Review */}
          {drawing.status === "Pending Review" && (
            <div className="flex gap-1 flex-wrap pt-6 w-full border-t border-gray-300 px-2 sm:px-6">
              <div className="flex sm:w-4/5 w-full flex-wrap items-center gap-2 border border-gray-200 rounded-xl sm:p-2 p-1 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  type="text"
                  placeholder="Type your Comment..."
                  className="flex-1 px-3 py-2 text-sm text-gray-600 outline-none w-full"
                />
                <button className="p-2 text-[#00000080] hover:text-gray-600">
                  <Paperclip className="w-5 h-5 -rotate-5" />
                </button>
              </div>
              <button className="text-[9px] ml-auto sm:text-sm font-normal bg-[linear-gradient(90deg,#2563EB_0%,#4F46E5_100%)] hover:bg-blue-700 text-white rounded-lg flex items-center md:gap-2 gap-1 md:px-6 px-3 py-3 h-auto sm:min-w-[100px]">
                Send Comment
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewDrawingModal;
