import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PencilLine,
  Mail,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  ChevronDown,
  ArrowUpDown,
  Link,
  Search,
} from "lucide-react";
import PageWrapper from "../common_component/PageWrapper";
import SubHeading from "../common_component/SubHeading";
import Button from "../common_component/Button";
import FilterDropdown from "../common_component/FilterDropdown";
import Pagination from "../Pagination";
import verify from "@/assets/icon/verify.svg";
import pdfIcon from "@/assets/icon/pdfIcon.svg";

const carrierData = {
  id: "DLV-2051",
  name: "IronHaul Logistics",
  status: "Active",
  rating: 4.7,
  address: "4712 Cherry Ridge Drive Rochester, NY 14620.",
  email: "john@example.com",
  phone: "+1 58578 54840",
  website: "www.example.com",
  lastAwarded: "Mar 18, 2026",
  serviceCategory: "Construction Material Transport",
  avgResponseTime: "responds within 45 min",
  fleet: {
    flatbed: 18,
    dryVan: 12,
    refrigerated: 5,
    heavyHaul: 4,
    totalVehicles: 32,
    maxCapacity: "30 Tons",
    avgAge: "4.2 Years",
  },
  notes:
    "Reliable for long-distance steel transport. Preferred carrier for Texas routes. Fast response time during bidding.",
  assignedProjects: [
    {
      id: "ORD00025",
      route: "Dallas → Austin",
      cargo: "Steel Beams",
      date: "Aug 12",
      status: "Assigned",
    },
    {
      id: "ORD00024",
      route: "Houston → Dallas",
      cargo: "Cement",
      date: "Aug 12",
      status: "Assigned",
    },
    {
      id: "ORD00023",
      route: "Austin → Houston",
      cargo: "Iron Rods",
      date: "Aug 12",
      status: "Assigned",
    },
  ],
  freightHistory: [
    { id: "ORD00025", route: "Dallas → Austin", cargo: "Steel Beams", date: "Aug 12", status: "Delivered" },
    { id: "ORD00024", route: "Houston → Dallas", cargo: "Cement", date: "Aug 12", status: "Delivered" },
    { id: "ORD00023", route: "Austin → Houston", cargo: "Iron Rods", date: "Aug 12", status: "Delivered" },
    { id: "ORD00022", route: "Houston → Dallas", cargo: "Cement", date: "Aug 12", status: "Delivered" },
    { id: "ORD00019", route: "Dallas → Austin", cargo: "Steel Beams", date: "Aug 12", status: "Delivered" },
    { id: "ORD00018", route: "Austin → Dallas", cargo: "Glass", date: "Aug 10", status: "Delivered" },
    { id: "ORD00017", route: "Dallas → Houston", cargo: "Metal Plates", date: "Aug 08", status: "Delivered" },
  ],
  complianceDocs: [
    { name: "Insurance certificate", size: "6.1 MB", type: "PDF", expiry: "Mar 15, 2025" },
    { name: "Material certifications", size: "5.2 MB", type: "PDF", expiry: "Jan 8, 2025" },
    { name: "Contracts", size: "6.1 MB", type: "PDF", expiry: "Mar 15, 2025" },
    { name: "Pricing sheets", size: "6.1 MB", type: "PDF", expiry: "Mar 15, 2025" },
  ]
};

const CarrierDetailsView: React.FC = () => {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [assignedSort, setAssignedSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [historySort, setHistorySort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [complianceSort, setComplianceSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [docSort, setDocSort] = useState("Docs Type");
  const [docSearch, setDocSearch] = useState("");

  const handleSort = (table: "assigned" | "history" | "compliance", key: string) => {
    const setters = {
      assigned: { state: assignedSort, setter: setAssignedSort },
      history: { state: historySort, setter: setHistorySort },
      compliance: { state: complianceSort, setter: setComplianceSort },
    };
    const { state, setter } = setters[table];
    let direction: "asc" | "desc" = "asc";
    if (state?.key === key && state.direction === "asc") {
      direction = "desc";
    }
    setter({ key, direction });
  };

  const sortedAssigned = useMemo(() => {
    let items = [...carrierData.assignedProjects];
    if (assignedSort) {
      items.sort((a: any, b: any) => {
        if (a[assignedSort.key] < b[assignedSort.key]) return assignedSort.direction === "asc" ? -1 : 1;
        if (a[assignedSort.key] > b[assignedSort.key]) return assignedSort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [assignedSort]);

  const sortedHistory = useMemo(() => {
    let items = [...carrierData.freightHistory];
    if (historySort) {
      items.sort((a: any, b: any) => {
        if (a[historySort.key] < b[historySort.key]) return historySort.direction === "asc" ? -1 : 1;
        if (a[historySort.key] > b[historySort.key]) return historySort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [historySort]);

  const sortedDocs = useMemo(() => {
    let docs = [...carrierData.complianceDocs];
    if (docSearch) {
      docs = docs.filter(doc => doc.name.toLowerCase().includes(docSearch.toLowerCase()));
    }
    
    // Primary sort from dropdown
    if (docSort !== "Docs Type") {
      docs.sort((a, b) => {
        if (docSort === "Name") return a.name.localeCompare(b.name);
        if (docSort === "Size") return b.size.localeCompare(a.size);
        return 0;
      });
    }

    // Secondary sort from table header
    if (complianceSort) {
      docs.sort((a: any, b: any) => {
        if (a[complianceSort.key] < b[complianceSort.key]) return complianceSort.direction === "asc" ? -1 : 1;
        if (a[complianceSort.key] > b[complianceSort.key]) return complianceSort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return docs;
  }, [docSort, docSearch, complianceSort]);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-[#051321]" />
          </button>
          <h1 className="text-xl font-bold text-[#051321]">Carriers</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-[#F7F8F9] rounded-[14px] p-3 md:p-6 shadow-sm relative">
              <div className="flex justify-between items-start mb-6 ">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm">
                    <span className="text-[#7539FF] font-normal">
                      {carrierData.id}
                    </span>
                    <div className="flex items-center gap-2 text-[#051321]">
                      ⭐
                      <span className="font-normal">
                        {carrierData.rating} / 5
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#051321] truncate">
                      {carrierData.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 ml-4">
                      <img src={verify} alt="verify" className="size-4" />
                      <p className="text-[#34C759] font-medium text-sm">
                        {carrierData.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-[#5D6772]">
                    <MapPin size={14} />
                    <span>{carrierData.address}</span>
                  </div>
                </div>
                <Button
                  variant="white"
                  className="flex items-center gap-2 text-sm font-semibold h-10 px-4"
                >
                  <PencilLine size={16} /> Edit Profile
                </Button>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 md:p-5 bg-white rounded-[14px] shadow-xs mb-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#051321] flex items-center gap-2 uppercase tracking-wide">
                    <Mail size={14} /> Email Address
                  </p>
                  <p className="text-sm text-[#5D6772]">{carrierData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#051321] flex items-center gap-2 uppercase tracking-wide">
                    <Phone size={14} /> Phone
                  </p>
                  <p className="text-sm text-[#5D6772]">{carrierData.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#051321] flex items-center gap-2 uppercase tracking-wide">
                    <Globe size={14} /> Website
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#5D6772]">
                      {carrierData.website}
                    </span>
                    <Link size={14} className="text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3 md:p-5 rounded-[14px] shadow-xs bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-1 bg-[#637381] rounded-full" />
                    <p className="text-xs font-bold text-[#051321] uppercase tracking-wide">
                      Last awarded
                    </p>
                  </div>
                  <p className="text-sm text-[#5D6772] pl-3">
                    {carrierData.lastAwarded}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-1 bg-[#637381] rounded-full" />
                    <p className="text-xs font-bold text-[#051321] uppercase tracking-wide">
                      Service Category
                    </p>
                  </div>
                  <p className="text-sm text-[#5D6772] pl-3">
                    {carrierData.serviceCategory}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="size-1 bg-[#637381] rounded-full" />
                    <p className="text-xs font-bold text-[#051321] uppercase tracking-wide">
                      Avg Response Time
                    </p>
                  </div>
                  <p className="text-sm text-[#5D6772] pl-3">
                    {carrierData.avgResponseTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Fleet & Equipment Details */}
            <div className="bg-white rounded-[14px] p-3 md:p-6 shadow-xs mt-6">
              <SubHeading text="Fleet & Equipment Details" />
              <div className="h-px bg-[#E2E4E6] my-6" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Flatbed Trucks", value: carrierData.fleet.flatbed },
                  { label: "Dry Vans", value: carrierData.fleet.dryVan },
                  {
                    label: "Refrigerated Trucks",
                    value: carrierData.fleet.refrigerated,
                  },
                  {
                    label: "Heavy Haul Trailers",
                    value: carrierData.fleet.heavyHaul,
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-1 bg-[#637381] rounded-full" />
                      <p className="text-xs font-semibold text-[#051321] tracking-wide">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-normal text-[#5D6772] pl-3">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <SubHeading text="Fleet Capacity" />
              <div className="h-px bg-[#E2E4E6] my-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Total Vehicles",
                    value: carrierData.fleet.totalVehicles,
                  },
                  {
                    label: "Maximum Load Capacity",
                    value: carrierData.fleet.maxCapacity,
                  },
                  {
                    label: "Average Fleet Age",
                    value: carrierData.fleet.avgAge,
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="size-1 bg-[#637381] rounded-full" />
                      <p className="text-sm font-semibold text-[#051321] tracking-wide">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm font-normal text-[#5D6772] pl-3">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Projects Table */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <SubHeading text="Assigned Projects" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-[#F4F6F8]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Freight ID
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("assigned", "route")}
                      >
                        <div className="flex items-center gap-1">
                          Route <ArrowUpDown size={14} className={assignedSort?.key === "route" ? "text-blue-500" : "text-gray-400"} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("assigned", "cargo")}
                      >
                        <div className="flex items-center gap-1">
                          Cargo <ArrowUpDown size={14} className={assignedSort?.key === "cargo" ? "text-blue-500" : "text-gray-400"} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("assigned", "date")}
                      >
                        <div className="flex items-center gap-1">
                          Delivery Date <ArrowUpDown size={14} className={assignedSort?.key === "date" ? "text-blue-500" : "text-gray-400"} />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E4E6]">
                    {sortedAssigned.map((project, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-[#5D6772] font-medium">
                          {project.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#051321] font-semibold">
                          {project.route}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#5D6772]">
                          {project.cargo}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#051321] font-medium">
                          {project.date}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                            {project.status} <CheckCircle2 size={14} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Freight History Table */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <SubHeading text="Freight History" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-[#F4F6F8]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">Freight ID</th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("history", "route")}
                      >
                        <div className="flex items-center gap-1">Route <ArrowUpDown size={14} className={historySort?.key === "route" ? "text-blue-500" : "text-gray-400"} /></div>
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("history", "cargo")}
                      >
                        <div className="flex items-center gap-1">Cargo <ArrowUpDown size={14} className={historySort?.key === "cargo" ? "text-blue-500" : "text-gray-400"} /></div>
                      </th>
                      <th 
                        className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("history", "date")}
                      >
                        <div className="flex items-center gap-1">Delivery Date <ArrowUpDown size={14} className={historySort?.key === "date" ? "text-blue-500" : "text-gray-400"} /></div>
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E4E6]">
                    {sortedHistory.map((project, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-[#006CE4] font-medium underline cursor-pointer">
                          {project.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#051321] font-semibold">{project.route}</td>
                        <td className="px-6 py-4 text-sm text-[#5D6772]">{project.cargo}</td>
                        <td className="px-6 py-4 text-sm text-[#051321] font-medium">{project.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[#34C759] bg-[#E8F9EE] px-2.5 py-1 rounded-full w-fit border border-[#34C759]">
                            {project.status} <CheckCircle2 size={14} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Pagination 
                  currentPage={currentPage}
                  totalItems={carrierData.freightHistory.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={setRowsPerPage}
                />
              </div>
            </div>

            {/* Compliance & Certifications */}
            <div className="bg-white rounded-[14px] shadow-sm p-3 md:p-6 border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between">
                <SubHeading text="Compliance & Certifications" />
                <ChevronDown size={20} className="text-[#637381]" />
              </div>
              <div className="w-full h-px bg-gray-100 my-4" />
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <p className="text-sm font-bold text-[#111827]">
                    Total No of Documents : {carrierData.complianceDocs.length}
                  </p>
                  <div className="flex items-center gap-3">
                    <FilterDropdown
                      label="Sort By :"
                      activeTab={docSort}
                      onTabChange={setDocSort}
                      options={[
                        { label: "Docs Type", value: "Docs Type" },
                        { label: "Name", value: "Name" },
                        { label: "Size", value: "Size" },
                      ]}
                    />
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-[200px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-[#F4F6F8]">
                      <tr>
                        <th 
                          className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("compliance", "name")}
                        >
                          <div className="flex items-center gap-1">Name <ArrowUpDown size={14} className={complianceSort?.key === "name" ? "text-blue-500" : "text-gray-400"} /></div>
                        </th>
                        <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">Size</th>
                        <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">Type</th>
                        <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E4E6] bg-white">
                      {sortedDocs.map((doc, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#F8F9FA] rounded-md shrink-0 border border-gray-100">
                                <img src={pdfIcon} alt="PDF" className="size-5" />
                              </div>
                              <span className="text-sm font-medium text-[#111827] truncate">
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#5D6772]">{doc.size}</td>
                          <td className="px-6 py-4 text-sm text-[#5D6772]">{doc.type}</td>
                          <td className="px-6 py-4 text-sm text-[#051321] font-medium">{doc.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-6">
            {/* Notes Card */}
            <div className="bg-white rounded-[14px] p-6 shadow-sm ">
              <SubHeading text="Notes" />
              <div className="h-px bg-gray-100 my-6" />
              <p className="text-sm text-[#637381] leading-relaxed">
                {carrierData.notes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CarrierDetailsView;
