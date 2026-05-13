import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  ArrowDownUp,
  CircleX,
  CheckCircle2,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import FilterDropdown from "../common_component/FilterDropdown";
import Pagination from "../Pagination";
import CommonCheckbox from "../common_component/CommonCheckbox";

const mockPackingLists = [
  { id: "PKL-101", project: "Riverside Complex", loadId: "LOAD-101", truck: "TX-4135", bundles: 5, weight: "18,500 IBS", destination: "Site A", date: "22 Feb 2025", status: "Dispatched" },
  { id: "PKL-102", project: "Tech Park Dev", loadId: "LOAD-102", truck: "TX-4135", bundles: 8, weight: "37,700 IBS", destination: "Site A", date: "07 Feb 2025", status: "Ready" },
  { id: "PKL-103", project: "Downtown Plaza", loadId: "LOAD-103", truck: "TX-4135", bundles: 6, weight: "21,400 IBS", destination: "Site B", date: "30 Jan 2025", status: "Dispatched" },
  { id: "PKL-104", project: "Riverside Complex", loadId: "LOAD-104", truck: "TX-4135", bundles: 5, weight: "18,500 IBS", destination: "Site A", date: "17 Jan 2025", status: "Ready" },
  { id: "PKL-105", project: "Tech Park Dev", loadId: "LOAD-105", truck: "TX-4135", bundles: 8, weight: "37,700 IBS", destination: "Site A", date: "04 Jan 2025", status: "Dispatched" },
  { id: "PKL-106", project: "Downtown Plaza", loadId: "LOAD-106", truck: "TX-4135", bundles: 6, weight: "21,400 IBS", destination: "Site B", date: "09 Dec 2024", status: "Ready" },
  { id: "PKL-107", project: "Riverside Complex", loadId: "LOAD-107", truck: "TX-4135", bundles: 3, weight: "18,500 IBS", destination: "Site A", date: "02 Dec 2024", status: "Dispatched" },
  { id: "PKL-108", project: "Tech Park Dev", loadId: "LOAD-108", truck: "TX-4135", bundles: 4, weight: "37,700 IBS", destination: "Site A", date: "15 Nov 2024", status: "Ready" },
  { id: "PKL-108", project: "Downtown Plaza", loadId: "LOAD-108", truck: "TX-4135", bundles: 2, weight: "21,400 IBS", destination: "Site B", date: "30 Nov 2024", status: "Dispatched" },
  { id: "PKL-109", project: "Riverside Complex", loadId: "LOAD-109", truck: "ABC Steel", bundles: 4, weight: "18,500 IBS", destination: "Site A", date: "12 Oct 2024", status: "Ready" },
  { id: "PKL-110", project: "Tech Park Dev", loadId: "LOAD-110", truck: "TX-4135", bundles: 5, weight: "37,700 IBS", destination: "Site A", date: "05 Oct 2024", status: "Dispatched" },
  { id: "PKL-111", project: "Downtown Plaza", loadId: "LOAD-111", truck: "TX-4135", bundles: 8, weight: "21,400 IBS", destination: "Site B", date: "09 Sep 2024", status: "Ready" },
  { id: "PKL-112", project: "Riverside Complex", loadId: "LOAD-112", truck: "TX-4135", bundles: 6, weight: "18,500 IBS", destination: "Site A", date: "02 Sep 2024", status: "Dispatched" },
  { id: "PKL-113", project: "Tech Park Dev", loadId: "LOAD-113", truck: "TX-4135", bundles: 8, weight: "37,700 IBS", destination: "Site A", date: "07 Aug 2024", status: "Dispatched" },
];

const PackingListView: React.FC = () => {
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
  ];

  return (
    <div className="xl:pr-2 px-4 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <TitleSubtitle
          title="Packing List"
          subtitle="View and manage packing lists generated from load planning for plant loading and shipment verification."
        />
        <Button variant="white" size="sm">
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
        <FilterDropdown
          activeTab={activeSort}
          onTabChange={setActiveSort}
          options={sortOptions}
          label="Sort by :"
        />
      </div>

      {/* Packing List Table */}
      <div className="bg-white rounded-[14px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  <CommonCheckbox checked={false} size="sm"
                  onChange={()=>{}}/>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Packing ID</th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Project</th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Load ID</th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">Truck <ArrowDownUp size={14} className="text-[#919EAB]" /></div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">Bundles <ArrowDownUp size={14} className="text-[#919EAB]" /></div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">Weight <ArrowDownUp size={14} className="text-[#919EAB]" /></div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">Destination <ArrowDownUp size={14} className="text-[#919EAB]" /></div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">Date <ArrowDownUp size={14} className="text-[#919EAB]" /></div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Status</th>
                <th className="p-4 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPackingLists.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4 text-center">
                        <CommonCheckbox checked={false} 
                        size="sm"
                  onChange={()=>{}}/>
                  </td>
                  <td className="p-4 text-sm font-inter text-[#212B36] font-medium">{item.id}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36] font-semibold">{item.project}</td>
                  <td className="p-4 text-sm font-inter text-[#637381]">{item.loadId}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36] font-semibold">{item.truck}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36]">{item.bundles}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36]">{item.weight}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36]">{item.destination}</td>
                  <td className="p-4 text-sm font-inter text-[#637381]">{item.date}</td>
                  <td className="p-4">
                    <CommonStatusBadge
                      text={item.status}
                      variant={item.status === "Dispatched" ? "green" : "blue"}
                      icon={
                        item.status === "Dispatched" ? <CheckCircle2 size={14} /> : 
                        item.status === "Ready" ? <CircleX size={14} /> : 
                        undefined
                      }
                    />
                  </td>
                  <td className="px-6 py-2">
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/load_planning/packing-list/details/${item.id}`)}
                    >
                      View
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

export default PackingListView;
