import React, { useState } from "react";
import Modal from "../Modal";
import SentCompletionNotesModal from "./SentCompletionNotesModal";
import { Check, CheckCheck } from "lucide-react";

interface TrackLeadsLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadData: {
    id: string;
    name: string;
  };
}

const TrackLeadsLifecycleModal: React.FC<TrackLeadsLifecycleModalProps> = ({
  isOpen,
  onClose,
  leadData,
}) => {
  const [isCompletionNotesOpen, setIsCompletionNotesOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(4); // Default to Step 4 (Install) as in image

  const steps = [
    { id: 1, label: "Design" },
    { id: 2, label: "Fabrication" },
    { id: 3, label: "Dispatch" },
    { id: 4, label: "Install" },
    { id: 5, label: "Complete" },
  ];

  const handleUpdateStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSave = () => {
    // Save logic here
    onClose();
  };

  const handleNotesSubmit = (note: string) => {
    console.log("Submitted Note:", note);
    // Handle note submission logic
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Track Leads lifecycle - ${leadData.name}`}
        width="max-w-4xl"
      >
        <div className="p-4 md:p-8">
          <p className="text-gray-500 text-sm -mt-4 md:-mt-6 mb-6 md:mb-8">
            {leadData.id}
          </p>

          <h3 className="text-base font-semibold text-gray-900 mb-6 font-primary">
            Progress Steps
          </h3>

          <div className="bg-[#fcfcfc] rounded-2xl p-4 md:p-8 border border-gray-100">
            <div className="space-y-6 md:space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100 -z-10"></div>

              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-4 md:gap-6">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 text-white
                    ${
                      step.id < currentStep
                        ? "bg-[#3AB449]"
                        : step.id === currentStep
                        ? "bg-[#2563EB]"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{step.id}</span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 pt-0.5">
                    <div>
                      <p
                        className={`text-sm md:text-base font-semibold ${
                          step.id < currentStep
                            ? "text-[#3AB449]"
                            : step.id === currentStep
                            ? "text-[#2563EB]"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.id === currentStep && (
                        <p className="text-[10px] text-[#2563EB] mt-0.5 uppercase font-bold">
                          Current Step
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-6">
                      {step.id < currentStep && (
                        <CheckCheck className="w-6 h-6 text-[#006C14]" />
                      )}
                      {step.id === currentStep && (
                        <button
                          onClick={handleUpdateStep}
                          className="px-6 py-2 bg-[#7C9BFF] hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress Bar Footer */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-2 font-medium">
                Progress: Step {currentStep} of {steps.length}
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-[#3AB449] h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentStep / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8 md:mt-12">
            <button
              onClick={() => setIsCompletionNotesOpen(true)}
              className="w-full sm:w-auto px-8 py-3 bg-[#2563EB]/90 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
            >
              Sent Completion Notes
            </button>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-10 py-3 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      <SentCompletionNotesModal
        isOpen={isCompletionNotesOpen}
        onClose={() => setIsCompletionNotesOpen(false)}
        onSubmit={handleNotesSubmit}
      />
    </>
  );
};

export default TrackLeadsLifecycleModal;
