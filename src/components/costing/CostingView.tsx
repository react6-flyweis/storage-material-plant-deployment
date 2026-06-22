import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  DollarSign,
  TrendingUp,
  FileText,
  Upload,
  CirclePlus,
  Check,
  AlertCircle,
} from "lucide-react";
import Button from "../common_component/Button";
import FilterDropdown from "../common_component/FilterDropdown";
import SubHeading from "../common_component/SubHeading";
import TitleSubtitle from "../common_component/TitleSubtitle";
import { UploadModal } from "../projects/ProjectUploadModals";
import SuccessModal from "../common_component/SuccessModal";
import PartCostModal from "./PartCostModal";
import CostingTable from "./CostingTable";
import PageWrapper from "../common_component/PageWrapper";
import Pagination from "../Pagination";
import { useGetSmdtCostListQuery, useGetSmdtStatsQuery } from "@/redux/api/costingApi";
import { CATEGORY_OPTIONS } from "@/constants/costing";
import FreightStatCard from "../delivery/FreightStatCard";
import { useAppSelector } from "@/redux/hooks";

type SortKey = "partName" | "partColor" | "costUnit" | "mbsCost" | "currentMarketCost" | "description";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Part Name A-Z", value: "partName_asc" },
  { label: "Part Name Z-A", value: "partName_desc" },
  { label: "MBS Cost ↑", value: "mbsCost_asc" },
  { label: "MBS Cost ↓", value: "mbsCost_desc" },
];

const CostingView: React.FC = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.accessToken);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [successConfig, setSuccessConfig] = useState({
    title: "",
    subTitle: "",
    buttonText: "Ok",
    isBOMSuccess: false
  });

  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [quickSort, setQuickSort] = useState("latest");
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.append("category", filterType);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());
      // trailing slash remove
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
      const url = `${apiBaseUrl}/api/smdt/export/excel?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to export Excel file");
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "smdt-cost-list.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setToastMessage("Excel exported successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error("Error exporting excel:", error);
      setToastMessage("Error: Failed to export Excel list.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch SMDT Cost list from active cost version
  const { data, isLoading } = useGetSmdtCostListQuery({
    category: filterType || undefined,
    search: searchTerm.trim() || undefined,
    page,
    limit,
  });

  // Fetch SMDT Stats
  const { data: statsData, isLoading: isStatsLoading } = useGetSmdtStatsQuery();

  const items = data?.items ?? [];

  // Reset selected rows when data changes
  React.useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  // Use categories options from constants
  const filterOptions = useMemo(() => {
    return [
      { label: "All Categories", value: "" },
      ...CATEGORY_OPTIONS
    ];
  }, []);

  // Derive sortKey/sortDir from the quickSort dropdown value
  const sortKey: SortKey | null = (() => {
    if (quickSort === "partName_asc" || quickSort === "partName_desc") return "partName";
    if (quickSort === "mbsCost_asc" || quickSort === "mbsCost_desc") return "mbsCost";
    return null;
  })();
  const sortDir: "asc" | "desc" | null = (() => {
    if (quickSort.endsWith("_asc")) return "asc";
    if (quickSort.endsWith("_desc")) return "desc";
    return null;
  })();

  const handleColSort = (key: string) => {
    const currentKey = sortKey;
    const currentDir = sortDir;
    if (currentKey === key) {
      // Toggle: asc → desc → none
      if (currentDir === "asc") setQuickSort(`${key}_desc`);
      else setQuickSort("latest");
    } else {
      setQuickSort(`${key}_asc`);
    }
  };

  // Remove client-side sorting function, keep UI as it is
  const sortedAndFiltered = items;

  const allSelected = selectedRows.length === sortedAndFiltered.length && sortedAndFiltered.length > 0;
  const toggleAll = () => setSelectedRows(allSelected ? [] : sortedAndFiltered.map((r) => r._id));
  const toggleRow = (id: string | number) =>
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedPart(null);
    setIsPartModalOpen(true);
  };

  const handleEdit = (part: any) => {
    setModalMode("edit");
    setSelectedPart(part);
    setIsPartModalOpen(true);
  };

  const onSavePart = (saveData: any) => {
    console.log(saveData);
    setIsPartModalOpen(false);
    setSuccessConfig({
      title: "Item/Part Cost",
      subTitle: "Saved Successfully",
      buttonText: "Ok",
      isBOMSuccess: false
    });
    setIsSuccessModalOpen(true);
  };

  const onUploadBOM = () => {
    setIsModalOpen(false);
    setSuccessConfig({
      title: "BOM File Uploaded",
      subTitle: "",
      buttonText: "View BOM File",
      isBOMSuccess: true
    });
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    if (successConfig.isBOMSuccess) {
      navigate("/costing/bom-details/BOM-001");
    }
  };

  return (
    <PageWrapper>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce ${toastMessage.includes("Error:") ? "bg-red-500" : "bg-[#10B981]"
          }`}>
          {toastMessage.includes("Error:") ? <AlertCircle size={18} strokeWidth={3} /> : <Check size={18} strokeWidth={3} />}
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <TitleSubtitle title="Item Cost List" />
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Button
            variant="white"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Upload size={16} /> {isExporting ? "Exporting..." : "Export SMD list"}
          </Button>
          {/* <Button variant="grayFilled" size="sm" onClick={() => setIsModalOpen(true)}>
            <CirclePlus size={16} /> Check BOM Costing
          </Button> */}
          <Button variant="gradient" size="sm" onClick={handleAdd}>
            <CirclePlus size={16} /> Add New Item/Part Cost
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <FreightStatCard
          title="Total Item Cost"
          value={isStatsLoading ? "..." : `$${(statsData?.totalItemCost ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)"
        />
        <FreightStatCard
          title="Total Items"
          value={isStatsLoading ? "..." : (statsData?.totalItems ?? 0).toLocaleString()}
          icon={TrendingUp}
          gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
        />
        <FreightStatCard
          title="New Added"
          value={isStatsLoading ? "..." : (statsData?.newlyAdded ?? 0).toLocaleString()}
          icon={FileText}
          gradient="linear-gradient(135deg, #FF6900 0%, #F54900 100%)"
        />
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 transition-all placeholder:text-gray-400"
          />
        </div>
        {/* Filter */}
        <FilterDropdown
          activeTab={filterType}
          onTabChange={(tab) => {
            setFilterType(tab);
            setPage(1);
          }}
          options={filterOptions}
          icon
        />
        {/* Sort By */}
        <div className="ml-auto">
          <FilterDropdown
            activeTab={quickSort}
            onTabChange={setQuickSort}
            options={SORT_OPTIONS}
            label="Sort by : "
          />
        </div>
      </div>

      {/* Table */}
      <div>
        <SubHeading text="Part Cost List" />
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-sm text-[#637381]">
            Loading cost database...
          </div>
        ) : (
          <>
            <CostingTable
              data={sortedAndFiltered}
              selectedRows={selectedRows}
              onToggleRow={toggleRow}
              onToggleAll={toggleAll}
              allSelected={allSelected}
              handleColSort={handleColSort}
              sortKey={sortKey}
              sortDir={sortDir}
              onActionClick={handleEdit}
              actionLabel="Edit"
            />
            {data && data.total > 0 && (
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                totalItems={data.total}
                itemsPerPage={limit}
                rowsPerPage={limit}
                onRowsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                rowsPerPageOptions={[20, 50, 100, 200]}
              />
            )}
          </>
        )}
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload BOM File"
        subtitle="Please upload your BOM file to continue."
        fileLabel="BOM File"
        onUpload={onUploadBOM}
      />

      <PartCostModal
        isOpen={isPartModalOpen}
        onClose={() => setIsPartModalOpen(false)}
        onSave={onSavePart}
        initialData={selectedPart}
        mode={modalMode}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        title={successConfig.title}
        subTitle={successConfig.subTitle}
        buttonText={successConfig.buttonText}
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default CostingView;
