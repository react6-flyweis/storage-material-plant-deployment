import React, { useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Button from "../common_component/Button";

type Doc = { name: string; url: string; size?: number };

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
  const createdUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    const created = createdUrls.current;
    return () => {
      created.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
      created.clear();
    };
  }, []);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs = Array.from(files).map((f) => {
      const url = URL.createObjectURL(f);
      createdUrls.current.add(url);
      return { name: f.name, url, size: f.size };
    });

    onDocumentsChange([...(documents || []), ...newDocs]);

    // reset input so same file can be picked again if needed
    e.currentTarget.value = "";
  };

  const removeDocument = (index: number) => {
    const next = (documents || []).filter((_: Doc, i: number) => i !== index);
    const removed = (documents || [])[index];
    if (removed?.url && createdUrls.current.has(removed.url)) {
      try {
        URL.revokeObjectURL(removed.url);
      } catch {
        // ignore
      }
      createdUrls.current.delete(removed.url);
    }
    onDocumentsChange(next);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
      <h2 className="font-semibold text-gray-800 mb-5 text-base">
        Upload Documents
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 max-w-sm">
          <div className="border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              Upload Documents & Files
            </h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-1 text-ellipsis">
              Add your documents here, and you can upload later to S3 when
              integrated.
            </p>

            <div className="border border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center bg-blue-50/30 mb-3 cursor-pointer hover:bg-blue-50 transition-colors">
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
          {documents.length === 0 ? (
            <div className="text-sm text-gray-500">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="w-full max-w-xs">
              {(documents as Doc[]).map((doc, idx) => (
                <div
                  key={`${doc.name}-${idx}`}
                  className="border border-gray-200 rounded-xl p-3 flex items-center gap-4 w-full justify-between mb-3"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
