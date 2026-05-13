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
import { cn } from "@/lib/utils";

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

  const stats = [
    {
      title: "Total BOM Files",
      value: "58 Files",
      color: "bg-[#1E51A4]",
      icon: <Hammer className="text-[#1E51A4]" size={18} />,
    },
    {
      title: "Pending Upload",
      value: "12 Files",
      color: "bg-[#3AB449]",
      icon: <ShieldCheck className="text-[#3AB449]" size={18} />,
    },
    {
      title: "Ready for Shipper",
      value: "26 Files",
      color: "bg-[#DCC426]",
      icon: <DollarSign className="text-[#DCC426]" size={18} />,
    },
    {
      title: "Issues Detected",
      value: "8 Files",
      color: "bg-[#FD8D5B]",
      icon: <BarChart3 className="text-[#FD8D5B]" size={18} />,
    },
  ];

  const initialData = [
    {
      project: "ABC Warehouse",
      date: "15 Jan 2025",
      items: "125",
      status: "Draft",
      customerId: "ID-2025-1047",
      projectId: "PRJ-001",
    },
    {
      project: "Riya Buildings",
      date: "22 Feb 2025",
      items: "98",
      status: "✅ Approved",
      customerId: "ID-2025-1047",
      projectId: "PRJ-002",
    },
    {
      project: "Z-Tech Park",
      date: "05 Dec 2024",
      items: "210",
      status: "🔒 Locked",
      customerId: "ID-2025-1048",
      projectId: "PRJ-003",
    },
    {
      project: "Global Logistics",
      date: "10 Mar 2025",
      items: "150",
      status: "Draft",
      customerId: "ID-2025-1049",
      projectId: "PRJ-004",
    },
    {
      project: "Metro Station",
      date: "01 Jan 2025",
      items: "300",
      status: "🔒 Locked",
      customerId: "ID-2025-1050",
      projectId: "PRJ-005",
    },
  ];

  const projectOptions = React.useMemo(() => {
    const uniqueProjects = Array.from(new Set(initialData.map((d) => d.project)));
    return [
      { label: "All Projects", value: "all" },
      ...uniqueProjects.map((p) => ({ label: p, value: p })),
    ];
  }, []);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = React.useMemo(() => {
    let data = [...initialData];

    // Filter by search query
    if (searchQuery) {
      data = data.filter((item) =>
        item.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by project dropdown
    if (projectFilter !== "all") {
      data = data.filter((item) => item.project === projectFilter);
    }

    // Sort logic
    if (sortConfig.key) {
      // Manual column sort
      data.sort((a: any, b: any) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "date") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (sortConfig.key === "items") {
          valA = parseInt(valA);
          valB = parseInt(valB);
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      // Fallback to Sort By dropdown (Latest/Oldest)
      data.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortBy === "Latest" ? dateB - dateA : dateA - dateB;
      });
    }

    return data;
  }, [searchQuery, projectFilter, sortConfig, sortBy]);

  const handleViewBOM = (item: any) => {
    navigate(`/projects/view-bom/${item.customerId}/${item.projectId}`);
  };

  const getBadgeVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === "draft") return "yellow";
    if (s.includes("approved")) return "green";
    if (s.includes("locked")) return "green";
    return "blue";
  };

  return (
    <div className="xl:pr-2 md:px-4 px-2 pb-10 space-y-6">
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
                  onClick={() => handleSort("project")}
                >
                  <div className="flex items-center gap-1">
                    Project
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "project"
                          ? "text-(--text-color-primary-blue)"
                          : "text-(--text-color-gray-4)",
                      )}
                    />
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-sm font-archivo font-semibold text-black cursor-pointer group"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center gap-1">
                    Upload Date
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "date"
                          ? "text-(--text-color-primary-blue)"
                          : "text-(--text-color-gray-4)",
                      )}
                    />
                  </div>
                </th>
                <th
                  className="py-4 px-4 text-sm font-archivo font-semibold text-black cursor-pointer group"
                  onClick={() => handleSort("items")}
                >
                  <div className="flex items-center gap-1">
                    Items
                    <ArrowUpDown
                      size={14}
                      className={cn(
                        "transition-colors",
                        sortConfig.key === "items"
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
              {filteredAndSortedData.map((item, idx) => (
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
                    {item.project}
                  </td>
                  <td className="py-2 px-4 text-[15px] font-inter text-[#637381]">
                    {item.date}
                  </td>
                  <td className="py-2 px-4 text-[15px] font-inter font-normal text-black">
                    {item.items}
                  </td>
                  <td className="py-2 px-4">
                    <CommonStatusBadge
                      text={item.status}
                      variant={getBadgeVariant(item.status)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={15}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
        getPageNumbers={() => [1, 2, 3, 4, "...", 15]}
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
    </div>
  );
};

export default UploadedBOMFilesView;
