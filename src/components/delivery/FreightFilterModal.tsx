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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const projectOptions = [
    { label: "Project", value: "" },
    { label: "Storage Facility B", value: "1" },
    { label: "Industrial Complex A", value: "2" },
    { label: "Warehouse Complex", value: "3" },
  ];

  const deliveryTypeOptions = [
    { label: "Delivery Type", value: "" },
    { label: "Flatbed", value: "1" },
    { label: "Box Truck", value: "2" },
    { label: "Refrigerated", value: "3" },
  ];

  const colorStatusOptions = [
    { label: "Color by Status", value: "" },
    { label: "Ready", value: "1" },
    { label: "Pending", value: "2" },
    { label: "Delayed", value: "3" },
  ];

  const vendorOptions = [
    { label: "Vendor", value: "" },
    { label: "ABC Steel", value: "1" },
    { label: "Metro Steel", value: "2" },
    { label: "Steel Works LTD", value: "3" },
  ];

  const siteLocationOptions = [
    { label: "Site Location", value: "" },
    { label: "Dallas, TX", value: "1" },
    { label: "San Antonio, TX", value: "2" },
    { label: "Houston, TX", value: "3" },
  ];

  const priorityOptions = [
    { label: "Priority", value: "" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  const internalOwnerOptions = [
    { label: "Internal Owner", value: "" },
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
    { label: "Michael Brown", value: "3" },
  ];

  const statusOptions = [
    { label: "Status", value: "" },
    { label: "Awarded", value: "awarded" },
    { label: "Requested", value: "requested" },
    { label: "Bids Received", value: "bids_received" },
  ];

  const deliveryOptions = [
    { label: "Delivery", value: "" },
    { label: "Delivered", value: "delivered" },
    { label: "In Transit", value: "in_transit" },
    { label: "Pending", value: "pending" },
  ];

  const channelOptions = [
    { label: "Channel", value: "" },
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
    { label: "Voice", value: "voice" },
  ];

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
              options={[{ label: "All Deliveries", value: "all" }, { label: "My Deliveries", value: "my" }, { label: "Shared Deliveries", value: "shared" }]}
              placeholder="All Deliveries"
              className="min-w-[180px]"
            />
            <CommonDropdown 
              value={filters.project}
              onChange={(v) => handleFilterChange("project", v)}
              options={projectOptions}
              placeholder="Project"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.deliveryType}
              onChange={(v) => handleFilterChange("deliveryType", v)}
              options={deliveryTypeOptions}
              placeholder="Delivery Type"
              className="min-w-[200px]"
            />
            <CommonDropdown 
              value={filters.colorStatus}
              onChange={(v) => handleFilterChange("colorStatus", v)}
              options={colorStatusOptions}
              placeholder="Color by Status"
              className="min-w-[220px]"
            />
          </div>

          {/* Row 2: Secondary Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CommonDropdown 
              value={filters.vendor}
              onChange={(v) => handleFilterChange("vendor", v)}
              options={vendorOptions}
              placeholder="Vendor"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.siteLocation}
              onChange={(v) => handleFilterChange("siteLocation", v)}
              options={siteLocationOptions}
              placeholder="Site Location"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.priority}
              onChange={(v) => handleFilterChange("priority", v)}
              options={priorityOptions}
              placeholder="Priority"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.internalOwner}
              onChange={(v) => handleFilterChange("internalOwner", v)}
              options={internalOwnerOptions}
              placeholder="Internal Owner"
              className="min-w-[220px]"
            />
          </div>

          {/* Row 3: Final Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CommonDropdown 
              value={filters.status}
              onChange={(v) => handleFilterChange("status", v)}
              options={statusOptions}
              placeholder="Status"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.delivery}
              onChange={(v) => handleFilterChange("delivery", v)}
              options={deliveryOptions}
              placeholder="Delivery"
              className="min-w-[220px]"
            />
            <CommonDropdown 
              value={filters.channel}
              onChange={(v) => handleFilterChange("channel", v)}
              options={channelOptions}
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
