import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowDownUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  // Download,
} from "lucide-react";
// import Button from "../common_component/Button";
import TitleSubtitle from "../common_component/TitleSubtitle";
import { useGetPackingListProjectsQuery } from "@/redux/api/shipperApi";
import { projectDisplayName } from "@/lib/utils";

const QRLabelsView: React.FC = () => {
  const navigate = useNavigate();

  // States for Projects list
  const [searchTermProj, setSearchTermProj] = useState("");
  const [currentPageProj, setCurrentPageProj] = useState(1);
  const [rowsPerPageProj, setRowsPerPageProj] = useState(10);
  const [selectedProjIds, setSelectedProjIds] = useState<string[]>([]);

  // Query
  const { data: projData, isLoading: isProjLoading } = useGetPackingListProjectsQuery({
    search: searchTermProj || undefined,
    limit: rowsPerPageProj,
    page: currentPageProj,
  });

  const projects = projData?.projects || [];
  const totalProjItems = projData?.total || 0;
  const totalProjPages = Math.ceil(totalProjItems / rowsPerPageProj);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr;
    }
  };

  // Check box handlers
  const handleSelectAllProj = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProjIds(projects.map((p) => p.projectId));
    } else {
      setSelectedProjIds([]);
    }
  };

  const handleSelectOneProj = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProjIds((prev) => [...prev, id]);
    } else {
      setSelectedProjIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <TitleSubtitle
          title="QR Labels"
          subtitle="Select a project to generate, manage, and print QR labels for bundles and pallets."
        />
        {/* <Button variant="white" size="sm">
          <Download size={18} className="mr-2 text-gray-500" /> Export
        </Button> */}
      </div>

      {/* Table Controls */}
      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchTermProj}
            onChange={(e) => {
              setSearchTermProj(e.target.value);
              setCurrentPageProj(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-[#212B36] font-medium hover:bg-gray-50 transition-colors shadow-sm">
          <Filter size={16} className="text-gray-400" /> Filter
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-100">
                <th className="p-3 md:p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      projects.length > 0 &&
                      selectedProjIds.length === projects.length
                    }
                    onChange={handleSelectAllProj}
                    className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                  />
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Project ID
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  Project Name
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    List Generated Date <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 text-[#212B36] font-inter font-bold text-sm">
                  <div className="flex items-center gap-1 cursor-pointer select-none">
                    Total Packing List <ArrowDownUp size={14} className="text-[#919EAB]" />
                  </div>
                </th>
                <th className="p-3 md:p-4 w-20 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isProjLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 font-inter"
                  >
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-gray-500 font-inter"
                  >
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-3 md:p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProjIds.includes(item.projectId)}
                        onChange={(e) =>
                          handleSelectOneProj(item.projectId, e.target.checked)
                        }
                        className="size-4 rounded border-gray-300 text-[#1E51A4] focus:ring-[#1E51A4]"
                      />
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {item.projectId}
                    </td>
                    <td
                      onClick={() => navigate(`/load_planning/qr-labels/${item.projectId}`)}
                      className="p-3 md:p-4 text-sm font-inter text-[#212B36] font-semibold cursor-pointer hover:text-[#1E51A4] transition-colors"
                    >
                      <div>{projectDisplayName(item)}</div>

                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#637381]">
                      {formatDate(item.listGeneratedAt)}
                    </td>
                    <td className="p-3 md:p-4 text-sm font-inter text-[#212B36] font-medium">
                      {item.totalPackingList}
                    </td>
                    <td className="p-3 md:p-4 text-center">
                      <button
                        onClick={() => navigate(`/load_planning/qr-labels/${item.projectId}`)}
                        className="p-1.5 text-gray-400 hover:text-[#1E51A4] rounded-lg hover:bg-gray-50 transition-all"
                        title="View QR Labels"
                      >
                        <Eye size={18} />
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
          <span>Row Per Page</span>
          <select
            value={rowsPerPageProj}
            onChange={(e) => {
              setRowsPerPageProj(Number(e.target.value));
              setCurrentPageProj(1);
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
            onClick={() => setCurrentPageProj((p) => Math.max(1, p - 1))}
            disabled={currentPageProj === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalProjPages || 1 }, (_, i) => i + 1).map(
            (page) => {
              const isActive = page === currentPageProj;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPageProj(page)}
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
            onClick={() => setCurrentPageProj((p) => Math.min(totalProjPages, p + 1))}
            disabled={currentPageProj === totalProjPages || totalProjPages === 0}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRLabelsView;
