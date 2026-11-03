import React, { useState, useMemo } from "react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetPlantProjectsQuery } from "@/redux/api/projectApi";

export interface NotificationFilters {
  leadId?: string;
  status?: string;
  channel?: string;
  startDate?: string;
  endDate?: string;
}

interface NotificationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: NotificationFilters) => void;
  initialFilters?: NotificationFilters;
}

const NotificationFilterModal: React.FC<NotificationFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<NotificationFilters>({
    leadId: initialFilters?.leadId || "",
    status: initialFilters?.status || "",
    channel: initialFilters?.channel || "",
  });

  const [currentDate, setCurrentDate] = useState<Date | null>(() => {
    if (initialFilters?.startDate) {
      const d = new Date(initialFilters.startDate);
      if (!isNaN(d.getTime())) {
        return d;
      }
    }
    return new Date();
  });

  const { data: projectsData } = useGetPlantProjectsQuery({ limit: 100 }, { skip: !isOpen });

  const handleFilterChange = (key: keyof NotificationFilters, value: string) => {
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
    : "All Time";

  const projectOptions = useMemo(() => {
    const options = [{ label: "All Projects", value: "" }];
    if (projectsData?.projects) {
      projectsData.projects.forEach((p) => {
        options.push({ label: p.projectName || p.jobId || p._id, value: p._id });
      });
    }
    return options;
  }, [projectsData]);

  const channelOptions = [
    { label: "All Channels", value: "" },
    { label: "Email", value: "Email" },
    { label: "SMS", value: "SMS" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Sent", value: "Sent" },
    { label: "Delivered", value: "Delivered" },
    { label: "Pending", value: "Pending" },
    { label: "Failed", value: "Failed" },
  ];

  const handleApply = () => {
    let startDate: string | undefined;
    let endDate: string | undefined;

    if (currentDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const pad = (n: number) => String(n).padStart(2, "0");
      startDate = `${year}-${pad(month + 1)}-01T00:00:00.000Z`;
      const lastDay = new Date(year, month + 1, 0).getDate();
      endDate = `${year}-${pad(month + 1)}-${pad(lastDay)}T23:59:59.999Z`;
    }

    onApply?.({
      ...filters,
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setFilters({
      leadId: "",
      status: "",
      channel: "",
    });
    setCurrentDate(null);
    onApply?.({
      leadId: "",
      status: "",
      channel: "",
      startDate: undefined,
      endDate: undefined,
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
          {/* Month Selector UI */}
          <div className="flex items-center justify-center gap-6 py-3">
            <button
              onClick={handlePrevMonth}
              className="text-[#637381] hover:text-[#212B36] transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-lg md:text-xl font-semibold text-[#212B36] min-w-40 text-center select-none">
              {monthLabel}
            </span>
            <button
              onClick={handleNextMonth}
              className="text-[#637381] hover:text-[#212B36] transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight size={24} />
            </button>
            {currentDate && (
              <button
                onClick={() => setCurrentDate(null)}
                className="text-xs text-[#155DFC] hover:underline font-medium ml-2 cursor-pointer"
              >
                Clear Month
              </button>
            )}
          </div>

          {/* Dropdowns Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CommonDropdown
              label="Project"
              value={filters.leadId || ""}
              onChange={(v) => handleFilterChange("leadId", v)}
              options={projectOptions}
              placeholder="Select Project"
            />
            <CommonDropdown
              label="Channel"
              value={filters.channel || ""}
              onChange={(v) => handleFilterChange("channel", v)}
              options={channelOptions}
              placeholder="Select Channel"
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
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Button variant="white" onClick={handleReset} size="md">
            Reset All
          </Button>
          <div className="flex gap-3">
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
      </div>
    </Modal>
  );
};

export default NotificationFilterModal;
