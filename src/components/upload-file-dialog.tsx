import * as React from "react";
import { FolderUp, XCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/common_component/Button";
import { useGetPresignedUrlMutation } from "@/redux/api/uploadApi";

interface FileUploadState {
  id: string;
  file: File;
  progress: number;
  status: "idle" | "uploading" | "completed" | "failed";
  error?: string;
  url?: string;
}

type Props = {
  title?: string;
  description?: string;
  supportText?: string;
  accept?: string;
  maxFiles?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  onUpload?: (urls: string[]) => void;
  onUploadComplete?: (files: { url: string; name: string }[]) => void;
  folder?: string;
};

const uploadWithXhr = (
  url: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during upload"));
    };

    xhr.send(file);
  });
};

export function UploadFileDialog({
  title = "Upload File",
  description = "Add your documents here.",
  supportText = "Only support .jpg, .png and .svg and zip files",
  accept = "*",
  maxFiles = 5,
  open: controlledOpen,
  onOpenChange,
  onUpload,
  onUploadComplete,
  folder = "documents",
}: Props) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [uploadStates, setUploadStates] = React.useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [getPresignedUrl] = useGetPresignedUrlMutation();

  const filterFiles = (fileList: FileList | null): File[] => {
    if (!fileList) return [];
    const files = Array.from(fileList);
    if (accept === "*") return files;

    const allowedExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());
    return files.filter((file) => {
      return allowedExtensions.some((ext) => {
        if (ext.startsWith(".")) {
          return file.name.toLowerCase().endsWith(ext);
        }
        return file.type === ext || file.type.startsWith(ext.replace("*", ""));
      });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const allowed = filterFiles(list);
    const newFiles = allowed.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "idle" as const,
    }));
    setUploadStates((s) => [...s, ...newFiles].slice(0, maxFiles));
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const list = e.dataTransfer?.files;
    if (!list) return;
    const allowed = filterFiles(list);
    const newFiles = allowed.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: "idle" as const,
    }));
    setUploadStates((s) => [...s, ...newFiles].slice(0, maxFiles));
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = async () => {
    if (!uploadStates.length) return;
    setIsUploading(true);

    try {
      const uploadPromises = uploadStates.map(async (state) => {
        if (state.status === "completed") return { url: state.url || "", name: state.file.name };

        setUploadStates((prev) =>
          prev.map((item) =>
            item.id === state.id
              ? { ...item, status: "uploading" as const, progress: 0, error: undefined }
              : item
          )
        );

        try {
          // 1. Get presigned URL
          const presignedRes = await getPresignedUrl({
            fileName: state.file.name,
            fileType: state.file.type || "application/octet-stream",
            folder,
          }).unwrap();

          const { uploadUrl, fileUrl } = presignedRes;

          // 2. Put file to S3
          await uploadWithXhr(uploadUrl, state.file, (progress) => {
            setUploadStates((prev) =>
              prev.map((item) =>
                item.id === state.id
                  ? { ...item, progress }
                  : item
              )
            );
          });

          // 3. Mark completed
          setUploadStates((prev) =>
            prev.map((item) =>
              item.id === state.id
                ? { ...item, status: "completed" as const, progress: 100, url: fileUrl }
                : item
            )
          );

          return { url: fileUrl, name: state.file.name };
        } catch (err: unknown) {
          const errorMsg =
            err && typeof err === "object" && "message" in err
              ? err.message as string
              : "Upload failed";
          setUploadStates((prev) =>
            prev.map((item) =>
              item.id === state.id
                ? { ...item, status: "failed" as const, error: errorMsg }
                : item
            )
          );
          throw new Error(errorMsg);
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulFiles = results
        .filter(
          (r): r is PromiseFulfilledResult<{ url: string; name: string }> =>
            r.status === "fulfilled" && !!r.value
        )
        .map((r) => r.value);

      const successfulUrls = successfulFiles.map((f) => f.url);
      const hasFailures = results.some((r) => r.status === "rejected");

      if (!hasFailures && (onUpload || onUploadComplete)) {
        if (onUploadComplete) {
          onUploadComplete(successfulFiles);
        }
        if (onUpload) {
          onUpload(successfulUrls);
        }
        setUploadStates([]);
        setOpen(false);
      }
    } catch (e) {
      console.error("Some uploads failed:", e);
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const handleClose = () => {
    if (isUploading) return;
    setUploadStates([]);
    setOpen(false);
  };


  return (

    <Modal
      isOpen={open}
      onClose={handleClose}
      title={title}
      width="max-w-lg"
    >
      <div className="flex flex-col gap-0">
        <div className="text-[14px] text-slate-500 mb-6">
          {description}
        </div>

        <div className="mb-4">
          <label
            className="block"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div
              className={`border-2 border-dashed rounded-[12px] p-6 text-center hover:bg-slate-50 relative transition-colors ${isDragging
                ? "border-[#1D51A4] bg-blue-50/50"
                : "border-blue-300 bg-white"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                onChange={handleInputChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center justify-center gap-3 relative z-10 py-2">
                <div className="w-12 h-12 rounded-[10px] bg-[#2563EB] flex items-center justify-center mb-1">
                  <FolderUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-slate-800 text-[15px] font-medium">
                  Drag your file(s) to start uploading
                </div>

                <div className="flex items-center w-3/4 max-w-[200px] my-1">
                  <div className="flex-1 h-[1px] bg-slate-200" />
                  <span className="text-slate-400 text-[12px] px-3">OR</span>
                  <div className="flex-1 h-[1px] bg-slate-200" />
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    className="border-[#2563EB] text-[#2563EB] hover:bg-blue-50 h-9 px-6 rounded-[8px]"
                    onClick={(e) => {
                      e.preventDefault();
                      inputRef.current?.click();
                    }}
                  >
                    Browse files
                  </Button>
                </div>
              </div>
            </div>
          </label>
        </div>

        <div className="text-[13px] text-slate-500 mb-4">{supportText}</div>

        {uploadStates.length > 0 && (
          <div className="space-y-3 mb-6 max-h-[240px] overflow-y-auto pr-1">
            {uploadStates.map((f) => {
              const fileTypeExt = f.file.name.split(".").pop()?.toUpperCase() || "FILE";
              return (
                <div
                  key={f.id}
                  className="flex flex-col p-3 border rounded-[10px] bg-white border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#EF4444] rounded-[8px] flex flex-col items-center justify-center text-white font-bold text-[10px]">
                        {fileTypeExt}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[14px] font-medium text-slate-800 truncate">
                          {f.file.name}
                        </div>
                        <div className="text-[12px] text-slate-500">
                          {formatSize(f.file.size)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {f.status === "uploading" && (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {f.status === "completed" && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {f.status === "failed" && (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      {f.status === "idle" && !isUploading && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setUploadStates((s) => s.filter((item) => item.id !== f.id));
                          }}
                          className="text-slate-400 hover:text-red-500 p-1 flex-shrink-0"
                          type="button"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {f.status === "uploading" && (
                    <div className="w-full mt-3">
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${f.progress}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 text-right mt-1 font-medium">
                        {f.progress}%
                      </div>
                    </div>
                  )}

                  {f.status === "failed" && f.error && (
                    <div className="text-[11px] text-red-500 mt-1.5 font-medium truncate">
                      {f.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-2 sm:justify-end gap-3 flex-row justify-end flex">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="rounded-[8px] min-w-[100px] border-slate-200"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-[8px] min-w-[100px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2"
            disabled={isUploading || uploadStates.length === 0}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpload();
            }}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </div>
    </Modal>

  );
}
