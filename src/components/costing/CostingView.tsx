import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  DollarSign,
  TrendingUp,
  FileText,
  Upload,
  CirclePlus,
} from "lucide-react";
import Button from "../common_component/Button";
import { StatCard } from "../delivery/FreightRequestDetailsView";
import FilterDropdown from "../common_component/FilterDropdown";
import SubHeading from "../common_component/SubHeading";
import TitleSubtitle from "../common_component/TitleSubtitle";
import { UploadModal } from "../projects/ProjectUploadModals";
import SuccessModal from "../common_component/SuccessModal";
import PartCostModal from "./PartCostModal";
import CostingTable from "./CostingTable";
import PageWrapper from "../common_component/PageWrapper";
import Pagination from "../Pagination";
import { useGetSmdtCostListQuery } from "../../redux/api/costingApi";

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
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  // Fetch SMDT Cost list from active cost version
  const { data, isLoading } = useGetSmdtCostListQuery({
    category: filterType || undefined,
    search: searchTerm.trim() || undefined,
    page,
    limit,
  });

  const activeVersionName = data?.activeVersion?.name ?? "No Upload Yet";
  const items = data?.items ?? [];
  const categories = data?.categories ?? [];

  // Reset selected rows when data changes
  React.useEffect(() => {
    setSelectedRows([]);
  }, [data]);

  // Derive filter categories options dynamically
  const filterOptions = useMemo(() => {
    const base = [
      { label: "All Categories", value: "" }
    ];
    return [
      ...base,
      ...categories.map(cat => ({ label: cat, value: cat }))
    ];
  }, [categories]);

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

  // Perform client-side sorting of the fetched page items
  const sortedAndFiltered = useMemo(() => {
    let list = [...items];
    if (sortKey && sortDir) {
      list.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    } else if (quickSort === "oldest") {
      list.reverse();
    }
    return list;
  }, [items, sortKey, sortDir, quickSort]);

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <TitleSubtitle title="Item Cost List"/>
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Button variant="white" size="sm" className="gap-2">
            <Upload size={16} /> Export
          </Button>
          <Button variant="grayFilled" size="sm" onClick={() => setIsModalOpen(true)}>
            <CirclePlus size={16} /> Check BOM Costing
          </Button>
          <Button variant="gradient" size="sm" onClick={handleAdd}>
            <CirclePlus size={16} /> Add New Item/Part Cost
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <StatCard
          title="Total Item Cost"
          value={activeVersionName}
          subtitle="Active Cost Version"
          icon={DollarSign}
          gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)"
        />
        <StatCard
          title="Total Items"
          value={data?.total !== undefined ? String(data.total) : "0"}
          subtitle="In cost database"
          icon={TrendingUp}
          gradient="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
        />
        <StatCard
          title="New Added"
          value="2"
          subtitle="Recently added parts"
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
        <SubHeading text="Part Cost List"/>
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
