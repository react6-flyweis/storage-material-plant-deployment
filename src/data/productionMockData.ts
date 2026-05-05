import type { TabType } from "@/pages/PlantPage";

// ─── Production Overview Metrics ─────────────────────────────────────────────
export interface ProductionMetric {
  label: string;
  value: string;
  icon: "graph" | "moneybillnote" | "moneybag" | "truck" | "chart";
}

export const productionMetricsByFilter: Record<TabType, ProductionMetric[]> = {
  today: [
    { label: "Planned Tonnage", value: "125.50 MT", icon: "graph" },
    { label: "Produced Tonnage", value: "78.80 MT", icon: "moneybillnote" },
    { label: "Utilization", value: "63%", icon: "moneybag" },
    { label: "On-Time Delivery", value: "92%", icon: "moneybag" },
    { label: "Rework/Rejection", value: "2.4%", icon: "graph" },
  ],
  week: [
    { label: "Planned Tonnage", value: "875.20 MT", icon: "graph" },
    { label: "Produced Tonnage", value: "612.40 MT", icon: "moneybillnote" },
    { label: "Utilization", value: "70%", icon: "moneybag" },
    { label: "On-Time Delivery", value: "88%", icon: "moneybag" },
    { label: "Rework/Rejection", value: "3.1%", icon: "graph" },
  ],
  month: [
    { label: "Planned Tonnage", value: "3,480.00 MT", icon: "graph" },
    { label: "Produced Tonnage", value: "2,856.50 MT", icon: "moneybillnote" },
    { label: "Utilization", value: "82%", icon: "moneybag" },
    { label: "On-Time Delivery", value: "91%", icon: "moneybag" },
    { label: "Rework/Rejection", value: "1.8%", icon: "graph" },
  ],
};

// ─── Recent Shipper Files ────────────────────────────────────────────────────
export interface ShipperFile {
  name: string;
  shpId: string;
  company: string;
  items: number;
  date: string;
  time: string;
}

export const shipperFilesByFilter: Record<TabType, ShipperFile[]> = {
  today: [
    { name: "ABC Warehouse", shpId: "SHP-1044", company: "ABC Steel", items: 120, date: "Mar 15, 2025", time: "05:00:14 PM" },
    { name: "Tech Park Dev", shpId: "SHP-1044", company: "ABC Steel", items: 95, date: "Jan 8, 2025", time: "08:20:13 PM" },
    { name: "Downtown Plaza", shpId: "SHP-1044", company: "ABC Steel", items: 50, date: "Aug 6, 2025", time: "04:10:12 PM" },
    { name: "Riverside Complex", shpId: "SHP-1044", company: "ABC Steel", items: 120, date: "Jan 6, 2025", time: "03:40:14 PM" },
    { name: "Techpark Dev", shpId: "SHP-1044", company: "ABC Steel", items: 120, date: "Oct 12, 2025", time: "05:00:14 PM" },
  ],
  week: [
    { name: "Metro Station Hub", shpId: "SHP-1052", company: "Metro Corp", items: 200, date: "Mar 10, 2025", time: "09:15:00 AM" },
    { name: "ABC Warehouse", shpId: "SHP-1044", company: "ABC Steel", items: 120, date: "Mar 15, 2025", time: "05:00:14 PM" },
    { name: "Industrial Zone A", shpId: "SHP-1048", company: "IZ Steel", items: 180, date: "Mar 12, 2025", time: "11:30:00 AM" },
    { name: "Tech Park Dev", shpId: "SHP-1044", company: "ABC Steel", items: 95, date: "Jan 8, 2025", time: "08:20:13 PM" },
    { name: "Skyline Tower", shpId: "SHP-1055", company: "Sky Build", items: 75, date: "Mar 9, 2025", time: "02:45:00 PM" },
  ],
  month: [
    { name: "Highway Bridge #4", shpId: "SHP-1060", company: "Bridge Co", items: 340, date: "Feb 28, 2025", time: "10:00:00 AM" },
    { name: "Metro Station Hub", shpId: "SHP-1052", company: "Metro Corp", items: 200, date: "Mar 10, 2025", time: "09:15:00 AM" },
    { name: "ABC Warehouse", shpId: "SHP-1044", company: "ABC Steel", items: 120, date: "Mar 15, 2025", time: "05:00:14 PM" },
    { name: "Industrial Zone A", shpId: "SHP-1048", company: "IZ Steel", items: 180, date: "Mar 12, 2025", time: "11:30:00 AM" },
    { name: "Commercial Complex", shpId: "SHP-1058", company: "CC Builders", items: 260, date: "Feb 20, 2025", time: "01:20:00 PM" },
  ],
};

// ─── Plant Alerts ────────────────────────────────────────────────────────────
export interface PlantAlert {
  message: string;
  time: string;
  type: "shipper" | "order" | "drawing" | "production" | "fileLine";
}

export const plantAlertsByFilter: Record<TabType, PlantAlert[]> = {
  today: [
    { message: "New shipper file received for ABC Warehouse (SHP1044)", time: "05:00:14 PM", type: "shipper" },
    { message: "Oder ORD-1045 Marked as ready to dispatch", time: "08:20:13 PM", type: "order" },
    { message: "Drawing DRG-098 Uploaded", time: "04:10:12 PM", type: "drawing" },
    { message: "Production Target for today is 63%", time: "03:40:14 PM", type: "production" },
    { message: "Oder ORD-1045 Marked as ready to dispatch", time: "05:00:14 PM", type: "fileLine" },
  ],
  week: [
    { message: "Material shortage alert for Steel Rod TMT 16mm", time: "Mon 09:00 AM", type: "production" },
    { message: "New shipper file received for Metro Station (SHP1052)", time: "Mon 11:30 AM", type: "shipper" },
    { message: "Drawing DRG-102 revision uploaded", time: "Tue 02:15 PM", type: "drawing" },
    { message: "Order ORD-1050 dispatched successfully", time: "Wed 04:30 PM", type: "order" },
    { message: "Production target achieved 82% this week", time: "Fri 06:00 PM", type: "production" },
  ],
  month: [
    { message: "Monthly production report generated", time: "Mar 01, 10:00 AM", type: "production" },
    { message: "5 new shipper files received this month", time: "Mar 05, 09:00 AM", type: "shipper" },
    { message: "Quality audit completed — 98.2% pass rate", time: "Mar 10, 03:00 PM", type: "production" },
    { message: "Drawing batch DRG-090 to DRG-098 approved", time: "Mar 12, 11:00 AM", type: "drawing" },
    { message: "12 orders dispatched this month", time: "Mar 15, 05:00 PM", type: "order" },
  ],
};

// ─── Recent Shipper Files Table ─────────────────────────────────────────────
export interface RecentShipperFile {
  projectId: string;
  projectName: string;
  shipperName: string;
  shipperAvatar: string;
  fileName: string;
  uploadDate: string;
  items: number;
  rates: string;
  weight: string;
  status: "File Received" | "Order Sent" | "Revision Sent";
}

export const recentShipperFilesByFilter: Record<TabType, RecentShipperFile[]> = {
  today: [
    { projectId: "PRJ-001", projectName: "ABC Warehouse", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=1", fileName: "SHP-1044", uploadDate: "22 Feb 2025", items: 120, rates: "$2100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-002", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=2", fileName: "SHP-1045", uploadDate: "07 Feb 2025", items: 95, rates: "$3100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-003", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=3", fileName: "SHP-1046", uploadDate: "30 Jan 2025", items: 50, rates: "$7100", weight: "21,400 IBS", status: "Revision Sent" },
    { projectId: "PRJ-004", projectName: "Riverside Complex", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=4", fileName: "SHP-1047", uploadDate: "17 Jan 2025", items: 80, rates: "$12100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-005", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=5", fileName: "SHP-1048", uploadDate: "04 Jan 2025", items: 110, rates: "$4100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-006", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=6", fileName: "SHP-1049", uploadDate: "09 Dec 2024", items: 120, rates: "$8100", weight: "21,400 IBS", status: "Order Sent" },
  ],
  week: [
    { projectId: "PRJ-001", projectName: "ABC Warehouse", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=1", fileName: "SHP-1044", uploadDate: "22 Feb 2025", items: 120, rates: "$2100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-002", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=2", fileName: "SHP-1045", uploadDate: "07 Feb 2025", items: 95, rates: "$3100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-003", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=3", fileName: "SHP-1046", uploadDate: "30 Jan 2025", items: 50, rates: "$7100", weight: "21,400 IBS", status: "Revision Sent" },
    { projectId: "PRJ-004", projectName: "Riverside Complex", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=4", fileName: "SHP-1047", uploadDate: "17 Jan 2025", items: 80, rates: "$12100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-005", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=5", fileName: "SHP-1048", uploadDate: "04 Jan 2025", items: 110, rates: "$4100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-006", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=6", fileName: "SHP-1049", uploadDate: "09 Dec 2024", items: 120, rates: "$8100", weight: "21,400 IBS", status: "Order Sent" },
  ],
  month: [
    { projectId: "PRJ-001", projectName: "ABC Warehouse", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=1", fileName: "SHP-1044", uploadDate: "22 Feb 2025", items: 120, rates: "$2100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-002", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=2", fileName: "SHP-1045", uploadDate: "07 Feb 2025", items: 95, rates: "$3100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-003", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=3", fileName: "SHP-1046", uploadDate: "30 Jan 2025", items: 50, rates: "$7100", weight: "21,400 IBS", status: "Revision Sent" },
    { projectId: "PRJ-004", projectName: "Riverside Complex", shipperName: "ABC Steel", shipperAvatar: "https://i.pravatar.cc/150?u=4", fileName: "SHP-1047", uploadDate: "17 Jan 2025", items: 80, rates: "$12100", weight: "18,500 IBS", status: "File Received" },
    { projectId: "PRJ-005", projectName: "Tech Park Dev", shipperName: "Steel Works LTD", shipperAvatar: "https://i.pravatar.cc/150?u=5", fileName: "SHP-1048", uploadDate: "04 Jan 2025", items: 110, rates: "$4100", weight: "37,700 IBS", status: "Order Sent" },
    { projectId: "PRJ-006", projectName: "Downtown Plaza", shipperName: "Metro Steel", shipperAvatar: "https://i.pravatar.cc/150?u=6", fileName: "SHP-1049", uploadDate: "09 Dec 2024", items: 120, rates: "$8100", weight: "21,400 IBS", status: "Order Sent" },
  ],
};

// ─── Freight Carriers ────────────────────────────────────────────────────────
export interface FreightCarrier {
  name: string;
  loads: string;
  status: "On Time" | "Delayed";
}

export const freightCarriersByFilter: Record<TabType, FreightCarrier[]> = {
  today: [
    { name: "Roadking Logistics", loads: "12 Loads Today", status: "On Time" },
    { name: "Swift Transport", loads: "08 Loads Today", status: "On Time" },
    { name: "Global Freight Lines", loads: "12 Loads Today", status: "Delayed" },
    { name: "Eagle Freight", loads: "08 Loads Today", status: "On Time" },
    { name: "Prime Carriers", loads: "12 Loads Today", status: "Delayed" },
  ],
  week: [
    { name: "Roadking Logistics", loads: "58 Loads This Week", status: "On Time" },
    { name: "Swift Transport", loads: "42 Loads This Week", status: "On Time" },
    { name: "Global Freight Lines", loads: "35 Loads This Week", status: "Delayed" },
    { name: "Eagle Freight", loads: "28 Loads This Week", status: "On Time" },
    { name: "Prime Carriers", loads: "45 Loads This Week", status: "On Time" },
  ],
  month: [
    { name: "Roadking Logistics", loads: "210 Loads This Month", status: "On Time" },
    { name: "Swift Transport", loads: "180 Loads This Month", status: "On Time" },
    { name: "Global Freight Lines", loads: "145 Loads This Month", status: "Delayed" },
    { name: "Eagle Freight", loads: "120 Loads This Month", status: "On Time" },
    { name: "Prime Carriers", loads: "165 Loads This Month", status: "Delayed" },
  ],
};

// ─── Drawing Approval Status ────────────────────────────────────────────────
export interface DrawingApprovalStatus {
  clientName: string;
  clientAvatar: string;
  projectName: string;
  fileName: string;
  sentDate: string;
  status: "Pending" | "Approved" | "Revision Sent";
}

export const drawingApprovalStatusByFilter: Record<TabType, DrawingApprovalStatus[]> = {
  today: [
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=1", projectName: "ABC Warehouse", fileName: "Drawing", sentDate: "22 Feb 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=2", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "07 Feb 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=3", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "30 Jan 2025", status: "Revision Sent" },
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=4", projectName: "Riverside Complex", fileName: "Drawing", sentDate: "17 Jan 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=5", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "04 Jan 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=6", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "09 Dec 2024", status: "Approved" },
  ],
  week: [
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=1", projectName: "ABC Warehouse", fileName: "Drawing", sentDate: "22 Feb 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=2", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "07 Feb 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=3", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "30 Jan 2025", status: "Revision Sent" },
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=4", projectName: "Riverside Complex", fileName: "Drawing", sentDate: "17 Jan 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=5", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "04 Jan 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=6", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "09 Dec 2024", status: "Approved" },
  ],
  month: [
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=1", projectName: "ABC Warehouse", fileName: "Drawing", sentDate: "22 Feb 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=2", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "07 Feb 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=3", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "30 Jan 2025", status: "Revision Sent" },
    { clientName: "ABC Steel", clientAvatar: "https://i.pravatar.cc/150?u=4", projectName: "Riverside Complex", fileName: "Drawing", sentDate: "17 Jan 2025", status: "Pending" },
    { clientName: "Steel Works LTD", clientAvatar: "https://i.pravatar.cc/150?u=5", projectName: "Tech Park Dev", fileName: "Drawing", sentDate: "04 Jan 2025", status: "Approved" },
    { clientName: "Metro Steel", clientAvatar: "https://i.pravatar.cc/150?u=6", projectName: "Downtown Plaza", fileName: "Drawing", sentDate: "09 Dec 2024", status: "Approved" },
  ],
};

// ─── Customer Data (Dynamic View) ───────────────────────────────────────────
export interface CustomerInfo {
  id: string;
  name: string;
  joinedDate: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  image: string;
  projects: { id: string; name: string; amount: string; status: string; startDate: string; endDate: string; }[];
  invoices: { number: string; dueDate: string; amount: string; paid: string; dueAmount: string; status: string; }[];
}

export const customersData: Record<string, CustomerInfo> = {
  "ID-2025-1047": {
    id: "ID-2025-1047",
    name: "John Doe",
    joinedDate: "January 15, 2023",
    status: "Active",
    phone: "(163) 2459 315",
    email: "john@example.com",
    address: "1861 Bayonne Ave, Manchester, NJ, 08759",
    image: "https://i.pravatar.cc/150?u=1",
    projects: [
      { id: "Project 1", name: "ABC Building", amount: "$50,000", status: "Completed", startDate: "Apr 02, 2024", endDate: "May 02, 2024" },
      { id: "Project 2", name: "XYZ Building", amount: "$15,000", status: "Completed", startDate: "Apr 02, 2024", endDate: "May 02, 2024" },
      { id: "Project 3", name: "PQR Building", amount: "$25,000", status: "In progress", startDate: "Apr 02, 2024", endDate: "May 02, 2024" },
    ],
    invoices: [
      { number: "INV001", dueDate: "24 Dec 2024", amount: "$500", paid: "$500", dueAmount: "$0", status: "Paid" },
      { number: "INV002", dueDate: "10 Dec 2024", amount: "$1500", paid: "$1500", dueAmount: "$0", status: "Paid" },
      { number: "INV003", dueDate: "27 Nov 2024", amount: "$600", paid: "$600", dueAmount: "$0", status: "Paid" },
      { number: "INV004", dueDate: "18 Nov 2024", amount: "$1000", paid: "$0", dueAmount: "$1000", status: "Unpaid" },
    ]
  },
  "ID-2025-1048": {
    id: "ID-2025-1048",
    name: "Roahan Sharma",
    joinedDate: "February 10, 2023",
    status: "Active",
    phone: "(163) 2459 999",
    email: "roahan@example.com",
    address: "742 Evergreen Terrace, Springfield, IL, 62704",
    image: "https://i.pravatar.cc/150?u=2",
    projects: [
      { id: "Project 1", name: "Tech Park 1", amount: "$120,000", status: "Completed", startDate: "Mar 15, 2024", endDate: "Jun 15, 2024" },
      { id: "Project 2", name: "Tech Park 2", amount: "$85,000", status: "In progress", startDate: "Jun 20, 2024", endDate: "Sep 20, 2024" },
    ],
    invoices: [
      { number: "INV101", dueDate: "15 Mar 2024", amount: "$5000", paid: "$5000", dueAmount: "$0", status: "Paid" },
      { number: "INV102", dueDate: "01 Apr 2024", amount: "$2000", paid: "$0", dueAmount: "$2000", status: "Unpaid" },
    ]
  },
  "ID-2025-1049": {
    id: "ID-2025-1049",
    name: "Riyaz Verma",
    joinedDate: "March 05, 2023",
    status: "Active",
    phone: "(163) 2459 888",
    email: "riyaz@example.com",
    address: "221B Baker St, London, NW1 6XE",
    image: "https://i.pravatar.cc/150?u=3",
    projects: [
      { id: "Project 1", name: "Mall Complex", amount: "$250,000", status: "Completed", startDate: "Jan 10, 2024", endDate: "Dec 10, 2024" },
    ],
    invoices: [
      { number: "INV201", dueDate: "10 Jan 2024", amount: "$25000", paid: "$25000", dueAmount: "$0", status: "Paid" },
    ]
  },
  "ID-2025-1050": {
    id: "ID-2025-1050",
    name: "Riya Wellness",
    joinedDate: "April 12, 2023",
    status: "Active",
    phone: "(163) 2459 777",
    email: "riya@example.com",
    address: "10 Downing St, London, SW1A 2AA",
    image: "https://i.pravatar.cc/150?u=4",
    projects: [
      { id: "Project 1", name: "Gymnasium", amount: "$45,000", status: "In progress", startDate: "May 01, 2024", endDate: "Aug 01, 2024" },
    ],
    invoices: [
      { number: "INV301", dueDate: "01 May 2024", amount: "$4500", paid: "$4500", dueAmount: "$0", status: "Paid" },
    ]
  }
};
