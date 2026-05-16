import React, { useRef, useState } from "react";
import Modal from "./Modal";
import uploadCloudIcon from "../assets/uploadCloudIcon.svg";
import CommonDropdown from "./common_component/CommonDropdown";
import Button from "./common_component/Button";

interface UploadDrawingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const PROJECT_OPTIONS = [
  { label: "Downtown Office Complex", value: "downtown" },
  { label: "City Mall Renovation", value: "mall" },
  { label: "Highway Bridge Project", value: "highway" },
];

const UploadDrawingsModal: React.FC<UploadDrawingsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log(e.dataTransfer.files);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Drawings & Images"
      width="max-w-xl"
    >
      <div className="space-y-6">
        <div
          className={`border-3 border-dashed rounded-[14px] m-2 md:m-5 p-4 md:p-6 flex flex-wrap items-center justify-around text-center transition-colors
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-[#C5C5C5] bg-white"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
            />

            <div className="md:w-8 md:h-8 w-6 h-6 mb-4 text-gray-400">
              <img
                src={uploadCloudIcon}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[#7C7C7C] text-xs md:text-sm mb-1">Drop your file here</p>
            <p className="text-[#7C7C7C] text-xs font-normal mb-4">
              or click to browse
            </p>
          </div>

          <Button
            onClick={handleButtonClick}
            variant="blueFilled"
            size="sm"
          >
            Choose file
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 mt-2">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
          <p className="text-xs text-gray-400">
            Required columns: Company, Contact, Email
          </p>
        </div>

        {/* Project Selection */}
        <CommonDropdown
          label="Project"
          options={PROJECT_OPTIONS}
          value={selectedProject}
          onChange={setSelectedProject}
          placeholder="Select Project"
        />

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="w-full px-4 py-2.5 bg-(--button-bg-primary-color) text-white font-light rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDrawingsModal;
