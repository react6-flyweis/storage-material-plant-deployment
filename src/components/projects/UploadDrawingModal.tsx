import React from "react";
import Modal from "../Modal";
import pdf from "@/assets/icon/pdfIcon.svg";
import { X } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";
import {
  useGetProjectBuildingsQuery,
  useUploadProjectDrawingsMutation,
  type ProjectBuilding,
} from "@/redux/api/projectApi";
import { UploadModal, SuccessModal } from "./ProjectUploadModals";

interface UploadDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onUpload?: (file: File, buildingId: string, url: string) => void;
}

const mapDrawingStatusBadge = (status: string | null) => {
  if (!status) return { text: "No Drawings", classes: "bg-gray-50 text-gray-500 border border-gray-100" };
  const lower = status.toLowerCase();
  if (lower.includes("approved")) {
    return { text: "Approved", classes: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
  }
  if (lower.includes("reject")) {
    return { text: "Rejected", classes: "bg-red-50 text-red-600 border border-red-100" };
  }
  if (lower.includes("pending") || lower.includes("review")) {
    return { text: "Pending Review", classes: "bg-[#FEFAE2] text-[#E0B000] border border-[#FEFAE2]" };
  }
  return { text: status.replace("_", " "), classes: "bg-blue-50 text-blue-600 border border-blue-100" };
};

const UploadDrawingModal: React.FC<UploadDrawingModalProps> = ({
  isOpen,
  onClose,
  leadId,
  onUpload,
}) => {
  const [uploadingBuilding, setUploadingBuilding] = React.useState<ProjectBuilding | null>(null);
  const [uploadProjectDrawings] = useUploadProjectDrawingsMutation();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  const { data: buildingsData, isLoading, refetch } = useGetProjectBuildingsQuery(leadId || "", {
    skip: !leadId || !isOpen,
  });


  const buildings = buildingsData?.buildings || [];

  // Refetch when modal is opened to show latest statuses
  React.useEffect(() => {
    if (isOpen && leadId) {
      refetch();
    }
  }, [isOpen, leadId, refetch]);

  const handleUploadSuccess = async (file: File, fileUrl: string) => {
    if (uploadingBuilding) {
      try {
        await uploadProjectDrawings({
          leadId,
          drawings: [
            {
              buildingId: uploadingBuilding.buildingId,
              fileUrl,
              fileName: file.name,
            },
          ],
        }).unwrap();

        onUpload?.(file, uploadingBuilding.buildingId, fileUrl);
        setIsSuccessOpen(true);
      } catch (err) {
        console.error("Failed to register drawing in backend:", err);
      } finally {
        setUploadingBuilding(null);
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} width="max-w-2xl" hideHeader>
        <div className="p-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SubHeading text="Building Drawings" />
              <p className="text-sm text-[#637381] font-inter">
                View drawings status per building or upload/replace files.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors text-[#919EAB]"
            >
              <X size={20} />
            </button>
          </div>

          {/* List of Buildings */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1E51A4]"></div>
                <p className="text-sm text-gray-500 font-inter">Loading buildings...</p>
              </div>
            ) : buildings.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-inter text-sm">
                No buildings found for this project.
              </div>
            ) : (
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-[#F8FAFC]">
                {buildings.map((b) => {
                  const badge = mapDrawingStatusBadge(b.latestDrawingStatus || b.status);
                  const statusStr = (b.latestDrawingStatus || b.status || "").toLowerCase();
                  const isApproved = statusStr.includes("approved") || statusStr.includes("accept");

                  return (
                    <div key={b.buildingId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-inter font-bold text-sm text-[#212B36]">
                            Building {b.buildingNumber}
                          </span>
                          {b.hasDrawing && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${badge.classes}`}>
                              {badge.text}
                            </span>
                          )}
                        </div>
                        {b.latestDrawing ? (
                          <div className="flex items-center gap-2.5 text-xs text-[#637381] font-inter truncate">
                            {(() => {
                              const ext = b.latestDrawing.fileName ? b.latestDrawing.fileName.split('.').pop()?.toLowerCase() : "";
                              const isImage = ["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext || "");
                              return isImage ? (
                                <div className="size-8 rounded-md overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                                  <img
                                    src={b.latestDrawing.fileUrl}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <img src={pdf} alt="pdf" className="size-4 shrink-0" />
                              );
                            })()}
                            <span className="truncate max-w-[200px] sm:max-w-xs font-medium text-[#212B36]" title={b.latestDrawing.fileName}>
                              {b.latestDrawing.fileName}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span>v{b.latestDrawing.versionNumber}</span>
                            <span className="text-gray-300">|</span>
                            <span>
                              {new Date(b.latestDrawing.uploadedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 font-inter">No files uploaded yet</p>
                        )}
                        {b.latestDrawing?.rejectionReason && (
                          <p className="text-[11px] text-red-500 font-inter bg-red-50/50 p-1.5 rounded border border-red-100/50">
                            Reason: {b.latestDrawing.rejectionReason}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center">
                        <Button
                          variant={b.hasDrawing ? "secondary" : "primary"}
                          size="sm"
                          disabled={isApproved}
                          className="w-full sm:w-auto font-inter text-xs"
                          onClick={() => setUploadingBuilding(b)}
                        >
                          {b.hasDrawing ? "Add another" : "Upload file"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {uploadingBuilding && (
        <UploadModal
          isOpen={!!uploadingBuilding}
          onClose={() => setUploadingBuilding(null)}
          title={`Upload Drawing: Building ${uploadingBuilding.buildingNumber}`}
          subtitle="Select or drop a drawing/photo file for this building."
          fileLabel={`Building-${uploadingBuilding.buildingNumber}-drawing`}
          folder="drawings"
          onUpload={handleUploadSuccess}
        />
      )}

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          onClose();
        }}
        title="Drawing Uploaded & Sent to Customer"
        buttonLabel="Ok"
      />
    </>
  );
};

export { UploadDrawingModal };
