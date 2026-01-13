// Mock data for the application

import type { TabType } from "@/pages/PlantPage";

export const mockInventoryData = [
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
    minLevel: 30,
    status: "🟢 OK",
    action: "View",
    actionType: "primary",
  },
  {
    material: "Bricks (Red Clay)",
    currentStock: 15000,
    unit: "Pieces",
    minLevel: 20000,
    status: "🔴 Low Stock",
    action: "Reorder",
    actionType: "secondary",
  },
];

export const flteredMockInventoryData: Record<
  TabType,
  {
    material: string;
    currentStock: number;
    unit: string;
    minLevel: number;
    status: string;
    action: string;
    actionType: string;
  }[]
> = {
  today: [
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
      minLevel: 30,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Bricks (Red Clay)",
      currentStock: 15000,
      unit: "Pieces",
      minLevel: 20000,
      status: "🔴 Low Stock",
      action: "Reorder",
      actionType: "secondary",
    },
  ],

  week: [
    {
      material: "Cement",
      currentStock: 180,
      unit: "Bags",
      minLevel: 300,
      status: "🔴 Low Stock",
      action: "Reorder",
      actionType: "secondary",
    },
    {
      material: "Steel Rod TMT 12mm",
      currentStock: 6.5,
      unit: "Tons",
      minLevel: 5,
      status: "🟡 Near Limit",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Aggregates 20mm",
      currentStock: 28,
      unit: "Tons",
      minLevel: 30,
      status: "🔴 Low Stock",
      action: "Reorder",
      actionType: "secondary",
    },
    {
      material: "Bricks (Red Clay)",
      currentStock: 12000,
      unit: "Pieces",
      minLevel: 20000,
      status: "🔴 Low Stock",
      action: "Reorder",
      actionType: "secondary",
    },
  ],

  month: [
    {
      material: "Cement",
      currentStock: 520,
      unit: "Bags",
      minLevel: 300,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Steel Rod TMT 12mm",
      currentStock: 14.8,
      unit: "Tons",
      minLevel: 5,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Aggregates 20mm",
      currentStock: 92,
      unit: "Tons",
      minLevel: 30,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
    {
      material: "Bricks (Red Clay)",
      currentStock: 42000,
      unit: "Pieces",
      minLevel: 20000,
      status: "🟢 OK",
      action: "View",
      actionType: "primary",
    },
  ],
} as const;


export const mockMachineUsageData = [
  {
    equipment: "Excavator CAT 320D",
    type: "Heavy",
    project: "Highway Bridge Project",
    operator: "Mike Johnson",
    hoursUsed: 156,
    lastService: "05-Apr",
    nextDue: "20-Apr",
    priority: "High",
    priorityColor: "bg-red-500",
    status: "🟢 Active",
    action: "Details",
    actionType: "primary",
  },
  {
    equipment: "Concrete Mixer 350L",
    type: "Medium",
    project: "Downtown Office Complex",
    operator: "John Smith",
    hoursUsed: 42,
    lastService: "12-Apr",
    nextDue: "26-Apr",
    priority: "Scheduled",
    priorityColor: "bg-yellow-500",
    status: "🟢 Active",
    action: "Details",
    actionType: "primary",
  },
  {
    equipment: "Tower Crane TC5613",
    type: "Heavy",
    project: "City Mall Renovation",
    operator: "Sarah Williams",
    hoursUsed: 89,
    lastService: "18-Apr",
    nextDue: "02-May",
    priority: "Low",
    priorityColor: "bg-green-500",
    status: "🟡 Maintenance",
    action: "Details",
    actionType: "primary",
  },
  {
    equipment: "Bulldozer D8T",
    type: "Heavy",
    project: "Industrial Park",
    operator: "Robert Brown",
    hoursUsed: 120,
    lastService: "22-Apr",
    nextDue: "06-May",
    priority: "Scheduled",
    priorityColor: "bg-yellow-500",
    status: "🟢 Active",
    action: "Details",
    actionType: "primary",
  },
];

export const filterMockMachineUsageData: Record<
  TabType,
  {
    equipment: string;
    type: string;
    project: string;
    operator: string;
    hoursUsed: number;
    lastService: string;
    nextDue: string;
    priority: string;
    priorityColor: string;
    status: string;
    action: string;
    actionType: string;
  }[]
> = {
  today: [
    {
      equipment: "Mini Excavator ZX55",
      type: "Light",
      project: "Residential Villa Project",
      operator: "Alex Turner",
      hoursUsed: 18,
      lastService: "11-Jan",
      nextDue: "25-Jan",
      priority: "Low",
      priorityColor: "bg-green-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Concrete Mixer 350L",
      type: "Medium",
      project: "Downtown Office Complex",
      operator: "John Smith",
      hoursUsed: 42,
      lastService: "12-Jan",
      nextDue: "26-Jan",
      priority: "Scheduled",
      priorityColor: "bg-yellow-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
  ],

  week: [
    {
      equipment: "Excavator CAT 320D",
      type: "Heavy",
      project: "Highway Bridge Project",
      operator: "Mike Johnson",
      hoursUsed: 156,
      lastService: "05-Jan",
      nextDue: "20-Jan",
      priority: "High",
      priorityColor: "bg-red-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Tower Crane TC5613",
      type: "Heavy",
      project: "City Mall Renovation",
      operator: "Sarah Williams",
      hoursUsed: 89,
      lastService: "08-Jan",
      nextDue: "22-Jan",
      priority: "Low",
      priorityColor: "bg-green-500",
      status: "🟡 Maintenance",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Bulldozer D8T",
      type: "Heavy",
      project: "Industrial Park",
      operator: "Robert Brown",
      hoursUsed: 120,
      lastService: "10-Jan",
      nextDue: "28-Jan",
      priority: "Scheduled",
      priorityColor: "bg-yellow-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
  ],

  month: [
    {
      equipment: "Excavator CAT 320D",
      type: "Heavy",
      project: "Highway Bridge Project",
      operator: "Mike Johnson",
      hoursUsed: 312,
      lastService: "02-Jan",
      nextDue: "02-Feb",
      priority: "High",
      priorityColor: "bg-red-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Concrete Mixer 350L",
      type: "Medium",
      project: "Downtown Office Complex",
      operator: "John Smith",
      hoursUsed: 210,
      lastService: "04-Jan",
      nextDue: "30-Jan",
      priority: "Scheduled",
      priorityColor: "bg-yellow-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Tower Crane TC5613",
      type: "Heavy",
      project: "City Mall Renovation",
      operator: "Sarah Williams",
      hoursUsed: 268,
      lastService: "06-Jan",
      nextDue: "05-Feb",
      priority: "Low",
      priorityColor: "bg-green-500",
      status: "🟡 Maintenance",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Bulldozer D8T",
      type: "Heavy",
      project: "Industrial Park",
      operator: "Robert Brown",
      hoursUsed: 295,
      lastService: "09-Jan",
      nextDue: "07-Feb",
      priority: "Scheduled",
      priorityColor: "bg-yellow-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
    {
      equipment: "Forklift FL20",
      type: "Light",
      project: "Warehouse Expansion",
      operator: "Daniel Carter",
      hoursUsed: 144,
      lastService: "12-Jan",
      nextDue: "12-Feb",
      priority: "Low",
      priorityColor: "bg-green-500",
      status: "🟢 Active",
      action: "Details",
      actionType: "primary",
    },
  ],
} as const;


export const mockEquipmentData = [
  {
    id: "EQ-001",
    name: "Concrete Mixer 350L",
    category: "Heavy Equipment",
    status: "Active",
    location: "Site A",
    lastMaintenance: "2024-01-15",
  },
  {
    id: "EQ-002",
    name: "Excavator CAT 320D",
    category: "Heavy Equipment",
    status: "Active",
    location: "Site B",
    lastMaintenance: "2024-01-10",
  },
  {
    id: "EQ-003",
    name: "Tower Crane TC5613",
    category: "Heavy Equipment",
    status: "Maintenance",
    location: "Site C",
    lastMaintenance: "2024-01-20",
  },
];

export const mockMaintenanceData = [
  {
    equipment: "Concrete Mixer 350L",
    type: "Preventive",
    scheduledDate: "2024-02-01",
    status: "Scheduled",
    assignedTo: "Tech Team A",
  },
  {
    equipment: "Excavator CAT 320D",
    type: "Repair",
    scheduledDate: "2024-01-25",
    status: "In Progress",
    assignedTo: "Tech Team B",
  },
];

export const mockContacts = [
  {
    id: 1,
    name: "Michael Chen (Project Lead)",
    avatar: "https://i.pravatar.cc/150?u=michael",
    lastMessage: "Hi, I need a quote for a 40*60 workshop in Texas.",
    time: "2024-10-10 09:30 pm",
  },
  {
    id: 2,
    name: "Sarah Johnson (Site Manager)",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    lastMessage: "Equipment delivery confirmed for tomorrow",
    time: "2024-10-10 08:15 pm",
  },
];

export const mockMessages = [
  {
    id: 1,
    sender: "Michael Chen",
    text: "Hi, I need a quote for a 40*60 workshop in Texas.",
    time: "2024-10-10 09:30 pm",
    isMe: false,
  },
  {
    id: 2,
    sender: "You",
    text: "Sure, I can help with that. Let me prepare the details.",
    time: "2024-10-10 09:35 pm",
    isMe: true,
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Low Stock Alert",
    message: "Cement stock is below minimum level",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "maintenance",
    title: "Scheduled Maintenance",
    message: "Excavator CAT 320D maintenance due tomorrow",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Equipment Transfer",
    message: "Tower Crane transferred to Site C",
    time: "1 day ago",
    read: true,
  },
];

export const mockUserProfile = {
  fullName: "John Anderson",
  email: "johnanderson@company.com",
  phone: "+1 (555) 123-4567",
  role: "Plant Manager",
  avatar:
    "https://imgs.search.brave.com/C6AU3hqShumrOuZaswKHOeZBwOo-XeuuJnf7XZ-5QW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal9mcy1faEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9",
};

export const mockDashboardStats = {
  totalEquipment: 45,
  activeProjects: 12,
  maintenanceDue: 5,
  lowStockItems: 8,
};

export const mockLeadsData = {
  id: "Q-2025-1047",
  contactInfo: {
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    phone: "(555) 123-4567",
    location: "Texas",
  },
  projectDetails: {
    buildingType: "Workshop",
    quoteValue: "$12,500",
    status: "Quotation Sent",
    createdOn: "2024-10-10",
  },
  assignment: {
    assignedTo: "Sarah Lee",
    role: "1 person working on this lead",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  contract: {
    status: "Signed contact/Agreement",
    date: "Signed on: 12 April 2025",
  },
  progress: {
    currentStep: 4,
    totalSteps: 7,
    steps: [
      { id: 1, label: "Initial Contact", status: "completed" },
      { id: 2, label: "Requirements Gathered", status: "completed" },
      { id: 3, label: "Proposal Sent", status: "completed" },
      { id: 4, label: "Negotiation", status: "current" },
      { id: 5, label: "Deal Closed", status: "pending" },
      { id: 6, label: "Payment Done", status: "pending" },
      { id: 7, label: "Delivered", status: "pending" },
    ],
  },
  recentActivity: [
    { text: "Last activity: 2024-10-18", type: "info" },
    { text: "Lead created: 2024-10-10", type: "info" },
    { text: "2 unread messages", type: "alert" },
  ],
  photos: [
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
    "https://imgs.search.brave.com/tHqgR22b7R8Q9j0r6QfX7y2V6V8y0r6QfX7y2V6V8y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/NDMyNTMyL3Bob3Rv/L3N0ZWVsLWJlYW1z/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz16XzR4XzR4XzR4/XzR4XzR4XzR4XzR4",
  ],
};

export const mockServiceProviders = [
  {
    id: 1,
    providerName: "ABC Machinery",
    services: "Heavy Equipment",
    contact: "9876543210",
    rating: 5,
    avgCost: "High",
    lastService: "05-Apr",
  },
  {
    id: 2,
    providerName: "Local Workshop",
    services: "Repairs",
    contact: "9988776655",
    rating: 5,
    avgCost: "Low",
    lastService: "05-Apr",
  },
  {
    id: 3,
    providerName: "PowerTech",
    services: "Generators",
    contact: "9090909090",
    rating: 5,
    avgCost: "Medium",
    lastService: "05-Apr",
  },
  {
    id: 4,
    providerName: "ABC Machinery",
    services: "Heavy Equipment",
    contact: "9876543210",
    rating: 5,
    avgCost: "High",
    lastService: "05-Apr",
  },
  {
    id: 5,
    providerName: "Local Workshop",
    services: "Repairs",
    contact: "9988776655",
    rating: 5,
    avgCost: "Low",
    lastService: "05-Apr",
  },
  {
    id: 6,
    providerName: "PowerTech",
    services: "Generators",
    contact: "9090909090",
    rating: 5,
    avgCost: "Medium",
    lastService: "05-Apr",
  },
  {
    id: 7,
    providerName: "ABC Machinery",
    services: "Heavy Equipment",
    contact: "9876543210",
    rating: 5,
    avgCost: "High",
    lastService: "05-Apr",
  },
];

export const mockBreakdownCases = [
  {
    id: 1,
    equipment: "Excavator CAT 320D",
    reportedOn: "05-Apr",
    issue: "Not starting",
    severity: "Critical",
    severityColor: "bg-red-500",
    status: "Pending",
    assignedTo: "PowerTech",
  },
  {
    id: 2,
    equipment: "Concrete Mixer 350L",
    reportedOn: "05-Apr",
    issue: "Burnt motor",
    severity: "High",
    severityColor: "bg-orange-500",
    status: "Under Repair",
    assignedTo: "Local Shop",
  },
  {
    id: 3,
    equipment: "Diesel Generator 65kVA",
    reportedOn: "05-Apr",
    issue: "Trigger fault",
    severity: "Medium",
    severityColor: "bg-yellow-500",
    status: "Completed",
    assignedTo: "In-house",
  },
  {
    id: 4,
    equipment: "Excavator CAT 320D",
    reportedOn: "05-Apr",
    issue: "Not starting",
    severity: "Critical",
    severityColor: "bg-red-500",
    status: "Pending",
    assignedTo: "PowerTech",
  },
  {
    id: 5,
    equipment: "Concrete Mixer 350L",
    reportedOn: "05-Apr",
    issue: "Burnt motor",
    severity: "High",
    severityColor: "bg-orange-500",
    status: "Under Repair",
    assignedTo: "Local Shop",
  },
  {
    id: 6,
    equipment: "Diesel Generator 65kVA",
    reportedOn: "05-Apr",
    issue: "Trigger fault",
    severity: "Medium",
    severityColor: "bg-yellow-500",
    status: "Completed",
    assignedTo: "In-house",
  },
  {
    id: 7,
    equipment: "Concrete Mixer 350L",
    reportedOn: "05-Apr",
    issue: "Not starting",
    severity: "Critical",
    severityColor: "bg-red-500",
    status: "Pending",
    assignedTo: "PowerTech",
  },
];


export const equipmentByFilter: Record<
  TabType,
  {
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
  }[]
> = {
  today: [
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
      nextDue: "Today",
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
      nextDue: "Tomorrow",
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
  ],

  week: [
    {
      id: "EX-401",
      name: "Excavator Volvo EC210",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "IT Park Phase 2",
      location: "Bangalore",
      hours: "214h",
      nextDue: "18-Apr",
    },
    {
      id: "CR-211",
      name: "Tower Crane TC5613",
      category: "Heavy",
      status: "Scheduled Service",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "City Mall",
      location: "Mumbai",
      hours: "96h",
      nextDue: "22-Apr",
    },
    {
      id: "DG-88",
      name: "Diesel Generator 88kVA",
      category: "Medium",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "Metro Rail",
      location: "Delhi",
      hours: "355h",
      nextDue: "25-Apr",
    },
    {
      id: "FL-120",
      name: "Forklift Toyota 3T",
      category: "Light",
      status: "Idle",
      statusColor: "text-gray-600",
      dotColor: "bg-gray-400",
      project: "-",
      location: "Central Yard",
      hours: "44h",
      nextDue: "28-Apr",
    },
  ],

  month: [
    {
      id: "EX-990",
      name: "Excavator Komatsu PC200",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "Highway Expansion",
      location: "Nagpur",
      hours: "512h",
      nextDue: "05-May",
    },
    {
      id: "CM-550",
      name: "Concrete Mixer 550L",
      category: "Medium",
      status: "Under Maintenance",
      statusColor: "text-orange-600",
      dotColor: "bg-orange-500",
      project: "-",
      location: "Service Yard",
      hours: "-",
      nextDue: "03-May",
    },
    {
      id: "DG-120",
      name: "Diesel Generator 120kVA",
      category: "Heavy",
      status: "Breakdown",
      statusColor: "text-red-600",
      dotColor: "bg-red-500",
      project: "Airport Terminal",
      location: "Hyderabad",
      hours: "742h",
      nextDue: "Overdue",
    },
    {
      id: "CR-882",
      name: "Crawler Crane XCMG",
      category: "Heavy",
      status: "In Use",
      statusColor: "text-green-600",
      dotColor: "bg-green-500",
      project: "Steel Plant",
      location: "Jamshedpur",
      hours: "630h",
      nextDue: "12-May",
    },
    {
      id: "FL-300",
      name: "Forklift Hyundai 5T",
      category: "Medium",
      status: "Idle",
      statusColor: "text-gray-600",
      dotColor: "bg-gray-400",
      project: "-",
      location: "Warehouse Hub",
      hours: "90h",
      nextDue: "18-May",
    },
  ],
} as const;
