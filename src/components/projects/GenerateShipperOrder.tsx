import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, Send, X, Truck } from "lucide-react";
import { customersData } from "@/data/productionMockData";
import Heading from "../common_component/Heading";
import Button from "../common_component/Button";
import BOMListContent from "./BOMListContent";

import SuccessModal from "../common_component/SuccessModal";
import AddShipperMailModal from "./AddShipperMailModal";

const shippersMockData = [
  { id: 1, name: "Steel Investments", rating: 4.8, serviceArea: "Texas / Oklahoma", selected: true },
  { id: 2, name: "DBA Storage Materials", rating: 4.5, serviceArea: "Texas / Oklahoma", selected: true },
  { id: 3, name: "Steel Investments", rating: 4.2, serviceArea: "Texas / Oklahoma", selected: false },
  { id: 4, name: "DBA Storage Materials", rating: 4.9, serviceArea: "Texas / Oklahoma", selected: false },
];

const GenerateShipperOrder: React.FC = () => {
  const navigate = useNavigate();
  const { customerId, projectId } = useParams();
  const [shippers, setShippers] = useState(shippersMockData);
  const [newShipperEmails, setNewShipperEmails] = useState(["steelinvestment@gmail.com"]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isAddShipperModalOpen, setIsAddShipperModalOpen] = useState(false);
  const [isAddSuccessOpen, setIsAddSuccessOpen] = useState(false);

  const customer = customersData[customerId || ""] || customersData["ID-2025-1047"];
  const project = customer?.projects.find((p) => p.id === projectId) || customer?.projects[0];

  const bomData = {
    id: "BOM-001",
    projectName: project?.name || "ABC Construction",
    customerName: customer?.name || "John Doe",
    date: "01.09.26",
    jobId: "BLDG-D",
    summary: {
      totalItems: 125,
      totalWeight: "32,000 lbs",
      totalPanelsArea: "3,300 sqm",
    },
    items: [
      { qty: 12, mark: "S-10", description: "STUD", part: "C42516", color: "RO", angle: "90°", thick: "16 GA", length: "10'-2\"", weight: "24.50" },
      { qty: 5, mark: "S-1", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 25, mark: "S-5", description: "STUD", part: "C42516", color: "RO", angle: "45°", thick: "18 GA", length: "12'-0\"", weight: "42.00" },
      { qty: 8, mark: "S-2", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 15, mark: "S-8", description: "STUD", part: "C42516", color: "RO", angle: "30°", thick: "14 GA", length: "9'-6\"", weight: "35.20" },
      { qty: 6, mark: "S-3", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 2, mark: "S-9", description: "STUD", part: "C42516", color: "RO", angle: "90°", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 4, mark: "S-4", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
    ],
  };

  const toggleShipper = (id: number) => {
    setShippers(shippers.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const handleAddShipperMail = (data: { email: string }) => {
    if (data.email && !newShipperEmails.includes(data.email)) {
      setNewShipperEmails([...newShipperEmails, data.email]);
    }
    setIsAddShipperModalOpen(false);
    setIsAddSuccessOpen(true);
  };

  const removeEmail = (email: string) => {
    setNewShipperEmails(newShipperEmails.filter(e => e !== email));
  };

  const handleSendOrder = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
          <Heading text="Generate Shipper Order" />
        </div>

        <Button 
          variant="gradient"
          size="md"
          className="flex items-center gap-2"
          onClick={handleSendOrder}
        >
          <Send size={18} /> Send Order
        </Button>
      </div>

      {/* Select Shipper Card */}
      <div className="bg-white rounded-[16px] md:rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-[#EBF1FF] flex items-center justify-center flex-shrink-0">
              <Truck className="size-6 text-[#1E51A4]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#212B36]">Select Shipper</h3>
              <p className="text-sm text-[#637381]">Send Material Request to Shipper</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 lg:justify-end">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Shippers"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400"
              />
            </div>
            <Button 
              variant="grayFilled" 
              size="sm" 
              onClick={() => setIsAddShipperModalOpen(true)}
            >
              Add new Shipper Mail
            </Button> 
          </div>
        </div>

        {/* Shippers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {shippers.map((shipper) => (
            <div 
              key={shipper.id}
              onClick={() => toggleShipper(shipper.id)}
              className={`p-5 rounded-[12px] border-2 transition-all cursor-pointer flex flex-col gap-3 ${
                shipper.selected ? "border-[#3AB449] bg-white" : "border-[#E2E4E6] bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`size-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  shipper.selected ? "bg-[#3AB449] border-[#3AB449]" : "border-gray-300 bg-white"
                }`}>
                  {shipper.selected && (
                    <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-white" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#212B36] text-sm md:text-base leading-tight">{shipper.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[#FF9409] text-xs font-bold">★ {shipper.rating}</span>
                      <span className="text-gray-300 text-xs">•</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[11px] md:text-xs text-[#637381] font-medium ml-8">Service Area: {shipper.serviceArea}</p>
            </div>
          ))}
        </div>

        {/* New Shippers Tags */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#212B36]">New Shippers</h4>
          <div className="flex flex-wrap gap-3">
            {newShipperEmails.map((email) => (
              <div key={email} className="flex items-center gap-2.5 px-4 py-2 bg-[#F4F6F8] border border-gray-100 rounded-lg text-sm font-semibold text-[#212B36] shadow-sm">
                {email}
                <button onClick={(e) => { e.stopPropagation(); removeEmail(email); }} className="text-[#919EAB] hover:text-[#212B36] transition-colors">
                  <div className="size-4 bg-[#919EAB]/20 rounded-full flex items-center justify-center">
                    <X size={10} strokeWidth={3} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOM Content Section */}
      <BOMListContent bomData={bomData} />

      {/* Main Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate(-1);
        }}
        title="Order Sent Successfully"
        subTitle="Material Request has been sent to selected shippers."
      />

      {/* Add Shipper Mail Modal */}
      <AddShipperMailModal 
        isOpen={isAddShipperModalOpen}
        onClose={() => setIsAddShipperModalOpen(false)}
        onAdd={handleAddShipperMail}
      />

      {/* Add Email Success Modal */}
      <SuccessModal 
        isOpen={isAddSuccessOpen}
        onClose={() => setIsAddSuccessOpen(false)}
        title="Shipper Mail Added in the Order"
        subTitle="After Shipper/vendor processes the order, they prepare the actual shipment. Then they send the shipper file."
        isLogoBottom={false}
      />
    </div>
  );
};

export default GenerateShipperOrder;


