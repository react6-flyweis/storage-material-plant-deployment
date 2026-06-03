import React from "react";
import Modal from "../Modal";
import checkIcon from "@/assets/icon/checkIcon.svg";
import upload from "@/assets/icon/upload.svg";
import pdf from "@/assets/icon/pdfIcon.svg";
import { CircleX, X } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";
import { useGetPresignedUrlMutation } from "@/redux/api/uploadApi";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  fileLabel: string;
  onUpload: (file: File, fileUrl: string) => void;
  folder?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  onUpload,
  folder,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [getPresignedUrl, { isLoading: isGettingUrl }] =
    useGetPresignedUrlMutation();
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(
    null,
  );
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Step 1: Get presigned URL
      const response = await getPresignedUrl({
        fileName: selectedFile.name,
        fileType: selectedFile.type || "application/octet-stream",
        folder: folder || "",
      }).unwrap();

      const { uploadUrl, fileUrl } = response;

      // Step 2: Upload file to S3 via PUT
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader(
          "Content-Type",
          selectedFile.type || "application/octet-stream",
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`S3 upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error during S3 upload."));
        };

        xhr.send(selectedFile);
      });

      // Step 3: Success callback
      onUpload(selectedFile, fileUrl);
      setSelectedFile(null);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const errMsg =
        err instanceof Error
          ? err.message
          : "Failed to upload file. Please try again.";
      setUploadError(errMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const isPending = isUploading || isGettingUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-xl" hideHeader>
      <div className="p-1 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <SubHeading text={title} />
            <p className="text-sm text-[#637381] font-inter">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#919EAB] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed border-[#1849D6] rounded-lg p-6 md:p-10 flex flex-col items-center justify-center space-y-4 bg-white transition-opacity ${
            isPending ? "opacity-50 pointer-events-none" : ""
          }`}
        >
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

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isPending}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            Browse files
          </Button>
        </div>

        <p className="text-xs text-[#919EAB] font-inter">
          Only support .jpg, .png and .svg and zip files
        </p>

        {/* File List Item */}
        {selectedFile && (
          <div className="bg-white border border-gray-100 rounded-xl p-2 flex items-center gap-2 group">
            <img src={pdf} alt="Upload" className="size-8" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-inter font-normal text-[#212B36] truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[#919EAB] font-inter">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            {!isPending && (
              <button
                onClick={() => setSelectedFile(null)}
                className="bg-gray-300 rounded-full text-gray-500 hover:text-[#FF4842] transition-colors hover:bg-gray-100"
              >
                <CircleX size={16} />
              </button>
            )}
          </div>
        )}

        {/* Uploading Status / Progress Bar */}
        {isPending && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#637381] font-inter">
              <span>
                {isGettingUrl
                  ? "Requesting upload authorization..."
                  : "Uploading to S3..."}
              </span>
              {uploadProgress !== null && <span>{uploadProgress}%</span>}
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#1849D6] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress ?? 0}%` }}
              />
            </div>
          </div>
        )}

        {uploadError && (
          <p className="text-xs text-red-500 font-inter font-medium">
            {uploadError}
          </p>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
          >
            {isPending ? "Uploading..." : "Upload"}
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

        <Button variant="gradient" onClick={onButtonClick || onClose}>
          {buttonLabel}
        </Button>
      </div>
    </Modal>
  );
};

export { UploadModal, SuccessModal };
