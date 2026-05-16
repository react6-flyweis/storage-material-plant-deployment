import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileDown, ArrowUpDown } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import { downloadFile } from "../../lib/utils";

const BOMFilesDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const bomData = {
    id: id || "BOM-001",
    projectName: "ABC Construction",
    customerName: "John Doe",
    date: "01.09.26",
    jobId: "BLDG-D",
    summary: {
      totalItems: 125,
      totalWeight: "32,000 lbs",
      totalPanelsArea: "3,300 sqm",
    },
    missingCost: {
      totalAmount: "$25009",
      missingQty: 15,
    },
    items: [
      { qty: 5, mark: "S-1", description: "STUD", part: "C42516", color: "RO", angle: "90°", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$40" },
      { qty: 8, mark: "S-2", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "Missing" },
      { qty: 6, mark: "S-3", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$16.00" },
      { qty: 5, mark: "S-4", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$40" },
      { qty: 8, mark: "S-5", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$40" },
      { qty: 6, mark: "S-6", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$16.00" },
      { qty: 3, mark: "S-7", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00", amount: "$40" },
    ],
  };

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="sm"
            className="h-9 px-4 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </Button>
            <Heading text="BOM Files Details" />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="white" 
            size="sm" 
            className="gap-2 border-gray-200"
            onClick={() => downloadFile("/sample-bom.xlsx", "BOM-Details.xlsx")}
          >
            <FileDown size={16} className="text-gray-600" /> Download Excel
          </Button>
          <Button 
            variant="white" 
            size="sm" 
            className="gap-2 border-gray-200"
            onClick={() => downloadFile("/sample-bom.pdf", "BOM-Details.pdf")}
          >
            <FileDown size={16} className="text-gray-600" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        {/* Project Header */}
        <div className="bg-[#F9FAFB] px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl lg:text-2xl font-inter font-semibold text-[#212B36]">
            Project: <span className="font-bold">{bomData.projectName}</span> |
            BOM ID: <span className="font-bold">{bomData.id}</span>
          </h2>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BOM Summary */}
            <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100 space-y-5">
              <h3 className="text-lg font-inter font-bold text-[#212B36]">
                BOM Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#212B36]">Total Items</span>
                  <span className="text-sm font-bold text-[#212B36]">{bomData.summary.totalItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#212B36]">Total Weight</span>
                  <span className="text-sm font-bold text-[#212B36]">{bomData.summary.totalWeight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#212B36]">Total Panels Area</span>
                  <span className="text-sm font-bold text-[#212B36]">{bomData.summary.totalPanelsArea}</span>
                </div>
              </div>
            </div>

            {/* Missing Item Cost list */}
            <div className="bg-[#F9FAFB] rounded-xl p-6 border border-gray-100 space-y-5">
              <h3 className="text-lg font-inter font-bold text-[#212B36]">
                Missing Item Cost list
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#212B36]">Total Amount</span>
                  <span className="text-sm font-bold text-[#212B36]">{bomData.missingCost.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[#212B36]">Missing Item QTY</span>
                  <span className="text-sm font-bold text-[#212B36]">{bomData.missingCost.missingQty}</span>
                </div>
                <div className="pt-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate("/costing/missing-items")}
                  >
                    Add Item in Cost List
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Header Block */}
          <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-black">
              {/* Logo Section */}
              <div className="md:col-span-4 flex items-center justify-center p-4">
                <div className="flex flex-wrap items-center gap-1 font-archivo tracking-tighter">
                  <span className="text-2xl font-black text-[#212B36]">STORAGE</span>
                  <span className="text-2xl font-black text-white bg-[#1E51A4] px-2">MATERIALS</span>
                </div>
              </div>

              {/* Title & Info Section */}
              <div className="md:col-span-8 flex flex-col">
                <div className="grid grid-cols-1 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x-2 divide-black h-full">
                  <div className="md:col-span-3 flex flex-col divide-y-2 divide-black h-full">
                    <div className="p-2 text-center">
                      <h4 className="text-xl font-bold uppercase tracking-widest font-inter text-[#212B36]">
                        STUDS & TOP CHANNELS
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-y md:divide-y-0 lg:divide-x-2 divide-black border-t-2 border-b-2 border-black">
                      <div className="p-2 flex items-center justify-center bg-[#F9FAFB]">
                        <span className="text-sm font-bold text-[#212B36]">Customer:</span>
                      </div>
                      <div className="md:col-span-2 p-2 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#212B36]">{bomData.customerName}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-y md:divide-y-0 lg:divide-x-2 divide-black border-t-2 border-black">
                      <div className="p-2 flex items-center justify-center bg-[#F9FAFB]">
                        <span className="text-sm font-bold text-[#212B36]">Project Name:</span>
                      </div>
                      <div className="md:col-span-2 p-2 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#212B36]">{bomData.projectName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col divide-y-2 divide-black">
                    <div className="grid grid-cols-2 divide-x-2 divide-black">
                      <div className="p-1 px-2 text-sm font-bold text-[#212B36] bg-[#F9FAFB]">Date</div>
                      <div className="p-1 px-2 text-sm font-bold text-[#212B36]">{bomData.date}</div>
                    </div>
                    <div className="grid grid-cols-2 divide-x-2 divide-black h-full">
                      <div className="p-1 px-2 text-sm font-bold text-[#212B36] bg-[#F9FAFB]">Job Id</div>
                      <div className="p-1 px-2 text-sm font-bold text-[#212B36]">{bomData.jobId}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-[#F9FAFB] border-y border-gray-200">
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      QTY <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Mark <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    Part
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    Color
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    Thick
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-nowrap">
                      Length <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    <div className="flex items-center gap-1 text-nowrap">
                      Weight <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="py-4 px-4 text-xs font-semibold text-[#212B36] uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      Amount <ArrowUpDown size={14} className="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bomData.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-[#212B36]">{item.qty}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#212B36]">{item.mark}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#637381]">{item.description}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#212B36]">{item.part}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#637381]">{item.color}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#637381]">{item.thick}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#212B36]">{item.length}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#637381]">{item.weight}</td>
                    <td className={`py-4 px-4 text-sm font-semibold ${item.amount === "Missing" ? "text-[#919EAB]" : "text-[#212B36]"}`}>
                      {item.amount}
                    </td>
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

export default BOMFilesDetailsView;
