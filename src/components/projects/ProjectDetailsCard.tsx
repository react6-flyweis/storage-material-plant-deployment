import React from "react";
import {
  CircleDollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Landmark,
  File,
  Building,
} from "lucide-react";
import type { PlantProjectDetail } from "@/redux/api/projectApi";
import { getLeadProjectName } from "@/lib/utils";

interface ProjectDetailsCardProps {
  project: PlantProjectDetail;
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
  customerAddress,
}) => {
  const projectIdStr = project?.jobId || "N/A";
  const projectNameStr = getLeadProjectName(project?.lead, project?.client);
  const statusStr = project?.lifecycleStatus || "";
  const poNumberStr = project?.poOrder?.poNumber || "";

  const createdOnStr = project?.createdAt
    ? new Date(project.createdAt).toLocaleDateString()
    : "N/A";
  const salesPersonStr = project?.assignedSales?.name || "N/A";
  const contractDateStr = project?.agreement?.uploadedAt
    ? new Date(project.agreement.uploadedAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Top Section: Project Title & ID */}
      <div className="p-4 lg:p-6 border-b border-[#0000004D] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <div className="size-12 lg:size-14 text-sm md:text-base bg-[#EAF2FE] rounded-[14px] flex items-center justify-center text-[#435FB3] shrink-0">
            <Landmark />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg md:text-xl font-inter font-semibold text-[#212B36]">
                {projectIdStr}- {projectNameStr}
              </h2>
              <span className="px-3 py-1 bg-[#E7F8EE] text-[#36A44A] rounded-full text-xs font-inter font-medium flex items-center gap-1.5 border border-[#3AB449]/20 capitalize">
                🟢 {statusStr}
              </span>
            </div>
            <p className="text-[#637381] font-inter text-sm lg:text-base">
              {poNumberStr}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b border-[#0000004D]">
        <div className="p-3 lg:p-6 flex items-start gap-4 last:border-r-0">
          <div className="text-[#637381] mt-1">
            <Building size={20} />
          </div>
          <div>
            <p className="text-sm md:text-base text-[#000000] font-inter font-medium mb-1">
              Building Type
            </p>
            <p className="text-xs md:text-sm text-[#212B36] font-inter font-semibold">
              {project?.buildingType || "N/A"}
            </p>
          </div>
        </div>
        <div className="p-3 lg:p-6 flex items-start gap-4  last:border-r-0">
          <div className="text-[#637381] mt-1">
            <CircleDollarSign size={20} />
          </div>
          <div>
            <p className="text-sm md:text-base text-[#000000] font-inter font-medium mb-1">
              Quote Value
            </p>
            <p className="text-xs md:text-sm text-[#212B36] font-inter font-semibold">
              {project?.quoteValue || "N/A"}
            </p>
          </div>
        </div>
        <div className="p-3 lg:p-6 flex items-start gap-4  last:border-r-0">
          <div className="text-[#637381] mt-1">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-sm md:text-base text-[#000000] font-inter font-medium mb-1">
              Created On
            </p>
            <p className="text-xs md:text-sm text-[#212B36] font-inter font-semibold">
              {createdOnStr}
            </p>
          </div>
        </div>
        <div className="p-3 lg:p-6 flex items-start gap-4">
          <div className="text-[#637381] mt-1">
            <MapPin size={20} />
          </div>
          <div>
            <p className="text-sm md:text-base text-[#000000] font-inter font-medium mb-1">
              Location
            </p>
            <p className="text-xs md:text-sm text-[#212B36] font-inter font-semibold leading-relaxed">
              {project?.location || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="p-3 lg:p-6 space-y-4 border-r border-gray-100 last:border-r-0 text-[#000000]">
          <h3 className="text-sm font-inter font-medium ">
            Contact Information
          </h3>
          <div className="bg-[#F9FAFB] p-4 rounded-xl space-y-3">
            <p className="text-sm font-inter font-medium text-[#000000]">
              {customerName}
            </p>
            <div className="flex items-center gap-3 text-sm text-[#637381]">
              <Phone size={14} />
              <span>
                Phone: <span className=" font-medium">{customerPhone}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#637381]">
              <Mail size={14} />
              <span>
                Email:{" "}
                <span className="text-[#446DF6] font-medium underline">
                  {customerEmail}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm text-[#111827]">
              <MapPin size={14} className="shrink-0" />
              <span>
                Address: <span className=" font-medium">{customerAddress}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Assignment */}
        <div className="p-3 lg:p-6 space-y-4 border-r border-gray-100 last:border-r-0">
          <h3 className="text-sm font-inter font-medium text-[#212B36]">
            Assignment
          </h3>
          <div className="bg-[#F9FAFB] p-3 md:p-4 rounded-[14px] flex items-center gap-4">
            <div className="size-10 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center">
              <User size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-[#000000] font-inter">Sales Person:</p>
              <p className="text-xs font-inter font-normal text-[#212B36]">
                {salesPersonStr}
              </p>
            </div>
          </div>
        </div>

        {/* Signed Contract/Agreement */}
        <div className="p-3 lg:p-6 space-y-4">
          <h3 className="text-sm font-inter font-medium text-[#000000]">
            Signed Contract/Agreement
          </h3>
          <div className="bg-[#F9FAFB] p-3 md:p-4 rounded-[14px] flex items-center gap-4">
            <div className="size-10 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center">
              <File size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-inter font-normal text-[#000000]">
                Signed contact/Agreement
              </p>
              <p className="text-xs text-[#637381] font-inter">
                Signed on: {contractDateStr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsCard;
