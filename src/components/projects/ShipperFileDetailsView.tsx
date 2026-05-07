import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Scale, ArrowUpDown, FileDown } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import { customersData } from "@/data/productionMockData";
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
        <div className="space-y-6">
          {/* Logo & Sales Order Info */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-16 w-48 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                {/* Logo Placeholder - assuming QuickenLogo.svg is fixed or use text for now */}
                <span className="text-xs text-gray-400">Quicken Steel Logo</span>
              </div>
              <div className="text-sm font-inter text-[#637381]">
                <p className="font-bold text-[#212B36] text-lg uppercase">Quicken Steel, LLC</p>
                <p>188 Georgia Pacific Dr</p>
                <p>Claxton, GA 30417</p>
                <p>Phone: (912) 549-4050</p>
              </div>
            </div>
            
            <div className="w-full lg:w-80">
              <div className="text-center font-inter font-bold text-2xl text-[#212B36] mb-2 tracking-wide">
                SALES ORDER
              </div>
              <table className="w-full border-collapse border border-[#E2E8F0] text-sm font-inter">
                <tbody>
                  <tr>
                    <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36] w-1/2">ORDER NO.</td>
                    <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">S-19459</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36]">ORDER DATE</td>
                    <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">1/14/2026</td>
                  </tr>
                  <tr>
                    <td className="border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-2 font-bold text-[#212B36]">REQUESTED DATE</td>
                    <td className="border border-[#E2E8F0] px-4 py-2 font-bold text-[#212B36] text-right">3/31/2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PO Info Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 border border-[#E2E8F0] rounded-lg overflow-hidden text-sm font-inter">
            {[
              { label: "Customer PO#", value: "USB Shipper" },
              { label: "Sales Person", value: "Hunter Jeffcoat" },
              { label: "Warehouse", value: "CLX" },
              { label: "Terms", value: "Cash in Advance" },
              { label: "Ship Via", value: "3rd Party" },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col border-r border-[#E2E8F0] last:border-r-0`}>
                <div className="bg-[#F1F5F9] px-3 py-2.5 font-bold text-[#212B36]">{item.label}</div>
                <div className="px-3 py-3 font-medium text-[#637381] bg-white">{item.value}</div>
              </div>
            ))}
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
            <table className="w-full text-left border-collapse min-w-[900px] font-inter">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-sm font-bold text-[#212B36]">
                  <th className="py-3 px-4 w-20">QTY <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
                  <th className="py-3 px-4 w-32">Item <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 w-32">Length <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
                  <th className="py-3 px-4 w-24">Weight</th>
                  <th className="py-3 px-4 w-32">Unit Price <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
                  <th className="py-3 px-4 w-32 text-right">Amount <ArrowUpDown size={14} className="inline ml-1 opacity-30" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-sm">
                {orderItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-4 font-medium text-[#212B36]">{item.qty}</td>
                    <td className="py-4 px-4 font-medium text-[#212B36]">{item.item}</td>
                    <td className="py-4 px-4 text-[#637381] leading-relaxed whitespace-pre-line">
                      {item.description}
                    </td>
                    <td className="py-4 px-4 font-medium text-[#212B36]">{item.length}</td>
                    <td className="py-4 px-4 text-[#637381]">{item.weight}</td>
                    <td className="py-4 px-4 text-[#637381]">${item.price.toFixed(1)}</td>
                    <td className="py-4 px-4 text-right font-bold text-[#212B36]">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperFileDetailsView;
