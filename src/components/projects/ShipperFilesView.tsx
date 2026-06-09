import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  Wrench,
  ShieldCheck,
  CircleDollarSign,
  ChartSpline,
} from "lucide-react";
import ProjectShipperFilesTable from "@/components/ProjectShipperFilesTable";
import StatCard from "@/components/ui/stat-card";
import Pagination from "@/components/Pagination";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import FilterDropdown from "../common_component/FilterDropdown";
import {
  useGetProjectShipperRequestsQuery,
  type ShipperRequestEntry,
} from "@/redux/api/shipperApi";
// ─── Constants ────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { label: "Filter", value: "" },
  { label: "All Items", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Older", value: "older" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ShipperFilesView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const {
    data: shipperRequestsData,
    isLoading,
    error,
  } = useGetProjectShipperRequestsQuery(projectId || "");

  // All shipper files (merge all filter buckets for this page)

  // ── Search & sort state ────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortOrder, setSortOrder] = useState<"Latest" | "Oldest">("Latest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // ── Pagination state ──────────────────────────────────────────────────────
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const allFiles = useMemo<ShipperRequestEntry[]>(() => {
    return shipperRequestsData?.shipperRequests || [];
  }, [shipperRequestsData]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = allFiles;

    // Filter by type
    // if (filterType && filterType !== "all") {
    //   list = list.filter(f => f.category === filterType);
    // }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.vendorName.toLowerCase().includes(q) ||
          f.fileName.toLowerCase().includes(q) ||
          f.fileStatus.toLowerCase().includes(q)
      );
    }
    if (sortOrder === "Oldest") list = [...list].reverse();
    return list;
  }, [allFiles, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const stats = useMemo(() => {
    const total = allFiles.length;
    const received = allFiles.filter(f => f.fileStatus === "submitted").length;
    const sent = allFiles.filter(f => f.fileStatus === "sent" || f.fileStatus === "order sent").length;
    const revision = allFiles.filter(f => f.fileStatus === "revision sent" || f.fileStatus === "revision").length;

    return [
      {
        title: "Total Shipper Files",
        value: `${total} Files`,
        icon: <Wrench className="md:size-6 size-4 text-[#1E51A4]" />,
        color: "bg-[#1E51A4]",
      },
      {
        title: "File Received",
        value: `${received} Files`,
        icon: <ShieldCheck className="md:size-6 size-4 text-[#3AB449]" />,
        color: "bg-[#3AB449]",
      },
      {
        title: "Order Sent",
        value: `${sent} Files`,
        icon: <CircleDollarSign className="md:size-6 size-4 text-[#EAB308]" />,
        color: "bg-[#EAB308]",
      },
      {
        title: "Revision Sent",
        value: `${revision} Files`,
        icon: <ChartSpline className="md:size-6 size-4 text-[#FD8D5B]" />,
        color: "bg-[#FD8D5B]",
      },
    ];
  }, [allFiles]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading shipper files...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:pr-5 px-2 pb-10 space-y-6">
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="Shipper Files" />
        </div>
        <div className="p-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter text-[#212B36]">
            Error Loading Shipper Files
          </p>
          <p className="text-sm text-gray-500 font-inter max-w-md">
            Something went wrong while retrieving shipper files details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // ── Pagination helpers ────────────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1, 2, 3);
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages - 1, totalPages);
    return [...new Set(pages)];
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
        <Heading text={`${shipperRequestsData?.projectName || "Project"} - Shipper Files`} />
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* ── Search / Filter / Sort bar ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#637381]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search"
              className="pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-[8px] text-sm text-[#212B36] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 w-44 md:w-56"
            />
          </div>

          {/* Filter Dropdown */}
          <FilterDropdown
            activeTab={filterType}
            onTabChange={setFilterType}
            options={FILTER_OPTIONS}
            icon
          />
        </div>

        {/* Sort */}
        <div className="relative" onBlur={() => setTimeout(() => setShowSortMenu(false), 150)}>
          <button
            onClick={() => setShowSortMenu((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] rounded-[8px] text-sm font-medium text-[#212B36] bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter size={15} className="text-[#637381]" />
            Sort by : <span className="text-[#1E51A4] font-medium">{sortOrder}</span>
            <ChevronDown size={15} className={`text-[#637381] transition-transform ${showSortMenu ? "rotate-180" : ""}`} />
          </button>
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-[10px] shadow-lg z-50 overflow-hidden min-w-[130px]">
              {(["Latest", "Oldest"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortOrder(opt); setShowSortMenu(false); setCurrentPage(1); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-50 ${sortOrder === opt ? "text-[#1E51A4] font-semibold bg-blue-50/50" : "text-[#212B36]"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <ProjectShipperFilesTable data={paginated} />

      {/* ── Pagination ────────────────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
        getPageNumbers={getPageNumbers}
      />
    </div>
  );
};

export default ShipperFilesView;
