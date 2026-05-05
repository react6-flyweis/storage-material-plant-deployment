import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Copy, 
  Hammer, 
  CircleCheck, 
  CircleDollarSign, 
  TrendingUp,
  FileText,
  FileSpreadsheet,
  Printer,
  CircleDot
} from "lucide-react";
import StatCard from "./ui/stat-card";
import { customersData, type CustomerInfo } from "@/data/productionMockData";

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
          className="flex items-center gap-2 px-6 py-2 bg-[#1E51A4] text-white rounded-md hover:opacity-90 transition-opacity font-inter font-semibold text-sm shadow-sm"
        >
          <ArrowLeft size={18} strokeWidth={2.5} /> Back
        </button>
        <h1 className="text-xl font-inter font-bold text-[#212B36]">Customer Info</h1>
      </div>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
          {/* Left: Avatar & Basic Info */}
          <div className="flex flex-wrap gap-8 items-center lg:w-[45%]">
            <img 
              src={customerData.image} 
              alt={customerData.name} 
              className="size-24 rounded-full object-cover ring-4 ring-gray-50 shadow-sm" 
            />
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-inter font-bold text-[#212B36]">{customerData.name}</h2>
                <span className="flex items-center gap-2 px-6 py-2.5 bg-[#DCFCE7] text-(--text-color-green) rounded-full text-sm font-inter font-bold tracking-wide">
                  <span className="size-3 bg-[#22C55E] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Active
                </span>
              </div>
              <p className="text-[#656565] font-inter text-lg font-normal">{customerData.id}</p>
              <p className="text-[#656565] font-inter text-base font-normal">Joined {customerData.joinedDate}</p>
            </div>
          </div>

          {/* Right: Contact Details */}
          <div className="flex-1 grid grid-cols-1 gap-y-4 lg:border-l lg:pl-12 border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 w-28">
                <Phone size={18} className="text-[#637381]" />
                <span className="text-base text-[#637381] font-inter font-medium">Phone</span>
              </div>
              <span className="text-base font-inter text-[#212B36] font-semibold">{customerData.phone}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 w-28">
                <Mail size={18} className="text-[#637381]" />
                <span className="text-base text-[#637381] font-inter font-medium">Email</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-inter text-[#446DF6] font-semibold underline underline-offset-4 decoration-1">{customerData.email}</span>
                <Copy size={16} className="text-[#919EAB] cursor-pointer hover:text-[#212B36] transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 w-28 shrink-0">
                <MapPin size={18} className="text-[#637381]" />
                <span className="text-base text-[#637381] font-inter font-medium">Address</span>
              </div>
              <span className="text-base font-inter text-[#212B36] font-semibold leading-relaxed">{customerData.address}</span>
            </div>
          </div>
        </div>
      </div>

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-white">
          <h3 className="text-xl font-inter font-bold text-[#212B36]">All Projects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider">Project</th>
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider">Project Name</th>
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider">Amount</th>
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider">Status</th>
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider text-nowrap">Start Date</th>
                <th className="p-4 text-[#919EAB] font-inter font-semibold uppercase text-xs tracking-wider text-nowrap">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-inter text-[#637381] font-medium">{project.id}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36] font-bold">{project.name}</td>
                  <td className="p-4 text-sm font-inter text-[#212B36] font-bold">{project.amount}</td>
                  <td className="p-4">
                    <span className={`text-sm font-inter font-semibold ${project.status === 'Completed' ? 'text-(--text-color-green)' : 'text-(--text-color-salmon)'}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-medium">{project.startDate}</td>
                  <td className="p-4 text-sm font-inter text-[#637381] font-medium">{project.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 text-center border-t border-gray-100 bg-white">
          <button className="text-[#446DF6] font-inter font-bold text-base hover:underline transition-all">View All</button>
        </div>
      </div>

      {/* Invoice List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h3 className="text-xl font-inter font-bold text-[#212B36]">Invoice List</h3>
          <div className="flex gap-3">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#FF4842] transition-colors"><FileText size={20} /></button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-(--text-color-green) transition-colors"><FileSpreadsheet size={20} /></button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-[#919EAB] transition-colors"><Printer size={20} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Invoice Number</th>
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Due Date</th>
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Amount</th>
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Paid</th>
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Amount Due</th>
                <th className="p-4 text-(--text-color-gray-3) font-inter font-semibold text-sm uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-inter text-[#BA6D36] font-bold cursor-pointer hover:underline">{inv.number}</td>
                  <td className="p-4 text-sm font-inter text-(--text-color-gray-3) font-medium">{inv.dueDate}</td>
                  <td className="p-4 text-sm font-inter text-(--text-color-gray-3) font-medium">{inv.amount}</td>
                  <td className="p-4 text-sm font-inter text-(--text-color-gray-3) font-medium">{inv.paid}</td>
                  <td className="p-4 text-sm font-inter text-(--text-color-gray-3) font-medium">{inv.dueAmount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-inter font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                      inv.status === 'Paid' ? 'bg-[#E7F8EE] text-(--text-color-green)' : 'bg-[#FFE7E6] text-[#FF4842]'
                    }`}>
                      <CircleDot size={8} className={inv.status === 'Paid' ? 'fill-(--text-color-green)' : 'fill-[#FF4842]'} />
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoView;
