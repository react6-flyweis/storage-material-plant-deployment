import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubHeading from "../common_component/SubHeading";

interface Project {
  id: string;
  name: string;
  building: string;
  amount: string;
  status: string;
  stage: string;
  progress: number;
  startDate: string;
  endDate: string;
}

interface CustomerProjectsTableProps {
  projects: Project[];
}

const CustomerProjectsTable: React.FC<CustomerProjectsTableProps> = ({ projects }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="bg-white rounded-[10px] border-[0.5px] border-[#00000029] overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 bg-white">
        <SubHeading text="All Projects" />
      </div>
      <div className="overflow-x-auto font-inter">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB]">
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">Project</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">Project Name</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">Amount</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">Status</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">Start Date</th>
              <th className="p-3 md:p-4 text-[#919EAB] font-normal uppercase text-[10px] md:text-xs tracking-wider text-nowrap">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {projects.map((project, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/project-details/${id || "ID-2025-1047"}/${project.id}`)}
              >
                <td className="p-3 md:p-4 text-xs md:text-sm text-[#637381] font-normal text-nowrap">{project.id}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm text-[#212B36] font-normal text-nowrap">{project.name}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm text-[#212B36] font-normal text-nowrap">{project.amount}</td>
                <td className="p-3 md:p-4">
                  <span className={`text-xs md:text-sm font-normal text-nowrap ${project.status === 'Completed' || project.status === 'Active' ? 'text-(--text-color-green)' : 'text-(--text-color-brown)'}`}>
                    {project.status}
                  </span>
                </td>
                <td className="p-3 md:p-4 text-xs md:text-sm text-[#637381] font-normal text-nowrap">{project.startDate}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm text-[#637381] font-normal text-nowrap">{project.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 md:p-6 text-center border-t border-gray-100 bg-white">
        <button 
          onClick={() => navigate(`/projects/all-projects/${id}`)}
          className="text-(--button-bg-primary-color) font-normal text-sm md:text-base hover:underline transition-all"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default CustomerProjectsTable;
