import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Wrench,
  ShieldCheck,
  CircleDollarSign,
  ChartSpline,
} from "lucide-react";
import { useGetShipperProjectsQuery, useGetShipperStatsQuery } from "@/redux/api/shipperApi";
import ShipperProjectsTable from "./ShipperProjectsTable";
import Pagination from "@/components/Pagination";
import FilterDropdown from "../common_component/FilterDropdown";
import TitleSubtitle from "../common_component/TitleSubtitle";
import { projectDisplayName } from "@/lib/utils";
import StatCard from "@/components/ui/stat-card";

const ShipperQuotationView: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Select Status");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useGetShipperProjectsQuery();
  const { data: statsData, isLoading: statsLoading } = useGetShipperStatsQuery();

  const stats = useMemo(() => {
    return [
      {
        title: "Total files",
        value: statsData ? `${statsData.totalFiles} Files` : "0 Files",
        icon: <Wrench className="md:size-6 size-4 text-[#1E51A4]" />,
        color: "bg-[#1E51A4]",
      },
      {
        title: "Files received",
        value: statsData ? `${statsData.filesReceived} Files` : "0 Files",
        icon: <ShieldCheck className="md:size-6 size-4 text-[#3AB449]" />,
        color: "bg-[#3AB449]",
      },
      {
        title: "Orders sent",
        value: statsData ? `${statsData.ordersSent} Files` : "0 Files",
        icon: <CircleDollarSign className="md:size-6 size-4 text-[#EAB308]" />,
        color: "bg-[#EAB308]",
      },
      {
        title: "Revisions sent",
        value: statsData ? `${statsData.revisionsSent} Files` : "0 Files",
        icon: <ChartSpline className="md:size-6 size-4 text-[#FD8D5B]" />,
        color: "bg-[#FD8D5B]",
      },
    ];
  }, [statsData]);

  // Derived data
  const filtered = useMemo(() => {
    const projects = data?.projects || [];
    let list = projects;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          projectDisplayName(p).toLowerCase().includes(q) ||
          p.projectId.toLowerCase().includes(q) ||
          p.jobId.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "Select Status") {
      list = list.filter((p) => p.fileReceivedStatus === statusFilter);
    }

    return list;
  }, [data, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading projects...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6">
        <TitleSubtitle
          title="Shipper Files"
          subtitle="Manage vendor shipment files and prepare for validation"
        />
        <div className="p-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter text-[#212B36]">
             Error Loading Projects
          </p>
          <p className="text-sm text-gray-500 font-inter max-w-md">
            Something went wrong while retrieving projects. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <TitleSubtitle
        title="Shipper Files"
        subtitle="Manage vendor shipment files and prepare for validation"
      />

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={statsLoading}
          />
        ))}
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
              { label: "Completed", value: "all" },
              { label: "Partial", value: "partial" },
              { label: "None", value: "none" },
            ]}
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <ShipperProjectsTable data={paginated} />

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
