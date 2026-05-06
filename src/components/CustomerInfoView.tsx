import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Hammer, 
  CircleCheck, 
  CircleDollarSign, 
  TrendingUp,
} from "lucide-react";
import StatCard from "./ui/stat-card";
import { customersData, type CustomerInfo } from "@/data/productionMockData";
import CustomerProjectsTable from "./projects/CustomerProjectsTable";
import CustomerInvoicesTable from "./projects/CustomerInvoicesTable";
import CustomerProfileCard from "./projects/CustomerProfileCard";
import Heading from "./common_component/Heading";

const CustomerInfoView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Find customer data by ID, fallback to John Doe if not found (for demo)
  const customerData: CustomerInfo = customersData[id || ""] || customersData["ID-2025-1047"];

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
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 md:px-6 py-1 md:py-2 bg-[#1E51A4] text-white rounded-md hover:opacity-90 transition-opacity font-inter font-semibold text-xs md:text-sm shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </button>
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
