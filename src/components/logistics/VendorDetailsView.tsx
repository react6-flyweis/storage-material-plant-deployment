import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShoppingBag,
  Globe,
  Search,
  MapPin,
  Link,
  PencilLine,
  CircleCheck,
  Hourglass,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../common_component/PageWrapper";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import Button from "../common_component/Button";
import Pagination from "../Pagination";
import VendorModal from "./VendorModal";
import SubHeading from "../common_component/SubHeading";
import FilterDropdown from "../common_component/FilterDropdown";
import verify from "@/assets/icon/verify.svg";
import pdfIcon from "@/assets/icon/pdfIcon.svg";

import personPlaceholderImage from "@/assets/images/personPlaceholderImage.svg";

const VendorDetailsView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [docSort, setDocSort] = useState("Docs Type");

  // Sorting and Pagination State
  const [sortField, setSortField] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Mock data for the specific vendor
  const vendorData = {
    id: "CI-12345",
    name: "Robert George",
    status: "Active",
    rating: 4.7,
    address: "4712 Cherry Ridge Drive Rochester, NY 14620.",
    email: "john@example.com",
    phone: "+1 58578 54840",
    shop: "True Steel Materials",
    website: "www.example.com",
    vendorType: "Material Shipper",
    serviceCategory: "Construction Materials",
    yearsWorking: "3 Years",
    metrics: {
      totalOrders: 142,
      completedDeliveries: 138,
      activeOrders: 4,
      avgDeliveryTime: "2.4 Days",
      onTimeRate: "95%",
    },
    notes:
      "Keep in mind that in order to be deductible, your employees' pay must be reasonable and necessary for conducting business to qualify for",
    contactRoles: [
      { role: "Sales Rep", name: "John Doe", phone: "+1 58578 54840" },
      { role: "Dispatch", name: "Riyaz Khan", phone: "+1 58578 54840" },
      { role: "Accounts", name: "Sir John Peds", phone: "+1 58578 54840" },
      { role: "Warehouse Manager", name: "John Doe", phone: "+1 58578 54840" },
    ],
    purchaseHistory: [
      {
        id: "ORD00025",
        material: "Steel Beams",
        quantity: "20 Tons",
        value: "$5,000",
        status: "Delivered",
      },
      {
        id: "ORD00024",
        material: "Cement Bags",
        quantity: "500 Units",
        value: "$10,750",
        status: "In Transit",
      },
      {
        id: "ORD00023",
        material: "Iron Rods",
        quantity: "12 Tons",
        value: "$20,000",
        status: "Delivered",
      },
      {
        id: "ORD00022",
        material: "Cement Bags",
        quantity: "500 Units",
        value: "$50,000",
        status: "Delivered",
      },
      {
        id: "ORD00019",
        material: "Iron Rods",
        quantity: "20 Tons",
        value: "$1,25,000",
        status: "Delivered",
      },
    ],
    complianceDocs: [
      {
        name: "Insurance certificate",
        size: "6.1 MB",
        type: "PDF",
        expiry: "Mar 15, 2025",
      },
      {
        name: "Material certifications",
        size: "5.2 MB",
        type: "PDF",
        expiry: "Jan 8, 2025",
      },
      {
        name: "Contracts",
        size: "6.1 MB",
        type: "PDF",
        expiry: "Mar 15, 2025",
      },
      {
        name: "Pricing sheets",
        size: "6.1 MB",
        type: "PDF",
        expiry: "Mar 15, 2025",
      },
    ],
  };

  const sortedHistory = useMemo(() => {
    const data = [...vendorData.purchaseHistory];
    return data.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle currency/numeric values
      if (sortField === "value") {
        valA = parseFloat(valA.replace(/[$,]/g, ""));
        valB = parseFloat(valB.replace(/[$,]/g, ""));
      } else if (sortField === "quantity") {
        valA = parseFloat(valA.split(" ")[0]);
        valB = parseFloat(valB.split(" ")[0]);
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortField, sortOrder, vendorData.purchaseHistory]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedHistory.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, rowsPerPage, sortedHistory]);

  const sortedDocs = useMemo(() => {
    const data = [...vendorData.complianceDocs];
    if (docSort === "Name") {
      return data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (docSort === "Size") {
      return data.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
    } else if (docSort === "Docs Type") {
      return data.sort((a, b) => a.type.localeCompare(b.type));
    }
    return data;
  }, [docSort, vendorData.complianceDocs]);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors shrink-0"
        >
          <ArrowLeft size={20} className="text-[#051321]" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-[#051321]">
          Vendors
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#F7F8F9] rounded-[14px] p-3 md:p-6 shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-6 items-start justify-between mb-8">
              <div className="flex flex-wrap items-center sm:items-start gap-2 md:gap-4 w-full">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm shrink-0">
                  <img
                    src={personPlaceholderImage}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-[250px]">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm">
                    <span className="text-[#7539FF] font-normal">
                      {vendorData.id}
                    </span>
                    <div className="flex items-center gap-2 text-[#051321]">
                      ⭐
                      <span className="font-normal">
                        {vendorData.rating} / 5
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#051321] truncate">
                      {vendorData.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 ml-4">
                      <img src={verify} alt="verify" className="size-4" />
                      <p className="text-[#34C759] font-medium text-sm">
                        {vendorData.status}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#5D6772] flex items-center justify-center sm:justify-start gap-1">
                    <MapPin size={14} className="shrink-0" />{" "}
                    <span className="truncate">{vendorData.address}</span>
                  </p>
                </div>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 border-gray-200 shadow-sm"
                >
                  <PencilLine size={16} /> Edit Profile
                </Button>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-white p-4 rounded-xl border border-gray-100">
              <InfoTile
                icon={<Mail size={18} />}
                label="Email Address"
                value={vendorData.email}
              />
              <InfoTile
                icon={<Phone size={18} />}
                label="Phone"
                value={vendorData.phone}
              />
              <InfoTile
                icon={<ShoppingBag size={18} />}
                label="Shop"
                value={vendorData.shop}
              />
              <InfoTile
                icon={<Globe size={18} />}
                label="Website"
                value={vendorData.website}
                isLink
              />
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 pt-8 border-t border-gray-100">
              <DetailItem label="Vendor Type" value={vendorData.vendorType} />
              <DetailItem
                label="Service Category"
                value={vendorData.serviceCategory}
              />
              <DetailItem
                label="Years Working With Company"
                value={vendorData.yearsWorking}
              />
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6 gap-x-4 p-4 md:p-6 mt-8 bg-[#F8F9FA] rounded-[14px]">
              <MetricItem
                label="Total Orders"
                value={vendorData.metrics.totalOrders}
              />
              <MetricItem
                label="Completed Deliveries"
                value={vendorData.metrics.completedDeliveries}
              />
              <MetricItem
                label="Active Orders"
                value={vendorData.metrics.activeOrders}
              />
              <MetricItem
                label="Average Delivery Time"
                value={vendorData.metrics.avgDeliveryTime}
              />
              <MetricItem
                label="On-time Delivery Rate"
                value={vendorData.metrics.onTimeRate}
              />
            </div>
          </div>

          {/* Order / Purchase History */}
          <div className="bg-white rounded-[14px] p-3 md:p-5 shadow-sm border border-gray-100">
            <SubHeading text="Order / Purchase History" />
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-separate border-spacing-0 border border-[#E2E4E6] rounded-lg">
                <thead className="bg-[#F4F6F8]">
                  <tr>
                    <th className="p-3 text-xs font-semibold text-[#5D6772] uppercase tracking-wider border-b border-r border-[#E2E4E6]">
                      Order ID
                    </th>
                    <th
                      className="p-3 text-xs font-semibold text-[#5D6772] uppercase tracking-wider border-b border-r border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("material")}
                    >
                      <div className="flex items-center gap-1">
                        Material{" "}
                        <ArrowUpDown
                          size={14}
                          className={
                            sortField === "material"
                              ? "text-[#7539FF]"
                              : "text-gray-400"
                          }
                        />
                      </div>
                    </th>
                    <th
                      className="p-3 text-xs font-semibold text-[#5D6772] uppercase tracking-wider border-b border-r border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("quantity")}
                    >
                      <div className="flex items-center gap-1">
                        Quantity{" "}
                        <ArrowUpDown
                          size={14}
                          className={
                            sortField === "quantity"
                              ? "text-[#7539FF]"
                              : "text-gray-400"
                          }
                        />
                      </div>
                    </th>
                    <th
                      className="p-3 text-xs font-semibold text-[#5D6772] uppercase tracking-wider border-b border-r border-[#E2E4E6] cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("value")}
                    >
                      <div className="flex items-center gap-1">
                        Order Value{" "}
                        <ArrowUpDown
                          size={14}
                          className={
                            sortField === "value"
                              ? "text-[#7539FF]"
                              : "text-gray-400"
                          }
                        />
                      </div>
                    </th>
                    <th className="p-3 text-xs font-semibold text-[#5D6772] uppercase tracking-wider border-b border-[#E2E4E6]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E4E6]">
                  {paginatedHistory.map((order, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#2563EB] whitespace-nowrap border-r border-[#E2E4E6]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#051321] font-medium whitespace-nowrap border-r border-[#E2E4E6]">
                        {order.material}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#5D6772] whitespace-nowrap border-r border-[#E2E4E6]">
                        {order.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#051321] font-medium whitespace-nowrap border-r border-[#E2E4E6]">
                        {order.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <CommonStatusBadge
                          text={order.status}
                          variant={
                            order.status === "Delivered" ? "green" : "blue"
                          }
                          icon={
                            order.status === "Delivered" ? (
                              <CircleCheck size={14} />
                            ) : (
                              <Hourglass size={14} />
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalItems={vendorData.purchaseHistory.length}
              itemsPerPage={rowsPerPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </div>

          {/* Compliance & Certifications */}
          <div className="bg-white rounded-[14px] shadow-sm p-3 md:p-5 border border-gray-100 overflow-hidden">
            <SubHeading text="Compliance & Certifications" />
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-sm font-semibold text-[#051321]">
                  Total No of Documents : {vendorData.complianceDocs.length}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <FilterDropdown
                    label="Sort By :"
                    activeTab={docSort}
                    onTabChange={setDocSort}
                    options={[
                      { label: "Docs Type", value: "Docs Type" },
                      { label: "Name", value: "Name" },
                      { label: "Size", value: "Size" },
                    ]}
                  />
                  <div className="relative flex-1 sm:flex-none">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm outline-none w-full sm:w-48 focus:border-blue-400 transition-all text-[#051321]"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto border border-[#E2E4E6] rounded-lg">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-[#F4F6F8]">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Name
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Size
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Type
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-black border-b border-[#E2E4E6]">
                        Expiry Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E4E6] bg-white">
                    {sortedDocs.map((doc, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#F8F9FA] rounded-md shrink-0 border border-gray-100">
                              <img src={pdfIcon} alt="PDF" className="size-5" />
                            </div>
                            <span className="text-sm font-medium text-[#111827] truncate">
                              {doc.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#5D6772]">
                          {doc.size}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#5D6772]">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#051321] font-medium">
                          {doc.expiry}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right 1/3) */}
        <div className="space-y-6">
          {/* Notes Card */}
          <div className="bg-white rounded-[14px] p-3 md:p-5 shadow-sm ">
            <SubHeading text="Notes" />
            <div className="w-full h-px bg-gray-100 mb-6" />
            <p className="text-sm text-[#637381] leading-relaxed font-inter">
              {vendorData.notes}
            </p>
          </div>

          {/* Contact Roles Card */}
          <div className="bg-white rounded-[14px] p-3 md:p-5 shadow-sm ">
            <SubHeading text="Vendor Contact Roles" />
            <div className="w-full h-px bg-gray-100 mb-6" />
            <div className="space-y-8">
              {vendorData.contactRoles.map((contact, i) => (
                <div key={i} className="space-y-1.5">
                  <h4 className="text-sm font-semibold text-[#051321]">
                    {contact.role}
                  </h4>
                  <p className="text-sm text-[#5D6772]">{contact.name}</p>
                  <p className="text-xs text-[#5D6772]">{contact.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <VendorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={{
          ...vendorData,
          materialTypes: ["Steel & Metal"],
        }}
        onSave={(data) => {
          console.log("Saving vendor data:", data);
          setIsEditModalOpen(false);
        }}
      />
    </PageWrapper>
  );
};

// --- Sub-components & Helpers ---

const InfoTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}> = ({ icon, label, value, isLink }) => (
  <div className="flex items-start gap-3">
    <div className="text-[#5D6772] mt-0.5 shrink-0">{icon}</div>
    <div className="space-y-0.5 min-w-0">
      <p className="text-sm font-semibold text-[#051321] tracking-tight">
        {label}
      </p>
      <p
        className={`text-xs text-[#5D6772] truncate ${isLink ? "flex items-center gap-1 font-medium" : ""}`}
      >
        {value} {isLink && <Link size={12} className="text-[#7539FF]" />}
      </p>
    </div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="space-y-1.5">
    <p className="text-sm font-semibold text-[#051321] tracking-tight flex items-center gap-2">
      <span className="w-1.5 h-1.5 bg-[#051321] rounded-full" /> {label}
    </p>
    <p className="text-xs text-[#5D6772] truncate pl-3.5 font-medium">
      {value}
    </p>
  </div>
);

const MetricItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-[#051321] tracking-tight leading-tight">
      {label}
    </p>
    <p className="text-xs text-[#5D6772] truncate ">{value}</p>
  </div>
);

export default VendorDetailsView;
