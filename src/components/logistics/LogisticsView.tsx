import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Star, Mail, Phone, Store, Eye, Edit2, Trash2 } from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import VendorModal from "./VendorModal";
import SuccessModal from "../common_component/SuccessModal";
import FreightFilterModal from "../delivery/FreightFilterModal";

const mockVendors = [
  {
    id: 1,
    name: "Steel Shippers Inc.",
    vendorId: "VEN-001",
    contact: "Robert Anderson",
    email: "robert@steelShippers.com",
    phone: "(555) 111-2222",
    materialTypes: ["Steel & Metal", "Structural Steel"],
    extraMaterials: 1,
    orders: { active: 8, total: 156 },
    rating: 4.7,
    status: "Active",
    vendorType: "Material Shipper",
    pickupLocation: "Dallas Steel Yard",
    onTimeDeliveries: "92%",
  },
  {
    id: 2,
    name: "Concrete Works Ltd.",
    vendorId: "VEN-002",
    contact: "Maria Garcia",
    email: "maria@concreteworks.com",
    phone: "(555) 222-3333",
    materialTypes: ["Concrete", "Ready Mix"],
    extraMaterials: 1,
    orders: { active: 5, total: 98 },
    rating: 4.9,
    status: "Active",
    vendorType: "Steel Shipper",
    pickupLocation: "-",
    onTimeDeliveries: "88%",
  },
  {
    id: 3,
    name: "Lumber & Building Materials Co.",
    vendorId: "VEN-003",
    contact: "David Chen",
    email: "david@lumberbuild.com",
    phone: "(555) 333-4444",
    materialTypes: ["Lumber", "Wood Products"],
    extraMaterials: 2,
    orders: { active: 6, total: 124 },
    rating: 4.5,
    status: "Active",
    vendorType: "Concrete Shipper",
    pickupLocation: "Dallas Steel Yard",
    onTimeDeliveries: "92%",
  },
  {
    id: 4,
    name: "Electrical Supply Warehouse",
    vendorId: "VEN-004",
    contact: "Jennifer Thompson",
    email: "jen@electricalsupply.com",
    phone: "(555) 444-5555",
    materialTypes: ["Electrical", "Wiring"],
    extraMaterials: 2,
    orders: { active: 4, total: 67 },
    rating: 4.6,
    status: "Active",
    vendorType: "Material Shipper",
    pickupLocation: "Dallas Steel Yard",
    onTimeDeliveries: "90%",
  },
  {
    id: 5,
    name: "ABC Plumbing Supplies",
    vendorId: "VEN-005",
    contact: "Michael Brown",
    email: "mike@abcplumbing.com",
    phone: "(555) 555-6666",
    materialTypes: ["Plumbing", "Pipes"],
    extraMaterials: 2,
    orders: { active: 0, total: 23 },
    rating: 3.2,
    status: "Inactive",
    vendorType: "Plumbing Shipper",
    pickupLocation: "Main Warehouse",
    onTimeDeliveries: "85%",
  },
];

const LogisticsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState({ title: "", subTitle: "" });

  const filteredVendors = useMemo(() => {
    return mockVendors.filter((v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vendorId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddVendor = () => {
    setModalMode("add");
    setSelectedVendor(null);
    setIsVendorModalOpen(true);
  };

  const handleEditVendor = (vendor: any) => {
    setModalMode("edit");
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setSuccessMsg({
      title: "Vendor Deleted",
      subTitle: `Vendor Name: ${vendor?.name}`,
    });
    setIsSuccessModalOpen(true);
  };

  const handleSaveVendor = (data: any) => {
    setSuccessMsg({
      title: modalMode === "add" ? "Vendor Added" : "Vendor Updated",
      subTitle: `Vendor Name: ${data.name}`,
    });
    setIsSuccessModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            className={s <= Math.floor(rating) ? "fill-[#FFD700] text-[#FFD700]" : "fill-[#000000]"}
          />
        ))}
        <span className="ml-1 text-sm text-[#364153] font-normal">{rating}</span>
      </div>
    );
  };

  const headers = [
    "Shippers", 
    "Contact", 
    "Email", 
    "Phone", 
    "Material Types", 
    "Orders", 
    "Rating",
    "Status",
    "Vendor Type",
    "Pickup Location",
    "On-time Deliveries:",
    "Actions"
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-1 pt-1">
        <TitleSubtitle 
          title="Logistics" 
          subtitle="Manage Shipper companies and material vendors" 
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-2 lg:p-3 rounded-[14px] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by vendor, contact, email, or material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-[200px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap ml-auto items-center gap-2">
          <Button variant="grayFilled" size="sm" onClick={() => setIsFilterModalOpen(true)}>
            <Filter size={18} /> Filter
          </Button>
          <Button variant="gradient" size="sm" onClick={handleAddVendor}>
            <Plus size={18} /> Add Vendor
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[14px] overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E5ECFF] border-b-2 border-[#BEDBFF] bg-gradient-to-r from-[#F1F5F9] to-[#DBEAFE]">
                {headers.map((header) => (
                  <th key={header} className="p-3 md:p-4 text-xs font-medium text-[#364153] uppercase tracking-wide text-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#155DFC]">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-nowrap font-semibold text-[#212B36] leading-tight mb-0.5">{vendor.name}</span>
                        <span className="text-xs text-[#919EAB] font-medium">{vendor.vendorId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium">
                    {vendor.contact}
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2 text-[#2563EB] text-sm">
                      <Mail size={16} />
                      <span className="truncate max-w-[150px]">{vendor.email}</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2 text-[#2563EB] text-sm whitespace-nowrap">
                      <Phone size={16} />
                      <span>{vendor.phone}</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex flex-col gap-1.5">
                      {vendor.materialTypes.map((type, i) => (
                        <span key={i} className="px-3 py-1 bg-[#F3E8FF] text-[#8200DB] text-[10px] font-medium rounded-md whitespace-nowrap w-fit">
                          {type}
                        </span>
                      ))}
                      {vendor.extraMaterials > 0 && (
                        <span className="px-2 py-0.5 bg-[#F4F6F8] text-[#637381] text-[10px] font-medium rounded w-fit">
                          +{vendor.extraMaterials}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-nowrap font-semibold text-[#212B36]">{vendor.orders.active} active</span>
                      <span className="text-xs text-[#919EAB] font-medium">{vendor.orders.total} total</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    {renderStars(vendor.rating)}
                  </td>
                  <td className="p-2 md:p-4">
                    <CommonStatusBadge 
                      text={vendor.status} 
                      variant={vendor.status === "Active" ? "green" : "gray"} 
                      icon
                    />
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium">
                    {vendor.vendorType}
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#637381]">
                    {vendor.pickupLocation}
                  </td>
                  <td className="p-2 md:p-4 text-sm font-normal text-[#212B36]">
                    {vendor.onTimeDeliveries}
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="p-1 rounded text-gray-600 transition-colors"
                        onClick={() => navigate(`/logistics/vendor/${vendor.vendorId}`)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="p-1 rounded text-blue-600 transition-colors"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                        onClick={() => handleDeleteVendor(vendor)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VendorModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        mode={modalMode}
        initialData={selectedVendor}
        onSave={handleSaveVendor}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMsg.title}
        subTitle={successMsg.subTitle}
        isLogoBottom={false}
      />

      <FreightFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(filters) => {
          console.log("Applied filters:", filters);
          setIsFilterModalOpen(false);
        }}
      />
    </PageWrapper>
  );
};

export default LogisticsView;
