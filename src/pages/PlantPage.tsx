import StatCard from "@/components/ui/stat-card";
import DashboardWidgets from "@/components/DashboardWidgets";
import InventoryTable from "@/components/InventoryTable";
import KPICard from "@/components/KPICard";
import type { Column } from "@/components/Table";
import { mockInventoryData, mockMachineUsageData } from "@/data/mockData";
import HammerIcon from "@/assets/hammerIcon.svg";
import CheckedShieldIcon from "@/assets/checkedShieldIcon.svg";
import YellowDollerIcon from "@/assets/yellowDollerIcon.svg";
import SalmonGraphIcon from "@/assets/salmonGraphIcon.svg";
import ProfitIcon from "@/assets/ProfitIcon.svg";
import HashIcon from "@/assets/hashIcon.svg";
import InvoiceDueIcon from "@/assets/InvoiceDueIcon.svg";
import ExpensesIcon from "@/assets/ExpensesIcon.svg";
import TitleSubtitle from "@/components/common_component/TitleSubtitle";
import { dashboardText } from "@/data/text/DashboardText";

const PlantPage = () => {
  const inventoryColumns: Column<(typeof mockInventoryData)[0]>[] = [
    {
      header: "Material",
      accessor: (row) => <span className="text-gray-900">{row.material}</span>,
    },
    {
      header: "Current Stock",
      accessor: (row) => (
        <span className="font-semibold">{row.currentStock}</span>
      ),
    },
    {
      header: "Unit",
      accessor: (row) => row.unit,
    },
    {
      header: "Min Level",
      accessor: (row) => row.minLevel,
    },
    {
      header: "Status",
      accessor: (row) => row.status,
    },
    {
      header: "Action",
      accessor: (row) => (
        <button
          className={`px-4 py-1.5 rounded-full text-xs font-medium w-24 text-center transition-colors ${
            row.action === "Reorder"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }`}
        >
          {row.action}
        </button>
      ),
      className: "text-center",
      cellClassName: "text-right",
    },
  ];

  // --- Data for Machine Usage Table ---
  const machineColumns: Column<(typeof mockMachineUsageData)[0]>[] = [
    {
      header: "Equipment",
      accessor: (row) => <span className="text-gray-600">{row.equipment}</span>,
    },
    {
      header: "Type",
      accessor: (row) => <span className="text-gray-500">{row.type}</span>,
    },
    {
      header: "Last Service",
      accessor: (row) => (
        <span className="text-gray-900 font-medium">{row.lastService}</span>
      ),
    },
    {
      header: "Next Due",
      accessor: (row) => (
        <span className="text-gray-900 font-medium">{row.nextDue}</span>
      ),
    },
    {
      header: "Priority",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${row.priorityColor} shadow-sm`}
          ></span>
          <span className="text-gray-700">{row.priority}</span>
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (row) => (
        <button
          className={`px-4 py-1.5 rounded-full text-xs font-medium w-24 text-center transition-colors ${
            row.priority === "High" || row.priority === "Scheduled"
              ? "bg-[#D1FAE5] text-[#065F46] hover:bg-green-200" // Light green button for "Reorder" look
              : "bg-[#DBEAFE] text-[#1E40AF] hover:bg-blue-200" // Light blue for "View"
          }`}
        >
          {row.priority === "High" || row.priority === "Scheduled"
            ? "Reorder"
            : "View"}
        </button>
      ),
      className: "text-center",
      cellClassName: "text-right",
    },
  ];

  return (
    <div className="sm:pr-5 pt-5 space-y-5">
      <TitleSubtitle
        title={dashboardText.header.title}
        subtitle={dashboardText.header.subtitle}
      />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          title="Total Equipment"
          value={"247 units"}
          icon={
            <img src={HammerIcon} alt="leads" className="sm:size-7 size-5" />
          }
          color="bg-[#1D51A4]"
        />

        <StatCard
          title="Available"
          value={"89"}
          icon={
            <img
              src={CheckedShieldIcon}
              alt="confirmed"
              className="sm:size-7 size-5"
            />
          }
          color="bg-[#3AB449]"
        />

        <StatCard
          title="In Use"
          value={"12"}
          icon={
            <img
              src={YellowDollerIcon}
              alt="value"
              className="sm:size-7 size-5"
            />
          }
          color="bg-[#F59E0B]"
        />

        <StatCard
          title="Under Maintenance"
          value={"12"}
          icon={
            <img
              src={SalmonGraphIcon}
              alt="revenue"
              className="sm:size-7 size-5"
            />
          }
          color="bg-[#FD8D5B]"
        />
      </div>

      <h2 className="md:text-2xl text-lg font-bold text-gray-800 mb-4">
        Inventory KPIs
      </h2>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KPICard
          title=""
          value="$8,458,798"
          subtext="Current Material Value"
          trend={{ value: "+35%", isPositive: true }}
          icon={<img src={ProfitIcon} alt="revenue" className="size-5" />}
          iconBgColor="bg-[#E9F8FB]"
          iconColor="text-[#06AED4]"
        />
        <KPICard
          title=""
          value="$48,988,78"
          subtext="Outflow this Month"
          trend={{ value: "-19%", isPositive: false }}
          icon={<img src={InvoiceDueIcon} alt="revenue" className="size-5" />}
          iconBgColor="bg-[#E9F5F4]"
          iconColor="text-green-500"
        />
        <KPICard
          title=""
          value="6"
          subtext="Reorder Requests Pending"
          trend={{ value: "+41%", isPositive: true }}
          icon={<img src={ExpensesIcon} alt="revenue" className="size-4" />}
          iconBgColor="bg-[#FCEFEA]"
          iconColor="text-orange-500"
        />
        <KPICard
          title=""
          value="2"
          subtext="Emergency Material Alerts"
          trend={{ value: "-20%", isPositive: false }}
          icon={<img src={HashIcon} alt="revenue" className="size-4" />}
          iconBgColor="bg-[#EDEDFB]"
          iconColor="text-purple-500"
        />
      </div>

      {/* Render Inventory Table */}
      <InventoryTable
        title="Material Inventory Snapshot"
        columns={inventoryColumns}
        data={mockInventoryData}
        footer={
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">
              🔔 2 items below minimum stock • 1 pending purchase request
            </span>
          </div>
        }
      />
      <DashboardWidgets />

      {/* Render Machine Usage Table */}
      <InventoryTable
        title="Machine usage & maintenance reminders"
        columns={machineColumns}
        data={mockMachineUsageData}
        onViewAll={() => console.log("View All Clicked")}
      />
    </div>
  );
};

export default PlantPage;
