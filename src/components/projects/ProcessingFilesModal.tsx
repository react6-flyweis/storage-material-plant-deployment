import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import CheckIcon from "../../assets/icon/checkIcon.svg"
import Heading from "../common_component/Heading";

interface ProcessingFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProcessingFilesModal: React.FC<ProcessingFilesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([
    { label: "Reading Files...", completed: false },
    { label: "Matching Part Numbers...", completed: false },
    { label: "Checking Quantities...", completed: false },
    { label: "Generating Report...", completed: false },
  ]);

  useEffect(() => {
    if (isOpen) {
      // Simulate step-by-step progress
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setSteps(prev => prev.map((step, idx) => 
            idx === currentStep ? { ...step, completed: true } : step
          ));
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onClose();
            navigate("/load_planning/comparison-result");
          }, 1000);
        }
      }, 800);
      return () => clearInterval(interval);
    } else {
      // Reset when closed
      setSteps(prev => prev.map(step => ({ ...step, completed: false })));
    }
  }, [isOpen, onClose, navigate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader={true}>
      <div className="py-8 px-6 flex flex-col items-center">
        {/* <h2 className="text-3xl font-archivo font-semibold text-[#111827] mb-8">
          Processing Files...
        </h2> */}
        <Heading text="Processing Files..." />
        
        <div className="w-full space-y-6 mt-4">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <div className={`transition-all duration-300 transform ${step.completed ? "scale-110 opacity-100" : "opacity-30"}`}>
                {step.completed ? (
                    <img src={CheckIcon} alt="" className="md:size-11 size-9" />
                )
                : (
                    <div className="md:size-11 size-9 rounded-full bg-gray-300"></div>
                )}
              </div>
              <span className={`text-base md:text-lg font-inter font-normal transition-colors duration-300 ${step.completed ? "text-black" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ProcessingFilesModal;
