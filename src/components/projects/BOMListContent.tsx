import React from "react";
import { ArrowUpDown } from "lucide-react";

interface BOMListContentProps {
  bomData: {
    id: string;
    projectName: string;
    customerName: string;
    date: string;
    jobId: string;
    summary: {
      totalItems: number;
      totalWeight: string;
      totalPanelsArea: string;
    };
    items: Array<{
      qty: number;
      mark: string;
      description: string;
      part: string;
      color: string;
      angle: string;
      thick: string;
      length: string;
      weight: string;
    }>;
  };
}

const BOMListContent: React.FC<BOMListContentProps> = ({ bomData }) => {
  return (
    <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
      {/* Project & BOM ID Header */}
      <div className="bg-[#F9FAFB] px-6 py-4 md:px-8 md:py-6 border-b border-gray-100">
        <h2 className="text-lg lg:text-2xl font-inter font-bold text-[#212B36]">
          Project: <span className="font-bold">{bomData.projectName}</span> |
          BOM ID: <span className="font-bold">{bomData.id}</span>
        </h2>
      </div>

      <div className="p-4 lg:p-8 space-y-8">
        {/* BOM Summary Section */}
        <div className="bg-[#F4F6F8] rounded-xl p-6 max-w-md space-y-4">
          <h3 className="text-base font-inter font-bold text-[#212B36]">
            BOM Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#637381] font-medium">
                Total Items
              </span>
              <span className="text-sm text-[#212B36] font-bold">
                {bomData.summary.totalItems}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#637381] font-medium">
                Total Weight
              </span>
              <span className="text-sm text-[#212B36] font-bold">
                {bomData.summary.totalWeight}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#637381] font-medium">
                Total Panels Area
              </span>
              <span className="text-sm text-[#212B36] font-bold">
                {bomData.summary.totalPanelsArea}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Header Block */}
        <div className="border-2 border-black rounded-sm overflow-hidden bg-white">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-black">
            {/* Logo Section */}
            <div className="md:col-span-4 flex items-center justify-center p-4">
              <div className="flex flex-wrap items-center gap-1 font-archivo tracking-tighter">
                <span className="text-lg md:text-2xl font-black text-[#212B36]">
                  STORAGE
                </span>
                <span className="text-lg md:text-2xl font-black text-white bg-[#1E51A4] px-2">
                  MATERIALS
                </span>
              </div>
            </div>

            {/* Title & Info Section */}
            <div className="md:col-span-8 flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x-2 divide-black h-full">
                <div className="md:col-span-3 flex flex-col divide-y-2 divide-black h-full">
                  <div className="p-2 text-center">
                    <h4 className="text-base lg:text-xl font-bold uppercase tracking-widest font-inter text-[#212B36]">
                      STUDS & TOP CHANNELS
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-y md:divide-y-0 md:divide-x-2 divide-black border-t-2 border-b-2 border-black">
                    <div className="p-2 flex items-center justify-center bg-[#F9FAFB] md:bg-transparent border-b md:border-b-0 border-black">
                      <span className="text-xs md:text-sm font-bold text-[#212B36]">
                        Customer:
                      </span>
                    </div>
                    <div className="md:col-span-2 p-2 flex items-center justify-center">
                      <span className="text-xs md:text-sm font-bold text-[#212B36]">
                        {bomData.customerName}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-y md:divide-y-0 md:divide-x-2 divide-black border-t-2 border-black">
                    <div className="p-2 flex items-center justify-center bg-[#F9FAFB] md:bg-transparent border-b md:border-b-0 border-black">
                      <span className="text-xs md:text-sm font-bold text-[#212B36]">
                        Project Name:
                      </span>
                    </div>
                    <div className="md:col-span-2 p-2 flex items-center justify-center">
                      <span className="text-xs md:text-sm font-bold text-[#212B36]">
                        {bomData.projectName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col divide-y-2 divide-black">
                  <div className="grid grid-cols-2 divide-x-2 divide-black">
                    <div className="p-1 px-2 text-xs md:text-sm font-semibold text-[#212B36] bg-[#F9FAFB] md:bg-transparent">
                      Date
                    </div>
                    <div className="p-1 px-2 text-xs md:text-sm font-semibold text-[#212B36]">
                      {bomData.date}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x-2 divide-black h-full">
                    <div className="p-1 px-2 text-xs md:text-sm font-semibold text-[#212B36] bg-[#F9FAFB] md:bg-transparent">
                      Job Id
                    </div>
                    <div className="p-1 px-2 text-xs md:text-sm font-semibold text-[#212B36]">
                      {bomData.jobId}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-y border-gray-200">
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  <div className="flex items-center gap-1">
                    QTY <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  <div className="flex items-center gap-1">
                    Mark <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  Part
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  Color
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  <div className="flex items-center gap-1">
                    Angle <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  Thick
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider">
                  <div className="flex items-center gap-1">
                    Length <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-xs md:text-sm font-semibold text-[#212B36] tracking-wider text-right">
                  <div className="flex items-center justify-end gap-1">
                    Weight <ArrowUpDown size={12} className="text-gray-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bomData.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#212B36]">
                    {item.qty}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#212B36]">
                    {item.mark}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#637381]">
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#212B36]">
                    {item.part}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#637381]">
                    {item.color}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#637381]">
                    {item.angle}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#637381]">
                    {item.thick}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#212B36]">
                    {item.length}
                  </td>
                  <td className="py-3 px-4 text-xs md:text-sm font-medium text-[#637381] text-right">
                    {item.weight}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-200 font-normal">
                <td className="py-4 px-4 text-xs md:text-sm text-[#212B36]">
                  QTY Total
                </td>
                <td className="py-4 px-4 text-xs md:text-sm text-[#637381]">
                  Total Tons:
                </td>
                <td className="py-4 px-4 text-xs md:text-sm text-[#212B36]">
                  1.71
                </td>
                <td className="py-4 px-4 text-xs md:text-sm text-[#637381]">
                  RO
                </td>
                <td className="py-4 px-4 text-xs md:text-sm text-[#212B36]">
                  -
                </td>
                <td className="py-4 px-4" colSpan={3}>
                  <div className="flex justify-end pr-8 font-normal">
                    <span className="text-xs md:text-sm text-[#637381] ">
                      Total Weight (lbs)
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs md:text-sm text-[#212B36] text-right">
                  3423
                </td>
              </tr>
              <tr className="border-t border-gray-100">
                <td
                  colSpan={9}
                  className="py-4 px-4 text-xs md:text-sm text-[#212B36] font-bold"
                >
                  199
                </td>
              </tr>
              <tr>
                <td
                  colSpan={9}
                  className="py-8 px-4 text-xs md:text-sm text-[#637381] italic"
                >
                  Received By:
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BOMListContent;
