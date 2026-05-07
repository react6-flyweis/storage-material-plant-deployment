import React from "react";
import Modal from "../Modal";
import checkIcon from "@/assets/icon/checkIcon.svg";
import upload from "@/assets/icon/upload.svg";
import pdf from "@/assets/icon/pdfIcon.svg";
import { CircleX, X } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  fileLabel: string;
  onUpload: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  fileLabel,
  onUpload,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-xl" hideHeader>
      <div className="p-1 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            {/* <h2 className="text-xl font-inter font-bold text-[#212B36]">{title}</h2> */}
            <SubHeading text={title} />
            <p className="text-sm text-[#637381] font-inter">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#919EAB]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dropzone */}
        <div className="border-2 border-dashed border-[#1849D6] rounded-lg p-6 md:p-10 flex flex-col items-center justify-center space-y-4 bg-white">
          <img src={upload} alt="Upload" className="size-8" />
          <p className="text-sm font-inter font-normal text-[#212B36]">
            Drag your file(s) to start uploading
          </p>
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 font-inter font-normal uppercase">
              OR
            </span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <button className="px-4 md:px-6 py-2 border border-[#446DF6] text-[#446DF6] rounded-lg text-sm font-inter font-bold hover:bg-[#446DF6]/5 transition-colors">
            Browse files
          </button>
        </div>

        <p className="text-xs text-[#919EAB] font-inter">
          Only support .jpg, .png and .svg and zip files
        </p>

        {/* File List Item */}
        <div className="bg-white border border-gray-100 rounded-xl p-2 flex items-center gap-2 group">
          <img src={pdf} alt="Upload" className="size-8" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-inter font-normal text-[#212B36] truncate">
              {fileLabel}
            </p>
            <p className="text-xs text-[#919EAB] font-inter">5.3MB</p>
          </div>
          <button className="bg-gray-300 rounded-full text-gray-500 hover:text-[#FF4842] transition-colors hover:bg-gray-100">
            <CircleX size={16} />
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onUpload}
          >
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onButtonClick?: () => void;
  title: string;
  buttonLabel: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onButtonClick,
  title,
  buttonLabel,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader>
      <div className="p-6 flex flex-col items-center text-center space-y-8">
        <h2 className="text-lg md:text-2xl font-inter font-bold text-[#212B36] max-w-[280px]">
          {title}
        </h2>

        <div className="relative">
          <img
            src={checkIcon}
            alt="Success"
            className="size-30 md:size-39 animate-pulse-slow"
          />
        </div>

        <Button
        variant="gradient"
          onClick={onButtonClick || onClose}
        >
          {buttonLabel}
        </Button>
      </div>
    </Modal>
  );
};

export { UploadModal, SuccessModal };
