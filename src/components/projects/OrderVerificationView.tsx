import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, Scale } from "lucide-react";
import Button from "../common_component/Button";
import { UploadModal } from "./ProjectUploadModals";
import uploadIcon from "@/assets/icon/upload.svg";
import ProcessingFilesModal from "@/components/projects/ProcessingFilesModal";
import CommonDropdown from "../common_component/CommonDropdown";
import TitleSubtitle from "../common_component/TitleSubtitle";

const OrderVerificationView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState("Steel Investment");

  const [isBOMModalOpen, setIsBOMModalOpen] = useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const [bomFile, setBomFile] = useState<string | null>("");
  const [shipperFile, setShipperFile] = useState<string | null>("");

  const vendorOptions = [
    { label: "ABC Material", value: "ABC Material" },
    { label: "LPQ Vendor", value: "LPQ Vendor" },
    { label: "Steel Investment", value: "Steel Investment" },
  ];

  const handleCompare = () => {
    setIsProcessingModalOpen(true);
    setTimeout(() => {}, 3000);
  };

  return (
    <div className="p-2 md:p-6 min-h-screen bg-[#F8F9FA]">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8 flex-wrap w-full">
        <Button variant="primary" onClick={() => navigate(-1)} size="sm">
          <MoveLeft size={18} className="mr-2" />
          Back
        </Button>
        <TitleSubtitle
          title="Order Verification"
          subtitle="File Update & Compare"
        />
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-4 lg:p-8 shadow-sm border border-[#F4F6F8] max-w-6xl mx-auto">
        <div className="mb-8 relative max-w-md">
          <CommonDropdown
            label="Select Vendor"
            options={vendorOptions}
            value={selectedVendor}
            onChange={setSelectedVendor}
            placeholder="Select Vendor"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8 mb-12">
          {/* BOM Upload Area */}
          <div
            className="border-2 border-dashed border-[#1849D6] rounded-[14px] p-4 lg:p-8 flex flex-col items-center justify-center text-center bg-white transition-colors cursor-pointer min-h-[260px]"
            onClick={() => setIsBOMModalOpen(true)}
          >
            <div className="mb-4">
              <img
                src={uploadIcon}
                alt="Upload"
                className="md:w-12 md:h-12 h-8 w-8"
              />
            </div>
            <h3 className="text-base md:text-lg font-archivo font-semibold text-black mb-1">
              Upload BOM File
            </h3>
            <p className="text-xs md:text-sm font-inter text-[#637381] mb-4">
              Drag & Drop or Browse ( PDF)
            </p>
            <div className="w-full flex items-center justify-center gap-2 mb-6">
              <div className="h-px bg-[#E2E4E6] flex-1 max-w-[60px]"></div>
              <span className="text-xs font-inter text-[#919EAB] uppercase">
                or
              </span>
              <div className="h-px bg-[#E2E4E6] flex-1 max-w-[60px]"></div>
            </div>
            {bomFile ? (
              <div className="px-6 py-2 border border-[#1E51A4] rounded-lg text-[#1E51A4] text-sm font-inter font-medium bg-white">
                {bomFile}
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsBOMModalOpen(true)}
                className="text-(--text-color-blue)"
              >
                Browse files
              </Button>
            )}
          </div>

          {/* Shipper Upload Area */}
          <div
            className="border-2 border-dashed border-[#1849D6] rounded-[14px] p-4 md:p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer min-h-[260px]"
            onClick={() => setIsShipperModalOpen(true)}
          >
            <div className="mb-4">
              <img
                src={uploadIcon}
                alt="Upload"
                className="md:w-12 md:h-12 h-8 w-8"
              />
            </div>
            <h3 className="text-base md:text-lg font-archivo font-semibold text-black mb-1">
              Upload Shipper File
            </h3>
            <p className="text-xs md:text-sm font-inter text-[#637381] mb-4">
              Drag & Drop or Browse ( Excel)
            </p>
            <div className="w-full flex items-center justify-center gap-2 mb-6">
              <div className="h-px bg-[#E2E4E6] flex-1 max-w-[60px]"></div>
              <span className="text-xs font-inter text-[#919EAB] uppercase">
                or
              </span>
              <div className="h-px bg-[#E2E4E6] flex-1 max-w-[60px]"></div>
            </div>
            {shipperFile ? (
              <div className="px-6 py-2 border border-[#1E51A4] rounded-lg text-[#1E51A4] text-sm font-inter font-medium bg-white">
                {shipperFile}
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsShipperModalOpen(true)}
                className="text-(--text-color-blue)"
              >
                Browse files
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCompare} variant="purpleFilled">
            <Scale className="size-6 mr-2" />
            Compare Files
          </Button>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <UploadModal
        isOpen={isBOMModalOpen}
        onClose={() => setIsBOMModalOpen(false)}
        title="Upload BOM File"
        subtitle="Add your documents here, and you can upload up to 5 files max"
        fileLabel="BOM File"
        onUpload={(file) => {
          setBomFile(file.name);
          setIsBOMModalOpen(false);
        }}
      />

      <UploadModal
        isOpen={isShipperModalOpen}
        onClose={() => setIsShipperModalOpen(false)}
        title="Upload Shipper File"
        subtitle="Add your documents here, and you can upload up to 5 files max"
        fileLabel="Shipper File"
        onUpload={(file) => {
          setShipperFile(file.name);
          setIsShipperModalOpen(false);
        }}
      />

      <ProcessingFilesModal
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
      />
    </div>
  );
};

export default OrderVerificationView;
