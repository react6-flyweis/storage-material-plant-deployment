import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scale, FileDown } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import {
  useGetShipperDocumentQuery,
  useApproveShipperRequestMutation,
  useRequestResubmitShipperRequestMutation,
} from "@/redux/api/shipperApi";

const ShipperFileDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();

  const { data: shipperDoc, isLoading, error } = useGetShipperDocumentQuery(requestId || "");

  const [approveRequest, { isLoading: isApproving }] = useApproveShipperRequestMutation();
  const [requestResubmit, { isLoading: isResubmitting }] = useRequestResubmitShipperRequestMutation();
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitNote, setResubmitNote] = useState("");

  const handleApprove = async () => {
    if (!requestId) return;
    try {
      await approveRequest(requestId).unwrap();
    } catch (err) {
      console.error("Failed to approve request:", err);
    }
  };

  const handleResubmit = async () => {
    if (!requestId || !resubmitNote.trim()) return;
    try {
      await requestResubmit({ requestId, note: resubmitNote }).unwrap();
      setIsResubmitModalOpen(false);
      setResubmitNote("");
    } catch (err) {
      console.error("Failed to request resubmit:", err);
    }
  };

  const isComparisonCompleted = shipperDoc?.fileStatus === "comparison_completed";
  const showVerification = shipperDoc?.fileStatus !== "comparison_completed" &&
    shipperDoc?.fileStatus !== "approved" &&
    shipperDoc?.fileStatus !== "rejected" &&
    shipperDoc?.fileStatus !== "resubmit_requested";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
      case "comparison_completed":
        return "green";
      case "rejected":
      case "comparison_failed":
        return "red";
      case "submitted":
      case "comparison_processing":
        return "yellow";
      case "sent":
        return "blue";
      case "resubmit_requested":
        return "cyan";
      default: {
        const s = status.toLowerCase();
        if (s.includes("received") || s.includes("pending") || s.includes("submitted")) return "yellow";
        if (
          s.includes("compared") ||
          s.includes("approved") ||
          s.includes("sent") ||
          s.includes("revision")
        )
          return "green";
        return "gray";
      }
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case "sent":
        return "Sent";
      case "submitted":
        return "File Received";
      case "comparison_processing":
        return "Comparison Processing";
      case "comparison_completed":
        return "Comparison Completed";
      case "comparison_failed":
        return "Comparison Failed";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "resubmit_requested":
        return "Resubmit Requested";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading shipper document details...
        </p>
      </div>
    );
  }

  if (error || !shipperDoc) {
    return (
      <div className="xl:pr-5 px-2 pb-10 space-y-6">
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="Shipper File Details" />
        </div>
        <div className="p-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter text-[#212B36]">
            Error Loading Shipper Document
          </p>
          <p className="text-sm text-gray-500 font-inter max-w-md">
            Something went wrong while retrieving shipper document details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="Shipper File Details" />
        </div>

        <div className="flex items-center gap-3">
          {shipperDoc.fileUrl && (
            <Button
              variant="white"
              size="sm"
              onClick={() => window.open(shipperDoc.fileUrl, "_blank")}
              className="flex items-center gap-2 border-[#E2E8F0] font-inter font-bold text-[#212B36]"
            >
              <FileDown size={18} /> Download file
            </Button>
          )}
          {showVerification && (
            <Button
              variant="purpleFilled"
              size="sm"
              onClick={() => navigate(`order-verification`)}
              className="flex items-center gap-2 font-inter font-bold"
            >
              <Scale size={18} /> Order Verification
            </Button>
          )}
          {isComparisonCompleted && (
            <>
              <Button
                variant="grayFilled"
                size="sm"
                onClick={() => setIsResubmitModalOpen(true)}
                disabled={isResubmitting}
                className="flex items-center gap-2 font-inter font-bold"
              >
                Request Resubmit
              </Button>
              <Button
                variant="greenFilled"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving}
                className="flex items-center gap-2 font-inter font-bold"
              >
                {isApproving ? "Approving..." : "Approve Shipment"}
              </Button>
            </>
          )}
          {shipperDoc?.fileStatus === "approved" && (
            <Button
              variant="purpleFilled"
              size="sm"
              onClick={() => navigate(`/load_planning/${shipperDoc.leadId}`)}
              className="flex items-center gap-2 font-inter font-bold"
            >
              Start Load Planning
            </Button>
          )}

        </div>
      </div>

      {/* ── Main Content Card ─────────────────────────────────────────── */}
      <div className="bg-white p-5 space-y-5">

        {/* Project Details Header */}
        <div className="bg-[#F8FAFC] rounded-[10px] p-6 border border-[#F1F5F9]">
          <h2 className="text-2xl font-inter font-bold text-[#212B36] mb-5">
            Project: {shipperDoc.projectName || "ABC Warehouse Project"}
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0">

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-24">Project ID:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{shipperDoc.projectId}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-24">Shipper:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{shipperDoc.vendorName}</span>
              </div>
            </div>


            <div className="hidden lg:block w-px h-16 bg-[#CBD5E1] mx-10"></div>


            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Shipper File:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{shipperDoc.fileName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Upload Date:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{formatDate(shipperDoc.uploadedDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Status:</span>
                <CommonStatusBadge
                  text={getDisplayStatus(shipperDoc.fileStatus)}
                  variant={getBadgeVariant(shipperDoc.fileStatus)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Preview Section */}
        <div className="w-full  overflow-hidden shadow-inner flex items-center justify-center">
          {shipperDoc.fileUrl ? (
            <iframe
              src={`${shipperDoc.fileUrl}#toolbar=0`}
              className="w-full h-[800px] rounded-lg border-0 bg-white"
              title={shipperDoc.fileName}
            />
          ) : (
            <div className="p-10 text-center text-gray-500 font-inter">
              No preview URL available for this document.
            </div>
          )}
        </div>
      </div>

      {/* ── Resubmit Modal ─────────────────────────────────────────── */}
      {isResubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold font-inter text-[#212B36]">
              Request Corrected Quote
            </h3>
            <p className="text-sm text-gray-500 font-inter">
              Please provide a note to the vendor explaining what correction is needed.
            </p>
            <textarea
              className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-2 focus:ring-[#1E51A4] focus:border-transparent resize-none"
              placeholder="e.g., Please correct qty mismatch on C62514."
              value={resubmitNote}
              onChange={(e) => setResubmitNote(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="white"
                size="sm"
                onClick={() => {
                  setIsResubmitModalOpen(false);
                  setResubmitNote("");
                }}
                className="border-gray-200 font-medium font-inter text-[#212B36]"
              >
                Cancel
              </Button>
              <Button
                variant="blueFilled"
                size="sm"
                disabled={!resubmitNote.trim() || isResubmitting}
                onClick={handleResubmit}
                className="font-medium font-inter"
              >
                {isResubmitting ? "Sending..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperFileDetailsView;
