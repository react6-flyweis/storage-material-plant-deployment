import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import ProjectQuickActions from "./ProjectQuickActions";
import ProjectDetailsCard from "./ProjectDetailsCard";
import ProjectLifecycle from "./ProjectLifecycle";
import ProjectStatsAndActivity from "./ProjectStatsAndActivity";
import ProjectPhotos from "./ProjectPhotos";

import { useState } from "react";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import {
  useGetPlantProjectDetailQuery,
  type PhoneNumber,
} from "@/redux/api/projectApi";
import {
  PLANT_LIFECYCLE_STAGES,
  getPlantLifecycleStatusConfig,
} from "@/constants/plantLifecycle";
import { UploadDrawingModal } from "./UploadDrawingModal";
import { UploadBOMModal } from "./UploadBOMModal";
import ProjectInvoicesTable from "./ProjectInvoices";
import { getLeadProjectName } from "@/lib/utils";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: projectDetail,
    isLoading,
    error,
  } = useGetPlantProjectDetailQuery(projectId || "");

  // Modal states
  const isBOMUploadOpen = searchParams.get("modal") === "upload-bom";
  const [isDrawingUploadOpen, setIsDrawingUploadOpen] = useState(false);

  const handleBOMOpen = () => {
    setSearchParams({ modal: "upload-bom" }, { replace: true });
  };

  const handleBOMClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("modal");
    setSearchParams(newParams, { replace: true });
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
          <p className="text-gray-500 font-inter font-medium text-sm">
            Loading project details...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (error || !projectDetail) {
    return (
      <PageWrapper>
        <div className="p-10 text-center text-red-500 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter">
            Error loading project details
          </p>
          <p className="text-sm text-gray-500 font-inter">
            {error && "status" in error
              ? `Status: ${error.status}`
              : "Project not found or access denied"}
          </p>
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0 font-inter font-bold"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const {
    lead,
    client,
    lifecycleStatus,
    lifecycleHistory,
    activityLog,
    leadNotes,
    assignedSales,
  } = projectDetail;

  const customerName = `${client.firstName} ${client.lastName}`;
  const formattedCreatedDate = lead.createdAt
    ? new Date(lead.createdAt).toLocaleDateString()
    : "N/A";

  const formatPhone = (phone: PhoneNumber): string => {
    if (!phone) return "N/A";
    if (typeof phone === "string") return phone;
    if (typeof phone === "object") {
      const code = phone.countryCode || "";
      const num = phone.number || "";
      return code ? `${code} ${num}` : num;
    }
    return "N/A";
  };
  const customerPhone = formatPhone(client.phone);

  const activeStageConfig = getPlantLifecycleStatusConfig(lifecycleStatus);
  const activeIndex = PLANT_LIFECYCLE_STAGES.indexOf(activeStageConfig.value);
  const currentStepNumber = activeIndex !== -1 ? activeIndex + 1 : 1;
  const currentStepLabel = activeStageConfig.label;

  const mappedActivities = (activityLog || [])
    .map((act) => ({
      building: "",
      action: act.displayMessage,
      date: act.createdAt
        ? new Date(act.createdAt).toLocaleDateString()
        : "N/A",
    }))
    .slice(0, 4);

  const mappedNotes = (leadNotes || []).map((n) => n.note || n.content || "");

  return (
    <PageWrapper>
      {/* Header Section */}
      <div className="flex flex-wrap md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0 font-inter font-bold"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <h1 className="text-xl md:text-2xl font-inter font-bold text-[#212B36]">
            Project Details-{" "}
            <span className="text-[#637381] font-medium">
              {getLeadProjectName(lead, client)}
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <Button
            variant="white"
            size="sm"
            onClick={handleBOMOpen}
            className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2.5 bg-white border border-[#1E51A4] text-[#212B36] rounded-lg hover:bg-gray-50 transition-colors font-inter font-bold text-xs md:text-sm shadow-sm"
          >
            <Upload size={18} className="text-[#1E51A4]" />
            Upload BOM File
          </Button>
          <Button
            variant="white"
            size="sm"
            onClick={() => setIsDrawingUploadOpen(true)}
            className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2.5 bg-white border border-[#1E51A4] text-[#212B36] rounded-lg hover:bg-gray-50 transition-colors font-inter font-bold text-xs md:text-sm shadow-sm"
          >
            <Upload size={18} className="text-[#1E51A4]" />
            Upload Drawing File
          </Button>
        </div>
      </div>

      {/* Quick Actions Row */}
      <ProjectQuickActions projectId={projectId} />

      {/* Detailed Project Card */}
      <ProjectDetailsCard
        project={projectDetail}
        customerName={customerName}
        customerPhone={customerPhone}
        customerEmail={client.email}
        customerAddress={client.address}
      />

      {/* Project Lifecycle Section */}
      <ProjectLifecycle
        projectId={projectId || ""}
        currentStatus={lifecycleStatus}
        lifecycleHistory={lifecycleHistory}
        startedDate={formattedCreatedDate}
        estimateCompletion={""}
        assignedPlanner={assignedSales?.name || "-"}
        priority={lead?.leadScoring?.temperature}
      />

      {/* Invoices List Section */}
      <ProjectInvoicesTable projectId={projectId} />

      {/* Stats and Activity Section */}
      <ProjectStatsAndActivity
        currentStep={currentStepLabel}
        stepNumber={currentStepNumber}
        totalSteps={PLANT_LIFECYCLE_STAGES.length}
        startedDate={formattedCreatedDate}
        estimateCompletion={""}
        activities={mappedActivities}
        notes={mappedNotes}
      />

      {/* Project Photos Section */}
      <ProjectPhotos />

      {/* Modals */}
      <UploadBOMModal
        isOpen={isBOMUploadOpen}
        onClose={handleBOMClose}
        leadId={projectId || ""}
      />

      <UploadDrawingModal
        isOpen={isDrawingUploadOpen}
        onClose={() => setIsDrawingUploadOpen(false)}
        leadId={projectId || ""}
      />
    </PageWrapper>
  );
};

export default ProjectDetailsView;
