import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  ArrowDownUp,
  CircleX,
  CheckCircle2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import FilterDropdown from "../common_component/FilterDropdown";
import Pagination from "../Pagination";
import CommonCheckbox from "../common_component/CommonCheckbox";

interface ProjectItem {
  id: string;
  name: string;
  date: string;
  totalLists: number;
  isBold?: boolean;
}

const mockProjects: ProjectItem[] = [
  { id: "PRJ-001", name: "ABC Warehouse", date: "22 Feb 2025", totalLists: 5, isBold: false },
  { id: "PRJ-002", name: "Tech Park Dev", date: "07 Feb 2025", totalLists: 3, isBold: true },
  { id: "PRJ-003", name: "Downtown Plaza", date: "30 Jan 2025", totalLists: 2, isBold: false },
  { id: "PRJ-004", name: "Riverside Complex", date: "17 Jan 2025", totalLists: 6, isBold: true },
  { id: "PRJ-005", name: "Tech Park Dev", date: "04 Jan 2025", totalLists: 4, isBold: true },
  { id: "PRJ-006", name: "Downtown Plaza", date: "09 Dec 2024", totalLists: 8, isBold: false },
];

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
  const [activeProjectFilter, setActiveProjectFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Keep track of checked items (for UX purposes)
  const [checkedProjects, setCheckedProjects] = useState<Record<string, boolean>>({});
  const [checkedPackingLists, setCheckedPackingLists] = useState<Record<string, boolean>>({});

  const projectOptions = [
    { label: "All Projects", value: "all" },
    { label: "ABC Warehouse", value: "abc" },
    { label: "Riverside Complex", value: "riverside" },
    { label: "Tech Park Dev", value: "techpark" },
    { label: "Downtown Plaza", value: "downtown" },
  ];

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
  ];

  const handleProjectCheckboxChange = (projectId: string) => {
    setCheckedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handlePackingListCheckboxChange = (pklId: string) => {
    setCheckedPackingLists((prev) => ({
      ...prev,
      [pklId]: !prev[pklId],
    }));
  };

  // Filter & sort logic for projects list
  const filteredProjects = mockProjects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeProjectFilter === "all" ||
      (activeProjectFilter === "abc" && proj.name === "ABC Warehouse") ||
      (activeProjectFilter === "riverside" && proj.name === "Riverside Complex") ||
      (activeProjectFilter === "techpark" && proj.name === "Tech Park Dev") ||
      (activeProjectFilter === "downtown" && proj.name === "Downtown Plaza");

    return matchesSearch && matchesFilter;
  });

  // Filter & sort logic for packing lists under a project
  const filteredPackingLists = mockPackingLists.filter((item) => {
    if (!selectedProject) return false;
    const matchesProjectName = item.project.toLowerCase() === selectedProject.name.toLowerCase();
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.loadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.truck.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesProjectName && matchesSearch;
  });

  return (
    <div className="xl:pr-2 px-4 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          {selectedProject && (
            <button
              onClick={() => {
                setSelectedProject(null);
                setSearchTerm("");
              }}
              className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-gray-600 shadow-sm"
              title="Back to projects"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <TitleSubtitle
            title={selectedProject ? `Packing List: ${selectedProject.name}` : "Packing List"}
            subtitle={
              selectedProject
                ? `Showing packing lists generated for ${selectedProject.name} (${selectedProject.id}).`
                : "View and manage packing lists generated from load planning for plant loading and shipment verification."
            }
          />
        </div>
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
          {!selectedProject && (
            <FilterDropdown
              activeTab={activeProjectFilter}
              onTabChange={setActiveProjectFilter}
              options={projectOptions}
            />
          )}
        </div>
        <FilterDropdown
          activeTab={activeSort}
          onTabChange={setActiveSort}
          options={sortOptions}
          label="Sort by :"
        />
      </div>

      {/* Main Content Area */}
      {!selectedProject ? (
        /* Projects Table (As shown in image) */
        <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-nowrap">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-100">
                  <th className="p-4 w-12 text-center">
                    <CommonCheckbox
                      checked={
                        filteredProjects.length > 0 &&
                        filteredProjects.every((p) => checkedProjects[p.id])
                      }
                      size="sm"
                      onChange={() => {
                        const allChecked = filteredProjects.every((p) => checkedProjects[p.id]);
                        const next: Record<string, boolean> = { ...checkedProjects };
                        filteredProjects.forEach((p) => {
                          next[p.id] = !allChecked;
                        });
                        setCheckedProjects(next);
                      }}
                    />
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Project ID</th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Project Name</th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      List Generated Date <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      Total Packing List <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 w-16 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      <CommonCheckbox
                        checked={!!checkedProjects[proj.id]}
                        size="sm"
                        onChange={() => handleProjectCheckboxChange(proj.id)}
                      />
                    </td>
                    <td className="p-4 text-sm font-inter text-[#637381] font-medium">{proj.id}</td>
                    <td
                      className={`p-4 text-sm font-inter text-[#212B36] cursor-pointer hover:text-[#1E51A4] transition-colors ${
                        proj.isBold ? "font-semibold" : "font-normal"
                      }`}
                      onClick={() => {
                        setSelectedProject(proj);
                        setSearchTerm("");
                      }}
                    >
                      {proj.name}
                    </td>
                    <td className="p-4 text-sm font-inter text-[#637381]">{proj.date}</td>
                    <td className="p-4 text-sm font-inter text-[#212B36] font-medium">{proj.totalLists}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedProject(proj);
                          setSearchTerm("");
                        }}
                        className="text-gray-400 hover:text-[#1E51A4] transition-colors p-1"
                        title="View Project Packing Lists"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 font-inter">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Extracted Packing List Table for Selected Project */
        <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-nowrap">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-gray-100">
                  <th className="p-4 w-12 text-center">
                    <CommonCheckbox
                      checked={
                        filteredPackingLists.length > 0 &&
                        filteredPackingLists.every((item) => checkedPackingLists[item.id])
                      }
                      size="sm"
                      onChange={() => {
                        const allChecked = filteredPackingLists.every((item) => checkedPackingLists[item.id]);
                        const next: Record<string, boolean> = { ...checkedPackingLists };
                        filteredPackingLists.forEach((item) => {
                          next[item.id] = !allChecked;
                        });
                        setCheckedPackingLists(next);
                      }}
                    />
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Packing ID</th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Project</th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Load ID</th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1">
                      Truck <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1">
                      Bundles <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1">
                      Weight <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1">
                      Destination <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                    <div className="flex items-center gap-1">
                      Date <ArrowDownUp size={14} className="text-[#919EAB]" />
                    </div>
                  </th>
                  <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Status</th>
                  <th className="p-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPackingLists.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      <CommonCheckbox
                        checked={!!checkedPackingLists[item.id]}
                        size="sm"
                        onChange={() => handlePackingListCheckboxChange(item.id)}
                      />
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
                          item.status === "Dispatched" ? (
                            <CheckCircle2 size={14} />
                          ) : item.status === "Ready" ? (
                            <CircleX size={14} />
                          ) : (
                            undefined
                          )
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
                {filteredPackingLists.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-gray-500 font-inter">
                      No packing lists found for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination currentPage={1} onPageChange={() => {}} />
    </div>
  );
};

export default PackingListView;
