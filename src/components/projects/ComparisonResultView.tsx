import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Search, ArrowUpDown, Download, ArrowRight} from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SuccessModal from "../common_component/SuccessModal";
import SendReportModal from "./SendReportModal";

const ComparisonResultView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSendSuccess = (email: string) => {
    console.log("Report sent to:", email);
    setIsSuccessModalOpen(true);
  };

  const stats = [
    { label: "Matched Items", value: 58, color: "bg-[#00D261]" },
    { label: "Missing Items", value: 2, color: "bg-[#F5B500]" },
    { label: "Extra Items", value: 0, color: "bg-[#FF6D00]" },
  ];

  const tableData = [
    {
      partNumber: "ML6CH",
      description: "Panel,Charcoal,26,Mloc,Prime Lifetime,Leg 1 Pieces @ 36' 3.25\"",
      orderedQty: "36.2708",
      shippedQty: "36.2708",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "#1",
      description: "1/4\"-14 x 1\" Driller 5/16 \" Hex Washer Head",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "552.0835",
      reason: "Part found in...",
    },
    {
      partNumber: "#11",
      description: "1/4\" x 1 1/4\" Nail Drive Masonry Anchor",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "35250.0000",
      reason: "Part found in...",
    },
    {
      partNumber: "#12A",
      description: "12 x 1\" Pancake Head Driller",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "#14",
      description: "1/8\" x 0.337\" Pop Rivet",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "#14A",
      description: "1/8\" x 0.525\" Pop Rivet",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "#1B",
      description: "1/4\"-14 x 1 1/4\" Driller 5/16 \" Hex Washer Head",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'60_VRR72'",
      description: "Panel,Charcoal,26,Mloc,Prime Lifetime,Leg 1 Pieces @ 36' 3.25\"",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'30_UF48 '",
      description: "1/4\"-14 x 1\" Driller 5/16 \" Hex Washer Head",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'30_UF72 '",
      description: "1/4\" x 1 1/4\" Nail Drive Masonry Anchor",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'35_UF48 '",
      description: "12 x 1\" Pancake Head Driller",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'35_UF72 '",
      description: "1/8\" x 0.337\" Pop Rivet",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'40_UF48 '",
      description: "1/8\" x 0.525\" Pop Rivet",
      orderedQty: "552.0835",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
    {
      partNumber: "'40_UF72 ' '",
      description: "1/4\"-14 x 1 1/4\" Driller 5/16 \" Hex Washer Head",
      orderedQty: "20000.0000",
      shippedQty: "0.0000",
      difference: "0.0000",
      reason: "",
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#E5ECFF]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Button variant="primary" onClick={() => navigate(-1)} size="sm">
            <MoveLeft size={18} className="mr-2" />
            Back
          </Button>
          <Heading
            text="Comparison Result"
          />
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setIsSendModalOpen(true)}
          className="ml-auto"
        >
          Send Report to the Shippers
          <ArrowRight size={18} className="ml-2" />
        </Button>
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

      {/* ── Search \u0026 Download ────────────────────────────────────────── */}
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
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  Part Number
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Description
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Ordered QTY
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Shipped QTY
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Difference
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="py-4 px-3 md:px-6 text-sm font-inter font-semibold text-black  tracking-wider">
                  <div className="flex items-center gap-1.5 cursor-pointer transition-colors">
                    Reason
                    <ArrowUpDown size={14} className="text-[#919EAB]" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E6]">
              {tableData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="py-4 px-3 md:px-6 text-sm font-archivo font-normal text-black">
                    {row.partNumber}
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                    {row.description}
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                    {row.orderedQty}
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                    {row.shippedQty}
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#637381]">
                    {row.difference}
                  </td>
                  <td className="py-4 px-3 md:px-6 text-sm font-inter text-[#919EAB]">
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <SendReportModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSendSuccess}
      />

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        title="Report Submitted Successfully"
      />
    </div>
  );
};

export default ComparisonResultView;
