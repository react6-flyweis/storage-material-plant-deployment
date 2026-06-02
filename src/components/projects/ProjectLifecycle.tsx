import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { 
  UpdateStepStatusModal, 
  AddNotesModal,  
} from "./ProjectActionModals";
import SuccessModal from "../common_component/SuccessModal";
import Button from "../common_component/Button";
import { 
  PLANT_LIFECYCLE_STAGES, 
  getPlantLifecycleStatusConfig, 
  formatPlantLifecycleStatusLabel 
} from "@/constants/plantLifecycle";
import { useUpdateProjectLifecycleMutation, useAddProjectNoteMutation } from "@/redux/api/projectApi";

export interface LifecycleHistoryEntry {
  stage: string;
  changedAt: string;
}

interface ProjectLifecycleProps {
  projectId: string;
  currentStatus: string;
  lifecycleHistory?: LifecycleHistoryEntry[];
  startedDate?: string;
  estimateCompletion?: string;
  assignedPlanner?: string;
  priority?: string;
}

const ProjectLifecycle: React.FC<ProjectLifecycleProps> = ({ 
  projectId,
  currentStatus, 
  lifecycleHistory = [],
  startedDate,
  estimateCompletion,
  assignedPlanner,
  priority
}) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [updateLifecycle, { isLoading: isUpdating }] = useUpdateProjectLifecycleMutation();
  const [addNote, { isLoading: isAddingNote }] = useAddProjectNoteMutation();

  const handleUpdateStatus = async (newStatus: string, note?: string) => {
    try {
      await updateLifecycle({
        leadId: projectId,
        lifecycleStatus: newStatus,
        note: note,
      }).unwrap();
      setIsUpdateModalOpen(false);
      setIsSuccessModalOpen(true);
      setSuccessMsg("Status Updated Successfully");
    } catch (err) {
      console.error("Failed to update lifecycle stage:", err);
    }
  };

  const handleAddNote = async (note: string) => {
    try {
      await addNote({
        leadId: projectId,
        note,
      }).unwrap();
      setIsNotesModalOpen(false);
      setIsSuccessModalOpen(true);
      setSuccessMsg("Note Added Successfully");
    } catch (err) {
      console.error("Failed to add project note:", err);
    }
  };

  const activeStageConfig = getPlantLifecycleStatusConfig(currentStatus);
  const activeStage = activeStageConfig.value;
  const activeIndex = PLANT_LIFECYCLE_STAGES.indexOf(activeStage);

  const steps = PLANT_LIFECYCLE_STAGES.map((stage, index) => {
    const historyEntry = [...lifecycleHistory]
      .reverse()
      .find((h) => h.stage === stage);
      
    const dateStr = historyEntry?.changedAt 
      ? new Date(historyEntry.changedAt).toLocaleDateString(undefined, { year: '2-digit', month: '2-digit', day: '2-digit' }) 
      : "";

    return {
      id: index + 1,
      label: formatPlantLifecycleStatusLabel(stage),
      date: dateStr,
      completed: index < activeIndex || (stage === "delivered" && index === activeIndex),
      current: index === activeIndex && stage !== "delivered",
      upcoming: index > activeIndex,
      status: index === activeIndex ? "Current Step" : undefined,
    };
  });

  const nextStage = activeIndex !== -1 && activeIndex < PLANT_LIFECYCLE_STAGES.length - 1
    ? PLANT_LIFECYCLE_STAGES[activeIndex + 1]
    : null;

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-4 md:p-6 space-y-8">
      <h2 className="text-xl font-semibold text-[#212B36]">Project Lifecycle</h2>

      {/* Timeline */}
      <div className="relative overflow-x-auto pb-6 pt-4">
        <div className="min-w-[1200px] relative">
          {/* Connection Line */}
          <div className="absolute top-4 left-10 right-10 h-1 bg-gray-200" />
          <div 
            className="absolute top-4 left-10 h-1 bg-[#3AB449] transition-all duration-500" 
            style={{ width: `${activeIndex !== -1 ? (Math.min(activeIndex, PLANT_LIFECYCLE_STAGES.length - 1) / (PLANT_LIFECYCLE_STAGES.length - 1)) * 92 : 0}%` }}
          />
          
          <div className="relative flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center w-[80px] z-10">
                {/* Step Circle */}
                <div 
                  className={`size-8 rounded-full flex items-center justify-center text-xs border-2 border-[#C6C6C6] font-inter font-semibold transition-all ${
                    step.completed ? 'bg-[#3AB449] text-white' : 
                    step.current ? 'bg-[#446DF6] text-white' : 
                    'bg-white text-[#919EAB] border-gray-200'
                  }`}
                >
                  {step.id}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center space-y-1">
                  <p className={`text-[10px] font-inter font-normal leading-tight line-clamp-2 h-6 ${
                    step.current ? 'text-[#6F6F6F]' : 'text-[#6F6F6F]'
                  }`}>
                    {step.label}
                  </p>
                  <div className="h-4">
                    {step.date && (
                      <p className="text-xs font-inter text-[#6F6F6F]">{step.date}</p>
                    )}
                    {step.status && (
                      <p className="text-xs font-inter text-[#6F6F6F] font-normal capitalize tracking-tighter">Current Step</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Step Details Card */}
      <div className="bg-[#F9FAFB] rounded-xl p-3 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-8">
          {/* Left: Step Info */}
          <div className="lg:col-span-1 space-y-3 lg:border-r border-gray-200 lg:pr-8">
            <h3 className="text-sm font-inter font-medium text-[#212B36]">
              {activeStageConfig.label} (Step {activeIndex !== -1 ? activeIndex + 1 : 1} of {PLANT_LIFECYCLE_STAGES.length})
            </h3>
            <p className="text-xs text-[#637381] font-inter leading-relaxed">
              Current lifecycle milestone status of the project in production and delivery workflow.
            </p>
          </div>

          {/* Middle: Dates */}
          <div className="lg:col-span-1 space-y-4 lg:border-r border-gray-200 lg:pr-8">
            <div className="flex items-center gap-4">
              <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-[#637381]">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-inter font-medium text-[#212B36]">Planned start date</p>
                <p className="text-xs text-[#637381] font-inter">{startedDate || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-[#637381]">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-inter font-medium text-[#212B36]">Target Completion</p>
                <p className="text-xs text-[#637381] font-inter">{estimateCompletion || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Right: Planner & Priority */}
          <div className="lg:col-span-1 space-y-4 lg:border-r border-gray-200 lg:pr-8">
            <div>
              <p className="text-sm font-inter font-medium text-[#212B36]">Assigned Planner</p>
              <p className="text-sm text-[#637381] font-inter">{assignedPlanner || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-inter font-medium text-[#212B36] mb-2">Priority</p>
              {priority ? (
                <span className="px-4 py-1 bg-[#FFF9E7] text-[#EAB308] border border-[#EAB308]/20 rounded-full text-xs font-inter font-normal capitalize">
                  {priority}
                </span>
              ) : (
                <p className="text-sm text-[#637381] font-inter">-</p>
              )}
            </div>
          </div>

          {/* Far Right: Next Step */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-inter font-medium text-[#212B36]">Next Step</h3>
            <div className="space-y-1">
              <p className="text-sm text-[#637381] font-inter">
                {nextStage ? formatPlantLifecycleStatusLabel(nextStage) : "None (Delivered)"}
              </p>
              <p className="text-xs text-[#5D6772] font-inter">
                {nextStage ? "Upcoming after completion" : "Project completed"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 pt-2">
        <Button
        variant="primary"
        size="md"
          onClick={() => setIsUpdateModalOpen(true)}
        >
          Update Step Status
        </Button>
        <Button
        variant="blueOutlined"
          onClick={() => setIsNotesModalOpen(true)}
        >
          Add Notes
        </Button>
      </div>

      {/* Action Modals */}
      <UpdateStepStatusModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateStatus}
        currentStatus={currentStatus}
        isLoading={isUpdating}
      />
      <AddNotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onAdd={handleAddNote}
        isLoading={isAddingNote}
      />
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMsg}
      />
    </div>
  );
};

export default ProjectLifecycle;
