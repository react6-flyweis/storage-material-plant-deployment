import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SidePanel from "../components/SidePanel";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import KPICard from "../components/KPICard";
import { type Column } from "../components/Table";
import DashboardWidgets from "../components/DashboardWidgets";
import EquipmentView from "../components/EquipmentView";
import InventoryTable from "../components/InventoryTable";
import MaterialInventoryView from "../components/MaterialInventoryView";
import ProductionManagementView from "../components/ProductionManagementView";
import { NAV_ITEMS } from "../constants/navigation";
import MaintenanceAndSchedulingView from "../components/maintenance_and_scheduling/MaintenanceAndSchedulingView";
import EquipmentAllocationView from "../components/equipment_allocation/EquipmentAllocationView";
import TransferRequestsView from "../components/equipment_allocation/TransferRequestsView";
import UsageTrackingView from "../components/equipment_allocation/UsageTrackingView";
import NotificationsView from "../components/notifications/NotificationsView";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(NAV_ITEMS[0].items[0] || "");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const navItem = NAV_ITEMS[index];
    if (navItem.items.length > 0) {
      setActiveSubTab(navItem.items[0]);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(true);
      }
    } else {
      setActiveSubTab("");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, activeSubTab]);

  const contentTitles = [
    "Dashboard",
    "Equipment Management",
    "Maintenance Logs",
    "Equipment Allocation",
    "Communication",
    "Notifications",
  ];

  const inventoryData = [
    {
      material: "Cement",
      currentStock: 230,
      unit: "Bags",
      minLevel: 300,
      status: "🔴 Low Stock",
      action: "Reorder",
      actionType: "secondary",
    },
    {
      material: "Steel Rod TMT 12mm",
      currentStock: 8.2,
      unit: "Tons",
      minLevel: 5,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Aggregates 20mm",
      currentStock: 40,
      unit: "Tons",
      minLevel: 50,
      status: "🟡 At Risk",
      action: "Reorder",
      actionType: "secondary",
    },
    {
      material: "Safety Helmets",
      currentStock: 120,
      unit: "Units",
      minLevel: 100,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
  ];

  const inventoryColumns: Column<(typeof inventoryData)[0]>[] = [
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
      className: "text-right",
      cellClassName: "text-right",
    },
  ];

  // --- Data for Machine Usage Table ---
  const machineData = [
    {
      equipment: "Excavator CAT 320D",
      type: "Heavy",
      lastService: "05-Apr",
      nextDue: "20-Apr",
      priority: "High",
      priorityColor: "bg-red-500", // Dot color
    },
    {
      equipment: "Concrete Mixer 350L",
      type: "Small",
      lastService: "15-Mar",
      nextDue: "15-Apr",
      priority: "Medium",
      priorityColor: "bg-yellow-400",
    },
    {
      equipment: "Generator 25 kVA",
      type: "Medium",
      lastService: "01-Apr",
      nextDue: "13-Apr",
      priority: "Scheduled",
      priorityColor: "bg-blue-500",
    },
    {
      equipment: "Excavator CAT 320D",
      type: "Heavy",
      lastService: "05-Apr",
      nextDue: "20-Apr",
      priority: "High",
      priorityColor: "bg-red-500",
    },
  ];

  const machineColumns: Column<(typeof machineData)[0]>[] = [
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
      className: "text-right",
      cellClassName: "text-right",
    },
  ];

  const renderDashboardContent = () => (
    <>
      <div className="mt-8 mb-6">
        <h1 className="text-2xl font-normal text-gray-800">Dashboard</h1>
        <p className="text-(--text-color-gray-2)">
          Here's a summary of your ongoing steel building projects.
        </p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Equipment"
          count="128 units"
          bgColor="bg-[#0f4c9c]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--primary-color)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
              />
            </svg>
          }
        />
        <StatCard
          title="Available"
          count="42"
          bgColor="bg-[#4caf50]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-green)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
          }
        />
        <StatCard
          title="In Use"
          count="74"
          bgColor="bg-[#ffbb00]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-gold)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
        />
        <StatCard
          title="Under Maintenance"
          count="12"
          bgColor="bg-[#ff8a65]"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-(--text-color-gold)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
              />
            </svg>
          }
        />
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">Inventory KPIs</h2>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <KPICard
          title=""
          value="$8,458,798"
          subtext="Current Material Value"
          trend={{ value: "+35%", isPositive: true }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
              />
            </svg>
          }
          iconBgColor="bg-cyan-50"
          iconColor="text-cyan-500"
        />
        <KPICard
          title=""
          value="$48,988,78"
          subtext="Outflow this Month"
          trend={{ value: "-19%", isPositive: false }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }
          iconBgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <KPICard
          title=""
          value="6"
          subtext="Reorder Requests Pending"
          trend={{ value: "+41%", isPositive: true }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008h-.008v-.008Z"
              />
            </svg>
          }
          iconBgColor="bg-orange-50"
          iconColor="text-orange-500"
        />
        <KPICard
          title=""
          value="2"
          subtext="Emergency Material Alerts"
          trend={{ value: "-20%", isPositive: false }}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5"
              />
            </svg>
          }
          iconBgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
      </div>

      <DashboardWidgets />

      {/* Render Inventory Table */}
      <InventoryTable
        title="Material Inventory Snapshot"
        columns={inventoryColumns}
        data={inventoryData}
        footer={
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-medium">
              🔔 2 items below minimum stock • 1 pending purchase request
            </span>
          </div>
        }
      />

      {/* Render Machine Usage Table */}
      <InventoryTable
        title="Machine usage & maintenance reminders"
        columns={machineColumns}
        data={machineData}
        onViewAll={() => console.log("View All Clicked")}
      />
    </>
  );

  const renderGenericContext = () => (
    <div className="mt-8 mb-6 h-full flex flex-col items-center justify-center text-gray-400">
      <h1 className="text-3xl font-light mb-4">{contentTitles[activeTab]}</h1>
      <p>This module is currently under development.</p>
    </div>
  );

  const renderContent = () => {
    // Logic for Content Routing
    if (activeTab === 0) {
      return renderDashboardContent();
    }

    if (activeTab === 1) {
      if (activeSubTab === "Equipment Management") {
        return <EquipmentView />; // Might need a dedicated view if this is different from the main Equipment view
      }
      if (activeSubTab === "Material Inventory Management") {
        return <MaterialInventoryView />;
      }
      if (activeSubTab === "Production Management") {
        return <ProductionManagementView />;
      }

      // Fallback or other sub-tabs
      if (activeSubTab === "") {
        return <EquipmentView />;
      }
    }

    if (activeTab === 2) {
      return <MaintenanceAndSchedulingView />;
    }
    if (activeTab === 3) {
      if (activeSubTab === "Equipment Management") {
        return <EquipmentView />;
      }
      if (activeSubTab === "Transfer Requests") {
        return <TransferRequestsView />;
      }
      if (activeSubTab === "Usage Tracking & Logs") {
        return <UsageTrackingView />;
      }
      return <EquipmentAllocationView />;
    }

    if (activeTab === 5) {
      return <NotificationsView />;
    }
    return renderGenericContext();
  };

  return (
    <div className="flex min-h-screen bg-[#E5ECFF] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      <SidePanel
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* Layout Placeholders to reserve space for fixed components */}
      <div className="hidden md:block w-20 lg:w-24 shrink-0" />
      <div className="hidden lg:block w-54 shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 w-full p-4 pt-0 md:p-4 md:pt-3 lg:pt-3 lg:p-3 transition-all duration-300 min-h-screen flex flex-col min-w-0">
        <Header onMenuToggle={toggleSidebar} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Home;
