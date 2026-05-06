import  { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  CircleCheck,
  ArrowDownUp,
} from "lucide-react";
import { customersData, type CustomerInfo } from "@/data/productionMockData";
import CustomerProfileCard from "./CustomerProfileCard";
import FilterDropdown from "../common_component/FilterDropdown";
import type { TabType } from "@/pages/PlantPage";
import Heading from "../common_component/Heading";

const AllProjectsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [searchTerm, setSearchTerm] = useState("");

  const customerData: CustomerInfo = customersData[id || ""] || customersData["ID-2025-1047"];

  if (!customerData) {
    return <div className="p-10 text-center font-inter text-gray-500">Customer not found</div>;
  }

  // Filter projects based on search term and active tab
  const filteredProjects = customerData.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple mock logic for time filtering
    // In a real app, you'd compare project.startDate with current date
    if (activeTab === "today") return matchesSearch && project.status === "Work in Progress";
    if (activeTab === "week") return matchesSearch && (project.status === "Work in Progress" || project.status === "🟢 Active");
    return matchesSearch; // "month" or default
  });

  const filterOptions: { label: string; value: TabType }[] = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 md:px-6 py-1 md:py-2 bg-[#1E51A4] text-white rounded-md hover:opacity-90 transition-opacity font-inter font-semibold text-xs md:text-sm shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </button>
        <Heading text="All Projects" />
        
      </div>

      {/* Customer Profile Card */}
      <CustomerProfileCard customerData={customerData} />

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
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            options={filterOptions} 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#637381]">Sort by :</span>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#212B36] hover:bg-gray-50 transition-colors">
            Latest
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-4 w-12">
                  <input type="checkbox" className="size-4 rounded-full border-gray-200 text-[#1E51A4] focus:ring-[#1E51A4] opacity-30" />
                </th>
                <th className="p-4 text-black font-archivo font-medium text-sm text-nowrap">Project Name</th>
                <th className="p-4 text-black font-archivo font-medium text-sm text-nowrap">Building</th>
                <th className="p-4 text-black font-archivo font-medium text-sm text-nowrap">
                  <div className="flex items-center gap-1">
                    Start Date
                   <ArrowDownUp size={12} color="#5D6772"/>
                  </div>
                </th>
                <th className="p-4 text-black font-inter font-medium text-sm text-nowrap">
                  <div className="flex items-center gap-1">
                    Stage
                     <ArrowDownUp size={12} color="#5D6772"/>
                  </div>
                </th>
                <th className="p-4 text-black font-inter font-medium text-sm text-nowrap">
                  <div className="flex items-center gap-1">
                    Progress
                    <ArrowDownUp size={12} color="#5D6772"/>
                  </div>
                </th>
                <th className="p-4 text-black font-inter font-medium text-sm">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProjects.map((project, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors font-semibold">
                  <td className="p-4">
                    <input type="checkbox" className="size-4 rounded-full border-gray-200 text-[#1E51A4] focus:ring-[#1E51A4] opacity-50" />
                  </td>
                  <td className="p-4 text-sm font-inter text-black font-semibold">{project.name}</td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-normal">{project.building}</td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-normal">{project.startDate}</td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-normal">{project.stage}</td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-normal">{project.progress}%</td>
                  <td className="p-4 text-nowrap">
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
                  <td className="p-2 text-center">
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#637381] font-inter">Row Per Page</span>
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-[#637381] font-inter">Entries</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-300 hover:text-black transition-colors"><ChevronLeft size={20} /></button>
          {[1, 2, 3, 4, '...', 15].map((page, i) => (
            <button 
              key={i}
              className={`size-8 flex items-center justify-center text-sm font-inter transition-all ${
                page === 4 ? 'bg-[#FD8D5B] text-white shadow-md rounded-full' : 'text-[#919EAB] hover:bg-gray-50 rounded-lg'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="p-2 text-gray-300 hover:text-[#212B36] transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default AllProjectsView;
