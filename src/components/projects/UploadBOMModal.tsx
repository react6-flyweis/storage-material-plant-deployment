import React from "react";
import { useNavigate } from "react-router-dom";
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
  useGenerateConsolidatedBOMMutation,
  type ProjectBuilding,
} from "@/redux/api/projectApi";
import { UploadModal, SuccessModal } from "./ProjectUploadModals";

interface UploadBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  onUpload?: (file: File, buildingId: string, url: string) => void;
}

// style record for bom status


const UploadBOMModal: React.FC<UploadBOMModalProps> = ({
  isOpen,
  onClose,
  leadId,
  onUpload,
}) => {
  const navigate = useNavigate();
  const [uploadingBuilding, setUploadingBuilding] = React.useState<ProjectBuilding | null>(null);
  const [uploadProjectBoms] = useUploadProjectBomsMutation();
  const [getBomJobsStatusBatch] = useGetBomJobsStatusBatchMutation();
  const [generateConsolidatedBOM, { isLoading: isGenerating }] = useGenerateConsolidatedBOMMutation();
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [uploadedJobIds, setUploadedJobIds] = React.useState<string[]>([]);
  const [uploadBomError, setUploadBomError] = React.useState<string | null>(null);

  const { data: buildingsData, isLoading, refetch } = useGetProjectBuildingsQuery(leadId || "", {
    skip: !leadId || !isOpen,
  });

  const buildings = React.useMemo(() => buildingsData?.buildings || [], [buildingsData]);

  const canConsolidate = React.useMemo(() => {
    if (buildings.length === 0) return false;
    return buildings.every((b) => {
      const isUploaded = !!b.hasBomJob;
      const isSuccess =
        b.bomJobStatus?.toLowerCase() === "completed";
      return isUploaded && isSuccess;
    });
  }, [buildings]);

  const handleConsolidate = async () => {
    try {
      setUploadBomError(null);
      await generateConsolidatedBOM(leadId).unwrap();
      onClose();
      navigate(`/projects/${leadId}/view-bom`);
    } catch (err: unknown) {
      console.error("Failed to generate consolidated BOM:", err);
      const errorObj = err as { data?: { message?: string }; message?: string };
      const errMsg =
        errorObj?.data?.message || errorObj?.message || "Failed to generate consolidated BOM.";
      setUploadBomError(errMsg);
    }
  };

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
        setUploadBomError(null);
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
      } catch (err: unknown) {
        console.error("Failed to register BOM in backend:", err);
        const errorObj = err as { data?: { message?: string }; message?: string };
        const errMsg = errorObj?.data?.message || errorObj?.message || "Failed to register BOM file in backend.";
        setUploadBomError(errMsg);
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

          {/* Error message banner */}
          {uploadBomError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center justify-between font-inter">
              <span>{uploadBomError}</span>
              <button onClick={() => setUploadBomError(null)} className="text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </div>
          )}

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
                  // TODO: Add style for all stasuses
                  const badgeStyle = "bg-gray-100"
                  const isLocked = b.bomJobStatus?.toLowerCase().includes("locked");
                  return (
                    <div key={b.buildingId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-inter font-bold text-sm text-[#212B36]">
                            Building {b.buildingNumber}
                          </span>
                          <span className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${badgeStyle}`}>
                            {b.bomJobStatus}
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
                        {b.latestBomJob?.errorMessage && (
                          <p className="text-[11px] text-red-500 font-inter bg-red-50/50 p-1.5 rounded border border-red-100/50 mt-1">
                            Error: {b.latestBomJob.errorMessage}
                          </p>
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

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!canConsolidate || isGenerating}
                onClick={handleConsolidate}
              >
                {isGenerating ? "Consolidating..." : "Consolidate"}
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
          subtitle="Select or drop a BOM file (.xlsx, .xls, .ods) for this building."
          fileLabel={`Building-${uploadingBuilding.buildingNumber}-bom`}
          folder="boms"
          onUpload={handleUploadSuccess}
          allowedExtensions={["ods", "xls", "xlsx"]}
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
