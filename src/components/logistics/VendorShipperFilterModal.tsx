import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";

interface FilterOption {
  label: string;
  value: string;
}

interface VendorShipperFilterValues {
  materialType: string;
}

interface VendorShipperFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: VendorShipperFilterValues) => void;
  materialTypeOptions: FilterOption[];
}

const VendorShipperFilterModal: React.FC<VendorShipperFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  materialTypeOptions,
}) => {
  const [filters, setFilters] = useState<VendorShipperFilterValues>({
    materialType: "",
  });

  if (!isOpen) return null;

  const handleFilterChange = (
    key: keyof VendorShipperFilterValues,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-2xl">
      <div className="p-3 md:p-2 space-y-6 font-inter">
        <h2 className="text-xl md:text-3xl font-semibold text-[#212B36] text-center">
          Vendor / Shipper Filters
        </h2>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-white h-11">
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span
                className="text-base md:text-lg font-semibold text-[#212B36] text-center"
                style={{ minWidth: 140 }}
              >
                March 2024
              </span>
              <button className="text-[#637381] hover:text-[#212B36] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <CommonDropdown
              value={filters.materialType}
              onChange={(value) => handleFilterChange("materialType", value)}
              options={materialTypeOptions}
              placeholder="Material Type"
              className="vendor-shipper-material-type"
            />
          </div>
        </div>

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
    </Modal>
  );
};

export default VendorShipperFilterModal;
