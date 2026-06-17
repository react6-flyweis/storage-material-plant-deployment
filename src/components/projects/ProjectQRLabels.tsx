import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  ArrowLeft,
  // Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleX,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import QRCodeDataModal from "./QRCodeDataModal";
import {
  useGetLoadPlanningStateQuery,
  type BundleItem,
} from "@/redux/api/shipperApi";
import { printQRCodeLabel, type QRModalData } from "@/lib/utils";

const ProjectQRLabels: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // States for QR Labels details
  const [searchTermLabel, setSearchTermLabel] = useState("");
  const [currentPageLabel, setCurrentPageLabel] = useState(1);
  const [rowsPerPageLabel, setRowsPerPageLabel] = useState(10);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<QRModalData | null>(null);


  const { data: stateData, isLoading: isStateLoading } = useGetLoadPlanningStateQuery(
    projectId || "",
    { skip: !projectId }
  );

  const isDetailsLoading = isStateLoading;

  const projectName = stateData?.project?.projectName || "Project";
  const planNumber = stateData?.bundlePlan?.planNumber || "N/A";

  const getLoadIdForBundle = useCallback(() => {
    return planNumber;
  }, [planNumber]);

  // Filter labels
  const filteredLabels = useMemo(() => {
    if (!projectId) return [];
    const bundles = stateData?.bundles || [];
    return bundles.filter((item) => {
      const search = searchTermLabel.toLowerCase();
      const loadId = getLoadIdForBundle().toLowerCase();
      return (
        item.bundleNo.toLowerCase().includes(search) ||
        loadId.includes(search) ||
        (item.bundleType || "").toLowerCase().includes(search) ||
        (item.title || "").toLowerCase().includes(search)
      );
    });
  }, [projectId, stateData?.bundles, searchTermLabel, getLoadIdForBundle]);

  const totalLabelItems = filteredLabels.length;
  const totalLabelPages = Math.ceil(totalLabelItems / rowsPerPageLabel);
  const paginatedLabels = useMemo(() => {
    return filteredLabels.slice(
      (currentPageLabel - 1) * rowsPerPageLabel,
      currentPageLabel * rowsPerPageLabel
    );
  }, [filteredLabels, currentPageLabel, rowsPerPageLabel]);

  // Check box handlers
  const handleSelectAllLabels = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLabelIds(paginatedLabels.map((item) => item._id));
    } else {
      setSelectedLabelIds([]);
    }
  };

  const handleSelectOneLabel = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLabelIds((prev) => [...prev, id]);
    } else {
      setSelectedLabelIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleViewDetails = (item: BundleItem) => {
    setSelectedLabel({
      projectName,
      shipperRef: planNumber,
      loadId: getLoadIdForBundle(),
      id: item.bundleNo,
      bundleId: item._id,
      parts: item.bundleType || item.title || "N/A",
      weight: `${Math.round(item.totalWeight * 100) / 100} LBS`,
      length: `${Math.round(item.maxLengthFeet * 100) / 100} ft`,
    });
    setIsModalOpen(true);
  };

  const handlePrintDirect = (item: BundleItem) => {
    printQRCodeLabel({
      projectName,
      shipperRef: planNumber,
      loadId: getLoadIdForBundle(),
      id: item.bundleNo,
      bundleId: item._id,
      parts: item.bundleType || item.title || "N/A",
      weight: String(Math.round(item.totalWeight * 100) / 100),
      length: String(Math.round(item.maxLengthFeet * 100) / 100),
    });
  };

  return (
    <div className="xl:pr-2 px-4 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-start gap-4 grow">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate("/load_planning/qr-labels")}
            title="Back to projects"
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <TitleSubtitle
            title={`QR Labels: ${projectName}`}
            subtitle="Generate, manage, and print QR labels for bundles and pallets to enable tracking and verification across plant and field operations."
          />
        </div>
        <Button variant="white" size="sm">
          <Download size={18} className="mr-2" /> Export
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchTermLabel}
            onChange={(e) => {
              setSearchTermLabel(e.target.value);
              setCurrentPageLabel(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all shadow-sm"
          />
        </div>
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Filter size={16} className="text-gray-400" /> Filter
        </button> */}
      </div>

      {/* QR Labels Table */}
      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-3 md:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedLabels.length > 0 &&
                      selectedLabelIds.length === paginatedLabels.length
                    }
                    onChange={handleSelectAllLabels}
                    className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                  />
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Bundle ID
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Load ID
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Parts
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Weight
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Length
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Status
                </th>
                <th className="p-3 md:p-4 w-20 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isDetailsLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-gray-500 font-inter"
                  >
                    Loading QR Labels...
                  </td>
                </tr>
              ) : paginatedLabels.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-gray-500 font-inter"
                  >
                    No QR Labels found for this project.
                  </td>
                </tr>
              ) : (
                paginatedLabels.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-3 md:p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedLabelIds.includes(item._id)}
                        onChange={(e) =>
                          handleSelectOneLabel(item._id, e.target.checked)
                        }
                        className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                      />
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {item.bundleNo}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {getLoadIdForBundle()}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36] font-semibold">
                      {item.bundleType || item.title || "N/A"}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {(Math.round(item.totalWeight * 100) / 100).toLocaleString()} LBS
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {Math.round(item.maxLengthFeet * 100) / 100} ft
                    </td>
                    <td className="p-3 md:p-4">
                      <CommonStatusBadge
                        text={item.status || "Generated"}
                        variant={item.status === "Printed" ? "green" : "blue"}
                        icon={
                          item.status === "Printed" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <CircleX size={14} />
                          )
                        }
                      />
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="gradient"
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                        >
                          View
                        </Button>
                        <Button
                          variant="mint"
                          size="sm"
                          onClick={() => handlePrintDirect(item)}
                        >
                          Print
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row bg-white items-center justify-between gap-4 p-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-[#637381] font-inter">
          <span>Row Per Page</span>
          <select
            value={rowsPerPageLabel}
            onChange={(e) => {
              setRowsPerPageLabel(Number(e.target.value));
              setCurrentPageLabel(1);
            }}
            className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all shadow-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>Entries</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPageLabel((p) => Math.max(1, p - 1))}
            disabled={currentPageLabel === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalLabelPages || 1 }, (_, i) => i + 1).map(
            (page) => {
              const isActive = page === currentPageLabel;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPageLabel(page)}
                  className={`w-8 h-8 rounded-full text-xs font-semibold font-inter flex items-center justify-center transition-all ${isActive
                    ? "bg-[#FF7F27] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              );
            }
          )}

          <button
            onClick={() =>
              setCurrentPageLabel((p) => Math.min(totalLabelPages, p + 1))
            }
            disabled={
              currentPageLabel === totalLabelPages || totalLabelPages === 0
            }
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <QRCodeDataModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLabel(null);
        }}
        data={selectedLabel}
      />
    </div>
  );
};

export default ProjectQRLabels;
