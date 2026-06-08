import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Button from "../common_component/Button";
import { useGetPresignedUrlMutation } from "@/redux/api/uploadApi";

type Doc = { name: string; url: string; size?: number };

interface UploadingFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  error?: string;
}

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "svg", "zip", "pdf"];

const formatSize = (size?: number) => {
  if (!size && size !== 0) return "";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
};

const fileTypeLabel = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "PDF";
  if (["jpg", "jpeg", "png", "svg"].includes(ext)) return ext.toUpperCase();
  return ext.toUpperCase() || "FILE";
};

export default function DocumentUploadCard({
  documents,
  onDocumentsChange,
}: {
  documents: Doc[];
  onDocumentsChange: (docs: Doc[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileRefs = useRef<Map<string, File>>(new Map());
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const uploadSingleFile = async (file: File, tempId: string) => {
    try {
      // Step 1: Get presigned URL
      const response = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        folder: "logistics",
      }).unwrap();

      const { uploadUrl, fileUrl } = response;

      // Step 2: Upload file to S3 via PUT
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream",
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100,
            );
            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === tempId ? { ...f, progress: percentComplete } : f,
              ),
            );
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed (${xhr.status})`));
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network error during upload"));
        };

        xhr.send(file);
      });

      // Remove from uploading files list
      setUploadingFiles((prev) => prev.filter((f) => f.id !== tempId));
      fileRefs.current.delete(tempId);

      // Add to documents list
      const newDoc = { name: file.name, url: fileUrl, size: file.size };
      onDocumentsChange([...(documents || []), newDoc]);
    } catch (err: unknown) {
      console.error("Upload error for file", file.name, err);
      const errMsg = err instanceof Error ? err.message : "Upload failed";
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === tempId ? { ...f, error: errMsg, progress: 0 } : f,
        ),
      );
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        alert(
          `Invalid file type: ${file.name}. Only ${ALLOWED_EXTENSIONS.join(", ")} are supported.`,
        );
        return;
      }

      const tempId = `${file.name}-${Date.now()}-${Math.random()}`;
      fileRefs.current.set(tempId, file);

      setUploadingFiles((prev) => [
        ...prev,
        { id: tempId, name: file.name, size: file.size, progress: 0 },
      ]);

      uploadSingleFile(file, tempId);
    });
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
    e.currentTarget.value = "";
  };

  const removeDocument = (index: number) => {
    const next = (documents || []).filter((_: Doc, i: number) => i !== index);
    onDocumentsChange(next);
  };

  const dismissUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
    fileRefs.current.delete(id);
  };

  const retryUpload = (upFile: UploadingFile) => {
    const file = fileRefs.current.get(upFile.id);
    if (!file) return;

    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.id === upFile.id ? { ...f, error: undefined, progress: 0 } : f,
      ),
    );
    uploadSingleFile(file, upFile.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
      <h2 className="font-semibold text-gray-800 mb-5 text-base">
        Upload Documents (Optional)
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 max-w-sm">
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              Upload Documents & Files
            </h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-1 text-ellipsis">
              Add your documents here, and they will be uploaded automatically to S3.
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-3 transition-colors ${
                dragActive
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-blue-400 bg-blue-50/30 hover:bg-blue-50"
              }`}
            >
              <div className="w-12 h-10 bg-blue-600 rounded flex items-center justify-center mb-3 relative">
                <Upload className="text-white w-4 h-4" />
                <div
                  className="absolute top-0 right-0 w-3 h-3 bg-blue-400 border-l border-b border-blue-500"
                  style={{ borderBottomLeftRadius: "2px" }}
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.svg,.zip,.pdf"
                onChange={handleFilesSelected}
                className="hidden"
              />

              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 py-1.5 px-4 text-xs font-medium rounded-full bg-white hover:bg-blue-50"
                type="button"
                onClick={handleBrowseClick}
              >
                Browse files
              </Button>
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              Only support .jpg, .png, .svg, .pdf and .zip files.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-start">
          {documents.length === 0 && uploadingFiles.length === 0 ? (
            <div className="text-sm text-gray-500">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="w-full max-w-xs space-y-3">
              {/* Existing Uploaded Documents */}
              {documents.map((doc, idx) => (
                <div
                  key={`${doc.name}-${idx}`}
                  className="border border-gray-200 rounded-xl p-3 flex items-center gap-4 w-full justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center text-red-600 font-bold text-xs relative overflow-hidden">
                      <div className="bg-red-500 text-white w-full h-full flex items-center justify-center">
                        {fileTypeLabel(doc.name)}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {doc.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatSize(doc.size)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Preview
                    </a>
                    <button
                      type="button"
                      onClick={() => removeDocument(idx)}
                      className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Uploading Documents */}
              {uploadingFiles.map((upFile) => (
                <div
                  key={upFile.id}
                  className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2 w-full bg-gray-50/50"
                >
                  <div className="flex items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 font-bold text-xs relative overflow-hidden">
                        <div className="bg-blue-500 text-white w-full h-full flex items-center justify-center">
                          {fileTypeLabel(upFile.name)}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {upFile.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatSize(upFile.size)}
                        </span>
                      </div>
                    </div>
                    {upFile.error ? (
                      <button
                        type="button"
                        onClick={() => dismissUploadingFile(upFile.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>

                  {upFile.error ? (
                    <div className="text-xs text-red-500 flex items-center justify-between">
                      <span className="truncate">{upFile.error}</span>
                      <button
                        type="button"
                        onClick={() => retryUpload(upFile)}
                        className="text-blue-600 hover:underline font-semibold ml-2 shrink-0"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Uploading to S3...</span>
                        <span>{upFile.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${upFile.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
