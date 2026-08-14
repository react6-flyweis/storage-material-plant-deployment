import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Eye, ArrowDown } from "lucide-react";
import { downloadFile } from "../../lib/utils";
import { customersData } from "@/data/productionMockData";
import Heading from "../common_component/Heading";
import Button from "../common_component/Button";
import ViewDrawingModal from "../leads/ViewDrawingModal";
import { SuccessModal } from "./ProjectUploadModals";
import FilterDropdown from "../common_component/FilterDropdown";
import filePdf from "../../assets/icon/file-pdf.svg";
import { useGetProjectDrawingsQuery, useGetPlantProjectDetailQuery } from "@/redux/api/projectApi";
import { UploadDrawingModal } from "./UploadDrawingModal";

const FileCard = ({
  file,
  onView,
  type = "drawing"
}: {
  file: any;
  onView: (file: any) => void;
  type?: "drawing" | "photo";
}) => (
  <div className="bg-white border border-[#0000001A] rounded-[6px] p-3 shadow-xs relative transition-all md:min-h-[100px] flex items-center">
    {/* Floating Status Badge */}
    <div className="absolute -top-3.5 -right-2 z-20">
      <span
        className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full md:text-xs text-[10px] font-normal ${file.statusColor}`}
        style={{ boxShadow: '0px 2px 4px rgba(0,0,0,0.05)' }}
      >
        {file.status}
      </span>
    </div>

    <div className="flex items-center gap-4 w-full">
      {/* Icon/Thumbnail Section */}
      <div className="shrink-0">
        {type === "drawing" ? (
          <img src={filePdf} alt="pdf" className="md:size-[32px] size-[24px]" />
        ) : (
          <div className="md:size-[52px] size-[30px] rounded-lg overflow-hidden border border-gray-100">
            <img
              src={file.thumbnail || "https://via.placeholder.com/100"}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-wrap items-center justify-between min-w-0">
        <div className="min-w-0 pr-2">
          <h4 className="md:text-base text-xs text-[#0D1522] font-bold truncate leading-tight">
            {file.name}
          </h4>
          <p className="md:text-sm text-xs text-[#637381] font-medium mt-1">
            {file.size}
          </p>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3 shrink-0 mr-1 ml-auto">
          <button
            onClick={() => downloadFile(file.imageUrl || filePdf, file.name)}
            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ArrowDown className="md:size-6 size-4 text-[#212B36]" />
          </button>
          <button
            onClick={() => onView(file)}
            className="p-1 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Eye className="md:size-6 size-4 text-[#1E51A4]" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const mapStatus = (apiStatus: string) => {
  const statusLower = apiStatus ? apiStatus.toLowerCase() : "";
  if (statusLower.includes("pending")) {
    return {
      text: "Pending",
      value: "pending",
      color: "bg-[#FEFAE2] text-[#F0CC16] border-[#FEFAE2]"
    };
  }
  if (statusLower.includes("approved")) {
    return {
      text: "Approved",
      value: "approved",
      color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]"
    };
  }
  if (statusLower.includes("revision") || statusLower.includes("required") || statusLower.includes("rejected")) {
    return {
      text: "Revision Requested",
      value: "revision-requested",
      color: "bg-[#FFF7ED] text-[#FF9409] border-[#FFEDD5]"
    };
  }
  return {
    text: apiStatus || "Unknown",
    value: statusLower,
    color: "bg-gray-50 text-gray-600 border-gray-100"
  };
};

const isPhotoFile = (fileName: string) => {
  const ext = fileName ? fileName.split('.').pop()?.toLowerCase() : "";
  return ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext || "");
};

const ProjectDrawingsView: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewDrawingOpen, setIsViewDrawingOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<any>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: drawingsData, isLoading, error } = useGetProjectDrawingsQuery(projectId || "");
  const { data: projectDetail } = useGetPlantProjectDetailQuery(projectId || "");

  const customer = customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project = customer?.projects.find((p) => p.id === projectId) || customer?.projects[0];

  const [activeStatus, setActiveStatus] = useState("all");

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Approved", value: "approved" },
    { label: "Revision Requested", value: "revision-requested" },
    { label: "Pending", value: "pending" },
  ];

  const onUpload = () => {
    setIsUploadModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleOpenDrawing = (file: any) => {
    setSelectedDrawing({
      ...file,
      id: projectDetail?.lead?.jobId || project?.id || "P-001",
      location: projectDetail?.lead?.location || customer?.location || "Unknown",
      uploadedBy: "Admin",
      receivedDate: file.original?.uploadedAt ? new Date(file.original.uploadedAt).toLocaleDateString() : "2026-05-01",
      imageUrl: file.imageUrl || "https://via.placeholder.com/800x600?text=Project+Drawing+Preview",
      rejectionReason: file.original?.rejectionReason || file.rejectionReason,
      comments: file.original?.comments || file.comments,
    });
    setIsViewDrawingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">Loading drawings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="font-semibold text-lg font-inter">Error loading drawings</p>
        <p className="text-sm text-gray-500 font-inter">
          {"status" in error ? `Status: ${error.status}` : "Access denied or network issue"}
        </p>
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0 font-inter font-bold"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
      </div>
    );
  }

  const projectName = projectDetail?.lead?.projectName || project?.name || "Project";

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text={`${projectName} - Drawings`} />
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Drawing/Photos
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <FilterDropdown
          activeTab={activeStatus}
          onTabChange={setActiveStatus}
          options={statusOptions}
        />
      </div>

      {/* Main Content Card */}
      <div className="space-y-6">
        {(drawingsData?.buildings || []).map((building) => {
          // Map drawings for this building
          const mappedFiles = (building.drawings || []).map((d: any) => {
            const statusInfo = mapStatus(d.status);
            return {
              name: d.fileName,
              size: `Version ${d.versionNumber}`,
              status: statusInfo.text,
              statusColor: statusInfo.color,
              statusValue: statusInfo.value,
              imageUrl: d.fileUrl,
              thumbnail: d.fileUrl,
              original: d,
            };
          });

          // Filter files based on searchTerm and activeStatus
          const filteredFiles = mappedFiles.filter(
            (file) =>
              (activeStatus === "all" || file.statusValue === activeStatus) &&
              file.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const buildingDrawings = filteredFiles.filter((file) => !isPhotoFile(file.name));
          const buildingPhotos = filteredFiles.filter((file) => isPhotoFile(file.name));

          const hasNoDrawingsAtAll = !building.drawings || building.drawings.length === 0;

          return (
            <div
              key={building.buildingId}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4"
            >
              {/* Building Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#212B36] font-inter">
                    Building {building.buildingNumber}
                  </h3>
                  {!hasNoDrawingsAtAll && building.latestDrawingStatus && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${mapStatus(building.latestDrawingStatus).color
                        }`}
                    >
                      {mapStatus(building.latestDrawingStatus).text}
                    </span>
                  )}
                </div>
              </div>

              {hasNoDrawingsAtAll ? (
                <div className="text-center py-8 text-sm text-gray-400 font-inter font-medium bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  No drawings or photos uploaded yet for this building.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Building Drawings */}
                  {buildingDrawings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#637381] font-inter">
                        Drawings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                        {buildingDrawings.map((file, idx) => (
                          <FileCard key={idx} file={file} onView={handleOpenDrawing} type="drawing" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Building Photos */}
                  {buildingPhotos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#637381] font-inter">
                        Photos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                        {buildingPhotos.map((file, idx) => (
                          <FileCard key={idx} file={file} onView={handleOpenDrawing} type="photo" />
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredFiles.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400 font-inter">
                      No drawings match the current filter.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {(drawingsData?.buildings || []).length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500 font-inter bg-white rounded-xl border border-gray-100">
            No buildings found for this project.
          </div>
        )}
      </div>

      {selectedDrawing && (
        <ViewDrawingModal
          isOpen={isViewDrawingOpen}
          onClose={() => setIsViewDrawingOpen(false)}
          drawing={selectedDrawing}
        />
      )}

      <UploadDrawingModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        leadId={projectId || ""}
        onUpload={onUpload}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Building Drawings & Photos Uploaded Successfully"
        buttonLabel="Go to Drawings"
        onButtonClick={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default ProjectDrawingsView;
