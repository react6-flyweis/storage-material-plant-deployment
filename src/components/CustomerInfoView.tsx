import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Hammer,
  CircleCheck,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import StatCard from "./ui/stat-card";
import CustomerProjectsTable from "./projects/CustomerProjectsTable";
import CustomerInvoicesTable from "./projects/CustomerInvoicesTable";
import CustomerProfileCard from "./projects/CustomerProfileCard";
import Heading from "./common_component/Heading";
import Button from "./common_component/Button";

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
  invoices: { number: string; dueDate: string; amount: string; paid: string; dueAmount: string; status: string; }[];
  recentActivity?: { building: string; action: string; date: string; }[];
  notes: string[];
}

const CustomerInfoView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find customer data by ID, fallback to John Doe if not found (for demo)
  const customerData: CustomerInfo = {
    id: id || "CUST-001",
    name: "John Doe",
    email: "[EMAIL_ADDRESS]",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
    location: "Anytown, USA",
    joinedDate: "2022-01-01",
    status: "Active",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    projects: [
      {
        id: "1",
        name: "Project 1",
        building: "Building 1",
        amount: "123",
        status: "Completed",
        stage: "Stage 1",
        progress: 100,
        startDate: "2022-01-01",
        endDate: "2022-12-31",
        buildingType: "Building Type 1",
        quoteValue: "123",
        createdOn: "2022-01-01",
        location: "Anytown, USA",
        salesPerson: "Sales Person 1",
        contractDate: "2022-01-01",
      },
    ],
    invoices: [
      {
        number: "1",
        dueDate: "2022-01-01",
        amount: "123",
        paid: "123",
        dueAmount: "123",
        status: "Paid",
      },
    ],
    recentActivity: [
      {
        building: "Building 1",
        action: "Action 1",
        date: "2022-01-01",
      },
    ],
    notes: ["Note 1", "Note 2"],
  }

  if (!customerData) {
    return <div className="p-10 text-center font-inter text-gray-500">Customer not found</div>;
  }

  const projects = customerData.projects;
  const invoices = customerData.invoices;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString().padStart(2, '0'),
      icon: <Hammer className="size-5 text-[#1E51A4]" />,
      color: "bg-[#1E51A4]",
    },
    {
      title: "Completed",
      value: projects.filter(p => p.status === 'Completed').length.toString(),
      icon: <CircleCheck className="size-5 text-[#3AB449]" />,
      color: "bg-[#3AB449]",
    },
    {
      title: "Work in progress",
      value: projects.filter(p => p.status === 'In progress').length.toString(),
      icon: <CircleDollarSign className="size-5 text-[#EAB308]" />,
      color: "bg-[#EAB308]",
    },
    {
      title: "Canceled",
      value: projects.filter(p => p.status === 'Canceled').length.toString(),
      icon: <TrendingUp className="size-5 text-[#FD8D5B]" />,
      color: "bg-[#FD8D5B]",
    },
  ];

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          variant="blueFilled"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 shrink-0"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </Button>
        <Heading text="Customer Info" />
      </div>

      {/* Customer Profile Card */}
      <CustomerProfileCard customerData={customerData} />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* All Projects Table */}
      <CustomerProjectsTable projects={projects} />

      {/* Invoice List Table */}
      <CustomerInvoicesTable invoices={invoices} />
    </div>
  );
};

export default CustomerInfoView;
