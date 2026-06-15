import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Upload, ArrowLeft } from "lucide-react";
import Button from "../common_component/Button";
import Heading from "../common_component/Heading";
import SubHeading from "../common_component/SubHeading";
import FilterDropdown from "../common_component/FilterDropdown";
import PageWrapper from "../common_component/PageWrapper";
import CostingTable from "./CostingTable";
import PartCostModal from "./PartCostModal";
import SuccessModal from "../common_component/SuccessModal";
import { useGetBOMDetailsQuery, useUpdateBOMItemPriceMutation } from "@/redux/api/projectApi";

const SORT_OPTIONS = [
  // { label: "Latest", value: "latest" },
  // { label: "Oldest", value: "oldest" },
  { label: "Part Name A-Z", value: "partName_asc" },
  { label: "Part Name Z-A", value: "partName_desc" },
];

const FILTER_OPTIONS = [
  { label: "Filter", value: "" },
  { label: "All Items", value: "all" },
  { label: "Steel", value: "steel" },
  { label: "Insulation", value: "insulation" },
];

const MissingItemCostListView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [quickSort, setQuickSort] = useState("latest");
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successConfig, setSuccessConfig] = useState({
    title: "Item/Part Cost",
    subTitle: "Saved Successfully",
    navigatePath: "",
  });

  const { data, isLoading, error } = useGetBOMDetailsQuery(
    {
      jobId: id || "",
      filter: "unpriced",
      page: 1,
      limit: 100,
    },
    { skip: !id }
  );
  const [updateBOMItemPrice] = useUpdateBOMItemPriceMutation();

  const bomItems = useMemo(() => {
    if (!data?.itemsByCategory) return [];
    return Object.values(data.itemsByCategory)
      .flat()
      .map((item) => ({
        _id: item._id,
        id: item._id,
        partName: item.partCode,
        partColor: item.partColor,
        costUnit: item.costUnit || "FT",
        cost: "Missing",
        currentMarketCost: "-",
        description: item.description || "",
        category: item.category || "",
      }));
  }, [data]);

  type SortKey = "partName" | "partColor" | "costUnit" | "cost" | "currentMarketCost" | "description";

  const sortKey: SortKey | null = (() => {
    if (quickSort === "partName_asc" || quickSort === "partName_desc") return "partName";
    return null;
  })();
  const sortDir: "asc" | "desc" | null = (() => {
    if (quickSort.endsWith("_asc")) return "asc";
    if (quickSort.endsWith("_desc")) return "desc";
    return null;
  })();

  const handleColSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setQuickSort(`${key}_desc`);
      else setQuickSort("latest");
    } else {
      setQuickSort(`${key}_asc`);
    }
  };

  const filteredData = useMemo(() => {
    let result = [...bomItems];

    // Category Filtering
    if (filterType !== "" && filterType !== "all") {
      result = result.filter(item => {
        const cat = item.category?.toLowerCase();
        if (cat === filterType.toLowerCase()) return true;
        if (filterType === "steel") {
          return item.partName.includes("VRR") || item.partName.includes("UF");
        } else if (filterType === "insulation") {
          return item.description.toLowerCase().includes("insul");
        }
        return false;
      });
    }

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) => r.partName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortKey && sortDir) {
      result.sort((a: any, b: any) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [bomItems, searchTerm, filterType, sortKey, sortDir]);

  const allSelected = selectedRows.length === filteredData.length && filteredData.length > 0;
  const toggleAll = () => setSelectedRows(allSelected ? [] : filteredData.map((r) => r.id));
  const toggleRow = (id: string | number) =>
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);

  const handleActionClick = (row: any) => {
    setSelectedPart(row);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    console.log("Saved data:", data);
    if (!selectedPart?._id) return;
    try {
      await updateBOMItemPrice({
        bomItemId: selectedPart._id,
        manualUnitCost: Number(data.mbsCost),
        saveToSMDT: false,
        jobId: id,
      }).unwrap();

      setIsModalOpen(false);
      setSuccessConfig({
        title: "Item/Part Cost",
        subTitle: "Saved Successfully",
        navigatePath: "",
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Failed to save BOM item manual price:", error);
      throw error;
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    if (successConfig.navigatePath) {
      navigate(successConfig.navigatePath);
    }
  };

  const handleExportExcel = () => {
    const headers = ["Part Name", "Part Colour", "Cost Unit", "Cost", "Current Market Cost", "Description"];
    const rows = filteredData.map(row => [
      `"${(row.partName || "").replace(/"/g, '""')}"`,
      `"${(row.partColor || "").replace(/"/g, '""')}"`,
      `"${(row.costUnit || "").replace(/"/g, '""')}"`,
      `"${(row.cost || "").replace(/"/g, '""')}"`,
      `"${(row.currentMarketCost || "").replace(/"/g, '""')}"`,
      `"${(row.description || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BOM_${id}_missing_items_cost_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E51A4]"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="p-8 text-center bg-white rounded-[14px] border border-gray-100 space-y-4">
          <h3 className="text-lg font-bold text-red-600">Error Loading Unmatched Items</h3>
          <p className="text-sm text-gray-500">Could not retrieve unmatched items for BOM Job ID: {id}</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            size="sm"
            className="h-9 px-4 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> Back
          </Button>
          <Heading text="Missing Item Cost List" />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <Button
            variant="white"
            size="sm"
            className="gap-2"
            onClick={handleExportExcel}
          >
            <Upload size={16} /> Export
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-[#F7F8F9] rounded-[14px] p-3 lg:p-6 max-w-sm space-y-4 shadow-sm">
        <SubHeading text="Missing Item in Cost List" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-[#212B36]">Missing QTY</span>
          <span className="text-sm font-semibold text-[#212B36]">
            {data?.summary?.unpricedItems ?? bomItems.length}
          </span>
        </div>
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
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
        <FilterDropdown
          activeTab={filterType}
          onTabChange={setFilterType}
          options={FILTER_OPTIONS}
          icon
        />
        <div className="ml-auto">
          <FilterDropdown
            activeTab={quickSort}
            onTabChange={setQuickSort}
            options={SORT_OPTIONS}
            label="Sort by : "
          />
        </div>
      </div>

      {/* Table Section */}
      <div>
        <SubHeading text="Missing Item in Cost List" />
        <CostingTable
          data={filteredData}
          selectedRows={selectedRows}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          allSelected={allSelected}
          handleColSort={handleColSort}
          sortKey={sortKey}
          sortDir={sortDir}
          onActionClick={handleActionClick}
          actionLabel="Add"
          isMissingView={true}
        />
      </div>

      <PartCostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedPart}
        mode="add"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        title={successConfig.title}
        subTitle={successConfig.subTitle}
        buttonText="Ok"
        isLogoBottom={false}
      />
    </PageWrapper>
  );
};

export default MissingItemCostListView;
