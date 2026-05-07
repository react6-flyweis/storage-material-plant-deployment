import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "@/components/common_component/Sidebar";
import Header from "@/components/common_component/Header";
import SidePanel from "@/components/SidePanel";
import { NAV_ITEMS } from "@/config/navigation.config";
import { UploadModal } from "@/components/projects/ProjectUploadModals";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // 🔹 Main tab click
  const handleTabChange = (index: number) => {
    const tab = NAV_ITEMS[index];
    setActiveTab(index);
    localStorage.setItem("activeTab", index.toString());

    if (tab.items?.length) {
      const firstNavigableItem = tab.items.find(item => !item.isAction) || tab.items[0];
      
      setActiveSubTab(firstNavigableItem.label);
      localStorage.setItem("activeSubTab", firstNavigableItem.label);
      
      if (!firstNavigableItem.isAction) {
        navigate(firstNavigableItem.path);
      }
    } else if (tab.path) {
      setActiveSubTab("");
      localStorage.removeItem("activeSubTab");
      navigate(tab.path);
    }
  };

  // 🔹 Sub-tab click
  const handleSubTabChange = (label: string, path: string) => {
    const currentNav = NAV_ITEMS[activeTab];
    const subItem = currentNav.items?.find(item => item.label === label);

    if (subItem?.isAction) {
      if (label === "Upload BOM File") {
        setIsUploadModalOpen(true);
      }
      return; // 🔹 Exit early without updating activeSubTab
    }

    setActiveSubTab(label);
    localStorage.setItem("activeSubTab", label);
    navigate(path);
  };

  // 🔹 Sync with URL (AUTO)
  useEffect(() => {
    NAV_ITEMS.forEach((tab, tabIndex) => {
      if (tab.path === location.pathname) {
        setActiveTab(tabIndex);
        setActiveSubTab("");
      }

      tab.items?.forEach((sub) => {
        if (sub.path === location.pathname) {
          setActiveTab(tabIndex);
          setActiveSubTab(sub.label);
        }
      });
    });
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#E5ECFF] relative overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
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
        onSubTabClick={handleSubTabChange}
      />

      <div className="flex-1 min-w-0 flex flex-col h-screen md:ml-[304px] lg:ml-[336px]">
        <Header onMenuToggle={toggleSidebar} />
        <main className="flex-1 overflow-y-auto mt-1 xl:pb-3 xl:pr-3">
          <Outlet />
        </main>
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload BOM File"
        subtitle="Please upload your BOM file to continue."
        fileLabel="BOM File"
        onUpload={() => {
          setIsUploadModalOpen(false);
          // Handle upload success logic
        }}
      />
    </div>
  );
}
