import React, { useState, useMemo, useEffect } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type FreightLoadFiltersData,
  useGetFreightLoadFiltersQuery,
  useGetAwardedLoadFiltersQuery,
} from "@/redux/api/deliveriesApi";

export interface FreightFilters {
  projectId?: string;
  customerId?: string;
  carrierId?: string;
  status?: string;
  materialType?: string;
  siteLocation?: string;
  fromDate?: string;
  toDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface FreightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FreightFilters) => void;
  initialFilters?: FreightFilters;
  filtersData?: FreightLoadFiltersData;
  screenType?: "freight" | "awarded";
}

export const BID_STATUS_LABELS: Record<string, string> = {
  sent: "Sent",
  submitted: "Submitted",
  resubmit_requested: "Resubmit requested",
  selected: "Selected / Awarded",
  rejected: "Rejected",
  expired: "Expired",
};

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  bidding_sent: "Bidding sent",
  carrier_selected: "Carrier selected",
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  material_prepared: "Material prepared",
  loaded: "Loaded",
  picked_up: "Picked up",
  in_transit: "In transit",
  staged: "Staged",
  dispatched_to_site: "Dispatched to site",
  delivered: "Delivered",
  partial_received: "Partial received",
  received: "Received",
  delayed: "Delayed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};

export const formatStatusLabel = (status: string): string => {
  if (!status) return "";
  if (BID_STATUS_LABELS[status]) return BID_STATUS_LABELS[status];
  if (DELIVERY_STATUS_LABELS[status]) return DELIVERY_STATUS_LABELS[status];
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const FreightFilterModal: React.FC<FreightFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
  filtersData: passedFiltersData,
  screenType = "freight",
}) => {
  // Query filters as fallback if not passed directly from parent
  const { data: freightApiFilters } = useGetFreightLoadFiltersQuery(undefined, {
    skip: !isOpen || Boolean(passedFiltersData) || screenType === "awarded",
  });
  const { data: awardedApiFilters } = useGetAwardedLoadFiltersQuery(undefined, {
    skip: !isOpen || Boolean(passedFiltersData) || screenType !== "awarded",
  });

  const activeFiltersData: FreightLoadFiltersData | undefined =
    passedFiltersData || (screenType === "awarded" ? awardedApiFilters : freightApiFilters);

  const [filters, setFilters] = useState<FreightFilters>({
    projectId: initialFilters?.projectId || "",
    customerId: initialFilters?.customerId || "",
    carrierId: initialFilters?.carrierId || "",
    status: initialFilters?.status || "",
    materialType: initialFilters?.materialType || "",
    siteLocation: initialFilters?.siteLocation || "",
  });

  const [currentDate, setCurrentDate] = useState<Date | null>(() => {
    const rawDate = initialFilters?.fromDate || initialFilters?.startDate;
    if (rawDate) {
      const d = new Date(rawDate.includes("T") ? rawDate : `${rawDate}T00:00:00`);
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
    return null;
  });

  // Keep local state in sync when initialFilters changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters({
        projectId: initialFilters?.projectId || "",
        customerId: initialFilters?.customerId || "",
        carrierId: initialFilters?.carrierId || "",
        status: initialFilters?.status || "",
        materialType: initialFilters?.materialType || "",
        siteLocation: initialFilters?.siteLocation || "",
      });

      const rawDate = initialFilters?.fromDate || initialFilters?.startDate;
      if (rawDate) {
        const d = new Date(rawDate.includes("T") ? rawDate : `${rawDate}T00:00:00`);
        if (!isNaN(d.getTime())) {
          setCurrentDate(d);
          return;
        }
      }
      setCurrentDate(null);
    }
  }, [isOpen, initialFilters]);

  const handleFilterChange = (key: keyof FreightFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const base = prev || new Date();
      return new Date(base.getFullYear(), base.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const base = prev || new Date();
      return new Date(base.getFullYear(), base.getMonth() + 1, 1);
    });
  };

  const monthLabel = currentDate
    ? currentDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "All Dates";

  // Project options
  const projectOptions = useMemo(() => {
    const options = [{ label: "All Projects", value: "" }];
    if (activeFiltersData?.projects) {
      activeFiltersData.projects.forEach((p) => {
        const label = p.projectName
          ? p.jobId
            ? `${p.projectName} (${p.jobId})`
            : p.projectName
          : p.jobId || p._id;
        options.push({ label, value: p._id });
      });
    }
    return options;
  }, [activeFiltersData?.projects]);

  // Customer options
  const customerOptions = useMemo(() => {
    const options = [{ label: "All Customers", value: "" }];
    if (activeFiltersData?.customers) {
      activeFiltersData.customers.forEach((c) => {
        options.push({ label: c.name || "Customer", value: c._id });
      });
    }
    return options;
  }, [activeFiltersData?.customers]);

  // Carrier options
  const carrierOptions = useMemo(() => {
    const options = [{ label: "All Carriers", value: "" }];
    if (activeFiltersData?.carriers) {
      activeFiltersData.carriers.forEach((c) => {
        options.push({ label: c.carrierName || "Carrier", value: c._id });
      });
    }
    return options;
  }, [activeFiltersData?.carriers]);

  // Status options (Awarded screen uses deliveryStatuses; Freight screen uses bidStatuses & deliveryStatuses)
  const statusOptions = useMemo(() => {
    const options = [{ label: "All Statuses", value: "" }];
    const statusList =
      screenType === "awarded"
        ? activeFiltersData?.deliveryStatuses || [
            "scheduled",
            "confirmed",
            "material_prepared",
            "loaded",
            "picked_up",
            "in_transit",
            "staged",
            "dispatched_to_site",
            "delivered",
            "delayed",
            "cancelled",
            "rescheduled",
          ]
        : Array.from(
            new Set([
              ...(activeFiltersData?.bidStatuses || activeFiltersData?.statuses || [
                "sent",
                "submitted",
                "resubmit_requested",
                "selected",
                "rejected",
                "expired",
              ]),
              ...(activeFiltersData?.deliveryStatuses || []),
            ])
          );

    statusList.forEach((st) => {
      if (st) {
        options.push({
          label: formatStatusLabel(st),
          value: st,
        });
      }
    });
    return options;
  }, [screenType, activeFiltersData?.bidStatuses, activeFiltersData?.statuses, activeFiltersData?.deliveryStatuses]);

  // Material type options
  const materialTypeOptions = useMemo(() => {
    const options = [{ label: "All Material Types", value: "" }];
    if (activeFiltersData?.materialTypes) {
      activeFiltersData.materialTypes.forEach((m) => {
        if (m) options.push({ label: m, value: m });
      });
    }
    return options;
  }, [activeFiltersData?.materialTypes]);

  // Site location options
  const siteLocationOptions = useMemo(() => {
    const options = [{ label: "All Site Locations", value: "" }];
    if (activeFiltersData?.siteLocations) {
      activeFiltersData.siteLocations.forEach((loc) => {
        if (loc) options.push({ label: loc, value: loc });
      });
    }
    return options;
  }, [activeFiltersData?.siteLocations]);

  const handleApply = () => {
    let fromDateStr: string | undefined;
    let toDateStr: string | undefined;
    let startDateStr: string | undefined;
    let endDateStr: string | undefined;

    if (currentDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const pad = (n: number) => String(n).padStart(2, "0");
      fromDateStr = `${year}-${pad(month + 1)}-01`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      toDateStr = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
      startDateStr = `${fromDateStr}T00:00:00.000Z`;
      endDateStr = `${toDateStr}T23:59:59.999Z`;
    }

    const cleanFilters: FreightFilters = {};
    if (filters.projectId) cleanFilters.projectId = filters.projectId;
    if (filters.customerId) cleanFilters.customerId = filters.customerId;
    if (filters.carrierId) cleanFilters.carrierId = filters.carrierId;
    if (filters.status) cleanFilters.status = filters.status;
    if (filters.materialType) cleanFilters.materialType = filters.materialType;
    if (filters.siteLocation) cleanFilters.siteLocation = filters.siteLocation;
    if (fromDateStr) {
      cleanFilters.fromDate = fromDateStr;
      cleanFilters.toDate = toDateStr;
      cleanFilters.startDate = startDateStr;
      cleanFilters.endDate = endDateStr;
    }

    onApply?.(cleanFilters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters: FreightFilters = {
      projectId: "",
      customerId: "",
      carrierId: "",
      status: "",
      materialType: "",
      siteLocation: "",
    };
    setFilters(emptyFilters);
    setCurrentDate(null);
    onApply?.({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[750px]" overflowVisible>
      <div className="p-4 md:p-6 space-y-6 font-inter">
        {/* Header */}
        <h2 className="text-xl md:text-2xl font-bold text-[#212B36] text-center">
          {screenType === "awarded" ? "Awarded Loads Filters" : "Freight Loads Filters"}
        </h2>

        <div className="space-y-6">
          {/* Date Selector UI */}
          <div className="flex flex-col items-center justify-center gap-1 py-2 bg-gray-50/70 rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!currentDate}
                className={`p-2 rounded-full transition-colors ${
                  currentDate
                    ? "text-[#637381] hover:text-[#212B36] hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title="Previous Month"
              >
                <ChevronLeft size={22} />
              </button>
              <span className="text-base md:text-lg font-semibold text-[#212B36] min-w-[170px] text-center select-none">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!currentDate}
                className={`p-2 rounded-full transition-colors ${
                  currentDate
                    ? "text-[#637381] hover:text-[#212B36] hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title="Next Month"
              >
                <ChevronRight size={22} />
              </button>
            </div>
            <div>
              {currentDate ? (
                <button
                  type="button"
                  onClick={() => setCurrentDate(null)}
                  className="text-xs text-[#1E51A4] hover:underline font-medium"
                >
                  Clear date filter (show all dates)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentDate(new Date())}
                  className="text-xs text-[#1E51A4] hover:underline font-medium"
                >
                  Filter by specific month
                </button>
              )}
            </div>
          </div>

          {/* Dropdowns Grid */}
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
            <CommonDropdown
              label="Material Type"
              value={filters.materialType || ""}
              onChange={(v) => handleFilterChange("materialType", v)}
              options={materialTypeOptions}
              placeholder="Select Material Type"
            />
            <CommonDropdown
              label="Site Location"
              value={filters.siteLocation || ""}
              onChange={(v) => handleFilterChange("siteLocation", v)}
              options={siteLocationOptions}
              placeholder="Select Site Location"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button variant="white" onClick={handleReset} size="md">
            Reset All
          </Button>
          <div className="flex gap-3">
            <Button variant="white" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleApply} size="md">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FreightFilterModal;
