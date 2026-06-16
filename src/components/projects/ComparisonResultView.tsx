import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Search, ArrowUpDown, Download } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SuccessModal from "../common_component/SuccessModal";
import {
  useGetComparisonSummaryQuery,
  useApproveShipperRequestMutation,
  useRequestResubmitShipperRequestMutation,
} from "@/redux/api/shipperApi";

const ComparisonResultView: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Report Submitted Successfully");

  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitNote, setResubmitNote] = useState("");

  const { data, isLoading, error } = useGetComparisonSummaryQuery(requestId || "", {
    skip: !requestId,
  });
  const [approveRequest, { isLoading: isApproving }] = useApproveShipperRequestMutation();
  const [requestResubmit, { isLoading: isResubmitting }] = useRequestResubmitShipperRequestMutation();

  const handleApprove = async () => {
    if (!requestId) return;
    try {
      await approveRequest(requestId).unwrap();
      setSuccessTitle("Shipment Approved Successfully");
      setIsSuccessModalOpen(true);
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
      setSuccessTitle("Resubmit Request Sent Successfully");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Failed to request resubmit:", err);
    }
  };

  const getDisplayStatusText = (status: string) => {
    switch (status) {
      case "missing_in_vendor_quote":
        return "Missing";
      case "extra_in_vendor_quote":
        return "Extra";
      case "qty_mismatch":
        return "QTY Mismatch";
      case "price_mismatch":
        return "Price Mismatch";
      case "matched":
        return "Matched";
      default:
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Matched":
      case "matched":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00D261]/10 text-[#008A3B] border border-[#00D261]/20">
            Matched
          </span>
        );
      case "Missing":
      case "missing_in_vendor_quote":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5B500]/10 text-[#B88600] border border-[#F5B500]/20">
            Missing
          </span>
        );
      case "Extra":
      case "extra_in_vendor_quote":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF6D00]/10 text-[#D35400] border border-[#FF6D00]/20">
            Extra
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FF6D00]/10 text-[#D35400] border border-[#FF6D00]/20">
            {getDisplayStatusText(status)}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#E5ECFF] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading comparison results...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-[#E5ECFF] space-y-6">
        <div className="flex items-start gap-4">
          <Button variant="primary" onClick={() => navigate(-1)} size="sm">
            <MoveLeft size={18} className="mr-2" />
            Back
          </Button>
          <Heading text="Comparison Result" />
        </div>
        <div className="p-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter text-[#212B36]">
            Error Loading Comparison Summary
          </p>
          <p className="text-sm text-gray-500 font-inter max-w-md">
            Something went wrong while retrieving the comparison summary. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Matched Items", value: data.summary?.matchedLines ?? 0, color: "bg-[#00D261]" },
    { label: "Missing Items", value: data.summary?.missingItems ?? 0, color: "bg-[#F5B500]" },
    { label: "Extra Items", value: data.summary?.extraItems ?? 0, color: "bg-[#FF6D00]" },
  ];

  const filteredResults = (data.results || []).filter((row) => {
    const q = searchQuery.toLowerCase();
    const partCode = (row.expected?.partCode || row.received?.partCode || "").toLowerCase();
    const reason = (row.reason || "").toLowerCase();
    const status = (row.status || "").toLowerCase();
    return partCode.includes(q) || reason.includes(q) || status.includes(q);
  });

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#E5ECFF]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Button variant="primary" onClick={() => navigate(-1)} size="sm">
            <MoveLeft size={18} className="mr-2" />
            Back
          </Button>
          <div className="flex flex-col">
            <Heading text="Comparison Result" />
            <p className="text-sm text-gray-600 font-inter mt-1">
              Project: <span className="font-semibold text-gray-800">{data.projectName}</span> | Vendor: <span className="font-semibold text-gray-800">{data.vendorName} ({data.vendorCode})</span>
            </p>
          </div>
        </div>
        {data.status === "comparison_completed" && (
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="grayFilled"
              size="sm"
              onClick={() => setIsResubmitModalOpen(true)}
              disabled={isResubmitting}
              className="flex items-center gap-2 font-inter font-bold"
            >
              Request Resubmit
            </Button>
            {!(data.summary?.missingItems && data.summary.missingItems > 0) && (
              <Button
                variant="greenFilled"
                size="sm"
                onClick={handleApprove}
                disabled={isApproving}
                className="flex items-center gap-2 font-inter font-bold"
              >
                {isApproving ? "Approving..." : "Approve Shipment"}
              </Button>
            )}
          </div>
        )}
        {data.status === "approved" && (
          <div className="flex items-center gap-3 ml-auto">
            <Button
              variant="white"
              size="sm"
              onClick={() => navigate(`/projects/${data.projectId}/shipper-files/${requestId}`)}
              className="font-inter font-bold text-black border-gray-200"
            >
              Back to Shipper File
            </Button>
            <Button
              variant="purpleFilled"
              size="sm"
              onClick={() => navigate(`/load_planning/${data.leadId}`)}
              className="flex items-center gap-2 font-inter font-bold"
            >
              Start Load Planning
            </Button>
          </div>
        )}
      </div>

      {/* ── Stats Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-8 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-[10px] p-3 lg:p-6 flex items-center justify-between text-white shadow-sm`}
          >
            <span className="text-sm lg:text-lg font-inter font-normal">
              {stat.label}
            </span>
            <span className="text-xl lg:text-3xl font-inter font-normal">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Search & Download ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[#919EAB]" />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E4E6] rounded-lg text-sm font-inter placeholder:text-[#919EAB] focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
          />
        </div>
        <Button variant="grayFilled" size="sm" onClick={() => console.log("Downloading report...")} className="ml-auto">
          <Download className="mr-2" size={18} />
          Download Excel Report
        </Button>
      </div>

      {/* ── Results Table ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-[10px] shadow-sm border border-[#F4F6F8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--bg-light-gray) border-b border-[#E2E4E6] text-nowrap">
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  Part Number
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Description
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Ordered QTY
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Shipped QTY
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Difference
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Reason
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E6]">
              {filteredResults.map((row) => {
                const part = row.expected || row.received;
                const partNumber = part?.partCode || "-";
                const description = part 
                  ? `Color: ${part.partColor || "N/A"}${part.lengthFeet ? `, Length: ${part.lengthFeet} ft` : ""}${part.weight ? `, Weight: ${part.weight} lbs` : ""}`
                  : "No details available";
                
                const orderedQty = row.expected?.totalQty ?? 0;
                const shippedQty = row.received?.totalQty ?? 0;
                const difference = row.difference?.qtyDiff !== null && row.difference?.qtyDiff !== undefined 
                  ? row.difference.qtyDiff 
                  : (shippedQty - orderedQty);

                return (
                  <tr
                    key={row.resultId}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-4 px-3 md:px-6 text-sm font-archivo font-normal text-black">
                      {partNumber}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                      {description}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                      {orderedQty}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                      {shippedQty}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                      {difference > 0 ? `+${difference}` : difference}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#919EAB]">
                      {row.reason || "-"}
                    </td>
                    <td className="py-4 px-3 md:px-6 text-sm font-inter">
                      {getStatusBadge(row.status)}
                    </td>
                  </tr>
                );
              })}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-inter text-sm">
                    No comparison items found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
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

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        title={successTitle}
      />
    </div>
  );
};

export default ComparisonResultView;
