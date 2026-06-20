import React, { useState, useMemo } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPlantProjectsQuery, useGetCustomersQuery } from "@/redux/api/projectApi";
import { useGetPlantCarriersQuery } from "@/redux/api/logisticsApi";

export interface FreightFilters {
  projectId?: string;
  customerId?: string;
  carrierId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

interface FreightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FreightFilters) => void;
  initialFilters?: FreightFilters;
}

const FreightFilterModal: React.FC<FreightFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FreightFilters>({
    projectId: initialFilters?.projectId || "",
    customerId: initialFilters?.customerId || "",
    carrierId: initialFilters?.carrierId || "",
    status: initialFilters?.status || "",
  });

  const [currentDate, setCurrentDate] = useState(() => {
    if (initialFilters?.fromDate) {
      const d = new Date(initialFilters.fromDate + "T00:00:00");
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
    return new Date();
  });

  const { data: projectsData } = useGetPlantProjectsQuery({ limit: 100 }, { skip: !isOpen });
  const { data: carriersData } = useGetPlantCarriersQuery({ limit: 100 }, { skip: !isOpen });
  const { data: customersData } = useGetCustomersQuery({ limit: 100 }, { skip: !isOpen });

  const handleFilterChange = (key: keyof FreightFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthLabel = currentDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const projectOptions = useMemo(() => {
    const options = [{ label: "All Projects", value: "" }];
    if (projectsData?.projects) {
      projectsData.projects.forEach((p) => {
        options.push({ label: p.projectName, value: p._id });
      });
    }
    return options;
  }, [projectsData]);

  const carrierOptions = useMemo(() => {
    const options = [{ label: "All Carriers", value: "" }];
    if (carriersData?.carriers) {
      carriersData.carriers.forEach((c) => {
        options.push({ label: c.carrierName, value: c._id });
      });
    }
    return options;
  }, [carriersData]);

  const customerOptions = useMemo(() => {
    const options = [{ label: "All Customers", value: "" }];
    if (customersData?.customers) {
      customersData.customers.forEach((c) => {
        const fullName = `${c.firstName} ${c.lastName}`.trim();
        options.push({ label: fullName, value: c._id });
      });
    }
    return options;
  }, [customersData]);

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Awarded", value: "awarded" },
    { label: "Requested", value: "requested" },
    { label: "Bids Received", value: "bids_received" },
    { label: "In Transit", value: "in_transit" },
    { label: "Delivered", value: "delivered" },
  ];

  const handleApply = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Start of the month in local YYYY-MM-DD
    const pad = (n: number) => String(n).padStart(2, "0");
    const fromDateStr = `${year}-${pad(month + 1)}-01`;
    // End of the month
    const lastDay = new Date(year, month + 1, 0).getDate();
    const toDateStr = `${year}-${pad(month + 1)}-${pad(lastDay)}`;

    onApply?.({
      ...filters,
      fromDate: fromDateStr,
      toDate: toDateStr,
    });
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[750px]" overflowVisible>
      <div className="p-4 md:p-6 space-y-6 font-inter">
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-[#212B36] text-center">
          Filters
        </h2>

        <div className="space-y-6">
          {/* Old Date Selector UI */}
          <div className="flex items-center justify-center gap-6 py-3">
            <button
              onClick={handlePrevMonth}
              className="text-[#637381] hover:text-[#212B36] transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-lg md:text-xl font-semibold text-[#212B36] min-w-[160px] text-center select-none">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-[#637381] hover:text-[#212B36] transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dropdowns Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommonDropdown
              label="Project"
              value={filters.projectId || ""}
              onChange={(v) => handleFilterChange("projectId", v)}
              options={projectOptions}
              placeholder="Select Project"
            />
            <CommonDropdown
              label="Customer"
              value={filters.customerId || ""}
              onChange={(v) => handleFilterChange("customerId", v)}
              options={customerOptions}
              placeholder="Select Customer"
            />
            <CommonDropdown
              label="Carrier"
              value={filters.carrierId || ""}
              onChange={(v) => handleFilterChange("carrierId", v)}
              options={carrierOptions}
              placeholder="Select Carrier"
            />
            <CommonDropdown
              label="Status"
              value={filters.status || ""}
              onChange={(v) => handleFilterChange("status", v)}
              options={statusOptions}
              placeholder="Select Status"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="white" onClick={onClose} size="md">
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleApply}
            size="md"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FreightFilterModal;
