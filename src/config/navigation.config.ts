import MenuIcon1 from "@/assets/menuIcon1.svg";
import MenuIcon2 from "@/assets/menuIcon2.svg";
import MenuIcon3 from "@/assets/MenuIcon3.svg";
import MenuIcon4 from "@/assets/menuIcon4.svg";
import MenuIcon5 from "@/assets/menuIcon5.svg";
import MenuIcon6 from "@/assets/menuIcon6.svg";
import ProjectManagementIcon from "@/assets/icon/sidebar/projectsIcon.svg";

export type SubNavItem = {
  label: string;
  path: string;
};

export type NavItem = {
  title: string;
  color: string;
  icon: string;
  path?: string;
  items?: SubNavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    color: "bg-[#FD8D5B]",
    icon: MenuIcon1,
    path: "/dashboard",
  },
  {
    title: "Projects",
    color: "bg-[#EAB308]",
    icon: ProjectManagementIcon,
    path: "/projects",
  },

  {
    title: "",
    color: "bg-[#A855F7]",
    icon: MenuIcon2,
    items: [
      {
        label: "Equipment Management",
        path: "/equipment_management",
      },
      {
        label: "Material Inventory Management",
        path: "/material_inventory_management",
      },
      {
        label: "Production Management",
        path: "/production_management",
      },
    ],
  },

  {
    title: "",
    color: "bg-[#3AB449]",
    icon: MenuIcon3,
    items: [
      {
        label: "Maintenance Logs",
        path: "/maintenance_logs",
      },
      {
        label: "Upcoming Schedule",
        path: "/upcoming_schedule",
      },
      {
        label: "Breakdown Cases",
        path: "/breakdown_cases",
      },
      {
        label: "Service Providers",
        path: "/service_providers",
      },
    ],
  },

  {
    title: "",
    color: "bg-[#E04F16]",
    icon: MenuIcon4,
    items: [
      {
        label: "Equipment Allocation",
        path: "/equipment_allocation",
      },
      {
        label: "Transfer Requests",
        path: "/transfer_requests",
      },
      {
        label: "Usage Tracking & Logs",
        path: "/usage_tracking",
      },
    ],
  },

  {
    title: "Communication",
    color: "bg-[#DCC426]",
    icon: MenuIcon5,
    path: "/communication",
  },

  {
    title: "Notifications",
    color: "bg-black",
    icon: MenuIcon6,
    path: "/notification",
  },
];
