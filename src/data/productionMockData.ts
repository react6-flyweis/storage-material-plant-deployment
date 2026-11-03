export interface CustomerInfo {
  location: string;
  id: string;
  name: string;
  joinedDate: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  image: string;
  projects: {
    id: string;
    name: string;
    building: string;
    amount: string;
    status: string;
    stage: string;
    progress: number;
    startDate: string;
    endDate: string;
    buildingType?: string;
    quoteValue: string;
    createdOn: string;
    location?: string;
    salesPerson?: string;
    contractDate?: string;
  }[];
  invoices: {
    number: string;
    dueDate: string;
    amount: string;
    paid: string;
    dueAmount: string;
    status: string;
  }[];
  recentActivity?: { building: string; action: string; date: string }[];
  notes?: string[];
}

export interface ShipperFile {
  name: string;
  shpId: string;
  company: string;
  items: number;
  date: string;
  time: string;
}

export interface PlantAlert {
  type: "shipper" | "order" | "drawing" | "production" | string;
  message: string;
  time: string;
}

export interface FreightCarrier {
  name: string;
  loads: string;
  status: "On Time" | "Delayed" | string;
}

export interface ProductionMetric {
  label: string;
  value: string;
  icon: "graph" | "moneybillnote" | "moneybag" | "truck" | "chart";
}

const defaultCustomer: CustomerInfo = {
  id: "ID-2025-1047",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 234-5678",
  address: "742 Evergreen Terrace, Springfield, OR 97477",
  location: "Springfield, OR",
  joinedDate: "15 Jan 2024",
  status: "Active",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  projects: [
    {
      id: "PROJ-101",
      name: "Industrial Complex A",
      building: "Building A",
      amount: "$150,000",
      status: "Completed",
      stage: "Delivery",
      progress: 100,
      startDate: "2024-01-10",
      endDate: "2024-03-25",
      buildingType: "Pre-Engineered Building",
      quoteValue: "$150,000",
      createdOn: "2024-01-05",
      location: "Austin, TX",
      salesPerson: "Michael Scott",
      contractDate: "2024-01-08",
    },
    {
      id: "PROJ-102",
      name: "Warehouse Expansion B",
      building: "Building B",
      amount: "$85,000",
      status: "In Progress",
      stage: "Fabrication",
      progress: 65,
      startDate: "2024-02-15",
      endDate: "2024-05-10",
      buildingType: "Steel Warehouse",
      quoteValue: "$85,000",
      createdOn: "2024-02-01",
      location: "Dallas, TX",
      salesPerson: "Dwight Schrute",
      contractDate: "2024-02-10",
    },
  ],
  invoices: [
    {
      number: "INV-2024-001",
      dueDate: "2024-04-01",
      amount: "$50,000",
      paid: "$50,000",
      dueAmount: "$0",
      status: "Paid",
    },
    {
      number: "INV-2024-002",
      dueDate: "2024-05-01",
      amount: "$35,000",
      paid: "$20,000",
      dueAmount: "$15,000",
      status: "Partial",
    },
  ],
  recentActivity: [
    {
      building: "Building A",
      action: "Drawings approved by structural engineer",
      date: "2024-03-20",
    },
    {
      building: "Building B",
      action: "Shipper file uploaded for review",
      date: "2024-03-22",
    },
  ],
  notes: ["Client requires site visit confirmation 24h prior to delivery."],
};

export const customersData: Record<string, CustomerInfo> = {
  "ID-2025-1047": defaultCustomer,
  "CUST-001": defaultCustomer,
};

export const shipperFilesData: ShipperFile[] = [
  {
    name: "SHP_Austin_Main_Framing.pdf",
    shpId: "SHP-9021",
    company: "Acme Industrial Co",
    items: 48,
    date: "24 Mar 2024",
    time: "10:30 AM",
  },
  {
    name: "SHP_Dallas_Roof_Trusses.pdf",
    shpId: "SHP-9022",
    company: "Pinnacle Structures",
    items: 32,
    date: "24 Mar 2024",
    time: "02:15 PM",
  },
  {
    name: "SHP_Houston_Wall_Girts.pdf",
    shpId: "SHP-9023",
    company: "Apex Metal Tech",
    items: 20,
    date: "23 Mar 2024",
    time: "11:45 AM",
  },
];

export const plantAlertsData: PlantAlert[] = [
  {
    type: "shipper",
    message: "New shipper file received for Job #PEB-1021",
    time: "10 mins ago",
  },
  {
    type: "drawing",
    message: "Revision requested on structural drawing DWG-004",
    time: "1 hour ago",
  },
  {
    type: "production",
    message: "Cutting machine #2 scheduled for routine maintenance",
    time: "3 hours ago",
  },
];

export const freightCarriersData: FreightCarrier[] = [
  {
    name: "FastFreight Express",
    loads: "12 active loads",
    status: "On Time",
  },
  {
    name: "TransNational Hauling",
    loads: "8 active loads",
    status: "Delayed",
  },
  {
    name: "Apex Logistics",
    loads: "15 active loads",
    status: "On Time",
  },
];
