import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  // Download,
  ArrowLeft,
  ArrowDownUp,
  CircleX,
  CheckCircle2,
  // Filter,
  ChevronLeft,
  ChevronRight,
  QrCode,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import PackingListModal from "./PackingListModal";
import { useGetTruckPlanQuery, useGetLoadPlanningStateQuery, type PackingListEntry } from "@/redux/api/shipperApi";

const ProjectQRLabels: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackingList, setSelectedPackingList] = useState<PackingListEntry | null>(null);

  const { data: truckPlan, isLoading: isTruckPlanLoading } = useGetTruckPlanQuery(projectId || "", {
    skip: !projectId,
  });

  const { data: stateData, isLoading: isStateLoading } = useGetLoadPlanningStateQuery(projectId || "", {
    skip: !projectId,
  });

  const projectName = stateData?.project?.projectName || "Project";
  const packingLists = truckPlan?.packingLists || [];

  // Filter logic
  const filteredPackingLists = packingLists.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.packingListNo.toLowerCase().includes(search) ||
      (item.truckLabel || "").toLowerCase().includes(search) ||
      (item.truckType || "").toLowerCase().includes(search) ||
      (item.truckNo || "").toLowerCase().includes(search) ||
      (item.status || "").toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const totalItems = filteredPackingLists.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const paginatedPackingLists = filteredPackingLists.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedPackingLists.map((item) => item._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isLoading = isTruckPlanLoading || isStateLoading;

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
        {/* <Button variant="white" size="sm">
          <Download size={18} className="mr-2" /> Export
        </Button> */}
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all"
            />
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] font-medium hover:bg-gray-50 transition-colors shadow-sm">
            <Filter size={16} className="text-gray-400" /> Filter
          </button> */}
        </div>
      </div>

      {/* Packing Lists Table */}
      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedPackingLists.length > 0 && selectedIds.length === paginatedPackingLists.length}
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                  />
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Packing ID</th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Load ID</th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">
                    Truck <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">
                    Bundles <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">
                  <div className="flex items-center gap-1">
                    Weight <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-4 text-[#212B36] font-inter font-semibold text-sm">Status</th>
                <th className="p-4 w-28 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 font-inter">
                    Loading packing lists...
                  </td>
                </tr>
              ) : paginatedPackingLists.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 font-inter">
                    No packing lists found for this project.
                  </td>
                </tr>
              ) : (
                paginatedPackingLists.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => handleSelectOne(item._id, e.target.checked)}
                        className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                      />
                    </td>
                    <td className="p-4 text-sm font-inter text-[#212B36] font-medium">{item.packingListNo}</td>
                    <td className="p-4 text-sm font-inter text-[#637381]">{stateData?.bundlePlan?.planNumber || "N/A"}</td>
                    <td className="p-4 text-sm font-inter text-[#212B36] font-semibold">{item.truckLabel || item.truckType || item.truckNo || "N/A"}</td>
                    <td className="p-4 text-sm font-inter text-[#212B36]">{item.totalBundles}</td>
                    <td className="p-4 text-sm font-inter text-[#212B36]">{item.totalWeight.toLocaleString()} LBS</td>
                    <td className="p-4">
                      <CommonStatusBadge
                        text={item.status || "Ready"}
                        variant={item.status === "Dispatched" ? "green" : "blue"}
                        icon={
                          item.status === "Dispatched" ? (
                            <CheckCircle2 size={14} />
                          ) : item.status === "Ready" ? (
                            <CircleX size={14} />
                          ) : (
                            undefined
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2 justify-center">
                        <Button
                          variant="gradient"
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => {
                            setSelectedPackingList(item);
                            setIsModalOpen(true);
                          }}
                        >
                          <QrCode size={16} />
                          View QR
                        </Button>
                        <Button
                          variant="mint"
                          size="sm"
                          className="flex items-center gap-1.5"
                          onClick={() => {
                            navigate(`/load_planning/qr-labels/packing-list/${item._id}`);
                          }}
                        >
                          View Bundles
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-[#637381] font-inter">
          <span>Row Per Page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
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
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => {
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full text-xs font-semibold font-inter flex items-center justify-center transition-all ${isActive
                  ? "bg-[#FF7F27] text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <PackingListModal
        showQr={true}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackingList(null);
        }}
        packingList={selectedPackingList}
        bundles={stateData?.bundles}
        projectName={projectName}
        planNumber={truckPlan?.packingListPlan?.planNumber}
      />
    </div>
  );
};

export default ProjectQRLabels;
