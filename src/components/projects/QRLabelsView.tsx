import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ArrowDownUp,
  CircleX,
  CheckCircle2,
} from "lucide-react";
import Button from "../common_component/Button";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import TitleSubtitle from "../common_component/TitleSubtitle";
import FilterDropdown from "../common_component/FilterDropdown";
import Pagination from "../Pagination";
import CommonCheckbox from "../common_component/CommonCheckbox";
import QRCodeDataModal from "./QRCodeDataModal";

const mockQRLabels = [
  { id: "BND-101", loadId: "LOAD-101", parts: "STL-4135", weight: "18,500 IBS", length: "20 ft", status: "Printed" },
  { id: "BND-102", loadId: "LOAD-102", parts: "STL-4135", weight: "37,700 IBS", length: "20 ft", status: "Generated" },
  { id: "BND-103", loadId: "LOAD-103", parts: "STL-4135", weight: "21,400 IBS", length: "17 ft", status: "Printed" },
  { id: "BND-104", loadId: "LOAD-104", parts: "STL-4135", weight: "18,500 IBS", length: "20 ft", status: "Generated" },
  { id: "BND-105", loadId: "LOAD-105", parts: "STL-4135", weight: "37,700 IBS", length: "20 ft", status: "Printed" },
  { id: "BND-106", loadId: "LOAD-106", parts: "STL-4135", weight: "21,400 IBS", length: "17 ft", status: "Generated" },
  { id: "BND-107", loadId: "LOAD-107", parts: "STL-4135", weight: "18,500 IBS", length: "20 ft", status: "Printed" },
  { id: "BND-108", loadId: "LOAD-108", parts: "STL-4135", weight: "37,700 IBS", length: "20 ft", status: "Generated" },
  { id: "BND-109", loadId: "LOAD-109", parts: "STL-4135", weight: "18,500 IBS", length: "20 ft", status: "Generated" },
  { id: "BND-110", loadId: "LOAD-110", parts: "STL-4135", weight: "37,700 IBS", length: "20 ft", status: "Printed" },
  { id: "BND-111", loadId: "LOAD-111", parts: "STL-4135", weight: "21,400 IBS", length: "17 ft", status: "Generated" },
  { id: "BND-112", loadId: "LOAD-112", parts: "STL-4135", weight: "18,500 IBS", length: "20 ft", status: "Printed" },
  { id: "BND-113", loadId: "LOAD-113", parts: "STL-4135", weight: "37,700 IBS", length: "20 ft", status: "Printed" },
];

type SortKey = "parts" | "weight" | "length" | null;
type SortOrder = "asc" | "desc";

const QRLabelsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProject, setActiveProject] = useState("all");
  const [activeSort, setActiveSort] = useState("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({ key: null, order: "asc" });

  const handleViewDetails = (item: any) => {
    setSelectedLabel(item);
    setIsModalOpen(true);
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      order: prev.key === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const parseValue = (val: string) => {
    return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
  };

  const sortedLabels = useMemo(() => {
    let result = [...mockQRLabels];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.loadId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.parts.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA: any = a[sortConfig.key!];
        let valB: any = b[sortConfig.key!];

        if (sortConfig.key === "weight" || sortConfig.key === "length") {
          valA = parseValue(valA);
          valB = parseValue(valB);
        }

        if (valA < valB) return sortConfig.order === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.order === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, sortConfig]);

  const projectOptions = [
    { label: "Select Project", value: "all" },
    { label: "ABC Construction", value: "abc" },
    { label: "XYZ Construction", value: "xyz" },
    { label: "PQR Construction", value: "pqr" },
  ];

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <TitleSubtitle
          title="QR Labels"
          subtitle="Generate, manage, and print QR labels for bundles and pallets to enable tracking and verification across plant and field operations."
        />
        <Button variant="white" size="sm">
          <Download size={18} className="mr-2" /> Export
        </Button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E51A4]/10 transition-all"
            />
          </div>
          <FilterDropdown
            activeTab={activeProject}
            onTabChange={setActiveProject}
            options={projectOptions}
          />
        </div>
        <FilterDropdown
          activeTab={activeSort}
          onTabChange={setActiveSort}
          options={sortOptions}
          label="Sort by :"
        />
      </div>

      {/* QR Labels Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead>
              <tr className="bg-(--bg-light-gray) border-b border-gray-100">
                <th className="p-2 md:p-4 w-12 text-center">
                  <CommonCheckbox checked={false} onChange={() => {}} size="sm" />
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm">Bundle ID</th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm">Load ID</th>
                <th 
                  className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("parts")}
                >
                  <div className="flex items-center gap-1">
                    Parts 
                    <ArrowDownUp 
                      size={14} 
                      className={sortConfig.key === "parts" ? "text-[#1E51A4]" : "text-(--text-color-gray-4)"} 
                    />
                  </div>
                </th>
                <th 
                  className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("weight")}
                >
                  <div className="flex items-center gap-1">
                    Weight 
                    <ArrowDownUp 
                      size={14} 
                      className={sortConfig.key === "weight" ? "text-[#1E51A4]" : "text-(--text-color-gray-4)"} 
                    />
                  </div>
                </th>
                <th 
                  className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSort("length")}
                >
                  <div className="flex items-center gap-1">
                    Length 
                    <ArrowDownUp 
                      size={14} 
                      className={sortConfig.key === "length" ? "text-[#1E51A4]" : "text-(--text-color-gray-4)"} 
                    />
                  </div>
                </th>
                <th className="p-2 md:p-4 text-[#212B36] font-inter font-semibold text-sm">Status</th>
                <th className="p-2 md:p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sortedLabels.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-2 md:p-4 text-center">
                    <CommonCheckbox checked={false} onChange={() => {}} size="sm" />
                  </td>
                  <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-4) font-medium">{item.id}</td>
                  <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-4) font-normal">{item.loadId}</td>
                  <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-5) font-medium">{item.parts}</td>
                  <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-5) font-normal">{item.weight}</td>
                  <td className="p-2 md:p-4 text-sm font-inter text-(--text-color-gray-5) font-normal">{item.length}</td>
                  <td className="p-2 md:p-4">
                    <CommonStatusBadge
                      text={item.status}
                      variant={item.status === "Printed" ? "green" : "blue"}
                      icon={
                        item.status === "Printed" ? <CheckCircle2 size={14} /> : 
                        item.status === "Generated" ? <CircleX size={14} /> : 
                        undefined
                      }
                    />
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="gradient" 
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                      >
                        View
                      </Button>
                      <Button variant="mint" size="sm"  onClick={() => handleViewDetails(item)}>
                        Print
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={1} onPageChange={() => {}} />

      <QRCodeDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedLabel}
      />
    </div>
  );
};

export default QRLabelsView;
