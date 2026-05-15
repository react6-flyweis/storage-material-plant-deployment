import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { 
  UpdateStepStatusModal, 
  AddNotesModal,  
} from "./ProjectActionModals";
import SuccessModal from "../common_component/SuccessModal";
import Button from "../common_component/Button";

const ProjectLifecycle: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateStatus = () => {
    setIsUpdateModalOpen(false);
    setIsSuccessModalOpen(true);
    setSuccessMsg("Status Updated Successfully");
  };

  const handleAddNote = () => {
    setIsNotesModalOpen(false);
     setIsSuccessModalOpen(true);
      setSuccessMsg("Note Added Successfully");
  };

  const steps = [
    { id: 1, label: "Released to plant", date: "24-10-10", completed: true },
    { id: 2, label: "Drawings Received", date: "24-10-10", completed: true },
    { id: 3, label: "BOM Received", date: "24-10-10", completed: true },
    { id: 4, label: "BOM Review", date: "24-10-10", completed: true },
    { id: 5, label: "Material Check", date: "24-10-10", completed: true },
    { id: 6, label: "Material Request", date: "24-10-10", completed: true },
    { id: 7, label: "Production Planning", status: "Current Step", current: true },
    { id: 8, label: "Fabrication Started", upcoming: true },
    { id: 9, label: "Quality Inspection", upcoming: true },
    { id: 10, label: "Packing Bundling", upcoming: true },
    { id: 11, label: "Shipper Prepared", upcoming: true },
    { id: 12, label: "Ready For Delivery", upcoming: true },
    { id: 13, label: "Dispatched", upcoming: true },
    { id: 14, label: "Delivered", upcoming: true },
  ];

  return (
    <div className="bg-white rounded-[14px] shadow-sm border border-gray-100 p-4 md:p-6 space-y-8">
      <h2 className="text-xl font-semibold text-[#212B36]">Project Lifecycle</h2>

      {/* Timeline */}
      <div className="relative overflow-x-auto pb-6 pt-4">
        <div className="min-w-[1200px] relative">
          {/* Connection Line */}
          <div className="absolute top-4 left-10 right-10 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div 
            className="absolute top-4 left-10 h-1 bg-[#0043CE] transition-all duration-500" 
            style={{ width: '43%' }} // Up to step 7
          />
          <div 
            className="absolute top-4 left-[46%] h-1 bg-[#446DF6] transition-all duration-500" 
            style={{ width: '5%' }} // The active segment
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
              Production Planning (Step 7 of 14)
            </h3>
            <p className="text-xs text-[#637381] font-inter leading-relaxed">
              Plan Production Schedule, assign resources and determine fabrication priority for this project
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
                <p className="text-xs text-[#637381] font-inter">2024-10-10</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="size-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 text-[#637381]">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-sm font-inter font-medium text-[#212B36]">Target Completion</p>
                <p className="text-xs text-[#637381] font-inter">2024-10-10</p>
              </div>
            </div>
          </div>

          {/* Right: Planner & Priority */}
          <div className="lg:col-span-1 space-y-4 lg:border-r border-gray-200 lg:pr-8">
            <div>
              <p className="text-sm font-inter font-medium text-[#212B36]">Assigned Planner</p>
              <p className="text-sm text-[#637381] font-inter">Sarah Lee</p>
            </div>
            <div>
              <p className="text-sm font-inter font-medium text-[#212B36] mb-2">Priority</p>
              <span className="px-4 py-1 bg-[#FFF9E7] text-[#EAB308] border border-[#EAB308]/20 rounded-full text-xs font-inter font-normal">
                Medium
              </span>
            </div>
          </div>

          {/* Far Right: Next Step */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-sm font-inter font-medium text-[#212B36]">Next Step</h3>
            <div className="space-y-1">
              <p className="text-sm text-[#637381] font-inter">Fabrication Production Started</p>
              <p className="text-xs text-[#5D6772] font-inter">Upcoming After completion</p>
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
      />
      <AddNotesModal 
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onAdd={handleAddNote}
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
