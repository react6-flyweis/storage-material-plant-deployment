import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  CircleCheck,
  ArrowDownUp,
} from "lucide-react";
import { customersData, type CustomerInfo } from "@/data/productionMockData";
import CustomerProfileCard from "./CustomerProfileCard";
import FilterDropdown from "../common_component/FilterDropdown";
import type { TabType } from "@/pages/PlantPage";
import Heading from "../common_component/Heading";
import Button from "../common_component/Button";
import Pagination from "../Pagination";

const AllProjectsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState("latest");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const customerData: CustomerInfo = customersData[id || ""] || customersData["ID-2025-1047"];

  if (!customerData) {
    return <div className="p-10 text-center font-inter text-gray-500">Customer not found</div>;
  }

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredProjects = useMemo(() => {
    let result = customerData.projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           project.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === "today") return matchesSearch && project.status === "Work in Progress";
      if (activeTab === "week") return matchesSearch && (project.status === "Work in Progress" || project.status === "🟢 Active");
      return matchesSearch;
    });

    // Sidebar Sort by Dropdown Logic
    if (sortBy === "latest") {
      result = [...result].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } else if (sortBy === "oldest") {
      result = [...result].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (sortBy === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "za") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    // Table Header Sorting Logic
    if (sortConfig) {
      result = [...result].sort((a: any, b: any) => {
        if (sortConfig.key === "startDate") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        
        if (sortConfig.key === "progress") {
          return sortConfig.direction === "asc" ? a.progress - b.progress : b.progress - a.progress;
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [customerData.projects, searchTerm, activeTab, sortBy, sortConfig]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProjects.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProjects, currentPage, rowsPerPage]);

  const filterOptions: { label: string; value: TabType }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Name (A-Z)", value: "az" },
    { label: "Name (Z-A)", value: "za" },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
        <Heading text="All Projects" />
      </div>

      {/* Customer Profile Card */}
      <CustomerProfileCard customerData={customerData} />

      {/* Table Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            options={filterOptions} 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#637381]">Sort by :</span>
          <FilterDropdown 
            activeTab={sortBy} 
            onTabChange={setSortBy} 
            options={sortOptions} 
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[14px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="md:3 p-4 w-12">
                  <input type="checkbox" className="size-4 rounded-full border-gray-200 text-[#1E51A4] focus:ring-[#1E51A4] opacity-30" />
                </th>
                <th className="md:3 p-4 text-black font-archivo font-medium text-sm text-nowrap">Project Name</th>
                <th className="md:3 p-4 text-black font-archivo font-medium text-sm text-nowrap">Building</th>
                <th 
                  className="md:3 p-4 text-black font-archivo font-medium text-sm text-nowrap cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center gap-1">
                    Start Date
                   <ArrowDownUp size={12} color={sortConfig?.key === "startDate" ? "#1E51A4" : "#5D6772"}/>
                  </div>
                </th>
                <th 
                  className="md:3 p-4 text-black font-inter font-medium text-sm text-nowrap cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort("stage")}
                >
                  <div className="flex items-center gap-1">
                    Stage
                     <ArrowDownUp size={12} color={sortConfig?.key === "stage" ? "#1E51A4" : "#5D6772"}/>
                  </div>
                </th>
                <th 
                  className="md:3 p-4 text-black font-inter font-medium text-sm text-nowrap cursor-pointer hover:bg-gray-100/50 transition-colors"
                  onClick={() => handleSort("progress")}
                >
                  <div className="flex items-center gap-1">
                    Progress
                    <ArrowDownUp size={12} color={sortConfig?.key === "progress" ? "#1E51A4" : "#5D6772"}/>
                  </div>
                </th>
                <th className="md:3 p-4 text-black font-inter font-medium text-sm">Status</th>
                <th className="md:3 p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProjects.map((project, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors font-semibold">
                  <td className="md:3 p-4">
                    <input type="checkbox" className="size-4 rounded-full border-gray-200 text-[#1E51A4] focus:ring-[#1E51A4] opacity-50" />
                  </td>
                  <td className="md:3 p-4 text-sm font-inter text-black font-semibold">{project.name}</td>
                  <td className="md:3 p-4 text-sm font-inter text-[#637381] font-normal">{project.building}</td>
                  <td className="md:3 p-4 text-sm font-inter text-[#637381] font-normal">{project.startDate}</td>
                  <td className="md:3 p-4 text-sm font-inter text-[#637381] font-normal">{project.stage}</td>
                  <td className="md:3 p-4 text-sm font-inter text-[#637381] font-normal">{project.progress}%</td>
                  <td className="md:3 p-4 text-nowrap">
                    <span className={`px-3 py-1 rounded-md text-xs font-inter font-medium flex items-center gap-1.5 w-fit border ${
                      project.status === 'Work in Progress' ? 'bg-[#FFF9E7] text-[#EAB308] border-[#FFF7C8]' : 
                      project.status === 'Active' ? 'bg-[#E7F8EE] text-[#3AB449] border-[#E9F7EF]' :
                      project.status === 'Completed' ? 'bg-[#E7F8EE] text-[#3AB449] border-[#E9F7EF]' :
                      'bg-[#FFF5F2] text-(--text-color-orange) border-[#F7E9E9]'
                    }`}>
                      <span className={`size-2 rounded-full ${
                        project.status === 'Work in Progress' ? 'hidden' : 
                        project.status === 'Active' ? 'bg-[#3AB449]' :
                        project.status === 'Completed' ? 'bg-black' :
                        'hidden'
                      }`} />
                      {project.status}
                      {project.status === 'Work in Progress' && <CircleCheck size={16} />}
                      {(project.status === 'Active' || project.status === 'Completed') && <CircleCheck size={16} />}
                      {project.status === 'Canceled' && <CircleCheck size={16} />}
                    </span>
                  </td>
                  <td className="md:3 p-2 text-center">
                    <button 
                      onClick={() => navigate(`/projects/project-details/${id}/${project.id}`)}
                      className="px-5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-inter font-medium hover:bg-[#1E51A4] transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalItems={filteredProjects.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default AllProjectsView;
