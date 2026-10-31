import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import {
  FileText,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileCheck2,
  PackageCheck,
  ClipboardList,
  FileSpreadsheet,
} from "lucide-react";
import {
  useGetDeliveryDocumentsQuery,
  downloadDeliveryPdf,
  type DeliveryDocumentItem,
} from "@/redux/api/deliveriesApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface DeliveryDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  deliveryNumber?: string;
}

const DeliveryDocumentsModal: React.FC<DeliveryDocumentsModalProps> = ({
  isOpen,
  onClose,
  deliveryId,
  deliveryNumber,
}) => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useGetDeliveryDocumentsQuery(deliveryId, {
    skip: !isOpen || !deliveryId,
  });

  if (!isOpen) return null;

  const documents = data?.data?.documents || [];

  const handleDownloadPdf = async (doc: DeliveryDocumentItem) => {
    try {
      setDownloadingUrl(doc.url);
      setErrorMsg(null);
      await downloadDeliveryPdf({
        relativeUrl: doc.url,
        fallbackFilename: `${doc.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        token,
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setErrorMsg(errorObj?.message || "Failed to download PDF. Please try again.");
    } finally {
      setDownloadingUrl(null);
    }
  };

  const handleOpenFile = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getDocIcon = (name: string, type: "pdf" | "file") => {
    const lower = name.toLowerCase();
    if (lower.includes("packing")) {
      return <PackageCheck size={20} className="text-purple-600" />;
    }
    if (lower.includes("instruction")) {
      return <ClipboardList size={20} className="text-amber-600" />;
    }
    if (lower.includes("sheet") || lower.includes("bom")) {
      return <FileSpreadsheet size={20} className="text-emerald-600" />;
    }
    if (type === "pdf") {
      return <FileText size={20} className="text-red-500" />;
    }
    return <FileCheck2 size={20} className="text-blue-500" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delivery Documents" width="max-w-xl">
      <div className="space-y-4">
        {/* Subtitle / Delivery Reference */}
        <div className="flex items-center justify-between text-xs text-[#6A7282] pb-1.5 border-b border-gray-100">
          <span>Available documents for shipment</span>
          <span className="font-semibold text-[#101828]">Ref: {deliveryNumber || deliveryId}</span>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-xs font-semibold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content list */}
        {isLoading ? (
          <div className="space-y-3 py-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-10 text-center space-y-3">
            <AlertCircle size={32} className="text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-gray-800">Failed to load documents</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't retrieve the document list. Check your network or permissions and try again.
            </p>
            <Button variant="white" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        ) : documents.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <FileText size={32} className="text-gray-300 mx-auto" />
            <p className="text-sm font-medium text-gray-700">No documents found</p>
            <p className="text-xs text-gray-400">
              There are no documents or PDF exports currently attached to this delivery.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {documents.map((doc, idx) => {
              const isDownloadingThis = downloadingUrl === doc.url;
              const isPdf = doc.type === "pdf";

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white flex items-center justify-between gap-3 transition-all shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {getDocIcon(doc.name, doc.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#101828] truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                            isPdf
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}
                        >
                          {isPdf ? "PDF" : "ATTACHMENT"}
                        </span>
                        <span className="text-[11px] text-[#6A7282]">
                          {isPdf ? "Official Export" : "Uploaded File"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isPdf ? (
                      <Button
                        variant="white"
                        size="sm"
                        disabled={isDownloadingThis || !!downloadingUrl}
                        onClick={() => handleDownloadPdf(doc)}
                        className="text-xs font-semibold flex items-center gap-1.5"
                      >
                        {isDownloadingThis ? (
                          <>
                            <Loader2 size={14} className="animate-spin text-[#1E51A4]" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download size={14} className="text-[#454F5B]" />
                            <span>Download</span>
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="white"
                        size="sm"
                        onClick={() => handleOpenFile(doc.url)}
                        className="text-xs font-semibold flex items-center gap-1.5"
                      >
                        <ExternalLink size={14} className="text-[#454F5B]" />
                        <span>Open</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <Button variant="white" onClick={onClose} size="md">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryDocumentsModal;
