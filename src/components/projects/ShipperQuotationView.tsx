import React, { useState, useMemo } from "react";
import { Search, Filter} from "lucide-react";
import { recentShipperFilesByFilter } from "@/data/productionMockData";
import type { RecentShipperFile } from "@/data/productionMockData";
import RecentShipperFilesTable from "@/components/RecentShipperFilesTable";
import Pagination from "@/components/Pagination";
import Heading from "../common_component/Heading";
import FilterDropdown from "../common_component/FilterDropdown";

const ShipperQuotationView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Select Status");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // All shipper files
  const allFiles: RecentShipperFile[] = useMemo(() => {
    const seen = new Set<string>();
    const merged = [
      ...recentShipperFilesByFilter.today,
      ...recentShipperFilesByFilter.week,
      ...recentShipperFilesByFilter.month,
    ];
    return merged.filter((f) => {
      if (seen.has(f.fileName)) return false;
      seen.add(f.fileName);
      return true;
    });
  }, []);

  // Derived data
  const filtered = useMemo(() => {
    let list = allFiles;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.projectName.toLowerCase().includes(q) ||
          f.shipperName.toLowerCase().includes(q) ||
          f.fileName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "Select Status") {
      list = list.filter((f) => f.status === statusFilter);
    }
    return list;
  }, [allFiles, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="mt-2">
        <Heading text="Shipper Files" />
        <p className="text-sm text-[#637381] mt-1 font-inter">
          Manage vendor shipment files and prepare for validation
        </p>
      </div>

      {/* ── Search / Filter / Status bar ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#637381]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search"
              className="pl-10 pr-4 py-2.5 border border-[#E2E4E6] rounded-[8px] text-sm text-[#212B36] bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 w-full sm:w-64"
            />
          </div>

          {/* Filter button */}
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E2E4E6] rounded-[8px] text-sm font-medium text-[#212B36] bg-white hover:bg-gray-50 transition-colors">
            <Filter size={18} className="text-[#637381]" />
            Filter
          </button>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FilterDropdown
            activeTab={statusFilter}
            onTabChange={setStatusFilter}
            options={[
              { label: "Select Status", value: "Select Status" },
              { label: "File Received", value: "File Received" },
              { label: "Order Sent", value: "Order Sent" },
              { label: "Compared", value: "Compared" },
              { label: "Revision Sent", value: "Revision Sent" },
            ]}
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <RecentShipperFilesTable data={paginated} />

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
      />
    </div>
  );
};

export default ShipperQuotationView;
