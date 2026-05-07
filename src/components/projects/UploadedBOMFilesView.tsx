import React from "react";
import { Search, Filter, Eye, ArrowUpDown, Hammer, ShieldCheck, DollarSign, BarChart3 } from "lucide-react";
import StatCard from "../ui/stat-card";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import Pagination from "../Pagination";
import { UploadModal } from "./ProjectUploadModals";
import FilterDropdown from "../common_component/FilterDropdown";

const UploadedBOMFilesView: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("Latest");

  const stats = [
    { title: "Total BOM Files", value: "58 Files", color: "bg-[#1E51A4]", icon: <Hammer className="text-[#1E51A4]" size={18} /> },
    { title: "Pending Upload", value: "12 Files", color: "bg-[#3AB449]", icon: <ShieldCheck className="text-[#3AB449]" size={18} /> },
    { title: "Ready for Shipper", value: "26 Files", color: "bg-[#DCC426]", icon: <DollarSign className="text-[#DCC426]" size={18} /> },
    { title: "Issues Detected", value: "8 Files", color: "bg-[#FD8D5B]", icon: <BarChart3 className="text-[#FD8D5B]" size={18} /> },
  ];

  const tableData = [
    { project: "ABC Warehouse", date: "22 Feb 2025", items: "125", status: "Pending" },
    { project: "Riya Buildings", date: "07 Feb 2025", items: "98", status: "Shared to Shippers" },
    { project: "ABC Warehouse", date: "30 Jan 2025", items: "210", status: "🔒 Locked" },
    { project: "Riya Buildings", date: "17 Jan 2025", items: "125", status: "🔒 Locked" },
    { project: "ABC Warehouse", date: "04 Jan 2025", items: "98", status: "🔒 Locked" },
    { project: "Riya Buildings", date: "09 Dec 2024", items: "210", status: "🔒 Locked" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-[#FFF6D0] text-[#B78B00] border-[#FFF6D0]";
      case "Shared to Shippers":
        return "bg-[#E6FFFA] text-[#047857] border-[#E6FFFA]";
      case "Locked":
        return "bg-[#F3F4F6] text-[#6B7280] border-[#F3F4F6]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-8">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <Heading text="Uploaded BOM Files" />
        <Button 
          variant="primary" 
          size="sm" 
          className="px-8 py-3"
          onClick={() => setIsModalOpen(true)}
        >
          Upload BOM File
        </Button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#637381] size-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-[#919EAB]"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[8px] text-sm font-medium text-[#212B36] hover:bg-gray-50 transition-all">
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#637381]">
          <span>Sort by :</span>
          <FilterDropdown 
            activeTab={sortBy} 
            onTabChange={setSortBy} 
            options={[
              { label: "Latest", value: "Latest" },
              { label: "Oldest", value: "Oldest" },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F7F8F9] border-b border-[#F4F6F8]">
                <th className="py-4 px-6 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                  <div className="flex items-center gap-1">
                    Project <ArrowUpDown size={14} className="text-[#5D6772]" />
                  </div>
                </th>
                <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                  <div className="flex items-center gap-1">
                    Upload Date <ArrowUpDown size={14} className="text-[#5D6772]" />
                  </div>
                </th>
                <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                  <div className="flex items-center gap-1">
                    Items <ArrowUpDown size={14} className="text-[#5D6772]" />
                  </div>
                </th>
                <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">File Status</th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {tableData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-5 px-4 text-[15px] font-archivo font-normal text-[#637381]">{item.project}</td>
                  <td className="py-5 px-4 text-[15px] font-inter text-[#637381]">{item.date}</td>
                  <td className="py-5 px-4 text-[15px] font-inter font-medium text-black">{item.items}</td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-inter font-normal inline-flex items-center gap-1.5 whitespace-nowrap ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <Button
                    variant={"gradient"}
                    size={"sm"}
                    >
                      <Eye size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={15}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
        getPageNumbers={() => [1, 2, 3, 4, "...", 15]}
      />

      <UploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload BOM File"
        subtitle="Please upload your BOM file to continue."
        fileLabel="BOM File"
        onUpload={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default UploadedBOMFilesView;
