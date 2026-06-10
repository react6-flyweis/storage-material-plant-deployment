import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Upload, X, Check } from "lucide-react";
import LoadPlanningHeader from "./LoadPlanningHeader";
import Button from "../../common_component/Button";
import CommonDropdown from "../../common_component/CommonDropdown";
import SubHeading from "../../common_component/SubHeading";

const Step0ShipperUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [project, setProject] = useState("Riverside Complex");
  const [batchName, setBatchName] = useState("Batch 001");
  const [shipperRef, setShipperRef] = useState("SHP-1044");
  const [vendor, setVendor] = useState("ABC Steel Suppliers");
  const [destination, setDestination] = useState("Site A");
  const [shipmentDate, setShipmentDate] = useState("5 April 2026");
  const [notes, setNotes] = useState("First batch for structural steel");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 lg:p-6">
        <SubHeading text="Upload New Shipper File" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 my-6">
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Project <span className="text-red-500">*</span>
            </label>
            <CommonDropdown
              options={[
                { label: "Riverside Complex", value: "Riverside Complex" },
                { label: "Project 2", value: "Project 2" },
                { label: "Project 3", value: "Project 3" },
              ]}
              value={project}
              onChange={setProject}
              placeholder="Select"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Shipment Batch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Shipper Reference <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shipperRef}
              onChange={(e) => setShipperRef(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Material Source / Vendor <span className="text-red-500">*</span>
            </label>
            <CommonDropdown
              options={[
                {
                  label: "ABC Steel Suppliers",
                  value: "ABC Steel Suppliers",
                },
                { label: "Suppliers 2", value: "Suppliers 2" },
                { label: "Suppliers 3", value: "Suppliers 3" },
              ]}
              value={vendor}
              onChange={setVendor}
              placeholder="Select"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Delivery Destination <span className="text-red-500">*</span>
            </label>
            <CommonDropdown
              options={[
                { label: "Site A", value: "Site A" },
                { label: "Site 2", value: "Site 2" },
                { label: "Site 3", value: "Site 3" },
              ]}
              value={destination}
              onChange={setDestination}
              placeholder="Select"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-inter font-bold text-black flex gap-1">
              Planned Shipment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shipmentDate}
              onChange={(e) => setShipmentDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
            />
          </div>
        </div>
        <div className="space-y-2 mb-8">
          <label className="text-sm font-inter font-bold text-black">
            Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#1E51A4]"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9FAFB] border-2 border-dashed border-[#E2E4E6] rounded-lg flex items-center justify-center shrink-0">
            <div className="text-[#919EAB]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Button
                variant="purpleFilled"
                size="sm"
                onClick={handleButtonClick}
              >
                <Upload size={16} className="mr-2" /> Browse files
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] border border-[#E2E8F0] rounded-lg text-sm font-inter font-bold text-black">
                  {selectedFile.name}{" "}
                  <X
                    size={16}
                    className="text-[#637381] cursor-pointer hover:text-black"
                    onClick={() => setSelectedFile(null)}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-[#637381] font-inter">
              Max file size: 10 MB, Supported formats: (XLSX, CSV)
            </p>
          </div>
        </div>
        <div className="mb-12">
          <SubHeading text="Validation Results" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-10 max-w-3xl mt-4">
            {[
              { label: "Part Number", status: "Detected" },
              { label: "Weight", status: "Detected" },
              { label: "Description", status: "Detected" },
              { label: "Quantity", status: "Detected" },
              { label: "Length", status: "Detected" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#F4F6F8] pb-3"
              >
                <span className="text-[15px] font-inter text-[#637381] font-medium">
                  {item.label}
                </span>
                <span className="text-[15px] font-inter text-black font-bold flex items-center gap-2">
                  <Check size={18} strokeWidth={3} className="text-black" />{" "}
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-gray-100 mb-8" />
        <div className="mb-8">
          <SubHeading text="Data Summary" />
          <div className="space-y-4 max-w-sm mt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-inter text-black font-bold">
                Total Items
              </span>
              <span className="text-base font-inter text-black font-bold">
                200
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-inter text-black font-bold">
                Total Weight
              </span>
              <span className="text-base font-inter text-black font-bold">
                14100 IBS
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-inter text-black font-bold">
                Items Type
              </span>
              <span className="text-base font-inter text-black font-bold">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShipperUploadView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={0}
        requestId={projectId || ""}
        title="Shipper Upload"
        description="Upload material lists and generate optimized loads"
        actions={[]}
      />
      <div className="p-6">
        <Step0ShipperUpload />
      </div>
    </div>
  );
};

export default ShipperUploadView;
