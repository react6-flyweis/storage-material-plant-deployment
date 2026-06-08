import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../Modal";

interface ProcessingFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProcessingFilesModal: React.FC<ProcessingFilesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleOk = () => {
    onClose();
    if (projectId) {
      navigate(`/projects/${projectId}`);
    } else {
      navigate("/projects");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader={true}>
      <div className="py-12 px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-[32px] font-inter font-bold text-black mb-4">
          Processing Files...
        </h2>
        
        <p className="text-base md:text-lg font-inter font-normal text-black max-w-[280px] leading-relaxed mb-8">
          It Takes a little time we will Notify you after Comparison
        </p>

        <button
          onClick={handleOk}
          className="w-full max-w-[280px] py-3.5 px-6 bg-gradient-to-r from-[#1d61f2] to-[#463cf1] text-white text-lg font-medium rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          Ok
        </button>
      </div>
    </Modal>
  );
};

export default ProcessingFilesModal;
