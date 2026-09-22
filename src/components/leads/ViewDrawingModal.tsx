import React from "react";
import Modal from "../Modal";
import { ArrowDown, X, FileText } from "lucide-react";
import { downloadFile } from "../../lib/utils";

export interface DrawingCommentUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

export interface DrawingComment {
  _id?: string;
  text: string;
  commentedBy?: string | DrawingCommentUser | null;
  commentedByCustomer?: DrawingCommentUser | null;
  authorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

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
    rejectionReason?: string;
    customerSuggestions?: string;
    comments?: DrawingComment[];
  } | null;
}

const ViewDrawingModal: React.FC<ViewDrawingModalProps> = ({
  isOpen,
  onClose,
  drawing,
}) => {
  if (!drawing) return null;

  const getLatestCommentText = () => {
    if (drawing.comments && drawing.comments.length > 0) {
      const sorted = [...drawing.comments].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[0]?.text || "";
    }
    return drawing.customerSuggestions || "";
  };

  const customerSuggestionText = getLatestCommentText();

  const isImage = (fileName?: string) => {
    const ext = fileName ? fileName.split(".").pop()?.toLowerCase() : "";
    return ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext || "");
  };

  const getStatusBadgeStyle = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("approved")) {
      return "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]";
    }
    if (s.includes("revision") || s.includes("required") || s.includes("rejected")) {
      return "bg-[#FFF7ED] text-[#FF9409] border-[#FFEDD5]";
    }
    if (s.includes("pending")) {
      return "bg-[#FEFAE2] text-[#F0CC16] border-[#FEFAE2]";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getDisplayStatusText = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("rejected")) {
      return "Revision Requested";
    }
    return status || "Pending";
  };

  const hasRevision =
    (drawing.status &&
      (drawing.status.toLowerCase().includes("revision") ||
        drawing.status.toLowerCase().includes("required") ||
        drawing.status.toLowerCase().includes("rejected"))) ||
    Boolean(drawing.rejectionReason) ||
    Boolean(customerSuggestionText);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" width="max-w-5xl" height="max-h-[80vh]">
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-gray-100 gap-3 relative">
          <div className="pr-8 md:pr-0">
            <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
              {drawing.name}
            </h2>
            <p className="text-gray-500 font-medium text-xs mt-0.5">
              {drawing.id}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-inter text-gray-800 md:ml-auto mr-8 md:mr-0">
            {drawing.location && (
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Location
                </p>
                <p className="font-semibold text-gray-900 text-xs md:text-sm">
                  {drawing.location}
                </p>
              </div>
            )}
            {drawing.uploadedBy && (
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Uploaded By
                </p>
                <p className="font-semibold text-gray-900 text-xs md:text-sm">
                  {drawing.uploadedBy}
                </p>
              </div>
            )}
            {drawing.receivedDate && (
              <div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Received On
                </p>
                <p className="font-semibold text-gray-600 text-xs md:text-sm">
                  {drawing.receivedDate}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full hover:bg-gray-100 p-1.5 text-gray-500 hover:text-gray-900 transition-colors absolute top-0 right-0 md:static"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - File Preview */}
        <div className="bg-gray-50/70 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden w-full min-h-[300px]">
          {isImage(drawing.name) ? (
            <img
              src={drawing.imageUrl}
              alt={drawing.name}
              className="w-full h-full max-h-[65vh] object-contain"
            />
          ) : drawing.imageUrl ? (
            <iframe
              src={`${drawing.imageUrl}#toolbar=0`}
              title={drawing.name}
              className="w-full h-[65vh] border-0 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <FileText className="w-10 h-10 text-gray-300" />
              <p className="text-xs font-medium">Preview not available</p>
            </div>
          )}
        </div>

        {/* Footer / Action Section */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-xs md:text-sm font-medium transition-all shadow-xs"
              onClick={() => downloadFile(drawing.imageUrl, drawing.name)}
            >
              <ArrowDown className="w-4 h-4" />
              Download
            </button>

            {drawing.status && (
              <div className="flex items-center gap-3 ml-auto flex-wrap">
                {drawing.receivedDate && (
                  <p className="text-gray-600 text-xs md:text-sm font-normal">
                    {drawing.receivedDate}
                  </p>
                )}
                <span
                  className={`px-4 md:px-6 py-1.5 rounded-full text-xs md:text-sm font-medium border ${getStatusBadgeStyle(
                    drawing.status
                  )}`}
                >
                  {getDisplayStatusText(drawing.status)}
                </span>
              </div>
            )}
          </div>

          {/* Revision Messages Section */}
          {hasRevision && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <h3 className="text-sm md:text-base font-bold text-gray-900">Revision Message</h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {drawing.rejectionReason || ""}
                </p>
              </div>
              <div className="space-y-2 border-l-0 md:border-l border-gray-200 md:pl-6">
                <h3 className="text-sm md:text-base font-bold text-gray-900">Customer Suggestions</h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {customerSuggestionText || ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewDrawingModal;
