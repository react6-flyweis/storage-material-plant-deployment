import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  ArrowDownUp,
  Hourglass,
  CircleX,
  CheckCircle2,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import FilterDropdown from "../common_component/FilterDropdown";
import Pagination from "../Pagination";

const mockLoadPlans = [
  { id: "LP-2026-001", project: "Riverside Complex", ref: "SHP-1044", vendor: "ABC Steel", bundles: 5, loads: 2, weight: "18,500 IBS", status: "Completed", date: "22 Feb", avatar: "https://i.pravatar.cc/150?u=abc1" },
  { id: "LP-2026-002", project: "Tech Park Dev", ref: "SHP-1045", vendor: "Steel Works LTD", bundles: 8, loads: 3, weight: "37,700 IBS", status: "Planning", date: "07 Feb", avatar: "https://i.pravatar.cc/150?u=abc2" },
  { id: "LP-2026-003", project: "Downtown Plaza", ref: "SHP-1046", vendor: "Metro Steel", bundles: 6, loads: 2, weight: "21,400 IBS", status: "Ready", date: "30 Jan", avatar: "https://i.pravatar.cc/150?u=abc3" },
  { id: "LP-2026-004", project: "Riverside Complex", ref: "SHP-1047", vendor: "ABC Steel", bundles: 5, loads: 2, weight: "18,500 IBS", status: "Completed", date: "17 Jan", avatar: "https://i.pravatar.cc/150?u=abc4" },
  { id: "LP-2026-005", project: "Tech Park Dev", ref: "SHP-1048", vendor: "Steel Works LTD", bundles: 8, loads: 2, weight: "37,700 IBS", status: "Planning", date: "04 Jan", avatar: "https://i.pravatar.cc/150?u=abc5" },
  { id: "LP-2026-006", project: "Downtown Plaza", ref: "SHP-1049", vendor: "Metro Steel", bundles: 6, loads: 3, weight: "21,400 IBS", status: "Ready", date: "09 Dec", avatar: "https://i.pravatar.cc/150?u=abc6" },
  { id: "LP-2026-007", project: "Riverside Complex", ref: "SHP-1050", vendor: "ABC Steel", bundles: 3, loads: 3, weight: "18,500 IBS", status: "Completed", date: "02 Dec", avatar: "https://i.pravatar.cc/150?u=abc7" },
  { id: "LP-2026-008", project: "Tech Park Dev", ref: "SHP-1051", vendor: "Steel Works LTD", bundles: 4, loads: 3, weight: "37,700 IBS", status: "Planning", date: "15 Nov", avatar: "https://i.pravatar.cc/150?u=abc8" },
  { id: "LP-2026-009", project: "Downtown Plaza", ref: "SHP-1052", vendor: "Metro Steel", bundles: 2, loads: 2, weight: "21,400 IBS", status: "Ready", date: "30 Nov", avatar: "https://i.pravatar.cc/150?u=abc9" },
  { id: "LP-2026-010", project: "Riverside Complex", ref: "SHP-1053", vendor: "ABC Steel", bundles: 4, loads: 3, weight: "18,500 IBS", status: "Completed", date: "12 Oct", avatar: "https://i.pravatar.cc/150?u=abc10" },
  { id: "LP-2026-011", project: "Tech Park Dev", ref: "SHP-1054", vendor: "Steel Works LTD", bundles: 5, loads: 3, weight: "37,700 IBS", status: "Planning", date: "05 Oct", avatar: "https://i.pravatar.cc/150?u=abc11" },
  { id: "LP-2026-012", project: "Downtown Plaza", ref: "SHP-1055", vendor: "Metro Steel", bundles: 8, loads: 2, weight: "21,400 IBS", status: "Ready", date: "09 Sep", avatar: "https://i.pravatar.cc/150?u=abc12" },
  { id: "LP-2026-013", project: "Riverside Complex", ref: "SHP-1058", vendor: "ABC Steel", bundles: 6, loads: 2, weight: "18,500 IBS", status: "Completed", date: "02 Sep", avatar: "https://i.pravatar.cc/150?u=abc13" },
  { id: "LP-2026-014", project: "Tech Park Dev", ref: "SHP-1060", vendor: "Steel Works LTD", bundles: 8, loads: 3, weight: "37,700 IBS", status: "Planning", date: "07 Aug", avatar: "https://i.pravatar.cc/150?u=abc14" },
];

const LoadPlanningList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProject, setActiveProject] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");

  const projectOptions = [
    { label: "All Projects", value: "all" },
    { label: "Riverside Complex", value: "riverside" },
    { label: "Tech Park Dev", value: "techpark" },
    { label: "Downtown Plaza", value: "downtown" },
  ];

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Priority", value: "priority" },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <TitleSubtitle
        title="Load Planning"
        subtitle="Plan shipments by uploading shipper data, optimizing bundles, and building truckloads."
        />
        <Button
          variant="white"
          size="sm"
        >
          <Download size={18} className="mr-2" /> Export
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all"
            />
          </div>
          <FilterDropdown
            activeTab={activeProject}
            onTabChange={setActiveProject}
            options={projectOptions}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#637381]">Sort by :</span>
          <FilterDropdown
            activeTab={activeSort}
            onTabChange={setActiveSort}
            options={sortOptions}
          />
        </div>
      </div>

      {/* Load Planning Table */}
      <div className="bg-white rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-2 md:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4] opacity-30"
                  />
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Load Plan ID
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Project
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Shipper Reference
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1">
                    Vendor <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1">
                    Bundles <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1">
                    Loads <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1">
                    Weight <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Status
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1">
                    Date <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-2 md:p-4 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockLoadPlans.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="p-2 md:p-4 text-center">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4] opacity-50"
                    />
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#212B36] font-medium">
                    {item.id}
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#212B36] font-semibold">
                    {item.project}
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#637381]">
                    {item.ref}
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full bg-gray-100"
                      />
                      <span className="text-sm font-inter font-medium text-[#212B36]">
                        {item.vendor}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#212B36]">
                    {item.bundles}
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#212B36]">
                    {item.loads}
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#212B36]">
                    {item.weight}
                  </td>
                  <td className="p-2 md:p-4">
                    <CommonStatusBadge
                      text={item.status}
                      variant={
                        item.status === "Completed"
                          ? "green"
                          : item.status === "Planning"
                          ? "yellow"
                          : "blue"
                      }
                      icon={
                        item.status === "Completed" ? (
                          <CheckCircle2 size={14} />
                        ) : item.status === "Planning" ? (
                          <Hourglass size={14} />
                        ) : item.status === "Ready" ? (
                          <CircleX size={14} />
                        ) : undefined
                      }
                    />
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-[#637381]">
                    {item.date}
                  </td>
                  <td className="px-6 py-2">
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/load_planning/details/${item.id}`)}
                    >
                      Continue
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};

export default LoadPlanningList;
