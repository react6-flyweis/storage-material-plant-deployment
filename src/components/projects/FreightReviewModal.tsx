import React from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import GmailLogo from "../../assets/images/gmailLogo.svg";

interface FreightReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const FreightReviewModal: React.FC<FreightReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-3xl" title="Email">
      <div className="p-1 font-inter text-[#212B36]">
        {/* Header with Gmail Logo */}
        <div className="flex items-center gap-4 mb-5">
          <img
            src={GmailLogo}
            alt="Gmail"
            className="w-14 h-10 md:w-22 md:h-14 object-cover"
          />
          <h2 className="text-base md:text-2xl font-semibold leading-tight">
            Freight Request – PRJ-1025 | Pickup & Delivery Details
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p>
              <span className="font-bold text-base md:text-lg">Project:</span> ABC Logistics Warehouse
            </p>
            <p>
              <span className="font-bold text-base md:text-lg">Delivery Company:</span> QuickFrieght
              Solutions
            </p>
            <p>
              <span className="font-bold text-base md:text-lg">Date:</span> 04/04/2024 at 14:00
            </p>
            <p>
              <span className="font-bold text-base md:text-lg">POC:</span> John Site Manager
            </p>
            <p>
              <span className="font-bold text-base md:text-lg">Location:</span> Construction Site,
              Austin, TX
            </p>
          </div>

          <div className="h-px bg-[#E2E4E6]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
            <div className="space-y-1">
              <h3 className="font-bold text-base md:text-xl">Load Details:</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm md:text-lg">
                <li>Total Weight: 32,000 kg</li>
                <li>Bundles: 18</li>
                <li>Material: Steel & Panels</li>
                <li>Vehicle Type: Flatbed (preferred)</li>
              </ul>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base md:text-xl">Schedule:</h3>
              <ul className="list-disc list-inside space-y-1 pl-2 text-sm md:text-lg">
                <li>Pickup Date: May 10, 2026</li>
                <li>Delivery Date: May 12, 2026</li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-[#E2E4E6]" />

          <div className="space-y-1">
            <h3 className="font-bold text-base md:text-xl">Site Requirements:</h3>
            <ul className="list-disc list-inside space-y-1 pl-2 text-sm md:text-lg">
              <li>Crane required for unloading</li>
              <li>Advance notice before arrival</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-6 mb-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={onSubmit}
          >
            Submit your quote to Carriers
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FreightReviewModal;
