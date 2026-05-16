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

const mockData = [
  { id: 1, partName: "'30_VRR48'", partColour: "'--'", costUnit: "'FT'", mbsCost: 2.6, currentMarketCost: null, description: "'VRR+ Insul R10'" },
  { id: 2, partName: "'30_VRR72'", partColour: "'__'", costUnit: "'FT'", mbsCost: 3.9, currentMarketCost: null, description: "'VRR+ Insul R10'" },
  { id: 3, partName: "'35_VRR48'", partColour: "'__'", costUnit: "'FT'", mbsCost: 2.9, currentMarketCost: null, description: "'VRR+ Insul R11'" },
  { id: 4, partName: "'35_VRR72'", partColour: "'__'", costUnit: "'FT'", mbsCost: 4.4, currentMarketCost: null, description: "'VRR+ Insul R11'" },
  { id: 5, partName: "'40_VRR48'", partColour: "'__'", costUnit: "'FT'", mbsCost: 3.3, currentMarketCost: null, description: "'VRR+ Insul R13'" },
  { id: 6, partName: "'40_VRR72'", partColour: "'__'", costUnit: "'FT'", mbsCost: 4.9, currentMarketCost: null, description: "'VRR+ Insul R13'" },
  { id: 7, partName: "'60_VRR48'", partColour: "'__'", costUnit: "'FT'", mbsCost: 4.2, currentMarketCost: null, description: "'VRR+ Insul R19'" },
  { id: 8, partName: "'60_VRR72'", partColour: "'__'", costUnit: "'FT'", mbsCost: 6.3, currentMarketCost: null, description: "'VRR+ Insul R19'" },
  { id: 9, partName: "'30_UF48 '", partColour: "'__'", costUnit: "'FT'", mbsCost: 2.6, currentMarketCost: null, description: "-" },
  { id: 10, partName: "'30_UF72 '", partColour: "'__'", costUnit: "'FT'", mbsCost: 3.9, currentMarketCost: null, description: "'UF Insul R10 '" },
  { id: 11, partName: "'35_UF48 '", partColour: "'__'", costUnit: "'FT'", mbsCost: 2.9, currentMarketCost: null, description: "'UF Insul R10 '" },
  { id: 12, partName: "'35_UF72 '", partColour: "'__'", costUnit: "'FT'", mbsCost: 4.4, currentMarketCost: null, description: "'UF Insul R11 '" },
  { id: 13, partName: "'40_UF48 '", partColour: "'__'", costUnit: "'FT'", mbsCost: 2.9, currentMarketCost: null, description: "'UF Insul R11 '" },
  { id: 14, partName: "'40_UF72''", partColour: "'__'", costUnit: "'FT'", mbsCost: 4.4, currentMarketCost: null, description: "'UF Insul R13 '" },
];

type SortKey = "partName" | "partColour" | "costUnit" | "mbsCost" | "currentMarketCost" | "description";

const SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
  { label: "Part Name A-Z", value: "partName_asc" },
  { label: "Part Name Z-A", value: "partName_desc" },
  { label: "MBS Cost ↑", value: "mbsCost_asc" },
  { label: "MBS Cost ↓", value: "mbsCost_desc" },
];

const FILTER_BY_OPTIONS = [
  { label: "Filter", value: "" },
  { label: "All Items", value: "all" },
  { label: "Steel Parts", value: "steel" },
  { label: "Insulation", value: "insulation" },
  { label: "Hardware", value: "hardware" },
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

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [quickSort, setQuickSort] = useState("latest");

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

  const handleColSort = (key: SortKey) => {
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


  const filtered = useMemo(() => {
    let data = [...mockData];

    // Category Filtering
    if (filterType !== "all") {
      if (filterType === "steel") {
        data = data.filter(item => item.partName.includes("VRR") || item.partName.includes("UF"));
      } else if (filterType === "insulation") {
        data = data.filter(item => item.description.toLowerCase().includes("insul"));
      } else if (filterType === "hardware") {
        data = data.filter(item => item.partName.toLowerCase().includes("hard") || item.description === "-");
      }
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) => r.partName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }
    if (sortKey && sortDir) {
      data.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    } else if (quickSort === "oldest") {
      data.reverse();
    }
    return data;
  }, [searchTerm, sortKey, sortDir, quickSort, filterType]);

  const allSelected = selectedRows.length === filtered.length && filtered.length > 0;
  const toggleAll = () => setSelectedRows(allSelected ? [] : filtered.map((r) => r.id));
  const toggleRow = (id: number) =>
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

  const onSavePart = (data: any) => {
    console.log(data);
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
          value="$24,400"
          subtitle="All parts combined"
          icon={DollarSign}
          gradient="linear-gradient(135deg, #2B7FFF 0%, #155DFC 100%)"
        />
        <StatCard
          title="Total Items"
          value="120"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#155DFC]/20 transition-all placeholder:text-gray-400"
          />
        </div>
        {/* Filter */}
        <FilterDropdown
          activeTab={filterType}
          onTabChange={setFilterType}
          options={FILTER_BY_OPTIONS}
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
        <CostingTable
          data={filtered}
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
