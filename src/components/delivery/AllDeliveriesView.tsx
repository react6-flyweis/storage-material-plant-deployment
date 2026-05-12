import React, { useState } from "react";
import { 
  Search, 
  Download, 
  FileText, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Settings2,
  RotateCcw,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  Phone,
  Mail
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import CommonDropdown from "../common_component/CommonDropdown";

const statsData = [
  { title: "Draft", value: "1", icon: FileText, color: "text-[#D08700]", bgColor: "bg-[#FFF9E6]" },
  { title: "Total", value: "12", icon: Truck, color: "text-[#4A5565]", bgColor: "bg-[#F4F6F8]" },
  { title: "Scheduled", value: "4", icon: Calendar, color: "text-[#155DFC]", bgColor: "bg-[#E6F0FF]" },
  { title: "Confirmed", value: "3", icon: CheckCircle2, color: "text-[#00C853]", bgColor: "bg-[#E6FFEF]" },
  { title: "In Transit", value: "3", icon: Truck, color: "text-[#4A5565]", bgColor: "bg-[#F4F6F8]" },
  { title: "Delivered", value: "2", icon: CheckCircle2, color: "text-[#4A5565]", bgColor: "bg-[#F4F6F8]" },
  { title: "Delayed", value: "1", icon: AlertTriangle, color: "text-[#FF4842]", bgColor: "bg-[#FFE9E9]" },
  { title: "Cancelled", value: "1", icon: X, color: "text-[#FF4842]", bgColor: "bg-[#FFE9E9]" },
];

const StatCard = ({ title, value, icon: Icon, color, bgColor }: any) => (
  <div className="bg-white p-3 md:p-4 rounded-[14px] flex items-center justify-between shadow-sm transition-all">
    <div className="space-y-1">
      <p className="text-xs sm:text-sm font-semibold text-[#4A5565]">{title}</p>
      <p className={`text-lg sm:text-xl md:text-2xl xl:text-3xl font-semibold ${color}`}>{value}</p>
    </div>
    <div className={`sm:w-12 w-10 sm:h-12 h-10 xl:w-14 xl:h-14 rounded-full ${bgColor} font-normal flex items-center justify-center shrink-0`}>
      <Icon className={`sm:size-6 size-4 xl:size-7 ${color}`} />
    </div>
  </div>
);

const AllDeliveriesView: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    Project: true,
    Customer: true,
    Vendor: true,
    Carrier: true,
    POC: true,
    DeliveryDate: true,
    Items: true,
    Equipment: true,
    Site: true,
  });

  const [filters, setFilters] = useState({
    status: "all",
    project: "all",
    customer: "all",
    vendor: "all",
    carrier: "all",
    category: "all",
    equipment: "all",
    internalOwner: "all"
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const dropdownOptions = [{ label: "All", value: "all" }, { label: "Option 1", value: "1" }];

  const tableHeaders = [
    { label: "ID", key: "ID", sortable: true },
    { label: "Status", key: "Status", sortable: true },
    { label: "Date & Time", key: "Items", sortable: true },
    { label: "Project", key: "Project", sortable: true },
    { label: "Customer", key: "Customer", sortable: true },
    { label: "Vendor", key: "Vendor", sortable: true },
    { label: "Carrier", key: "Carrier", sortable: true },
    { label: "POC", key: "POC", sortable: false },
    { label: "Delivery Date & Time Window", key: "DeliveryDate", sortable: true },
    { label: "Equipment Required", key: "Equipment", sortable: true },
    { label: "Site Location", key: "Site", sortable: true },
  ];

  return (
    <div className="xl:pr-5 pb-10 space-y-8 mt-2 font-inter min-h-screen">
      <TitleSubtitle title="All Deliveries" subtitle="Comprehensive delivery management and tracking"/>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Main Filter Bar */}
      <div className="bg-white p-4 md:p-6 rounded-[14px] shadow-xs border border-gray-50 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="relative flex-1 flex gap-2 max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 size-6" />
            <input 
              type="text" 
              placeholder="Search by ID, project, customer, item, vendor..." 
              className="w-full pl-14 pr-6 py-3 bg-[#F4F6F8] border-none rounded-lg md:text-base text-sm outline-none transition-all placeholder:text-gray-400"
            />
                 <CommonDropdown 
              value={filters.status}
              onChange={(v) => handleFilterChange("status", v)}
              options={[{ label: "All Status", value: "all" }, { label: "Draft Only", value: "draft" }, { label: "Scheduled Only", value: "scheduled" }]}
              placeholder="All Status"
              className="md:min-w-[200px]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 ml-auto">            
            <Button 
              variant="white"
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="md"
            >
              <Settings2 size={20} className="mr-3" /> Advanced Filters
            </Button>

            <Button 
              variant="outlineGreen"
              size="md"
            >
              <Download size={20} className="mr-3 text-[#00C853]" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Advanced Filters Section */}
        {showAdvanced && (
          <div className="pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#212B36]">Date From</label>
                <input type="text" placeholder="DD/MM/YYYY" className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl text-base focus:border-[#1E51A4] outline-none shadow-sm transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#212B36]">Date To</label>
                <input type="text" placeholder="DD/MM/YYYY" className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl text-base focus:border-[#1E51A4] outline-none shadow-sm transition-all" />
              </div>
              <CommonDropdown 
                label="Project"
                value={filters.project}
                onChange={(v) => handleFilterChange("project", v)}
                options={dropdownOptions}
                placeholder="All Project"
              />
              <CommonDropdown 
                label="Customer"
                value={filters.customer}
                onChange={(v) => handleFilterChange("customer", v)}
                options={dropdownOptions}
                placeholder="All Customer"
              />
              <CommonDropdown 
                label="Vendor"
                value={filters.vendor}
                onChange={(v) => handleFilterChange("vendor", v)}
                options={dropdownOptions}
                placeholder="All Vendor"
              />
              <CommonDropdown 
                label="Delivery Company"
                value={filters.carrier}
                onChange={(v) => handleFilterChange("carrier", v)}
                options={dropdownOptions}
                placeholder="All Carriers"
              />
              <CommonDropdown 
                label="Material Category"
                value={filters.category}
                onChange={(v) => handleFilterChange("category", v)}
                options={dropdownOptions}
                placeholder="All Categories"
              />
              <div className="hidden lg:block" /> {/* Spacer */}
              <CommonDropdown 
                label="Equipment Required"
                value={filters.equipment}
                onChange={(v) => handleFilterChange("equipment", v)}
                options={dropdownOptions}
                placeholder="All Equipment"
              />
              <CommonDropdown 
                label="Status"
                value={filters.status}
                onChange={(v) => handleFilterChange("status", v)}
                options={dropdownOptions}
                placeholder="All Status"
              />
              <CommonDropdown 
                label="Internal Owner"
                value={filters.internalOwner}
                onChange={(v) => handleFilterChange("internalOwner", v)}
                options={dropdownOptions}
                placeholder="All Internal Owner"
              />
              
              <div className="flex items-end">
                <Button 
                  variant="white"
                  className="w-full h-14 rounded-2xl text-[#212B36] font-bold text-base border-gray-200 shadow-sm"
                  onClick={() => setFilters({
                    status: "all", project: "all", customer: "all", vendor: "all",
                    carrier: "all", category: "all", equipment: "all", internalOwner: "all"
                  })}
                >
                  <RotateCcw size={20} className="mr-3" /> Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Info & Column Toggles */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[#637381] font-medium text-sm sm:text-base">
            Showing <span className="font-bold text-[#212B36]">1</span> to <span className="font-bold text-[#212B36]">10</span> of <span className="font-bold text-[#212B36]">12</span> deliveries
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[#637381] font-medium text-sm sm:text-base">Items per page:</span>
            <div className="w-20">
              <input 
                type="text" 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E2E4E6] rounded-lg text-center font-bold text-[#212B36] shadow-sm outline-none focus:border-[#1E51A4]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {Object.keys(visibleColumns).map((col) => (
            <div 
              key={col}
              onClick={() => toggleColumn(col)}
              className="bg-white px-4 py-3 rounded-[8px] border border-gray-100 shadow-md flex items-center gap-3 cursor-pointer select-none transition-all active:scale-95"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${visibleColumns[col] ? "bg-white border-[#00C853]" : "bg-gray-50 border-gray-200"}`}>
                {visibleColumns[col] && <Check size={14} className="text-[#00C853]" strokeWidth={3} />}
              </div>
              <span className="text-[#4A5565] font-medium text-sm md:text-base">{col}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-[14px] overflow-hidden border border-gray-100 shadow-sm flex flex-col min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-nowrap">
            <thead className="bg-[linear-gradient(90deg,_#DBEAFE_0%,_#F3E8FF_100%)]">
              <tr className="border-b border-blue-100">
                {tableHeaders.map((header) => (
                  (header.key === "ID" || header.key === "Status" || header.key === "Actions" || visibleColumns[header.key]) && (
                    <th key={header.key} className="px-6 py-5 text-[#212B36] font-bold text-sm tracking-tight">
                      <div className="flex items-center gap-1.5">
                        {header.label}
                        {header.sortable && (
                          <div className="flex flex-col -space-y-1 opacity-30">
                            <ChevronUp size={12} />
                            <ChevronDown size={12} />
                          </div>
                        )}
                      </div>
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: "DEL-1012", priority: "Normal", priorityColor: "text-[#00C853] bg-[#E6FFEF]", status: "Delay", statusColor: "text-[#155DFC] bg-[#E6F0FF]", date: "Apr 1, 2026", time: "07:30 - 11:30", item: "Steel Frame - Primary frame set", project: "ABC Logistics Warehouse", customer: "Austin McClume", vendor: "Roof Masters Ltd.", carrier: "Rapid Delivery Services", poc: "John Smith", equipment: "5,000 lb forklift", site: "Austin Warehouse", address: "Austin TX" },
                { id: "DEL-1010", priority: "High", priorityColor: "text-[#FF4842] bg-[#FFE9E9]", status: "Delay", statusColor: "text-[#155DFC] bg-[#E6F0FF]", date: "Mar 31, 2026", time: "11:00 - 15:00", item: "Doors - Roll-up doors", project: "Metro Cast Factory", customer: "Sarah Williams", vendor: "Climate Control Inc.", carrier: "FastFreight Logistics", poc: "John Smith", equipment: "Crane required", site: "Austin Warehouse", address: "Austin TX" },
                { id: "DEL-1008", priority: "Critical", priorityColor: "text-[#FFAB00] bg-[#FFF9E6]", status: "Delivered", statusColor: "text-[#00C853] bg-[#E6FFEF]", date: "Mar 30, 2026", time: "10:00 - 14:00", item: "Steel Frame - Primary frame set", project: "Warehouse Phase 2", customer: "David Martinez", vendor: "Panel Systems Inc.", carrier: "Premier Transport Co.", poc: "John Smith", equipment: "5,000 lb forklift", site: "Warehouse Alpha", address: "Dallas TX" },
                { id: "DEL-1007", priority: "Normal", priorityColor: "text-[#00C853] bg-[#E6FFEF]", status: "Delay", statusColor: "text-[#155DFC] bg-[#E6F0FF]", date: "Mar 29, 2026", time: "08:00 - 12:00", item: "Doors - Roll-up doors", project: "Storage Facility B", customer: "Patricia Davis", vendor: "Fastener Wholesale", carrier: "FastFreight Logistics", poc: "John Smith", equipment: "Crane required", site: "Storage Hub 5", address: "Houston TX" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-bold text-[#1E51A4] text-[15px]">{row.id}</span>
                      <span className={`w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.priorityColor}`}>
                        {row.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${row.statusColor}`}>
                      {row.status === "Delay" ? <Calendar size={14} /> : <CheckCircle2 size={14} />}
                      <span className="text-xs font-bold">{row.status}</span>
                    </div>
                  </td>
                  {visibleColumns.Items && (
                    <td className="px-6 py-6 max-w-[200px]">
                      <span className="font-bold text-[#212B36] text-[14px] leading-snug block whitespace-normal">
                        {row.item}
                      </span>
                    </td>
                  )}
                  {visibleColumns.Project && (
                    <td className="px-6 py-6">
                      <span className="text-[#637381] font-medium text-sm">{row.project}</span>
                    </td>
                  )}
                  {visibleColumns.Customer && (
                    <td className="px-6 py-6">
                      <span className="text-[#637381] font-medium text-sm">{row.customer}</span>
                    </td>
                  )}
                  {visibleColumns.Vendor && (
                    <td className="px-6 py-6">
                      <span className="text-[#637381] font-medium text-sm">{row.vendor}</span>
                    </td>
                  )}
                  {visibleColumns.Carrier && (
                    <td className="px-6 py-6">
                      <span className="text-[#637381] font-medium text-sm">{row.carrier}</span>
                    </td>
                  )}
                  {visibleColumns.POC && (
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-[#212B36] text-sm truncate max-w-[120px]">POC {row.poc}</span>
                        <div className="flex items-center gap-2">
                          <button className="text-[#1E51A4] hover:bg-blue-50 p-1 rounded-md transition-colors">
                            <Phone size={14} />
                          </button>
                          <button className="text-[#1E51A4] hover:bg-blue-50 p-1 rounded-md transition-colors">
                            <Mail size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleColumns.DeliveryDate && (
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#212B36] text-[15px]">{row.date}</span>
                        <span className="text-[#637381] text-xs font-medium">{row.time}</span>
                      </div>
                    </td>
                  )}
                  {visibleColumns.Equipment && (
                    <td className="px-6 py-6">
                      <span className="text-[#637381] font-medium text-sm whitespace-normal max-w-[150px] block">
                        {row.equipment}
                      </span>
                    </td>
                  )}
                  {visibleColumns.Site && (
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[#212B36] text-sm">{row.site}</span>
                        <span className="text-[#637381] text-xs font-medium"> – {row.address}</span>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-white mt-auto">
          <p className="text-sm font-bold text-[#637381]">Showing 1 to 10 of 12 entries</p>
          <div className="flex gap-3">
            <Button variant="white" size="sm" disabled className="rounded-xl border-gray-200 font-bold opacity-50">Previous</Button>
            <Button variant="white" size="sm" className="rounded-xl border-gray-200 font-bold">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllDeliveriesView;
