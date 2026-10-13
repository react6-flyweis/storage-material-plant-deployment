import React, { useState } from "react";
import SubHeading from "../common_component/SubHeading";
import {
  Image as ImageIcon,
  Video,
  Play,
  Maximize2,
  ExternalLink,
  Calendar,
  User,
  Film,
  X,
  FileQuestion,
  RefreshCw,
} from "lucide-react";
import {
  useGetPlantProjectMediaQuery,
  type ProjectMediaItem,
} from "@/redux/api/projectApi";
import Modal from "../Modal";

interface ProjectPhotosProps {
  projectId: string;
}

type MediaFilter = "all" | "photo" | "video";

const ProjectPhotos: React.FC<ProjectPhotosProps> = ({ projectId }) => {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const [previewItem, setPreviewItem] = useState<ProjectMediaItem | null>(null);

  const {
    data: mediaData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPlantProjectMediaQuery(projectId, {
    skip: !projectId,
  });

  const allItems: ProjectMediaItem[] = mediaData?.documents || [];
  const photos: ProjectMediaItem[] = mediaData?.photos || [];
  const videos: ProjectMediaItem[] = mediaData?.videos || [];

  const photoCount = mediaData?.photoCount ?? photos.length;
  const videoCount = mediaData?.videoCount ?? videos.length;
  const totalCount = mediaData?.total ?? allItems.length;

  const displayedItems =
    filter === "photo"
      ? photos
      : filter === "video"
      ? videos
      : allItems;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <SubHeading text="Photos & Videos" />
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1E51A4]/10 text-[#1E51A4]">
              {totalCount} {totalCount === 1 ? "item" : "items"}
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#637381] mt-1 font-inter">
            View site photos and videos uploaded for this project.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-[#F4F6F8] p-1 rounded-lg border border-gray-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filter === "all"
                  ? "bg-white text-[#1E51A4] shadow-xs font-semibold"
                  : "text-[#637381] hover:text-[#212B36]"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("photo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                filter === "photo"
                  ? "bg-white text-[#1E51A4] shadow-xs font-semibold"
                  : "text-[#637381] hover:text-[#212B36]"
              }`}
            >
              <ImageIcon size={13} />
              Photos ({photoCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                filter === "video"
                  ? "bg-white text-[#1E51A4] shadow-xs font-semibold"
                  : "text-[#637381] hover:text-[#212B36]"
              }`}
            >
              <Video size={13} />
              Videos ({videoCount})
            </button>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh media"
            className="p-2 text-gray-500 hover:text-[#1E51A4] hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin text-[#1E51A4]" : ""}
            />
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-[#1E51A4]" />
          <p className="text-xs text-gray-500 font-inter font-medium">
            Loading project photos & videos...
          </p>
        </div>
      ) : error ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
            <FileQuestion size={22} />
          </div>
          <p className="text-sm font-semibold text-gray-800">
            Unable to load media
          </p>
          <p className="text-xs text-gray-500 max-w-sm mt-1">
            There was a problem fetching photos and videos for this project.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-3 py-1.5 text-xs font-semibold text-[#1E51A4] border border-[#1E51A4] rounded-lg hover:bg-blue-50 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="py-14 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] text-[#94A3B8] flex items-center justify-center mb-3">
            {filter === "video" ? (
              <Film size={26} />
            ) : (
              <ImageIcon size={26} />
            )}
          </div>
          <h4 className="text-sm font-semibold text-gray-700">
            {filter === "video"
              ? "No videos available"
              : filter === "photo"
              ? "No photos available"
              : "No photos or videos yet"}
          </h4>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-xs font-inter">
            {filter === "all"
              ? "Photos and videos uploaded from the site or other panels will appear here."
              : `No ${filter}s have been uploaded for this project yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
          {displayedItems.map((item) => {
            const isVideo = item.type === "video";
            return (
              <div
                key={item._id || item.url}
                onClick={() => setPreviewItem(item)}
                className="group relative flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#1E51A4] transition-all duration-200 cursor-pointer"
              >
                {/* Media Thumbnail Container */}
                <div className="relative aspect-4/3 w-full bg-[#0F172A] overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <>
                      <video
                        src={item.url}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-[#1E51A4] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play size={18} className="fill-[#1E51A4] translate-x-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <Film size={11} />
                        Video
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        src={item.url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                        <ImageIcon size={11} />
                        Photo
                      </span>
                    </>
                  )}

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-[#1E51A4] text-xs font-semibold shadow-md">
                      <Maximize2 size={13} />
                      Preview
                    </span>
                  </div>
                </div>

                {/* Info Bar */}
                <div className="p-2.5 flex flex-col justify-between grow bg-white">
                  <p
                    className="text-xs font-semibold text-gray-800 truncate font-inter"
                    title={item.name}
                  >
                    {item.name || "Untitled Media"}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5 font-inter">
                    <span className="flex items-center gap-1 truncate">
                      <Calendar size={11} />
                      {formatDate(item.uploadedAt)}
                    </span>
                    {item.uploadedBy?.name && (
                      <span
                        className="truncate max-w-[80px] text-gray-500"
                        title={`Uploaded by ${item.uploadedBy.name}`}
                      >
                        {item.uploadedBy.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen / Modal Preview */}
      {previewItem && (
        <Modal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          width="max-w-4xl"
          height="max-h-[92vh]"
          hideHeader
        >
          <div className="flex flex-col h-full -m-2 xl:-m-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white rounded-t-xl">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <div className="p-1.5 rounded-lg bg-blue-50 text-[#1E51A4] shrink-0">
                  {previewItem.type === "video" ? (
                    <Video size={18} />
                  ) : (
                    <ImageIcon size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate font-inter">
                    {previewItem.name || "Media Preview"}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-0.5 font-inter">
                    {previewItem.uploadedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(previewItem.uploadedAt)}
                      </span>
                    )}
                    {previewItem.uploadedBy?.name && (
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {previewItem.uploadedBy.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1E51A4] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-inter"
                >
                  <ExternalLink size={13} />
                  Open in New Tab
                </a>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Media Display Viewport */}
            <div className="relative bg-black/95 flex items-center justify-center min-h-[360px] max-h-[70vh] p-4 overflow-hidden">
              {previewItem.type === "video" ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[66vh] max-w-full rounded-md shadow-2xl object-contain"
                >
                  Your browser does not support playing this video.
                </video>
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[66vh] max-w-full rounded-md shadow-2xl object-contain"
                />
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectPhotos;
