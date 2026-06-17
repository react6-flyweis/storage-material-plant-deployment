import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Download,
  ArrowDownUp,
  Hourglass,
  CircleX,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  // SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import { useGetBundlePlanQuery } from "@/redux/api/shipperApi";

const ProjectLoadPlansList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSort, setActiveSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: bundlePlanData, isLoading: plansLoading } = useGetBundlePlanQuery(projectId || "", {
    skip: !projectId,
  });

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Priority", value: "priority" },
  ];

  const projectName = "Project";

  const plans = bundlePlanData?.bundles || [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Client-side search and sorting
  const filteredPlans = plans.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.bundleNo.toLowerCase().includes(search) ||
      (item.bundleType && item.bundleType.toLowerCase().includes(search)) ||
      (item.title && item.title.toLowerCase().includes(search))
    );
  });

  // Client-side pagination
  const totalPlans = filteredPlans.length;
  const totalPages = Math.ceil(totalPlans / rowsPerPage);
  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedPlans.map((p) => p._id));
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

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex grow items-start gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate("/load_planning/list")}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <TitleSubtitle
            title={`${projectName} - Load Planning`}
            subtitle="Plan shipments , optimizing bundles, and building truckloads."
          />
        </div>
        <Button variant="white" size="sm">
          <Download size={18} className="mr-2 text-gray-500" /> Export
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all shadow-sm font-inter"
            />
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] font-medium hover:bg-gray-50 transition-colors shadow-sm font-inter">
            <SlidersHorizontal size={16} className="text-gray-400" /> Select Project
          </button> */}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-[#637381] font-inter">Sort by :</span>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] font-medium focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all shadow-sm font-inter"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Load Planning Table */}
      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-3 md:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedPlans.length > 0 && selectedIds.length === paginatedPlans.length}
                    onChange={handleSelectAll}
                    className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                  />
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Bundle ID / No
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Shipper Reference
                </th>
                {/* <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Vendor <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th> */}
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Qty / Items <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Load Sequence <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Weight <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Status
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Date <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plansLoading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500 font-inter">
                    Loading bundle plans...
                  </td>
                </tr>
              ) : paginatedPlans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-gray-500 font-inter">
                    No bundle plans found for this project.
                  </td>
                </tr>
              ) : (
                paginatedPlans.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-3 md:p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={(e) => handleSelectOne(item._id, e.target.checked)}
                        className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                      />
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36] font-medium">
                      {item.bundleNo}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {bundlePlanData?.bundlePlan?.planNumber || "N/A"}
                    </td>
                    {/* <td className="p-3 md:p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bundlePlanData?.bundlePlan?.generatedBy || "Vendor")}&background=random`}
                          alt=""
                          className="w-8 h-8 rounded-full bg-gray-100 object-cover"
                        />
                        <span className="text-sm font-inter font-medium text-[#212B36]">
                          {bundlePlanData?.bundlePlan?.generatedBy || "N/A"}
                        </span>
                      </div>
                    </td> */}
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36]">
                      {item.totalQty} ({item.itemCount} items)
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36]">
                      {item.loadSequence !== null ? `Seq ${item.loadSequence}` : "N/A"}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36]">
                      {Number(item.totalWeight).toFixed(2)} lbs
                    </td>
                    <td className="p-3 md:p-4">
                      <CommonStatusBadge
                        text={item.status || "Draft"}
                        variant={
                          item.status === "Completed"
                            ? "green"
                            : item.status === "Planning"
                              ? "yellow"
                              : "blue"
                        }
                        icon={
                          item.status === "Completed" ? (
                            <CheckCircle2 size={14} />
                          ) : item.status === "Planning" ? (
                            <Hourglass size={14} />
                          ) : item.status === "Ready" ? (
                            <CircleX size={14} />
                          ) : undefined
                        }
                      />
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {formatDate(bundlePlanData?.bundlePlan?.createdAt)}
                    </td>
                    <td className="p-3 md:p-4 text-right">
                      <button
                        onClick={() => navigate(`/load_planning/details/${projectId}`)}
                        className="px-4 py-1.5 bg-[#1E51A4] hover:bg-[#153e80] text-white text-xs font-semibold rounded-lg font-inter transition-all shadow-sm"
                      >
                        View Load
                      </button>
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
          <span>Showing</span>
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
          <span>Results</span>
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
                  ? "bg-[#1E51A4] text-white shadow-sm"
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
    </div>
  );
};

export default ProjectLoadPlansList;
