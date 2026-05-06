import React from "react";
import Modal from "../Modal";
import checkIcon from "@/assets/icon/checkIcon.svg";
import upload from "@/assets/icon/upload.svg";
import pdf from "@/assets/icon/pdfIcon.svg";
import { CircleX, X } from "lucide-react";



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
  onUpload 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-xl" hideHeader>
      <div className="p-3 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-inter font-bold text-[#212B36]">{title}</h2>
            <p className="text-sm text-[#637381] font-inter">{subtitle}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#919EAB]">
            <X size={20} />
          </button>
        </div>

        {/* Dropzone */}
        <div className="border-2 border-dashed border-[#1849D6] rounded-lg p-6 md:p-10 flex flex-col items-center justify-center space-y-4 bg-white">
            <img src={upload} alt="Upload" className="size-8" />
          <p className="text-sm font-inter font-normal text-[#212B36]">Drag your file(s) to start uploading</p>
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400 font-inter font-normal uppercase">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <button className="px-4 md:px-6 py-2 border border-[#446DF6] text-[#446DF6] rounded-lg text-sm font-inter font-bold hover:bg-[#446DF6]/5 transition-colors">
            Browse files
          </button>
        </div>

        <p className="text-xs text-[#919EAB] font-inter">Only support .jpg, .png and .svg and zip files</p>

        {/* File List Item */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 group">
  <img src={pdf} alt="Upload" className="size-8" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-inter font-normal text-[#212B36] truncate">{fileLabel}</p>
            <p className="text-xs text-[#919EAB] font-inter">5.3MB</p>
          </div>
          <button className="p-1 text-[#919EAB] hover:text-[#FF4842] transition-colors rounded-full hover:bg-gray-100">
            <CircleX size={16} />
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-200 text-[#637381] rounded-lg text-sm font-inter font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onUpload}
            className="px-8 py-2.5 bg-[#1E51A4] text-white rounded-lg text-sm font-inter font-bold hover:opacity-90 transition-opacity"
          >
            Upload
          </button>
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

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, onButtonClick, title, buttonLabel }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader>
      <div className="p-6 flex flex-col items-center text-center space-y-8">
        <h2 className="text-lg md:text-2xl font-inter font-bold text-[#212B36] max-w-[280px]">
          {title}
        </h2>
        
        <div className="relative">
          <img src={checkIcon} alt="Success" className="size-30 md:size-39 animate-pulse-slow" />
        </div>

        <button 
          onClick={onButtonClick || onClose}
          className="px-4 py-2 md:px-8 md:py-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[10px] text-base md:text-lg font-inter font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
        >
          {buttonLabel}
        </button>
      </div>
    </Modal>
  );
};


export { UploadModal, SuccessModal };
