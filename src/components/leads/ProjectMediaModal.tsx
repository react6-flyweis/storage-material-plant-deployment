import React, { useState } from "react";
import Modal from "../Modal";
import ViewDrawingModal from "./ViewDrawingModal";
import { ArrowDown, Eye, File } from "lucide-react";

interface ProjectMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: {
    name: string;
    id: string;
    uploadedBy: string;
    location: string;
    lastUpdate: string;
  };
}

const FileCard = ({
  file,
  onView,
}: {
  file: any;
  onView: (file: any) => void;
}) => (
  <div className="bg-white border border-gray-100 rounded-xl xl:p-4 py-3 px-2 shadow-sm relative group hover:border-blue-200 transition-all">
    <div className="absolute top-2 right-2 flex gap-1">
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-normal border ${file.statusColor}`}
      >
        {file.status}
      </span>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="xl:w-10 xl:h-10 h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
        <File className="xl:w-6 xl:h-6 h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="xl:text-sm text-xs font-bold text-gray-900 truncate">
          {file.name}
        </p>
        <p className="xl:text-xs text-[10px] text-gray-400 font-medium">
          {file.size}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
          <ArrowDown className="xl:w-6 xl:h-6 h-4 w-4 text-black" />
        </button>
        <button
          onClick={() => onView(file)}
          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Eye className="xl:w-6 xl:h-6 h-4 w-4 text-[#1D51A4]" />
        </button>
      </div>
    </div>
  </div>
);

const ProjectMediaModal: React.FC<ProjectMediaModalProps> = ({
  isOpen,
  onClose,
  projectData,
}) => {
  const [isViewDrawingOpen, setIsViewDrawingOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<any>(null);

  const handleOpenDrawing = (file: any) => {
    setSelectedDrawing({
      ...file,
      id: projectData.id,
      location: projectData.location,
      uploadedBy: projectData.uploadedBy,
      receivedDate: projectData.lastUpdate,
      imageUrl:
        "https://via.placeholder.com/800x600?text=Project+Drawing+Preview", // Placeholder image
    });
    setIsViewDrawingOpen(true);
  };

  const handleCloseDrawing = () => {
    setIsViewDrawingOpen(false);
    setSelectedDrawing(null);
  };

  const drawings = [
    {
      name: "Architectural Plans.pdf",
      size: "15.2 MB",
      status: "Pending Review",
      statusColor: "bg-[#FEFAE2] text-[#F0CC16] border-[#FEFAE2]",
    },
    {
      name: "Structural Drawings.dwg",
      size: "15.2 MB",
      status: "Approved",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "Specifications.docx",
      size: "15.2 MB",
      status: "Revision Required",
      statusColor: "bg-red-50 text-red-600 border-red-100",
    },
  ];

  const photos = [
    {
      name: "Architectural Plans.pdf",
      size: "15.2 MB",
      status: "Pending Review",
      statusColor: "bg-[#FEFAE2] text-orange-600 border-orange-100",
    },
    {
      name: "Structural Building.dwg",
      size: "15.2 MB",
      status: "Approved",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      name: "Specifications.docx",
      size: "15.2 MB",
      status: "Revision Required",
      statusColor: "bg-red-50 text-red-600 border-red-100",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" width="max-w-6xl">
      <div className="xl:p-4 p-2 md:p-8">
        <div className="border-2 md:border rounded-[16px] md:rounded-[24px] overflow-hidden shadow-sm">
          {/* Internal Header */}
          <div className="bg-white px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-100 gap-6">
            <div>
              <h2 className="xl:text-xl md:text-2xl font-bold text-gray-900">
                {projectData.name}
              </h2>
              <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">
                {projectData.id}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap md:flex-nowrap gap-4 md:gap-12 text-left md:text-right">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Uploaded By:
                </p>
                <p className="text-xs md:text-sm font-semibold text-gray-900 mt-1">
                  {projectData.uploadedBy}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Pune,
                </p>
                <p className="text-xs md:text-sm font-semibold text-gray-900 mt-1">
                  {projectData.location}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  Last Update on
                </p>
                <p className="text-xs md:text-sm font-semibold text-gray-600 mt-1">
                  {projectData.lastUpdate}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 space-y-8 md:space-y-10 bg-white">
            {/* Drawings Section */}
            <div>
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-4 md:mb-6 font-primary">
                Attached Drawings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawings.map((draw, idx) => (
                  <FileCard
                    key={idx}
                    file={draw}
                    onView={(file) => handleOpenDrawing(file)}
                  />
                ))}
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <h3 className="xl:text-base font-bold text-gray-900 mb-6 font-primary">
                Attached Building Photos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <FileCard
                      file={photo}
                      onView={(file) => handleOpenDrawing(file)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedDrawing && (
        <ViewDrawingModal
          isOpen={isViewDrawingOpen}
          onClose={handleCloseDrawing}
          drawing={selectedDrawing}
        />
      )}
    </Modal>
  );
};

export default ProjectMediaModal;
