import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./common_component/Sidebar";
import Header from "./common_component/Header";
import SidePanel from "./SidePanel";
import { NAV_ITEMS } from "../constants/navigation";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("activeTab");
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [activeSubTab, setActiveSubTab] = useState(() => {
    const saved = localStorage.getItem("activeSubTab");
    return saved !== null ? saved : NAV_ITEMS[0].items[0] || "";
  });
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index.toString());
    const navItem = NAV_ITEMS[index];
    let newSubTab = "";
    if (navItem.items.length > 0) {
      newSubTab = navItem.items[0];
    }
    setActiveSubTab(newSubTab);
    localStorage.setItem("activeSubTab", newSubTab);

    // Routing logic for main tabs
    if (index === 0) navigate("/");
    else if (index === 1) navigate("/equipment_management");
    else if (index === 2) navigate("/maintenance_logs");
    else if (index === 3) navigate("/equipment_allocation");
    else if (index === 4) navigate("/communication");
    else if (index === 5) navigate("/notification");
    // Add other mappings as needed
  };

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
    localStorage.setItem("activeSubTab", subTab);

    // Simple routing based on subTab names to match routes.tsx
    const routeMap: Record<string, string> = {
      "Equipment Management": "/equipment_management",
      "Material Inventory Management": "/material_inventory_management",
      "Production Management": "/production_management",
      "Maintenance Logs": "/maintenance_logs",
      "Upcoming Schedule": "/upcoming_schedule",
      "Breakdown Cases": "/breakdown_cases",
      "Service Providers": "/service_providers",
      "Equipment Allocation": "/equipment_allocation",
      "Transfer Requests": "/transfer_requests",
      "Usage Tracking & Logs": "/usage_tracking",
      Communication: "/communication",
    };

    if (routeMap[subTab]) {
      navigate(routeMap[subTab]);
    }
  };

  // Sync state with URL on initial load or navigation
  useEffect(() => {
    const path = location.pathname;

    // Reverse mapping for subtabs
    const reverseRouteMap: Record<string, { tab: number; subTab: string }> = {
      "/": { tab: 0, subTab: "" },
      "/equipment_management": { tab: 1, subTab: "Equipment Management" },
      "/material_inventory_management": {
        tab: 1,
        subTab: "Material Inventory Management",
      },
      "/production_management": {
        tab: 1,
        subTab: "Production Management",
      },
      "/maintenance_logs": { tab: 2, subTab: "Maintenance Logs" },
      "/upcoming_schedule": { tab: 2, subTab: "Upcoming Schedule" },
      "/breakdown_cases": { tab: 2, subTab: "Breakdown Cases" },
      "/service_providers": { tab: 2, subTab: "Service Providers" },
      "/equipment_allocation": { tab: 3, subTab: "Equipment Allocation" },
      "/transfer_requests": { tab: 3, subTab: "Transfer Requests" },
      "/usage_tracking": { tab: 3, subTab: "Usage Tracking & Logs" },
      "/communication": { tab: 4, subTab: "Communication" },
    };

    if (reverseRouteMap[path]) {
      const { tab, subTab } = reverseRouteMap[path];
      setActiveTab(tab);
      if (subTab) setActiveSubTab(subTab);
      localStorage.setItem("activeTab", tab.toString());
      if (subTab) localStorage.setItem("activeSubTab", subTab);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#E8EFF9] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
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
        setActiveSubTab={handleSubTabChange}
      />

      {/* Layout Placeholders to reserve space for fixed components */}
      <div className="hidden md:block w-16 lg:w-20 shrink-0" />
      <div className="hidden md:block w-56 shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 w-full p-4 pt-0 md:p-4 md:pt-3 lg:pt-3 lg:p-3 transition-all duration-300 min-h-screen flex flex-col min-w-0">
        <Header
          onMenuToggle={toggleSidebar}
          // onProfileClick and onSettingsClick can be handled here or passed to Header
        />
        <main className="mt-2 w-full flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
