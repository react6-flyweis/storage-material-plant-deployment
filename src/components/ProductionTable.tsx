import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MessageSquare, FileEdit, FileText } from "lucide-react";
import Pagination from "./Pagination";

interface Lead {
  id: string; // Used for address in this context
  customerId: string; // Used for navigation
  name: string; // Project Name
  customer: {
    name: string;
    image?: string;
  };
  buildings: number;
  status: string;
  quoteValue: string;
  unreadMessages: number;
}

interface ProductionTableProps {
  data: Lead[];
  onViewDetails: (lead: Lead) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({
  data,
  onViewDetails,
}) => {
  const navigate = useNavigate();

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-[#E7F8EE] text-(--text-color-green)";
      case "bom ready":
        return "bg-[#FFF7ED] text-[#B76E00]";
      case "shipper file received":
        return "bg-[#F2EFFF] text-[#8B5CF6]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-100 bg-[#F9FAFB]">
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
              Project Name
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
              Customer
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-center">
              Buildings
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
              Status
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-nowrap">
              Project Value
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider">
              Chat
            </th>
            <th className="md:p-4 p-2 text-(--text-color-gray-3) font-inter font-semibold uppercase text-xs tracking-wider text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors bg-white"
            >
              <td className="p-4 text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-inter font-semibold text-black text-sm">
                    {row.name}
                  </span>
                  <span className="font-inter text-xs text-[#637381] mt-0.5">
                    {row.id}
                  </span>
                </div>
              </td>
              <td 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/projects/customerinfo/${row.customerId}`)}
              >
                <div className="flex items-center gap-2">
                  {row.customer.image ? (
                    <img src={row.customer.image} alt={row.customer.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {row.customer.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-inter text-sm text-[#637381]">
                    {row.customer.name}
                  </span>
                </div>
              </td>
              <td className="p-4 text-center font-inter font-semibold text-sm text-black">
                {row.buildings}
              </td>
              <td className="p-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-inter font-normal ${getStatusStyles(row.status)}`}
                >
                  {row.status}
                </span>
              </td>
              <td className="p-4 text-sm font-inter font-semibold text-black">
                {row.quoteValue}
              </td>
              <td className="p-4">
                <button
                  onClick={() => navigate(`/communication`)}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#F2F6FF] text-[#446DF6] rounded-md hover:bg-blue-100 transition-colors text-xs font-semibold relative group border border-[#DBEAFE]"
                >
                  <MessageSquare size={14} className="text-[#446DF6]" />
                  Chat
                  {row.unreadMessages > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white  w-6 h-6 flex items-center justify-center rounded-full font-normal text-sm border border-white">
                      {row.unreadMessages}
                    </span>
                  )}
                </button>
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-8">
                  <button
                    // onClick={() => onViewDetails(row as any)}
                    className="text-[#3C40AF] hover:opacity-80 transition-opacity"
                  >
                    <Eye size={20} />
                  </button>
                  <button className="text-[#B37878] hover:opacity-80 transition-opacity">
                    <FileText size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pagination
        totalItems={5}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={()=>{}}
      />
    </div>
  );
};

export default ProductionTable;
