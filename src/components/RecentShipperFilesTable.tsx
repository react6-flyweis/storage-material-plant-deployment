import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { RecentShipperFile } from "@/data/productionMockData";
import { Eye, ArrowUpDown,CircleCheck, RotateCcw } from "lucide-react";

interface Props {
  data: RecentShipperFile[];
}

const RecentShipperFilesTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();

  const handleViewDetails = (item: RecentShipperFile) => {
    // If we are in a project-specific view, use the params. Otherwise use defaults for the mock.
    const cId = customerId || "ID-2025-1047";
    const pId = projectId || item.projectId || "PRJ-001";
    navigate(`/projects/shipper-file-details/${cId}/${pId}/${item.fileName}`);
  };

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F7F8F9] border-b border-[#F4F6F8] text-nowrap">
              <th className="py-4 px-4 pl-6">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">Project ID</th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">Project Name</th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                <div className="flex items-center gap-1">
                  Shipper <ArrowUpDown size={14} className="text-[#5D6772]" />
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">File Name</th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                <div className="flex items-center gap-1">
                  Upload Date <ArrowUpDown size={14} className="text-[#5D6772]"/>
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                <div className="flex items-center gap-1">
                  Items <ArrowUpDown size={14} className="text-[#5D6772]"/>
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                <div className="flex items-center gap-1">
                  Rates <ArrowUpDown size={14} className="text-[#5D6772]"/>
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                <div className="flex items-center gap-1">
                  Weight <ArrowUpDown size={14} className="text-[#5D6772]"/>
                </div>
              </th>
              <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">File Status</th>
              <th className="py-4 px-4 pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F8]">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 pl-6">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-[#637381]">{item.projectId}</td>
                <td className="py-4 px-4 text-sm md:text-base font-archivo font-normal text-black">{item.projectName}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <img src={item.shipperAvatar} alt={item.shipperName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm md:text-base font-archivo font-normal text-black">{item.shipperName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-[#637381]">{item.fileName}</td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-[#637381]">{item.uploadDate}</td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-black font-normal">{item.items}</td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-black font-normal">{item.rates}</td>
                <td className="py-4 px-4 text-sm md:text-base font-inter text-black font-normal">{item.weight}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-inter font-normal inline-flex items-center gap-1.5 whitespace-nowrap ${
                    item.status === "File Received" ? "bg-[#FFF6D0] text-[#B78B00]" :
                    item.status === "Order Sent" ? "bg-(--background-green) text-(--text-color-green-2)" :
                    "bg-[#E0F2FE] text-[#0369A1]"
                  }`}>
                    {item.status}
                    {item.status === "Order Sent" && <CircleCheck size={14} />}
                    {item.status === "Revision Sent" && <RotateCcw size={14} />}
                  </span>
                </td>
                <td className="py-4 px-4 pr-6 text-right">
                  <button 
                    onClick={() => handleViewDetails(item)}
                    className="p-2 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white border border-[#FCF8EB] hover:opacity-90 transition-all h-[30px] w-fit flex items-center justify-center rounded-sm"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentShipperFilesTable;
