import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload
} from "lucide-react";
import { customersData } from "@/data/productionMockData";
import ProjectQuickActions from "./ProjectQuickActions";
import ProjectDetailsCard from "./ProjectDetailsCard";
import ProjectLifecycle from "./ProjectLifecycle";
import ProjectStatsAndActivity from "./ProjectStatsAndActivity";
import ProjectPhotos from "./ProjectPhotos";
import CustomerInvoicesTable from "./CustomerInvoicesTable";
import { UploadModal, SuccessModal } from "./ProjectUploadModals";
import { useState } from "react";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();
  
  // Modal states
  const [isBOMUploadOpen, setIsBOMUploadOpen] = useState(false);
  const [isBOMSuccessOpen, setIsBOMSuccessOpen] = useState(false);
  const [isDrawingUploadOpen, setIsDrawingUploadOpen] = useState(false);
  const [isDrawingSuccessOpen, setIsDrawingSuccessOpen] = useState(false);
  const customer = customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project = customer?.projects.find(p => p.id === projectId) || customer?.projects[0];

  if (!customer || !project) {
    return <div className="p-10 text-center text-gray-500">Project not found</div>;
  }

  return (
    <PageWrapper>
      {/* Header Section */}
      <div className="flex flex-wrap md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
          <h1 className="text-xl md:text-2xl font-inter font-bold text-[#212B36]">
            Project Details- <span className="text-[#637381] font-medium">{project.name}</span>
          </h1>

        </div>
        
        <div className="flex flex-wrap items-center gap-3 ml-auto">
          <Button
            variant="white"
            size="sm"
            onClick={() => setIsBOMUploadOpen(true)}
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
      <ProjectQuickActions />

      {/* Detailed Project Card */}
      <ProjectDetailsCard 
        project={project}
        customerName={customer.name}
        customerPhone={customer.phone}
        customerEmail={customer.email}
        customerAddress={customer.address}
      />

      {/* Project Lifecycle Section */}
      <ProjectLifecycle />

      {/* Invoices List Section */}
      <CustomerInvoicesTable invoices={customer.invoices || []} />
      {/* Stats and Activity Section */}
      <ProjectStatsAndActivity 
        currentStep="Production Planning"
        stepNumber={7}
        totalSteps={14}
        startedDate={project.createdOn || "2024-10-10"}
        estimateCompletion={project.createdOn || "2024-10-10"}
        activities={customer.recentActivity || []}
        notes={customer.notes || []}
      />

      {/* Project Photos Section */}
      <ProjectPhotos />


      {/* Modals */}
      <UploadModal 
        isOpen={isBOMUploadOpen}
        onClose={() => setIsBOMUploadOpen(false)}
        title="Upload BOM File"
        subtitle="Add your documents here, and you can upload up to 5 files max"
        fileLabel={`BOM-${project.name}`}
        onUpload={() => {
          setIsBOMUploadOpen(false);
          setIsBOMSuccessOpen(true);
        }}
      />
      <SuccessModal 
        isOpen={isBOMSuccessOpen}
        onClose={() => setIsBOMSuccessOpen(false)}
        onButtonClick={() => {
          setIsBOMSuccessOpen(false);
          navigate(`/projects/view-bom/${customerId}/${projectId}`);
        }}
        title="BOM File Uploaded"
        buttonLabel="View BOM File"
      />


      <UploadModal 
        isOpen={isDrawingUploadOpen}
        onClose={() => setIsDrawingUploadOpen(false)}
        title="Upload Building Drawings & Photos"
        subtitle="Add your documents here, and you can upload up to 5 files max"
        fileLabel={`Building ${project.name} Drawing`}
        onUpload={() => {
          setIsDrawingUploadOpen(false);
          setIsDrawingSuccessOpen(true);
        }}
      />
      <SuccessModal 
        isOpen={isDrawingSuccessOpen}
        onClose={() => setIsDrawingSuccessOpen(false)}
        title="Drawing Uploaded & Sent to Customer"
        buttonLabel="Ok"
      />
    </PageWrapper>
  );
};

export default ProjectDetailsView;
