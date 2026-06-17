import React from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  Hammer,
  ShieldCheck,
  DollarSign,
  BarChart3,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../ui/stat-card";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import Pagination from "../Pagination";
import { UploadModal } from "./ProjectUploadModals";
import FilterDropdown from "../common_component/FilterDropdown";
import CommonCheckbox from "../common_component/CommonCheckbox";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import { cn, getLeadProjectName } from "@/lib/utils";
import PageWrapper from "../common_component/PageWrapper";

import { useGetBOMProjectsQuery, type BOMProject } from "@/redux/api/projectApi";

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const UploadedBOMFilesView: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState("Latest");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [projectFilter, setProjectFilter] = React.useState("all");
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({
    key: "",
    direction: null,
  });

  const { data, isLoading } = useGetBOMProjectsQuery({
    page: currentPage,
    limit: rowsPerPage,
  });

  const projects = React.useMemo(() => {
    return (data?.projects || []).map((item) => ({
      ...item,
      resolvedProjectName: getLeadProjectName(item),
    }));
  }, [data?.projects]);
  const total = data?.total || 0;

  const stats = [
    {
      title: "Total BOM Files",
      value: `${total} Files`,
      color: "bg-[#1E51A4]",
      icon: <Hammer className="text-[#1E51A4]" size={18} />,
    },
    {
      title: "Pending Upload",
      value: "N/A",
      color: "bg-[#3AB449]",
      icon: <ShieldCheck className="text-[#3AB449]" size={18} />,
    },
    {
      title: "Ready for Shipper",
      value: "N/A",
      color: "bg-[#DCC426]",
      icon: <DollarSign className="text-[#DCC426]" size={18} />,
    },
    {
      title: "Issues Detected",
      value: "N/A",
      color: "bg-[#FD8D5B]",
      icon: <BarChart3 className="text-[#FD8D5B]" size={18} />,
    },
  ];

  const projectOptions = React.useMemo(() => {
    const uniqueProjects = Array.from(new Set(projects.map((d) => d.resolvedProjectName)));
    return [
      { label: "All Projects", value: "all" },
      ...uniqueProjects.map((p) => ({ label: p, value: p })),
    ];
  }, [projects]);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let list = [...projects];

    // Filter by search query
    if (searchQuery) {
      list = list.filter((item) =>
        item.resolvedProjectName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by project dropdown
    if (projectFilter !== "all") {
      list = list.filter((item) => item.resolvedProjectName === projectFilter);
    }

    // Sort logic
    if (sortConfig.key) {
      list.sort((a: any, b: any) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "uploadDate") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (sortConfig.key === "itemCount") {
          valA = parseInt(valA) || 0;
          valB = parseInt(valB) || 0;
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Fallback to Sort By dropdown (Latest/Oldest)
      list.sort((a, b) => {
        const dateA = new Date(a.uploadDate).getTime();
        const dateB = new Date(b.uploadDate).getTime();
        return sortBy === "Latest" ? dateB - dateA : dateA - dateB;
      });
    }

    return list;
  }, [projects, searchQuery, projectFilter, sortConfig, sortBy]);

  const handleViewBOM = (item: BOMProject) => {
    navigate(`/costing/bom-details/${item.bomJobId}`);
  };

  const getBadgeVariant = (status: string) => {
    if (!status) return "gray";
    const s = status.toLowerCase();
    if (s === "extracted" || s === "success" || s === "approved") return "green";
    if (s === "processing" || s === "pending") return "yellow";
    if (s === "failed" || s === "error") return "red";
    return "blue";
  };

  return (
    <PageWrapper>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        <Heading text="Uploaded BOM Files" />
        <Button
          variant="primary"
          size="sm"
          className="px-8 py-3"
          onClick={() => setIsModalOpen(true)}
        >
          Upload BOM File
        </Button>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#637381] size-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-[#919EAB]"
            />
          </div>
          <FilterDropdown
            activeTab={projectFilter}
            onTabChange={setProjectFilter}
            options={projectOptions}
            label="Filter"
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-[#637381] ml-auto">
          <span>Sort by :</span>
          <FilterDropdown
            activeTab={sortBy}
            onTabChange={setSortBy}
            options={[
              { label: "Latest", value: "Latest" },
              { label: "Oldest", value: "Oldest" },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F6F8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F7F8F9] border-b border-[#E2E4E6]">
                <th className="py-4 px-6 w-12">
                  <CommonCheckbox
                    checked={selectedRows.length === filteredAndSortedData.length && filteredAndSortedData.length > 0}
                    onChange={(checked) => {
                      if (checked)
                        setSelectedRows(filteredAndSortedData.map((_, i) => i));
                      else setSelectedRows([]);
                    }}
                  />
                </th>
                <th
                  className="py-3 px-4 text-sm font-archivo font-semibold text-black cursor-pointer group"
                  onClick={() => handleSort("resolvedProjectName")}
                >
                  <div className="flex items-center gap-1">
                    Project
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "resolvedProjectName"
                          ? "text-(--text-color-primary-blue)"
                          : "text-(--text-color-gray-4)",
                      )}
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-sm font-archivo font-semibold text-black cursor-pointer group"
                  onClick={() => handleSort("uploadDate")}
                >
                  <div className="flex items-center gap-1">
                    Upload Date
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "uploadDate"
                          ? "text-(--text-color-primary-blue)"
                          : "text-(--text-color-gray-4)",
                      )}
                    />
                  </div>
                </th>
                <th
                  className="py-4 px-4 text-sm font-archivo font-semibold text-black cursor-pointer group"
                  onClick={() => handleSort("itemCount")}
                >
                  <div className="flex items-center gap-1">
                    Items
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "itemCount"
                          ? "text-(--text-color-primary-blue)"
                          : "text-(--text-color-gray-4)",
                      )}
                    />
                  </div>
                </th>
                <th className="py-4 px-4 text-sm font-archivo font-semibold text-black">
                  File Status
                </th>
                <th className="py-4 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E6]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[15px] font-inter text-[#637381]">
                    Loading BOM projects...
                  </td>
                </tr>
              ) : filteredAndSortedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[15px] font-inter text-[#637381]">
                    No BOM projects found
                  </td>
                </tr>
              ) : (
                filteredAndSortedData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2 px-6">
                      <CommonCheckbox
                        checked={selectedRows.includes(idx)}
                        onChange={(checked) => {
                          if (checked) setSelectedRows([...selectedRows, idx]);
                          else
                            setSelectedRows(
                              selectedRows.filter((i) => i !== idx),
                            );
                        }}
                      />
                    </td>
                    <td className="py-2 px-4 text-[15px] font-archivo font-normal text-[#637381]">
                      {item.resolvedProjectName}
                    </td>
                    <td className="py-2 px-4 text-[15px] font-inter text-[#637381]">
                      {formatDate(item.uploadDate)}
                    </td>
                    <td className="py-2 px-4 text-[15px] font-inter font-normal text-black">
                      {item.itemCount}
                    </td>
                    <td className="py-2 px-4">
                      <CommonStatusBadge
                        text={item.fileStatus}
                        variant={getBadgeVariant(item.fileStatus)}
                        icon={<CircleCheck size={14} />}
                      />
                    </td>
                    <td className="py-3 px-6 text-right">
                      <Button
                        variant={"gradient"}
                        size={"sm"}
                        onClick={() => handleViewBOM(item)}
                      >
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={total}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload BOM File"
        subtitle="Please upload your BOM file to continue."
        fileLabel="BOM File"
        onUpload={() => {
          setIsModalOpen(false);
        }}
      />
    </PageWrapper>
  );
};

export default UploadedBOMFilesView;
