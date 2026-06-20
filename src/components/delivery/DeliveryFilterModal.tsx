import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DeliveryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: any) => void;
}

const DeliveryFilterModal: React.FC<DeliveryFilterModalProps> = ({
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
    carrier: "",
    siteLocation: "",
    priority: "",
    internalOwner: "",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const deliveryOptions = [
    { label: "All Deliveries", value: "all" },
    { label: "Scheduled", value: "scheduled" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Delivered", value: "delivered" },
  ];

  const projectOptions = Array.from({ length: 7 }, (_, i) => ({
    label: `Project ${i + 1}`,
    value: `project-${i + 1}`,
  }));

  const deliveryTypeOptions = [
    { label: "Primary Steel", value: "primary" },
    { label: "Secondary Steel", value: "secondary" },
    { label: "Doors", value: "doors" },
    { label: "Trim", value: "trim" },
    { label: "Insulation", value: "insulation" },
    { label: "Screws", value: "screws" },
    { label: "Hardware", value: "hardware" },
  ];

  const colorOptions = [
    { label: "Color by Status", value: "status" },
    { label: "Color by Material Type", value: "material" },
    { label: "Color by Project", value: "project" },
  ];

  const vendorOptions = Array.from({ length: 4 }, (_, i) => ({
    label: `Vendor ${i + 1}`,
    value: `vendor-${i + 1}`,
  }));

  const carrierOptions = Array.from({ length: 4 }, (_, i) => ({
    label: `Carrier ${i + 1}`,
    value: `carrier-${i + 1}`,
  }));

  const locationOptions = Array.from({ length: 4 }, (_, i) => ({
    label: `Site Location ${i + 1}`,
    value: `location-${i + 1}`,
  }));

  const priorityOptions = [
    { label: "High", value: "high" },
    { label: "Normal", value: "normal" },
    { label: "Critical", value: "critical" },
  ];

  const ownerOptions = Array.from({ length: 3 }, (_, i) => ({
    label: `Owner Name`,
    value: `owner-${i + 1}`,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[1100px]" overflowVisible>
      <div className="p-4 md:p-6 space-y-8 font-inter">
        {/* Title */}
        <h2 className="text-3xl font-bold text-[#212B36] text-center">Filters</h2>

        <div className="space-y-6">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Date Selector */}
            <div className="flex items-center gap-4 px-4 h-[52px] rounded-lg bg-white border border-[#F4F6F8] shadow-xs">
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="text-base lg:text-lg font-semibold text-[#212B36] min-w-[120px] text-center">
                March 2024
              </span>
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <CommonDropdown
              value={filters.deliveries}
              onChange={(v) => handleFilterChange("deliveries", v)}
              options={deliveryOptions}
              placeholder="All Deliveries"
              className="min-w-[180px]"
            />
            <CommonDropdown
              value={filters.project}
              onChange={(v) => handleFilterChange("project", v)}
              options={projectOptions}
              placeholder="Project"
              className="min-w-[200px]"
            />
            <CommonDropdown
              value={filters.deliveryType}
              onChange={(v) => handleFilterChange("deliveryType", v)}
              options={deliveryTypeOptions}
              placeholder="Delivery Type"
              className="min-w-[190px]"
            />
            <CommonDropdown
              value={filters.colorStatus}
              onChange={(v) => handleFilterChange("colorStatus", v)}
              options={colorOptions}
              placeholder="Color by Status"
              className="min-w-[200px]"
            />
          </div>

          {/* Row 2 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CommonDropdown
              value={filters.vendor}
              onChange={(v) => handleFilterChange("vendor", v)}
              options={vendorOptions}
              placeholder="Vendor"
              className="min-w-[180px]"
            />
            <CommonDropdown
              value={filters.carrier}
              onChange={(v) => handleFilterChange("carrier", v)}
              options={carrierOptions}
              placeholder="Carrier"
              className="min-w-[180px]"
            />
            <CommonDropdown
              value={filters.siteLocation}
              onChange={(v) => handleFilterChange("siteLocation", v)}
              options={locationOptions}
              placeholder="Site Location"
              className="min-w-[180px]"
            />
            <CommonDropdown
              value={filters.priority}
              onChange={(v) => handleFilterChange("priority", v)}
              options={priorityOptions}
              placeholder="Priority"
              className="min-w-[180px]"
            />
            <CommonDropdown
              value={filters.internalOwner}
              onChange={(v) => handleFilterChange("internalOwner", v)}
              options={ownerOptions}
              placeholder="Internal Owner"
              className="min-w-[180px]"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <Button
            variant="blueFilled"
            size="md"
            onClick={() => onApply?.(filters)}
            className="rounded-xl"
          >
            Apply
          </Button>
        </div>
      </div>

      <style>{`
        /* Styling to match the high-fidelity design */
        .min-w-[180px] button, 
        .min-w-[190px] button, 
        .min-w-[200px] button {
          background-color: white !important;
          border-radius: 12px !important;
          height: 52px !important;
          border-color: #F4F6F8 !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .min-w-[180px] span, 
        .min-w-[190px] span, 
        .min-w-[200px] span {
          font-size: 15px !important;
          color: #212B36 !important;
          font-weight: 500 !important;
        }
      `}</style>
    </Modal>
  );
};

export default DeliveryFilterModal;
