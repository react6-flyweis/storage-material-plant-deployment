import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FreightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

const FreightFilterModal: React.FC<FreightFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    deliveries: "all",
    project: "",
    deliveryType: "",
    colorStatus: "",
    vendor: "",
    siteLocation: "",
    priority: "",
    internalOwner: "",
    status: "",
    delivery: "",
    channel: "",
  });

  if (!isOpen) return null;

  const dropdownOptions = [
    { label: "Option 1", value: "1" },
    { label: "Option 2", value: "2" },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[1100px]">
      <div className="p-3 md:p-2 space-y-6 font-inter">
        {/* Header */}
        <h2 className="text-xl md:text-3xl font-semibold text-[#212B36] text-center">Filters</h2>

        <div className="space-y-4">
          {/* Row 1: Date Range & Top Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-white h-11">
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="text-base md:text-lg font-semibold text-[#212B36] min-w-[140px] text-center">March 2024</span>
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <CommonDropdown 
              value={filters.deliveries}
              onChange={(v) => handleFilterChange("deliveries", v)}
              options={[{ label: "All Deliveries", value: "all" }, ...dropdownOptions]}
              placeholder="All Deliveries"
              className="min-w-[180px]"
            />
            <CommonDropdown 
              value={filters.project}
              onChange={(v) => handleFilterChange("project", v)}
              options={dropdownOptions}
              placeholder="Project"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.deliveryType}
              onChange={(v) => handleFilterChange("deliveryType", v)}
              options={dropdownOptions}
              placeholder="Delivery Type"
              className="min-w-[200px]"
            />
            <CommonDropdown 
              value={filters.colorStatus}
              onChange={(v) => handleFilterChange("colorStatus", v)}
              options={dropdownOptions}
              placeholder="Color by Status"
              className="min-w-[220px]"
            />
          </div>

          {/* Row 2: Secondary Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CommonDropdown 
              value={filters.vendor}
              onChange={(v) => handleFilterChange("vendor", v)}
              options={dropdownOptions}
              placeholder="Vendor"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.siteLocation}
              onChange={(v) => handleFilterChange("siteLocation", v)}
              options={dropdownOptions}
              placeholder="Site Location"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.priority}
              onChange={(v) => handleFilterChange("priority", v)}
              options={dropdownOptions}
              placeholder="Priority"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.internalOwner}
              onChange={(v) => handleFilterChange("internalOwner", v)}
              options={dropdownOptions}
              placeholder="Internal Owner"
              className="min-w-[220px]"
            />
          </div>

          {/* Row 3: Final Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CommonDropdown 
              value={filters.status}
              onChange={(v) => handleFilterChange("status", v)}
              options={dropdownOptions}
              placeholder="Status"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.delivery}
              onChange={(v) => handleFilterChange("delivery", v)}
              options={dropdownOptions}
              placeholder="Delivery"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.channel}
              onChange={(v) => handleFilterChange("channel", v)}
              options={[{ label: "Email", value: "email" }, { label: "SMS", value: "sms" }, { label: "Voice", value: "voice" }]}
              placeholder="Channel"
              className="min-w-[220px]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="gradient"
            onClick={() => onApply?.(filters)}
            size="xl"
          >
            Apply
          </Button>
        </div>
      </div>

      <style>{`
        /* Refined Modal Dropdown Styling */
        .min-w-[180px] button, 
        .min-w-[200px] button, 
        .min-w-[220px] button {
          background-color: white !important;
          border-radius: 12px !important;
          height: 52px !important;
          border-color: #F4F6F8 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        .min-w-[180px] span, 
        .min-w-[200px] span, 
        .min-w-[220px] span {
          font-size: 16px !important;
          color: #212B36 !important;
          font-weight: 500 !important;
        }
      `}</style>
    </Modal>
  );
};

export default FreightFilterModal;
