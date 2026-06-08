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

interface BuildingRowProps {
  building: ProjectBuilding;
  isLocked: boolean;
  onUploadClick: (b: ProjectBuilding) => void;
  onNavigateToBOM: (jobId: string) => void;
  getFileIcon: (fileName?: string) => any;
}

const BuildingRow: React.FC<BuildingRowProps> = ({
  building: b,
  isLocked,
  onUploadClick,
  onNavigateToBOM,
  getFileIcon,
}) => {
  const isCompleted = b.bomJobStatus?.toLowerCase() === "completed";
  const isConfirmed = b.latestBomJob?.isConfirmed === true;
  const isUnconfirmed = b.latestBomJob?.isConfirmed === false;
  const hasUnmatched = (b.latestBomJob?.unmatchedItems ?? 0) > 0;
  const showDangerHighlight = isCompleted && isUnconfirmed && hasUnmatched;

  let badgeStyle = "bg-gray-100 text-gray-800";
  let displayStatus = b.bomJobStatus;

  if (isCompleted) {
    if (isConfirmed) {
      badgeStyle = "bg-blue-50 text-blue-700 border border-blue-200";
      displayStatus = "BOM Confirmed";
    } else if (hasUnmatched) {
      badgeStyle = "bg-red-50 text-red-700 border border-red-200";
      displayStatus = "Missing Items";
    } else {
      badgeStyle = "bg-green-50 text-green-700 border border-green-200";
      displayStatus = "BOM Extracted";
    }
  } else if (b.bomJobStatus?.toLowerCase() === "failed") {
    badgeStyle = "bg-red-50 text-red-700 border border-red-200";
  }

  const containerBg = showDangerHighlight
    ? "bg-red-50 hover:bg-red-100/70 border-l-4 border-l-red-500"
    : "bg-white hover:bg-gray-50";

  const renderButtons = () => {
    const latestJob = b.latestBomJob;
    const isCompletedJob = latestJob?.status?.toLowerCase() === "completed";
    const isConfirmedJob = latestJob?.isConfirmed === true;
    const isUnconfirmedJob = latestJob?.isConfirmed === false;

    const replaceBtn = (
      <button
        className={`font-inter text-xs font-medium px-3 py-1.5 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          b.hasBomJob
            ? "bg-white border border-[#446DF6] text-[#446DF6] hover:bg-[#446DF6]/5"
            : "bg-[#1E51A4] text-white hover:bg-[#1E51A4]/90"
        }`}
        onClick={() => onUploadClick(b)}
        disabled={isLocked}
      >
        {b.hasBomJob ? "Replace file" : "Upload file"}
      </button>
    );

    if (isCompletedJob && latestJob) {
      if (isConfirmedJob) {
        return (
          <>
            {replaceBtn}
            <button
              className="font-inter text-xs font-medium px-3 py-1.5 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => onNavigateToBOM(latestJob.bomJobId)}
              disabled={isLocked}
            >
              View
            </button>
          </>
        );
      }

      if (isUnconfirmedJob) {
        const jobHasUnmatched = (latestJob.unmatchedItems ?? 0) > 0;
        const buttonText = jobHasUnmatched
          ? "View and Add Missing Items"
          : "View and Confirm";
        return (
          <>
            {replaceBtn}
            <button
              className={`font-inter text-xs font-medium px-3 py-1.5 rounded-md transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                jobHasUnmatched
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-[#1E51A4] hover:bg-[#1E51A4]/90 text-white"
              }`}
              onClick={() => onNavigateToBOM(latestJob.bomJobId)}
              disabled={isLocked}
            >
              {buttonText}
            </button>
          </>
        );
      }
    }

    return replaceBtn;
  };

  return (
    <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${containerBg}`}>
      <div className="space-y-1.5 flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-inter font-bold text-sm text-[#212B36]">
            Building {b.buildingNumber}
          </span>
          <span className={`capitalize px-2 py-0.5 rounded-full text-[10px] font-medium font-inter ${badgeStyle}`}>
            {displayStatus}
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
      <div className="shrink-0 flex items-center gap-2">
        {renderButtons()}
      </div>
    </div>
  );
};

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
      return b.latestBomJob?.isConfirmed === true;
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
              <div className="border border-gray-100 rounded overflow-hidden divide-y divide-gray-100 bg-[#F8FAFC]">
                {buildings.map((b) => (
                  <BuildingRow
                    key={b.buildingId}
                    building={b}
                    isLocked={!!b.bomJobStatus?.toLowerCase().includes("locked")}
                    onUploadClick={(building) => setUploadingBuilding(building)}
                    onNavigateToBOM={(jobId) => {
                      onClose();
                      navigate(`/costing/bom-details/${jobId}`);
                    }}
                    getFileIcon={getFileIcon}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="disabled:cursor-not-allowed"
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
        }}
        title="BOM File Uploaded Successfully"
        buttonLabel="Ok"
      />
    </>
  );
};

export { UploadBOMModal };
