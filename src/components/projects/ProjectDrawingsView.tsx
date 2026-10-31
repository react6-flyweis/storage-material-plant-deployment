import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Eye,
  ArrowDown,
  Image as ImageIcon,
  Film,
  FileText,
  Play,
} from "lucide-react";
import { downloadFile } from "../../lib/utils";
import Heading from "../common_component/Heading";
import Button from "../common_component/Button";
import ViewDrawingModal, { type ViewDrawingFileItem } from "../leads/ViewDrawingModal";
import FilterDropdown from "../common_component/FilterDropdown";
import filePdf from "../../assets/icon/file-pdf.svg";
import {
  useGetProjectDrawingsQuery,
  useGetPlantProjectDetailQuery,
  useGetPlantProjectMediaQuery,
  type ProjectMediaItem,
} from "@/redux/api/projectApi";
import { UploadDrawingModal } from "./UploadDrawingModal";

const isImageFile = (fileName?: string) => {
  const ext = fileName ? fileName.split(".").pop()?.toLowerCase() : "";
  return ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext || "");
};

const isVideoFile = (fileName?: string) => {
  const ext = fileName ? fileName.split(".").pop()?.toLowerCase() : "";
  return ["mp4", "mov", "webm", "mkv", "avi", "ogg"].includes(ext || "");
};

interface FileCardItem {
  name: string;
  size: string;
  status: string;
  statusColor: string;
  statusValue: string;
  imageUrl: string;
  thumbnail: string;
  original: any;
  type: "drawing" | "photo" | "video";
}

const FileCard = ({
  file,
  onView,
}: {
  file: FileCardItem;
  onView: (file: FileCardItem) => void;
}) => {
  const isImage = isImageFile(file.name);
  const isVideo = file.type === "video" || isVideoFile(file.name);
  const isDrawing = file.type === "drawing";

  return (
    <div className="bg-white border border-[#0000001A] rounded-[8px] p-3 shadow-xs relative transition-all md:min-h-[96px] flex items-center hover:border-[#1E51A4]/40 hover:shadow-xs">
      {/* Floating Status Badge */}
      {file.status && (
        <div className="absolute -top-3 right-3 z-20">
          <span
            className={`px-2.5 md:px-3 py-0.5 rounded-full md:text-xs text-[10px] font-medium ${file.statusColor}`}
            style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" }}
          >
            {file.status}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3.5 w-full">
        {/* Icon/Thumbnail Section */}
        <div className="shrink-0">
          {isVideo ? (
            <div className="md:size-[48px] size-[38px] rounded-lg overflow-hidden border border-gray-200 bg-slate-900 relative flex items-center justify-center">
              <video
                src={file.imageUrl}
                className="w-full h-full object-cover opacity-75"
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-5 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                  <Play size={10} className="fill-[#1E51A4] text-[#1E51A4] translate-x-px" />
                </div>
              </div>
            </div>
          ) : isDrawing && !isImage ? (
            <div className="md:size-[48px] size-[38px] rounded-lg bg-red-50/70 border border-red-100 flex items-center justify-center">
              <img src={filePdf} alt="pdf" className="md:size-[28px] size-[22px]" />
            </div>
          ) : (
            <div className="md:size-[48px] size-[38px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              <img
                src={file.thumbnail || file.imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-wrap items-center justify-between min-w-0 pr-1">
          <div className="min-w-0 pr-2">
            <h4
              className="md:text-sm text-xs text-[#0D1522] font-bold truncate leading-tight font-inter"
              title={file.name}
            >
              {file.name}
            </h4>
            <p className="text-xs text-[#637381] font-medium mt-1 font-inter">
              {file.size}
            </p>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            <button
              onClick={() => downloadFile(file.imageUrl || filePdf, file.name)}
              title="Download"
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            >
              <ArrowDown size={18} />
            </button>
            <button
              onClick={() => onView(file)}
              title="Preview"
              className="p-1.5 hover:bg-blue-50 rounded-lg text-[#1E51A4] transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStatus = (apiStatus: string) => {
  const statusLower = apiStatus ? apiStatus.toLowerCase() : "";
  if (statusLower.includes("pending")) {
    return {
      text: "Pending",
      value: "pending",
      color: "bg-[#FEFAE2] text-[#F0CC16] border-[#FEFAE2]",
    };
  }
  if (statusLower.includes("approved")) {
    return {
      text: "Approved",
      value: "approved",
      color: "bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]",
    };
  }
  if (
    statusLower.includes("revision") ||
    statusLower.includes("required") ||
    statusLower.includes("rejected")
  ) {
    return {
      text: "Revision Requested",
      value: "revision-requested",
      color: "bg-[#FFF7ED] text-[#FF9409] border-[#FFEDD5]",
    };
  }
  return {
    text: apiStatus || "Unknown",
    value: statusLower,
    color: "bg-gray-50 text-gray-600 border-gray-100",
  };
};

type ViewCategory = "all" | "drawings" | "photos" | "videos";

const ProjectDrawingsView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewCategory, setViewCategory] = useState<ViewCategory>("all");
  const [isViewDrawingOpen, setIsViewDrawingOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<ViewDrawingFileItem | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const {
    data: drawingsData,
    isLoading: isLoadingDrawings,
    error: drawingsError,
  } = useGetProjectDrawingsQuery(projectId || "");

  const {
    data: mediaData,
    isLoading: isLoadingMedia,
  } = useGetPlantProjectMediaQuery(projectId || "", {
    skip: !projectId,
  });

  const { data: projectDetail } = useGetPlantProjectDetailQuery(projectId || "");

  const [activeStatus, setActiveStatus] = useState("all");

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Approved", value: "approved" },
    { label: "Revision Requested", value: "revision-requested" },
    { label: "Pending", value: "pending" },
  ];

  const handleOpenDrawing = (file: FileCardItem) => {
    setSelectedDrawing({
      name: file.name,
      id: projectDetail?.lead?.jobId || "P-001",
      location: projectDetail?.lead?.location || "Unknown",
      uploadedBy: file.original?.uploadedBy?.name || "Admin",
      receivedDate: file.original?.uploadedAt
        ? new Date(file.original.uploadedAt).toLocaleDateString()
        : "",
      imageUrl: file.imageUrl || "https://via.placeholder.com/800x600?text=Preview",
      status: file.status,
      type: file.type,
      rejectionReason: file.original?.rejectionReason || file.original?.rejectReason,
      comments: file.original?.comments,
    });
    setIsViewDrawingOpen(true);
  };

  const isLoading = isLoadingDrawings || isLoadingMedia;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading drawings and media...
        </p>
      </div>
    );
  }

  if (drawingsError && !drawingsData) {
    return (
      <div className="p-10 text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="font-semibold text-lg font-inter">Error loading drawings</p>
        <p className="text-sm text-gray-500 font-inter">
          {"status" in drawingsError
            ? `Status: ${drawingsError.status}`
            : "Access denied or network issue"}
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

  const projectName = projectDetail?.lead?.projectName || "Project";

  // Map media from project media API (photos & videos)
  const mediaDocuments: ProjectMediaItem[] = mediaData?.documents || [];
  const projectPhotosList = mediaDocuments.filter(
    (item) => item.type === "photo" || isImageFile(item.name)
  );
  const projectVideosList = mediaDocuments.filter(
    (item) => item.type === "video" || isVideoFile(item.name)
  );

  // Map media items into FileCard shape with type: "photo" and "video"
  const mappedMediaPhotos: FileCardItem[] = projectPhotosList.map((m) => {
    const statusInfo = mapStatus(m.approvalStatus || "approved");
    return {
      name: m.name,
      size: m.uploadedAt
        ? new Date(m.uploadedAt).toLocaleDateString()
        : "Photo",
      status: statusInfo.text,
      statusColor: statusInfo.color,
      statusValue: statusInfo.value,
      imageUrl: m.url,
      thumbnail: m.url,
      original: m,
      type: "photo",
    };
  });

  const mappedMediaVideos: FileCardItem[] = projectVideosList.map((m) => {
    const statusInfo = mapStatus(m.approvalStatus || "approved");
    return {
      name: m.name,
      size: m.uploadedAt
        ? new Date(m.uploadedAt).toLocaleDateString()
        : "Video",
      status: statusInfo.text,
      statusColor: statusInfo.color,
      statusValue: statusInfo.value,
      imageUrl: m.url,
      thumbnail: m.url,
      original: m,
      type: "video",
    };
  });

  const filteredMediaPhotos = mappedMediaPhotos.filter(
    (f) =>
      (activeStatus === "all" || f.statusValue === activeStatus) &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMediaVideos = mappedMediaVideos.filter(
    (f) =>
      (activeStatus === "all" || f.statusValue === activeStatus) &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate building drawing counts
  const buildingsList = drawingsData?.buildings || [];
  const totalDrawingsCount = buildingsList.reduce(
    (acc, b) => acc + (b.drawings?.length || 0),
    0
  );

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
          <Heading text={`${projectName} - Drawings & Media`} />
        </div>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Drawing
        </Button>
      </div>

      {/* Category Tabs & Search/Status Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center flex-wrap gap-1.5 bg-[#F4F6F8] p-1 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setViewCategory("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewCategory === "all"
                ? "bg-white text-[#1E51A4] font-semibold shadow-xs"
                : "text-[#637381] hover:text-[#212B36]"
            }`}
          >
            All Files ({totalDrawingsCount + mappedMediaPhotos.length + mappedMediaVideos.length})
          </button>
          <button
            type="button"
            onClick={() => setViewCategory("drawings")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewCategory === "drawings"
                ? "bg-white text-[#1E51A4] font-semibold shadow-xs"
                : "text-[#637381] hover:text-[#212B36]"
            }`}
          >
            <FileText size={13} />
            Building Drawings ({totalDrawingsCount})
          </button>
          <button
            type="button"
            onClick={() => setViewCategory("photos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewCategory === "photos"
                ? "bg-white text-[#1E51A4] font-semibold shadow-xs"
                : "text-[#637381] hover:text-[#212B36]"
            }`}
          >
            <ImageIcon size={13} />
            Site Photos ({mappedMediaPhotos.length})
          </button>
          <button
            type="button"
            onClick={() => setViewCategory("videos")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewCategory === "videos"
                ? "bg-white text-[#1E51A4] font-semibold shadow-xs"
                : "text-[#637381] hover:text-[#212B36]"
            }`}
          >
            <Film size={13} />
            Site Videos ({mappedMediaVideos.length})
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <FilterDropdown
            activeTab={activeStatus}
            onTabChange={setActiveStatus}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Building Drawings Section (Always cleanly grouped by building, whether PDF or Image drawings) */}
      {(viewCategory === "all" || viewCategory === "drawings") && (
        <div className="space-y-6">
          {buildingsList.map((building) => {
            const mappedBuildingDrawings: FileCardItem[] = (building.drawings || []).map((d: any) => {
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
                type: "drawing" as const,
              };
            });

            // Filter files based on searchTerm and activeStatus
            const filteredBuildingDrawings = mappedBuildingDrawings.filter(
              (file) =>
                (activeStatus === "all" || file.statusValue === activeStatus) &&
                file.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const hasNoDrawingsAtAll =
              !building.drawings || building.drawings.length === 0;

            return (
              <div
                key={building.buildingId}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4"
              >
                {/* Building Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#212B36] font-inter">
                      Building {building.buildingNumber} - Drawings
                    </h3>
                    {!hasNoDrawingsAtAll && building.latestDrawingStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${
                          mapStatus(building.latestDrawingStatus).color
                        }`}
                      >
                        {mapStatus(building.latestDrawingStatus).text}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-inter font-medium">
                    {building.drawings?.length || 0} {building.drawings?.length === 1 ? "drawing" : "drawings"}
                  </span>
                </div>

                {hasNoDrawingsAtAll ? (
                  <div className="text-center py-8 text-sm text-gray-400 font-inter font-medium bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                    No drawings uploaded yet for this building.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                      {filteredBuildingDrawings.map((file, idx) => (
                        <FileCard
                          key={idx}
                          file={file}
                          onView={handleOpenDrawing}
                        />
                      ))}
                    </div>

                    {filteredBuildingDrawings.length === 0 && (
                      <div className="text-center py-4 text-xs text-gray-400 font-inter">
                        No drawings match the current filter.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {buildingsList.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500 font-inter bg-white rounded-xl border border-gray-100">
              No buildings found for this project.
            </div>
          )}
        </div>
      )}

      {/* Separate Section: Site Photos */}
      {(viewCategory === "all" || viewCategory === "photos") && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#212B36] font-inter flex items-center gap-2">
                <ImageIcon size={20} className="text-[#1E51A4]" />
                Site Photos
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1E51A4]">
                {filteredMediaPhotos.length}
              </span>
            </div>
          </div>

          {filteredMediaPhotos.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 font-inter font-medium bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              {searchTerm || activeStatus !== "all"
                ? "No site photos match the current filter."
                : "No site photos uploaded yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
              {filteredMediaPhotos.map((file, idx) => (
                <FileCard
                  key={idx}
                  file={file}
                  onView={handleOpenDrawing}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Separate Section: Site Videos */}
      {(viewCategory === "all" || viewCategory === "videos") && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-[#212B36] font-inter flex items-center gap-2">
                <Film size={20} className="text-[#1E51A4]" />
                Site Videos
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1E51A4]">
                {filteredMediaVideos.length}
              </span>
            </div>
          </div>

          {filteredMediaVideos.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400 font-inter font-medium bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              {searchTerm || activeStatus !== "all"
                ? "No site videos match the current filter."
                : "No site videos uploaded yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
              {filteredMediaVideos.map((file, idx) => (
                <FileCard
                  key={idx}
                  file={file}
                  onView={handleOpenDrawing}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
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
      />
    </div>
  );
};

export default ProjectDrawingsView;
