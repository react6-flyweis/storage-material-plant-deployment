import React from "react";
import Modal from "../Modal";
import pdfIcon from "@/assets/icon/pdfIcon.svg";
import xlsxIcon from "@/assets/icon/dashboard/xlxs.svg";
import { X } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";
import {
  useGetProjectBuildingsQuery,
  useUploadProjectBomsMutation,
  useGetBomJobsStatusBatchMutation,
  type ProjectBuilding,
} from "@/redux/api/projectApi";
import { UploadModal, SuccessModal } from "./ProjectUploadModals";

interface UploadBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onUpload?: (file: File, buildingId: string, url: string) => void;
}

const mapBOMStatusBadge = (status: string | null) => {
  if (!status) return { text: "No BOM File", classes: "bg-gray-50 text-gray-500 border border-gray-100" };
  const lower = status.toLowerCase();
  if (lower === "queued") {
    return { text: "Queued", classes: "bg-amber-50 text-amber-600 border border-amber-100" };
  }
  if (lower === "processing") {
    return { text: "Processing", classes: "bg-blue-50 text-blue-600 border border-blue-100" };
  }
  if (lower.includes("approved") || lower.includes("confirmed")) {
    return { text: "Approved", classes: "bg-emerald-50 text-emerald-600 border border-emerald-100" };
  }
  if (lower.includes("locked")) {
    return { text: "Locked", classes: "bg-gray-100 text-gray-600 border border-gray-200" };
  }
  if (lower.includes("reject") || lower.includes("fail") || lower.includes("issue")) {
    return { text: "Issues Detected", classes: "bg-red-50 text-red-600 border border-red-100" };
  }
  if (lower.includes("pending") || lower.includes("review") || lower.includes("draft")) {
    return { text: "Draft", classes: "bg-[#FEFAE2] text-[#E0B000] border border-[#FEFAE2]" };
  }
  return { text: status.replace("_", " "), classes: "bg-blue-50 text-blue-600 border border-blue-100" };
};

const UploadBOMModal: React.FC<UploadBOMModalProps> = ({
  isOpen,
  onClose,
  leadId,
  onUpload,
}) => {
  const [uploadingBuilding, setUploadingBuilding] = React.useState<ProjectBuilding | null>(null);
  const [uploadProjectBoms] = useUploadProjectBomsMutation();
  const [getBomJobsStatusBatch] = useGetBomJobsStatusBatchMutation();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [uploadedJobIds, setUploadedJobIds] = React.useState<string[]>([]);

  const { data: buildingsData, isLoading, refetch } = useGetProjectBuildingsQuery(leadId || "", {
    skip: !leadId || !isOpen,
  });

  const buildings = React.useMemo(() => buildingsData?.buildings || [], [buildingsData]);

  React.useEffect(() => {
    if (isOpen && leadId) {
      refetch();
    }
  }, [isOpen, leadId, refetch]);

  // Derive job IDs that need polling from current buildings list
  const activeJobIds = React.useMemo(() => {
    const ids: string[] = [];
    buildings.forEach((b) => {
      if (b.latestBomJob) {
        const status = b.latestBomJob.status?.toLowerCase();
        if (status === "queued" || status === "processing") {
          ids.push(b.latestBomJob.bomJobId);
        }
      }
    });
    return ids;
  }, [buildings]);

  // The total set of job IDs we are currently interested in polling
  const allPollingJobIds = React.useMemo(() => {
    return Array.from(new Set([...activeJobIds, ...uploadedJobIds]));
  }, [activeJobIds, uploadedJobIds]);

  // Batch poll the active jobs every 2 seconds
  React.useEffect(() => {
    if (allPollingJobIds.length === 0) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await getBomJobsStatusBatch({ jobIds: allPollingJobIds }).unwrap();
        const jobs = response.jobs || [];

        const finishedJobIds: string[] = [];
        jobs.forEach((job) => {
          const status = job.status?.toLowerCase();
          if (status !== "queued" && status !== "processing") {
            finishedJobIds.push(job.jobId);
          }
        });

        if (finishedJobIds.length > 0) {
          refetch();
          setUploadedJobIds((prev) => prev.filter((id) => !finishedJobIds.includes(id)));
        }
      } catch (err) {
        console.error("Error polling job statuses:", err);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [allPollingJobIds, getBomJobsStatusBatch, refetch]);

  const handleUploadSuccess = async (file: File, fileUrl: string) => {
    if (uploadingBuilding) {
      try {
        const fileFormat = file.name.split(".").pop() || "xlsx";
        const result = await uploadProjectBoms({
          leadId,
          bomFiles: [
            {
              buildingId: uploadingBuilding.buildingId,
              fileUrl,
              fileName: file.name,
              fileFormat,
            },
          ],
        }).unwrap();

        const newJobIds = (result.jobs || []).map((j) => j.bomJobId);
        if (newJobIds.length > 0) {
          setUploadedJobIds((prev) => Array.from(new Set([...prev, ...newJobIds])));
        }

        onUpload?.(file, uploadingBuilding.buildingId, fileUrl);
        setIsSuccessOpen(true);
      } catch (err) {
        console.error("Failed to register BOM in backend:", err);
      } finally {
        setUploadingBuilding(null);
      }
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return xlsxIcon;
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) return pdfIcon;
    return xlsxIcon;
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} width="max-w-2xl" hideHeader>
        <div className="p-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SubHeading text="Building BOM Files" />
              <p className="text-sm text-[#637381] font-inter">
                View BOM status per building or upload/replace files.
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
                  const badge = mapBOMStatusBadge(b.bomJobStatus || b.latestBomJob?.status || null);
                  const isLocked = b.bomJobStatus?.toLowerCase().includes("locked");
                  return (
                    <div key={b.buildingId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-inter font-bold text-sm text-[#212B36]">
                            Building {b.buildingNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${badge.classes}`}>
                            {badge.text}
                          </span>
                        </div>
                        {b.latestBomJob ? (
                          <div className="flex items-center gap-2 text-xs text-[#637381] font-inter truncate">
                            <img src={getFileIcon(b.latestBomJob.fileName)} alt="icon" className="size-4 shrink-0" />
                            <span className="truncate max-w-[200px] sm:max-w-xs font-medium text-[#212B36]" title={b.latestBomJob.fileName}>
                              {b.latestBomJob.fileName}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span>Items: {b.latestBomJob.totalItems || 0}</span>
                            <span className="text-gray-300">|</span>
                            <span>
                              {new Date(b.latestBomJob.uploadedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 font-inter">No files uploaded yet</p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center">
                        <Button
                          variant={b.hasBomJob ? "secondary" : "primary"}
                          size="sm"
                          className="w-full sm:w-auto font-inter text-xs"
                          onClick={() => setUploadingBuilding(b)}
                          disabled={isLocked}
                        >
                          {b.hasBomJob ? "Replace file" : "Upload file"}
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
          title={`Upload BOM: Building ${uploadingBuilding.buildingNumber}`}
          subtitle="Select or drop a BOM file (.xlsx, .xls, .pdf) for this building."
          fileLabel={`Building-${uploadingBuilding.buildingNumber}-bom`}
          folder="boms"
          onUpload={handleUploadSuccess}
        />
      )}

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          onClose();
        }}
        title="BOM File Uploaded Successfully"
        buttonLabel="Ok"
      />
    </>
  );
};

export { UploadBOMModal };
