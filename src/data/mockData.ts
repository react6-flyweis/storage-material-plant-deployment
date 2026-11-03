export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: string;
  statusColor: string;
  dotColor: string;
  project: string;
  location: string;
  hours: string;
  nextDue: string;
}

export const equipmentData: EquipmentItem[] = [
  {
    id: "EX-302",
    name: "Excavator CAT 320D",
    category: "Heavy",
    status: "In Use",
    statusColor: "text-green-600",
    dotColor: "bg-green-500",
    project: "ABC Warehouse",
    location: "Pune Site",
    hours: "128h",
    nextDue: "20-Apr",
  },
  {
    id: "CM-104",
    name: "Concrete Mixer 350L",
    category: "Medium",
    status: "Under Maintenance",
    statusColor: "text-orange-600",
    dotColor: "bg-orange-500",
    project: "-",
    location: "Yard",
    hours: "-",
    nextDue: "15-Apr",
  },
  {
    id: "DG-65",
    name: "Diesel Generator 65kVA",
    category: "Medium",
    status: "Breakdown",
    statusColor: "text-red-600",
    dotColor: "bg-red-500",
    project: "Metro Cast",
    location: "Ahmedabad",
    hours: "412h",
    nextDue: "Overdue",
  },
  {
    id: "EX-304",
    name: "Hydraulic Crane 50T",
    category: "Heavy",
    status: "In Use",
    statusColor: "text-green-600",
    dotColor: "bg-green-500",
    project: "Nagpur Plant",
    location: "Nagpur Site",
    hours: "256h",
    nextDue: "25-Apr",
  },
];

export const equipmentByFilter: Record<string, EquipmentItem[]> = {
  today: equipmentData.slice(0, 2),
  week: equipmentData.slice(0, 3),
  month: equipmentData,
};

export interface BreakdownCaseItem {
  id: number;
  equipment: string;
  reportedOn: string;
  issue: string;
  severity: string;
  severityColor: string;
  status: string;
  assignedTo: string;
}

export const mockBreakdownCases: BreakdownCaseItem[] = [
  {
    id: 1,
    equipment: "Excavator CAT 320D",
    reportedOn: "12-Apr-2025",
    issue: "Hydraulic leak in main boom cylinder",
    severity: "High",
    severityColor: "bg-red-500",
    status: "Pending",
    assignedTo: "Rahul Sharma",
  },
  {
    id: 2,
    equipment: "Concrete Mixer 350L",
    reportedOn: "10-Apr-2025",
    issue: "Drum rotation motor failure",
    severity: "Medium",
    severityColor: "bg-yellow-500",
    status: "In Progress",
    assignedTo: "Amit Patel",
  },
  {
    id: 3,
    equipment: "Diesel Generator 65kVA",
    reportedOn: "08-Apr-2025",
    issue: "Overheating warning indicator",
    severity: "Low",
    severityColor: "bg-blue-500",
    status: "Completed",
    assignedTo: "Suresh Rao",
  },
  {
    id: 4,
    equipment: "Tower Crane TC-50",
    reportedOn: "05-Apr-2025",
    issue: "Cable tension misalignment",
    severity: "High",
    severityColor: "bg-red-500",
    status: "Pending",
    assignedTo: "Vikas Singh",
  },
];

export interface ServiceProviderItem {
  id: number;
  providerName: string;
  services: string;
  contact: string;
  rating: number;
  avgCost: string;
  lastService: string;
}

export const mockServiceProviders: ServiceProviderItem[] = [
  {
    id: 1,
    providerName: "Atlas Machinery Works",
    services: "Hydraulics, Engine Overhaul",
    contact: "+91 98230 11223",
    rating: 5,
    avgCost: "₹15,000",
    lastService: "12-Apr-2025",
  },
  {
    id: 2,
    providerName: "Precision Motors & Pumps",
    services: "Motors, Generators, Pumps",
    contact: "+91 98765 99881",
    rating: 4,
    avgCost: "₹8,500",
    lastService: "05-Apr-2025",
  },
  {
    id: 3,
    providerName: "QuickFix Industrial Care",
    services: "General Maintenance, Welding",
    contact: "+91 94220 55443",
    rating: 4,
    avgCost: "₹5,000",
    lastService: "28-Mar-2025",
  },
];

export const mockLeadsData = {
  id: "LEAD-2025-089",
  contactInfo: {
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
  },
  projectDetails: {
    buildingType: "Industrial Warehouse (PEB)",
    quoteValue: "₹45,00,000",
    status: "In Progress",
    createdOn: "10 April 2025",
  },
  assignment: {
    assignedTo: "Rahul Sharma",
  },
  progress: {
    currentStep: 3,
    totalSteps: 5,
    steps: [
      { id: 1, label: "Initial Inquiry & Site Visit", status: "completed" },
      { id: 2, label: "Design & Drawing Approval", status: "completed" },
      { id: 3, label: "Quotation & Contract Signing", status: "current" },
      { id: 4, label: "Fabrication & Quality Check", status: "pending" },
      { id: 5, label: "Dispatch & Delivery", status: "pending" },
    ],
  },
  recentActivity: [
    { type: "info", text: "Quotation revised and submitted to client" },
    { type: "alert", text: "Awaiting client confirmation for final layout" },
    { type: "info", text: "Site measurements verified by engineer" },
  ],
  photos: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&auto=format&fit=crop&q=60",
  ],
};
