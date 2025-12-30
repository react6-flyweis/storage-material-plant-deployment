import React, { useState } from "react";
import Modal from "../Modal";
import ViewDrawingModal from "./ViewDrawingModal";

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
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative group hover:border-blue-200 transition-all">
    <div className="absolute top-2 right-2 flex gap-1">
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${file.statusColor}`}
      >
        {file.status}
      </span>
    </div>
    <div className="flex items-center gap-3 mt-4">
      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-400 font-medium">{file.size}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
        <button
          onClick={() => onView(file)}
          className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
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
      statusColor: "bg-orange-50 text-orange-600 border-orange-100",
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
      statusColor: "bg-orange-50 text-orange-600 border-orange-100",
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
      <div className="p-4 md:p-8">
        <div className="border-2 md:border-[3px] border-[#0ea5e9] rounded-[16px] md:rounded-[24px] overflow-hidden shadow-sm">
          {/* Internal Header */}
          <div className="bg-white px-4 py-4 md:px-8 md:py-6 flex flex-col md:flex-row md:items-start md:justify-between border-b border-gray-100 gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
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
              <h3 className="text-base font-bold text-gray-900 mb-6 font-primary">
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
