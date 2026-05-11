import React from "react";
import { X } from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import qrPlacholderImg from "../../assets/images/qrPlacholderImg.svg"

interface QRCodeDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const QRCodeDataModal: React.FC<QRCodeDataModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-2xl">
      <div className="relative p-2 md:p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-2 md:right-2  bg-black text-white rounded-full p-1.5 shadow-sm hover:bg-gray-800 transition-colors z-50"
        >
          <X className="size-3 md:size-4" />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-inter font-bold text-center mb-10 text-[#212B36]">
          QR Code Data
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          {/* QR Code Placeholder */}
          <div className="w-48 h-48 md:w-56 md:h-56 shrink-0">
            <img 
              src={qrPlacholderImg}
              alt="QR Code" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Data List */}
          <div className="flex-1 space-y-2">
            <h3 className="text-lg md:text-xl font-inter font-semibold text-(--text-color-gray-5)">
              project=RiversideComplex
            </h3>
            <div className="space-y-1 text-sm md:text-base font-normal">
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Shipper :</span>
                <span className="text-(--text-color-gray-5) font-medium">shipper=SHP-1044</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Load :</span>
                <span className="text-(--text-color-gray-5) font-medium">load_id={data.loadId || 'LOAD-001'}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Bundle :</span>
                <span className="text-(--text-color-gray-5) font-medium">bundle_id={data.id || 'BND-001'}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Parts :</span>
                <span className="text-(--text-color-gray-5) font-medium">parts={data.parts || 'STL-B12'}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Weight :</span>
                <span className="text-(--text-color-gray-5) font-medium">weight={data.weight?.replace(/[^0-9]/g, '') || '3600'}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Length :</span>
                <span className="text-(--text-color-gray-5) font-medium">Length={data.length?.replace(/[^0-9]/g, '') || '20'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          <Button variant="gradient" size="lg" className="w-full">
            Export PDF
          </Button>
          <Button variant="gradient" size="lg" className="w-full">
            Print
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeDataModal;
