import React from "react";
import { 
  Building2, 
  CircleDollarSign, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText 
} from "lucide-react";

interface ProjectDetailsCardProps {
  project: any;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({ 
  project, 
  customerName, 
  customerPhone, 
  customerEmail, 
  customerAddress 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Top Section: Project Title & ID */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 bg-[#F0F4FF] rounded-xl flex items-center justify-center text-[#1E51A4]">
            <Building2 size={28} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-inter font-bold text-[#212B36]">{project.id}- {project.name}</h2>
              <span className="px-3 py-1 bg-[#E7F8EE] text-[#3AB449] rounded-full text-xs font-inter font-bold flex items-center gap-1.5 border border-[#3AB449]/20">
                <span className="size-2 bg-[#3AB449] rounded-full" /> In Progress
              </span>
            </div>
            <p className="text-[#637381] font-inter text-sm">Q-2025-1047</p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-gray-100">
        <div className="p-6 flex items-start gap-4 border-r border-gray-100 last:border-r-0">
          <div className="text-[#637381] mt-1"><Building2 size={20} /></div>
          <div>
            <p className="text-xs text-[#637381] font-inter font-medium mb-1">Building Type</p>
            <p className="text-sm text-[#212B36] font-inter font-semibold">{project.buildingType || "N/A"}</p>
          </div>
        </div>
        <div className="p-6 flex items-start gap-4 border-r border-gray-100 last:border-r-0">
          <div className="text-[#637381] mt-1"><CircleDollarSign size={20} /></div>
          <div>
            <p className="text-xs text-[#637381] font-inter font-medium mb-1">Quote Value</p>
            <p className="text-sm text-[#212B36] font-inter font-semibold">{project.quoteValue || "N/A"}</p>
          </div>
        </div>
        <div className="p-6 flex items-start gap-4 border-r border-gray-100 last:border-r-0">
          <div className="text-[#637381] mt-1"><Calendar size={20} /></div>
          <div>
            <p className="text-xs text-[#637381] font-inter font-medium mb-1">Created On</p>
            <p className="text-sm text-[#212B36] font-inter font-semibold">{project.createdOn || "N/A"}</p>
          </div>
        </div>
        <div className="p-6 flex items-start gap-4">
          <div className="text-[#637381] mt-1"><MapPin size={20} /></div>
          <div>
            <p className="text-xs text-[#637381] font-inter font-medium mb-1">Location</p>
            <p className="text-sm text-[#212B36] font-inter font-semibold leading-relaxed">{project.location || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="p-6 space-y-4 border-r border-gray-100 last:border-r-0">
          <h3 className="text-sm font-inter font-bold text-[#212B36]">Contact Information</h3>
          <div className="bg-[#F9FAFB] p-4 rounded-xl space-y-3">
            <p className="text-sm font-inter font-bold text-[#212B36]">{customerName}</p>
            <div className="flex items-center gap-3 text-xs text-[#637381]">
              <Phone size={14} />
              <span>Phone: <span className="text-[#212B36] font-medium">{customerPhone}</span></span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#637381]">
              <Mail size={14} />
              <span>Email: <span className="text-[#446DF6] font-medium underline">{customerEmail}</span></span>
            </div>
            <div className="flex items-start gap-3 text-xs text-[#637381]">
              <MapPin size={14} className="shrink-0" />
              <span>Address: <span className="text-[#212B36] font-medium">{customerAddress}</span></span>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="p-6 space-y-4 border-r border-gray-100 last:border-r-0">
          <h3 className="text-sm font-inter font-bold text-[#212B36]">Assignment</h3>
          <div className="bg-[#F9FAFB] p-4 rounded-xl flex items-center gap-4">
            <div className="size-10 bg-[#DCFCE7] text-[#22C55E] rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-[#637381] font-inter">Sales Person:</p>
              <p className="text-sm font-inter font-bold text-[#212B36]">{project.salesPerson || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Signed Contract/Agreement */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-inter font-bold text-[#212B36]">Signed Contract/Agreement</h3>
          <div className="bg-[#F9FAFB] p-4 rounded-xl flex items-center gap-4">
            <div className="size-10 bg-[#E0F2FE] text-[#0EA5E9] rounded-xl flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-sm font-inter font-bold text-[#212B36]">Signed contact/Agreement</p>
              <p className="text-xs text-[#637381] font-inter">Signed on: {project.contractDate || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsCard;
