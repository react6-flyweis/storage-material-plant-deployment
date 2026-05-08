import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scale, FileDown } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import { customersData } from "@/data/productionMockData";
import QuickenSteelDocument from "./QuickenSteelDocument";
// import QuickenLogo from "@/assets/images/QuickenLogo.svg";

const ShipperFileDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId, fileName } = useParams();

  const customer = customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project =
    customer?.projects.find((p) => p.id === projectId) || customer?.projects[0];

  const orderItems = [
    { qty: 5, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 8, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 6, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 5, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 8, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 6, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 3, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 4, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
    { qty: 2, item: "PC16RO8X", description: "16Ga CEE Purlin Red Oxide 8X3-12\"\nPunch: Custom, Piece Mark: DJ-1", length: "6'11-3/4\"", weight: 621, price: 2.0, amount: 16.00 },
  ];

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
          <Button
            variant="purpleFilled"
            size="sm"
            className="flex items-center gap-2 font-inter font-bold"
          >
            <Scale size={18} /> Order Verification
          </Button>
          <Button
            variant="white"
            size="sm"
            className="flex items-center gap-2 border-[#E2E8F0] font-inter font-bold text-[#212B36]"
          >
            <FileDown size={18} /> Download PDF
          </Button>
        </div>
      </div>

      {/* ── Main Content Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] p-6 md:p-8 space-y-8">
        
        {/* Project Details Header */}
        <div className="bg-[#F8FAFC] rounded-[10px] p-6 border border-[#F1F5F9]">
          <h2 className="text-2xl font-inter font-bold text-[#212B36] mb-5">
            Project: {project?.name || "ABC Warehouse Project"}
          </h2>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0">
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-24">Project ID:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{projectId || "PRJ-1025"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-24">Shipper:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">SteelCorp</span>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden lg:block w-px h-16 bg-[#CBD5E1] mx-10"></div>

            {/* Right Column */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Shipper File:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">{fileName || "steel_v1.xlsx"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Upload Date:</span>
                <span className="text-sm font-inter font-bold text-[#212B36]">Apr 22, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-inter font-medium text-[#637381] w-28">Status:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FFB02E] text-base">●</span>
                  <span className="text-sm font-inter font-bold text-[#212B36]">Pending Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quicken Steel Document Section */}
        <QuickenSteelDocument orderItems={orderItems} />
      </div>
    </div>
  );
};

export default ShipperFileDetailsView;
