import React, { useRef, useState } from "react";
import Modal from "./Modal";
import uploadCloudIcon from "../assets/uploadCloudIcon.svg";

interface UploadDrawingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadDrawingsModal: React.FC<UploadDrawingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dragActive, setDragActive] = useState(false);
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
          className={`border-4 border-dashed rounded-xl p-6 flex items-center justify-around text-center transition-colors
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
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

            <p className="text-gray-400 text-sm mb-1">Drop your file here</p>
            <p className="text-gray-400 text-xs font-normal mb-4">
              or click to browse
            </p>
          </div>

          <button
            onClick={handleButtonClick}
            className="bg-(--button-bg-primary-color) text-white px-6 py-2 rounded-lg font-light text-sm hover:opacity-90 transition-opacity"
          >
            Choose file
          </button>
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
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Project</label>
          <div className="relative">
            <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option>Downtown Office Complex</option>
              <option>City Mall Renovation</option>
              <option>Highway Bridge Project</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
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
