import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Check,
  X,
  Download,
  ArrowLeft,
  Package,
  Ruler,
  Truck,
  SlidersHorizontal,
  Clock,
  Paperclip,
  MapPin,
  Calendar,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import SubHeading from "../common_component/SubHeading";
import TitleSubtitle from "../common_component/TitleSubtitle";
import QuickenSteelDocument from "./QuickenSteelDocument";
import CheckIcon  from "../../assets/icon/checkIcon.svg"

const steps = [
  "Shipper Upload",
  "Item Analysis",
  "Bundle Planner",
  "Truck Optimizer",
  "Packing List",
  "QR Label",
  "Load Plan Review",
  "Freight Selection",
  "Dispatch",
];

const StartLoadPlanningView: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState("Riverside Complex");
  const [batchName, setBatchName] = useState("Batch 001");
  const [shipperRef, setShipperRef] = useState("SHP-1044");
  const [vendor, setVendor] = useState("ABC Steel Suppliers");
  const [destination, setDestination] = useState("Site A");
  const [shipmentDate, setShipmentDate] = useState("5 April 2026");
  const [notes, setNotes] = useState("First batch for structural steel");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);

  const orderItems = [
    {
      qty: 5,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 8,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 6,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 5,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 8,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 6,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 3,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 4,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
    {
      qty: 2,
      item: "PC16RO8X",
      description:
        '16Ga CEE Purlin Red Oxide 8X3-12"\nPunch: Custom, Piece Mark: DJ-1',
      length: "6'11-3/4\"",
      weight: 621,
      price: 2.0,
      amount: 16.0,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const bundleData = [
    {
      id: "BND-001",
      num: 1,
      profile: "Beam",
      items: "STL-B12 x 30",
      length: "20 ft",
      weight: "3600 IBS",
      status: "Valid",
    },
    {
      id: "BND-002",
      num: 2,
      profile: "Angle",
      items: "STL-B12 x 30",
      length: "12 ft",
      weight: "2400 IBS",
      status: "Valid",
    },
    {
      id: "BND-003",
      num: 3,
      profile: "Channel",
      items: "STL-B12 x 30",
      length: "15 ft",
      weight: "4500 IBS",
      status: "Valid",
    },
    {
      id: "BND-004",
      num: 4,
      profile: "Beam",
      items: "STL-B12 x 30",
      length: "20 ft",
      weight: "2700 IBS",
      status: "Valid",
    },
  ];

  return (
    <div className="p-1 min-h-screen">
      {/* ── Stepper ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl py-8 px-4 mb-6 border border-gray-100 overflow-x-auto custom-scrollbar shadow-sm">
        <div className="relative flex items-center justify-between min-w-[900px] md:min-w-0 max-w-6xl mx-auto px-10">
          {/* Progress Line Background */}
          <div className="absolute top-[13px] left-20 right-20 h-[2px] bg-gray-100">
            {/* Active Progress Line */}
            <div className="h-[4px] bg-[#0043CE] transition-all duration-300 w-[102%]" />
          </div>

          {steps.map((step, idx) => (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all duration-200 ${
                  idx <= currentStep
                    ? "bg-[#0043CE]"
                    : "bg-white border border-[#C6C6C6]"
                } ${idx === currentStep ? "ring-2 ring-[#0043CE]/10" : ""}`}
              >
                {idx < currentStep ? (
                  <Check size={14} className="text-white" strokeWidth={3} />
                ) : idx === currentStep ? (
                  <div className="w-[20px] h-[20px] rounded-full bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0043CE]" />
                  </div>
                ) : null}
              </div>
              <span
                className={`mt-4 text-xs font-inter whitespace-nowrap transition-colors ${
                  idx === currentStep
                    ? "text-black font-normal"
                    : "text-[#919EAB] font-normal"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-8 gap-4 px-2">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-black transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <TitleSubtitle
            title={
              currentStep === 8
                ? "Shipment Dispatch"
                : currentStep === 7
                  ? "Create Freight Request"
                  : currentStep === 6
                    ? "Load Plan Review"
                    : currentStep === 5
                      ? "QR Label Generator"
                      : currentStep === 4
                        ? "Packing List"
                        : currentStep === 3
                          ? "Truckload Optimizer"
                          : currentStep === 2
                            ? "Bundle / Pallet Planner"
                            : steps[currentStep]
            }
            subtitle={
              currentStep === 8
                ? "Finalize dispatch and initiate shipment tracking for the completed load plan."
                : currentStep === 7
                  ? "Request freight pricing from carriers and compare competitive bids"
                  : currentStep === 6
                    ? "Final check of the entire load plan, including bundles, trucks, and weights, before selecting freight carriers."
                    : currentStep === 5
                      ? "Generate and print QR labels for bundles and pallets to enable scanning and tracking."
                      : currentStep === 4
                        ? "Generate and manage packing lists for truckloads and bundles."
                        : currentStep === 3
                          ? "Optimize bundle assignments into truckloads to maximize utilization and prepare shipments for dispatch."
                          : currentStep === 2
                            ? "Group items into optimized bundles or pallets for efficient truck loading and site unloading."
                            : currentStep === 1
                              ? "Analyze the material list for accuracy and identify any missing or incompatible items."
                              : "Upload material lists and generate optimized loads"
            }
          />
        </div>
        <div className="flex items-center gap-3">
          {currentStep === 8 ? (
            <>
              <Button
                variant="purpleFilled"
                onClick={() => navigate("/projects")}
                className="px-8 py-2.5 font-bold"
              >
                Go to Project Dashboard
              </Button>
            </>
          ) : currentStep === 7 ? (
            <>
              <Button
                variant="white"
                className="border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5"
              >
                <Download size={18} className="mr-2" />
                Export Quote Summary
              </Button>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Confirm & Dispatch
              </Button>
            </>
          ) : currentStep === 6 ? (
            <>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Approve & Create Freight Request
              </Button>
            </>
          ) : currentStep === 5 ? (
            <>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Review Load Plan
              </Button>
            </>
          ) : currentStep === 4 ? (
            <>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Generate QR Label
              </Button>
            </>
          ) : currentStep === 3 ? (
            <>
              <Button
                variant="white"
                className="border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5"
              >
                <Download size={18} className="mr-2" />
                Export Load Plan
              </Button>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Generate Packing List
              </Button>
            </>
          ) : currentStep === 2 ? (
            <>
              <Button
                variant="white"
                className="border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5"
              >
                <Download size={18} className="mr-2" />
                Export Bundle Plan
              </Button>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                Proceed to Truckload Optimization
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="white"
                className="border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5"
              >
                <Upload size={18} className="mr-2" />
                Upload File
              </Button>
              <Button
                variant="purpleFilled"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
                className="px-8 py-2.5 font-bold"
              >
                {currentStep === 0 ? "Next" : "Auto Optimize Bundles"}
              </Button>
            </>
          )}
        </div>
      </div>

      {currentStep === 0 && (
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
                  Material Source / Vendor{" "}
                  <span className="text-red-500">*</span>
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
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="bg-[#F8F9FB] rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-inter font-bold text-black">
                  Project: Riverside Complex | Upload ID: UPL-001
                </h2>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                      Project:
                    </span>
                    <span className="text-sm font-inter text-[#637381]">
                      Riverside Complex
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                      Upload ID:
                    </span>
                    <span className="text-sm font-inter text-[#637381]">
                      UPL-001
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                      Shipper Reference:
                    </span>
                    <span className="text-sm font-inter text-[#637381]">
                      SHP-1044
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                      Vendor:
                    </span>
                    <span className="text-sm font-inter text-[#637381]">
                      ABC Shipper
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="purpleFilled"
                className="font-bold px-6 py-2.5 whitespace-nowrap self-end md:self-auto"
                onClick={() =>
                  setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
                }
              >
                Auto Optimize Bundles
              </Button>
            </div>
          </div>
          <QuickenSteelDocument orderItems={orderItems} />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
          <div className="bg-[#F8F9FB] rounded-xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-inter font-bold text-black mb-6">
              Project: Riverside Complex | Upload ID: UPL-001
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                  Project:
                </span>
                <span className="text-sm font-inter text-[#637381]">
                  Riverside Complex
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                  Shipper Reference:
                </span>
                <span className="text-sm font-inter text-[#637381]">
                  SHP-1044
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                  Upload ID:
                </span>
                <span className="text-sm font-inter text-[#637381]">
                  UPL-001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-inter font-bold text-black min-w-[140px]">
                  Vendor:
                </span>
                <span className="text-sm font-inter text-[#637381]">
                  ABC Shipper
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Summary KPI'S
              </h3>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Total Bundles", value: "5" },
                  { label: "Average Bundle Weight", value: "14100 IBS" },
                  { label: "Total Planned Weight", value: "18500 IBS" },
                  {
                    label: "Bundle Issues",
                    value: "1 Warning",
                    color: "text-black",
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-[#637381]">
                      {kpi.label}
                    </span>
                    <span
                      className={`font-inter font-bold ${kpi.color || "text-black"}`}
                    >
                      {kpi.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Optimization Control
              </h3>
              <div className="space-y-4 max-w-md">
                {[
                  { label: "Target Bundle Weight", value: "5000 IBS" },
                  { label: "Maximum Bundle Weight", value: "6000 IBS" },
                  { label: "Length Tolerance", value: "±6 in" },
                  { label: "Group by Profile", value: "Enabled" },
                ].map((ctrl) => (
                  <div
                    key={ctrl.label}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-[#637381]">
                      {ctrl.label}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {ctrl.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="white"
              className="bg-[#637381] text-white border-none font-bold px-6 py-2.5 rounded-lg hover:bg-[#454F5B]"
            >
              Reset Bundles
            </Button>
            <Button
              variant="white"
              className="bg-[#919EAB] text-white border-none font-bold px-6 py-2.5 rounded-lg hover:bg-[#637381]"
            >
              Merge Bundles
            </Button>
          </div>
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-inter font-bold text-black">
              Bundle Data
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse min-w-[800px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 w-12">
                      <div className="w-4 h-4 border-2 border-white/50 rounded flex items-center justify-center cursor-pointer">
                        <div className="w-2 h-2 bg-transparent" />
                      </div>
                    </th>
                    <th className="py-4 px-4 w-12">#</th>
                    <th className="py-4 px-6">Bundle ID</th>
                    <th className="py-4 px-6">Profile</th>
                    <th className="py-4 px-6">Items</th>
                    <th className="py-4 px-6">Length</th>
                    <th className="py-4 px-6">Unit Weight</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {bundleData.map((bundle, idx) => (
                    <tr
                      key={bundle.id}
                      className="hover:bg-[#F8F9FB] transition-colors group"
                    >
                      <td className="py-5 px-6">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all ${idx % 2 !== 0 ? "bg-[#0043CE]" : "border-2 border-gray-200 bg-white"}`}
                        >
                          {idx % 2 !== 0 && (
                            <Check
                              size={10}
                              className="text-white"
                              strokeWidth={4}
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4 font-bold text-[#637381]">
                        {bundle.num}
                      </td>
                      <td className="py-5 px-6 font-bold text-black">
                        {bundle.id}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.profile}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.items}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.length}
                      </td>
                      <td className="py-5 px-6 font-bold text-[#637381]">
                        {bundle.weight}
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-bold text-[#637381]">
                          {bundle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Weight Distribution Summary
              </h3>
              <div className="space-y-4 max-w-sm">
                {[
                  { range: "0-3000 IBS", count: "1" },
                  { range: "3000-5000 IBS", count: "3" },
                  { range: "5000-6000 IBS", count: "1" },
                ].map((item) => (
                  <div
                    key={item.range}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-black">
                      {item.range}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-inter font-bold text-black mb-6">
                Profile Distribution
              </h3>
              <div className="space-y-4 max-w-sm">
                {[
                  { profile: "Beam", count: "2" },
                  { profile: "Angle", count: "2" },
                  { profile: "Channel", count: "1" },
                ].map((item) => (
                  <div
                    key={item.profile}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="font-inter font-bold text-black">
                      {item.profile}
                    </span>
                    <span className="font-inter font-bold text-black">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
          <div className="space-y-4">
            <SubHeading text="Truckload Table" />
            <div className="overflow-x-auto rounded-sm border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse min-w-[900px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                    <th className="py-4 px-6 w-16">#</th>
                    <th className="py-4 px-6">Load ID</th>
                    <th className="py-4 px-6">Bundle</th>
                    <th className="py-4 px-6">Total Weight</th>
                    <th className="py-4 px-6">Utilization</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    {
                      id: "LOAD-001",
                      num: 1,
                      bundles: "BND-001\nBND-002",
                      weight: "36000 IBS",
                      util: "80%",
                      status: "Ready",
                    },
                    {
                      id: "LOAD-002",
                      num: 2,
                      bundles: "BND-003\nBND-004",
                      weight: "44500 IBS",
                      util: "99%",
                      status: "Ready",
                    },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-6 px-6 font-normal text-gray-400">
                        {row.num}
                      </td>
                      <td className="py-6 px-6 font-normal text-[#212B36]">
                        {row.id}
                      </td>
                      <td className="py-6 px-6 font-normal text-[#637381] whitespace-pre-line leading-relaxed">
                        {row.bundles}
                      </td>
                      <td className="py-6 px-6 font-normal text-[#919EAB]">
                        {row.weight}
                      </td>
                      <td className="py-6 px-6 font-normal text-[#637381]">
                        {row.util}
                      </td>
                      <td className="py-6 px-6 font-normal text-[#637381]">
                        {row.status}
                      </td>
                      <td className="py-6 px-6 text-center">
                        <Button variant="grayFilled" size="sm">
                          Lock Truck
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {[
              { id: "LOAD-001", weight: "36000 IBS", cost: "$4500" },
              { id: "LOAD-002", weight: "44500 IBS", cost: "$5200" },
            ].map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-black">
                    Load ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={item.id}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-gray-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-black">
                    Weight
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={item.weight}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-gray-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-inter font-semibold text-black">
                    Estimate Cost
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={item.cost}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-black font-bold focus:outline-none"
                  />
                </div>
              </div>
            ))}

            <div className="max-w-xs space-y-2">
              <label className="text-sm font-inter font-semibold text-black">
                Total Estimate Freight
              </label>
              <input
                type="text"
                readOnly
                value="$9700"
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-black font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-8 bg-white rounded-[14px] border border-gray-100 shadow-sm p-4 md:p-8">
          <div className="bg-[#F8F9FB] rounded-xl p-6 md:p-10 border border-gray-100">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-inter font-semibold text-[#212B36] mb-6">
              Project: Riverside Complex | Truckloads: 2
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-inter font-semibold text-[#212B36] min-w-[160px]">
                  Project:
                </span>
                <span className="text-sm md:text-base font-inter text-[#637381]">
                  Riverside Complex
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base font-inter font-semibold text-[#212B36] min-w-[160px]">
                  Upload ID:
                </span>
                <span className="text-sm md:text-base font-inter text-[#637381]">
                  UPL-001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-inter font-semibold text-[#212B36] min-w-[160px]">
                  Bundles Created:
                </span>
                <span className="text-base font-inter text-[#637381]">5</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-inter font-semibold text-[#212B36] min-w-[160px]">
                  Total Weight:
                </span>
                <span className="text-base font-inter text-[#637381]">
                  18500 IBS
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <SubHeading text="Optimization Summary Card" />
            <div className="max-w-md space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter font-semibold text-[#212B36]">
                  Truck Loads
                </span>
                <span className="font-inter font-bold text-[#212B36]">2</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter font-semibold text-[#212B36]">
                  Total Bundles
                </span>
                <span className="font-inter font-bold text-[#212B36]">4</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter font-semibold text-[#212B36]">
                  Total Weight
                </span>
                <span className="font-inter font-bold text-[#212B36]">
                  18500 IBS
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-inter font-semibold text-[#212B36]">
                  Packing List Geneated
                </span>
                <span className="font-inter font-semibold text-[#212B36]">
                  2
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 my-8" />

          <div className="space-y-4">
            <SubHeading text="Packing List" />
            <div className="overflow-x-auto rounded-sm border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse min-w-[900px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                    <th className="py-4 px-6 w-16">#</th>
                    <th className="py-4 px-6">Load ID</th>
                    <th className="py-4 px-6">Truck</th>
                    <th className="py-4 px-6">Bundles</th>
                    <th className="py-4 px-6">Weight</th>
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    {
                      id: "LOAD-001",
                      num: 1,
                      truck: "TX-2141",
                      bundles: 3,
                      weight: "36000 IBS",
                      destination: "Riverside Site A",
                      status: "Ready",
                    },
                    {
                      id: "LOAD-002",
                      num: 2,
                      truck: "TX-4712",
                      bundles: 2,
                      weight: "45500 IBS",
                      destination: "Riverside Site A",
                      status: "Ready",
                    },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-6 px-6 font-normal">{row.num}</td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        {row.id}
                      </td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        {row.truck}
                      </td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        {row.bundles}
                      </td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        <div className="leading-tight">
                          <div>{row.weight.split(" ")[0]}</div>
                          <div>{row.weight.split(" ")[1]}</div>
                        </div>
                      </td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        {row.destination}
                      </td>
                      <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                        {row.status}
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="grayFilled" size="sm">
                            <Download size={18} strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="grayFilled"
                            size="sm"
                            className="px-6"
                            onClick={() => setIsPackingListModalOpen(true)}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
          {/* Project Header Card */}
          <div className="bg-[#F8F9FB] rounded-xl p-6 md:p-10 border border-gray-100">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-inter font-bold text-[#212B36] mb-6">
              Project: Riverside Complex | Shipper Ref: SHP-1044
            </h2>
            <div className="space-y-2">
              {[
                { label: "Project", value: "Riverside Complex" },
                { label: "Upload ID", value: "UPL-001" },
                { label: "Bundles Created", value: "5" },
                { label: "Total Weight", value: "18500 IBS" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-inter font-semibold text-[#212B36] min-w-[160px]">
                    {item.label}:
                  </span>
                  <span className="text-sm md:text-base font-inter text-[#637381]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Card Section */}
          <div className="space-y-6">
            <SubHeading text="Summary Card"/>
            <div className="max-w-md space-y-4">
              {[
                { label: "Total Bundles", value: "4" },
                { label: "Labels Generated", value: "4" },
                { label: "Labels Printed", value: "3" },
                { label: "Pending Labels", value: "1" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm md:text-base">
                  <span className="font-inter font-semibold text-[#212B36]">
                    {item.label}
                  </span>
                  <span className="font-inter font-bold text-[#212B36]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 my-8" />

          {/* Bundle Label List Table */}
          <div className="space-y-4">
            <SubHeading text="Bundle Label List"/>
            <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse min-w-[900px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                    <th className="py-4 px-6 w-16">#</th>
                    <th className="py-4 px-6">Bundle ID</th>
                    <th className="py-4 px-6">Load ID</th>
                    <th className="py-4 px-6">Parts</th>
                    <th className="py-4 px-6">Length</th>
                    <th className="py-4 px-6">Weight</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    { num: 1, id: "BND-001", load: "LOAD-001", parts: "STL-B12", length: "20 ft", weight: "3600 IBS", status: "Generated" },
                    { num: 2, id: "BND-002", load: "LOAD-002", parts: "STL-B12", length: "12 ft", weight: "2400 IBS", status: "Generated" },
                    { num: 3, id: "BND-003", load: "LOAD-003", parts: "STL-A03", length: "15 ft", weight: "4500 IBS", status: "Generated" },
                    { num: 4, id: "BND-004", load: "LOAD-004", parts: "STL-B12", length: "20 ft", weight: "2700 IBS", status: "Generated" },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                      <td className="py-6 px-6 font-bold text-[#212B36]">{row.id}</td>
                      <td className="py-6 px-6 font-normal text-[#212B36]">{row.load}</td>
                      <td className="py-6 px-6 font-normal text-[#637381]">{row.parts}</td>
                      <td className="py-6 px-6 font-normal text-[#637381]">{row.length}</td>
                      <td className="py-6 px-6 font-normal text-[#637381]">{row.weight}</td>
                      <td className="py-6 px-6 font-normal text-[#637381]">{row.status}</td>
                      <td className="py-6 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <Button variant="grayFilled" size="sm" className="p-2 min-w-0">
                            <Download size={18} className="text-white" />
                          </Button>
                          <Button 
                            variant="grayFilled" 
                            size="sm" 
                            className="px-6 text-[#637381] font-bold"
                            onClick={() => setIsPackingListModalOpen(true)}
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="space-y-12 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
          {/* Project Header Card */}
          <div className="bg-[#F8F9FB] rounded-xl p-6 md:p-10 border border-gray-100">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-inter font-bold text-[#212B36] mb-6">
              Project: Riverside Complex | Shipper Ref: SHP-1044
            </h2>
            <div className="space-y-1">
              {[
                { label: "Project", value: "Riverside Complex" },
                { label: "Upload ID", value: "UPL-001" },
                { label: "Bundles Created", value: "5" },
                { label: "Total Weight", value: "18500 IBS" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-sm md:text-base font-inter font-bold text-[#212B36] min-w-[160px]">
                    {item.label}:
                  </span>
                  <span className="text-sm md:text-base font-inter font-bold text-[#212B36]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Load Summary Card */}
          <div className="space-y-6">
            <SubHeading text="Load Summary Card" />
            <div className="max-w-md space-y-4">
              {[
                { label: "Total Bundles", value: "4" },
                { label: "Total Loads", value: "2" },
                { label: "Total Weight", value: "18500 IBS" },
                { label: "Estimated Freight Request", value: "$9700" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-sm md:text-base">
                  <span className="font-inter font-bold text-[#212B36]">
                    {item.label}
                  </span>
                  <span className="font-inter font-bold text-[#212B36]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Truckload Summary */}
          <div className="space-y-6">
            <SubHeading text="Truckload Summary" />
            <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse min-w-[900px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-sm font-medium tracking-wider">
                    <th className="py-4 px-6 w-16">#</th>
                    <th className="py-4 px-6">Load ID</th>
                    <th className="py-4 px-6">Bundle</th>
                    <th className="py-4 px-6">Total Weight</th>
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Ready</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    { num: 1, id: "LOAD-001", bundle: 2, weight: "36000 IBS", destination: "Riverside Site A", ready: true },
                    { num: 2, id: "LOAD-002", bundle: 2, weight: "44500 IBS", destination: "Riverside Site A", ready: true },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                      <td className="py-6 px-6 font-normal text-[#212B36]">{row.id}</td>
                      <td className="py-6 px-6 font-normal text-[#212B36]">{row.bundle}</td>
                      <td className="py-6 px-6 font-normal text-[#919EAB]">{row.weight}</td>
                      <td className="py-6 px-6 font-normal text-[#919EAB]">{row.destination}</td>
                      <td className="py-6 px-6">
                        {row.ready && <span className="text-[#212B36] font-normal text-lg">✔</span>}
                      </td>
                      <td className="py-6 px-6 text-center">
                        <Button 
                          variant="grayFilled" 
                          size="sm" 
                          className="px-6 text-white font-bold"
                          onClick={() => setIsPackingListModalOpen(true)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bundle Verification */}
          <div className="space-y-6">
            <SubHeading text="Bundle Verification" />
            <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse min-w-[900px] font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-sm font-medium tracking-wider">
                    <th className="py-4 px-6 w-16">#</th>
                    <th className="py-4 px-6">Bundle ID</th>
                    <th className="py-4 px-6">Parts</th>
                    <th className="py-4 px-6">Weight</th>
                    <th className="py-4 px-6">Packing List Genrated</th>
                    <th className="py-4 px-6">QR Labels Generated</th>
                    <th className="py-4 px-6">Bundles Assigned to Truck</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    { num: 1, id: "BND-001", parts: "STL-B12", weight: "3600 IBS" },
                    { num: 2, id: "BND-002", parts: "STL-B12", weight: "2400 IBS" },
                    { num: 3, id: "BND-003", parts: "STL-A03", weight: "4500 IBS" },
                    { num: 4, id: "BND-004", parts: "STL-B12", weight: "2700 IBS" },
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                      <td className="py-6 px-6 font-normal text-[#212B36]">{row.id}</td>
                      <td className="py-6 px-6 font-normal text-[#919EAB]">{row.parts}</td>
                      <td className="py-6 px-6 font-normal text-[#919EAB]">{row.weight}</td>
                      <td className="py-6 px-6">
                        <img src={CheckIcon} alt="check" className="w-8 h-8" />
                      </td>
                      <td className="py-6 px-6">
                        <img src={CheckIcon} alt="check" className="w-8 h-8" />
                      </td>
                      <td className="py-6 px-6">
                        <img src={CheckIcon} alt="check" className="w-8 h-8" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentStep === 7 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            {/* Load Details Card */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFF4E5] rounded-full flex items-center justify-center text-[#FFAB00]">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-inter font-bold text-[#212B36]">Load Details (Auto-Fill)</h3>
                  <p className="text-sm text-[#637381]">Describe what needs to be transported</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Load Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Primary Steel Frame - 45,000 lbs"
                    className="w-full px-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-inter font-bold text-[#212B36]">
                      Weight <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <Package size={18} />
                        </span>
                        <input
                          type="text"
                          defaultValue="45000"
                          className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                        />
                      </div>
                      <div className="w-24">
                        <CommonDropdown 
                          options={[{ label: "Lbs", value: "Lbs" }, { label: "Kg", value: "Kg" }]}
                          value="Lbs"
                          onChange={() => {}}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-inter font-bold text-[#212B36]">
                      Dimensions
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Ruler size={18} />
                      </span>
                      <input
                        type="text"
                        defaultValue="40' x 8' x 8'"
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Material Type
                  </label>
                  <CommonDropdown 
                    options={[{ label: "Steel & Metal", value: "Steel & Metal" }]}
                    value="Steel & Metal"
                    onChange={() => {}}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pallet / Package Count
                  </label>
                  <CommonDropdown 
                    options={[{ label: "6 Bundles", value: "6 Bundles" }]}
                    value="6 Bundles"
                    onChange={() => {}}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Loading Equipment
                  </label>
                  <CommonDropdown 
                    options={[{ label: "Crain", value: "Crain" }]}
                    value="Crain"
                    onChange={() => {}}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-inter font-bold text-[#212B36]">
                      Bid Deadline
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Clock size={18} />
                      </span>
                      <input
                        type="text"
                        defaultValue="Carriers must respond within 6 hours."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-inter font-bold text-[#212B36]">
                      Document Upload
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Paperclip size={18} />
                      </span>
                      <input
                        type="text"
                        defaultValue="Attachments"
                        className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-sm font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE] text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations Card */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8F1FF] rounded-full flex items-center justify-center text-[#1E51A4]">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-inter font-bold text-[#212B36]">Locations</h3>
                  <p className="text-sm text-[#637381]">Pickup and delivery addresses</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#22C55E]">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g., Steel Mill, Pittsburgh, PA"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#EF4444]">
                      <MapPin size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g., Construction Site, Austin, TX"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Timing Card */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 md:p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center text-[#2E7D32]">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-inter font-bold text-[#212B36]">Timing</h3>
                  <p className="text-sm text-[#637381]">Pickup and delivery schedule</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Pickup Time
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="HH:MM"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-inter font-bold text-[#212B36]">
                    Delivery Time
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Clock size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="HH:MM"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-[#E2E4E6] rounded-xl text-base font-inter focus:outline-none focus:ring-1 focus:ring-[#0043CE]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Select Carriers */}
          <div className="lg:col-span-4 bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E8F1FF] rounded-full flex items-center justify-center text-[#1E51A4]">
                  <Truck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-inter font-bold text-[#212B36]">Select Carriers</h3>
                  <p className="text-xs text-[#637381]">Send bid request to carriers</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-[#E2E4E6] text-gray-500">
                <SlidersHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: "QuickFreight Solutions", rating: 4.8, lastQuote: "$2,850", special: "Steel, Heavy Equipment", onTime: "94%", area: "Texas / Oklahoma", checked: true },
                { name: "National Haulers Inc.", rating: 4.5, lastQuote: "$2,950", special: "General Freight", onTime: "94%", area: "Texas / Oklahoma", checked: true },
                { name: "Regional Transport Co.", rating: 4.2, lastQuote: "$3,100", special: "Regional Delivery", onTime: "94%", area: "Texas / Oklahoma", checked: true },
                { name: "FastFreight Logistics", rating: 4.9, lastQuote: "$3,250", special: "Express Delivery", onTime: "94%", area: "Texas / Oklahoma", checked: false },
              ].map((carrier) => (
                <div 
                  key={carrier.name}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${carrier.checked ? "border-[#0043CE]/20 bg-[#F8F9FB]" : "border-gray-50 bg-white"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${carrier.checked ? "bg-[#0043CE] border-[#0043CE]" : "bg-white border-gray-200"}`}>
                      {carrier.checked && <Check size={12} className="text-white" strokeWidth={4} />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#212B36] text-sm">{carrier.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#FFAB00] font-bold">★ {carrier.rating}</span>
                        <span className="text-[#637381]">Last: {carrier.lastQuote}</span>
                      </div>
                      <p className="text-[11px] text-[#637381] font-medium leading-relaxed">
                        {carrier.special}<br/>
                        On-time rate: {carrier.onTime}<br/>
                        Service Area: {carrier.area}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === 8 && (
        <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-inter font-bold text-[#212B36] mb-2">
              Shipment Dispatched Successfully!
            </h2>
            <p className="text-[#637381] max-w-md mx-auto">
              Your load plan has been finalized and carriers have been notified. Tracking will begin once pickup is confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Dispatch ID", value: "DSP-4402" },
              { label: "Total Shipments", value: "2 Loads" },
              { label: "Estimated Delivery", value: "May 15, 2026" },
            ].map((item) => (
              <div key={item.label} className="bg-[#F8F9FB] p-6 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-[#919EAB] uppercase font-bold tracking-wider mb-1">{item.label}</p>
                <p className="text-xl font-bold text-[#212B36]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-8">
            <h3 className="text-xl font-inter font-bold text-black">Shipment Summary</h3>
            <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
              <table className="w-full text-left border-collapse font-inter">
                <thead>
                  <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                    <th className="py-4 px-6">Load ID</th>
                    <th className="py-4 px-6">Carrier</th>
                    <th className="py-4 px-6">Weight</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {[
                    { id: "LOAD-001", carrier: "Global Logistics Inc.", weight: "36000 IBS", status: "Awaiting Pickup" },
                    { id: "LOAD-002", carrier: "FastWay Freight", weight: "44500 IBS", status: "Awaiting Pickup" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="py-5 px-6 font-bold text-[#212B36]">{row.id}</td>
                      <td className="py-5 px-6 text-[#637381]">{row.carrier}</td>
                      <td className="py-5 px-6 text-[#637381]">{row.weight}</td>
                      <td className="py-5 px-6">
                        <span className="px-3 py-1 bg-[#FFF7CD] text-[#7A4F01] rounded-full text-xs font-bold">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* ── Packing List Details Modal ─────────────────────────────── */}
      {isPackingListModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-[24px] w-full max-w-6xl shadow-2xl relative my-auto p-4 md:p-10">
            {/* Header Actions */}
            <div className="flex flex-wrap justify-between items-start mb-10 gap-4">
              <button
                onClick={() => setIsPackingListModalOpen(false)}
                className="px-6 py-2 bg-white border border-gray-100 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="purpleFilled"
                  size="sm"
                  className="px-6 font-bold"
                >
                  Download PDF
                </Button>
                <Button
                  variant="purpleFilled"
                  size="sm"
                  className="px-6 font-bold"
                >
                  Print Packing List
                </Button>
                <Button
                  variant="purpleFilled"
                  size="sm"
                  className="px-6 font-bold"
                >
                  Export Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
              {/* Load Information */}
              <div>
                <h3 className="text-xl font-bold text-[#212B36] mb-8">
                  Load Information
                </h3>
                <div className="space-y-4">
                  {[
                    { label: "Packing List ID", value: "PKL-001" },
                    { label: "Load ID", value: "LOAD-001" },
                    { label: "Project", value: "Riverside Complex" },
                    { label: "Truck", value: "TX-9876" },
                    { label: "Driver", value: "John Miler" },
                    { label: "Destination", value: "Construction Site A" },
                    { label: "Dispatch Date", value: "April 5" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between border-b border-gray-50 pb-2"
                    >
                      <span className="text-[#637381] font-semibold">
                        {item.label}
                      </span>
                      <span className="text-[#212B36] font-bold text-right">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packing Summary & Verification */}
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-[#212B36] mb-8">
                    Packing Summary
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Total Bundles", value: "3" },
                      { label: "Total Items", value: "150" },
                      { label: "Total weight", value: "36,000 lbs" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between border-b border-gray-50 pb-2"
                      >
                        <span className="text-[#637381] font-semibold">
                          {item.label}
                        </span>
                        <span className="text-[#212B36] font-bold text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#212B36] mb-8">
                    Loading Verification
                  </h3>
                  <div className="space-y-5 max-w-sm">
                    {[
                      "All Bundles Present",
                      "QR Labels Verified",
                      "Packing List Matches Load",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex justify-between items-center"
                      >
                        <span className="text-[#212B36] font-semibold">
                          {item}
                        </span>
                        <div className="w-6 h-6 bg-[#6366F1] rounded-md flex items-center justify-center">
                          <Check
                            size={14}
                            className="text-white"
                            strokeWidth={4}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bundle List */}
            <div>
              <h3 className="text-xl font-bold text-[#212B36] mb-6">
                Bundle List
              </h3>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left border-collapse font-inter min-w-[800px]">
                  <thead>
                    <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                      <th className="py-4 px-6 w-16">#</th>
                      <th className="py-4 px-6">Bundle ID</th>
                      <th className="py-4 px-6">Part Number</th>
                      <th className="py-4 px-6">Quantity</th>
                      <th className="py-4 px-6">Length</th>
                      <th className="py-4 px-6">Weight</th>
                      <th className="py-4 px-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {[
                      {
                        id: "BND-001",
                        num: 1,
                        part: "STL-B12",
                        qty: 20,
                        len: "20ft",
                        weight: "3600 IBS",
                        status: "Verified",
                      },
                      {
                        id: "BND-002",
                        num: 2,
                        part: "STL-B12",
                        qty: 30,
                        len: "30ft",
                        weight: "2400 IBS",
                        status: "Verified",
                      },
                      {
                        id: "BND-003",
                        num: 3,
                        part: "STL-B12",
                        qty: 100,
                        len: "20ft",
                        weight: "4500 IBS",
                        status: "Verified",
                      },
                      {
                        id: "BND-004",
                        num: 4,
                        part: "STL-B12",
                        qty: 20,
                        len: "15ft",
                        weight: "2700 IBS",
                        status: "Pending",
                      },
                    ].map((bundle) => (
                      <tr key={bundle.id} className="hover:bg-gray-50/50">
                        <td className="py-6 px-6 font-normal text-gray-400">
                          {bundle.num}
                        </td>
                        <td className="py-6 px-6 font-bold text-[#212B36]">
                          {bundle.id}
                        </td>
                        <td className="py-6 px-6 font-normal text-[#919EAB]">
                          {bundle.part}
                        </td>
                        <td className="py-6 px-6 font-normal text-[#919EAB]">
                          {bundle.qty}
                        </td>
                        <td className="py-6 px-6 font-normal text-[#919EAB]">
                          {bundle.len}
                        </td>
                        <td className="py-6 px-6 font-normal text-[#919EAB]">
                          {bundle.weight}
                        </td>
                        <td className="py-6 px-6 font-normal text-[#637381]">
                          {bundle.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartLoadPlanningView;
