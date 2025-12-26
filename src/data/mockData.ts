// Mock data for the application

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
