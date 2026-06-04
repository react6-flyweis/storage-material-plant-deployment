import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Store,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import Pagination from "../Pagination";
import VendorModal from "./VendorModal";
import SuccessModal from "../common_component/SuccessModal";
import VendorShipperFilterModal from "./VendorShipperFilterModal";
import {
  useGetPlantVendorsQuery,
  type PlantVendor,
} from "@/redux/api/logisticsApi";

interface VendorRow {
  id: string;
  name: string;
  vendorId: string;
  contact: string;
  email: string;
  phone: string;
  materialTypes: string[];
  extraMaterials: number;
  orders: { active: number; total: number };
  status: string;
  vendorType: string;
  pickupLocation: string;
  onTimeDeliveries: string;
}

interface VendorShipperFilterValues {
  materialType: string;
}

const normalizeStatus = (status: string) =>
  status
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "_");

const toTitleCase = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const LogisticsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedVendor, setSelectedVendor] = useState<VendorRow | null>(null);
  const [successMsg, setSuccessMsg] = useState({ title: "", subTitle: "" });
  const [appliedFilters, setAppliedFilters] =
    useState<VendorShipperFilterValues>({
      materialType: "",
    });

  const queryArgs = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      materialType: appliedFilters.materialType || undefined,
      page: currentPage,
      limit: rowsPerPage,
    }),
    [appliedFilters.materialType, currentPage, rowsPerPage, searchTerm],
  );

  const {
    data: vendorsResponse,
    isLoading,
    isFetching,
  } = useGetPlantVendorsQuery(queryArgs);

  const vendors = useMemo<VendorRow[]>(() => {
    return (vendorsResponse?.vendors ?? []).map((vendor: PlantVendor) => ({
      id: vendor._id,
      name: vendor.vendorName,
      vendorId: vendor.vendorCode,
      contact: vendor.contactName,
      email: vendor.email,
      phone: vendor.phone,
      materialTypes: vendor.materialTypes,
      extraMaterials: Math.max(0, vendor.materialTypes.length - 1),
      orders: {
        active: vendor.activeOrders,
        total: vendor.totalOrders,
      },
      status: vendor.status,
      vendorType: vendor.vendorType,
      pickupLocation: vendor.pickupLocation,
      onTimeDeliveries: `${Math.min(
        99,
        Math.max(
          70,
          Math.round(
            (vendor.activeOrders / Math.max(vendor.totalOrders, 1)) * 100,
          ),
        ),
      )}%`,
    }));
  }, [vendorsResponse]);

  const totalVendors = vendorsResponse?.total ?? vendors.length;

  const materialTypeOptions = useMemo(() => {
    const uniqueMaterialTypes = new Set<string>();

    (vendorsResponse?.vendors ?? []).forEach((vendor) => {
      vendor.materialTypes.forEach((materialType) => {
        if (materialType.trim()) {
          uniqueMaterialTypes.add(materialType);
        }
      });
    });

    return [
      { label: "All Materials", value: "" },
      ...Array.from(uniqueMaterialTypes)
        .sort((left, right) => left.localeCompare(right))
        .map((materialType) => ({ label: materialType, value: materialType })),
    ];
  }, [vendorsResponse]);

  const loading = isLoading || isFetching;

  const handleAddVendor = () => {
    navigate("/logistics/shippers/add");
    // setModalMode("add");
    // setSelectedVendor(null);
    // setIsVendorModalOpen(true);
  };

  const handleEditVendor = (vendor: VendorRow) => {
    setModalMode("edit");
    setSelectedVendor(vendor);
    setIsVendorModalOpen(true);
  };

  const handleDeleteVendor = (vendor: VendorRow) => {
    setSelectedVendor(vendor);
    setSuccessMsg({
      title: "Vendor Deleted",
      subTitle: `Vendor Name: ${vendor?.name}`,
    });
    setIsSuccessModalOpen(true);
  };

  const handleSaveVendor = (data: { name: string }) => {
    setSuccessMsg({
      title: modalMode === "add" ? "Vendor Added" : "Vendor Updated",
      subTitle: `Vendor Name: ${data.name}`,
    });
    setIsSuccessModalOpen(true);
  };

  const handleApplyFilters = (filters: VendorShipperFilterValues) => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const headers = [
    "Shipper",
    "Contact",
    "Email",
    "Phone",
    "Material Types",
    "Orders",
    "Status",
    "Vendor Type",
    "Pickup Location",
    "On-time Deliveries:",
    "Actions",
  ];

  const emptyState = !loading && vendors.length === 0;

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
            className="w-full min-w-50 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap ml-auto items-center gap-2">
          <Button
            variant="grayFilled"
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter size={18} />
            Filter
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
              <tr className="bg-[#E5ECFF] border-b-2 border-[#BEDBFF] bg-linear-to-r from-[#F1F5F9] to-[#DBEAFE]">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="p-3 md:p-4 text-xs font-medium text-[#364153] uppercase tracking-wide text-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: Math.min(rowsPerPage, 5) }).map(
                  (_, index) => (
                    <tr key={`vendor-skeleton-${index}`} className="bg-white">
                      {Array.from({ length: headers.length }).map(
                        (__, cellIndex) => (
                          <td key={cellIndex} className="p-2 md:p-4">
                            <div className="h-4 rounded bg-gray-200 animate-pulse" />
                          </td>
                        ),
                      )}
                    </tr>
                  ),
                )
              ) : emptyState ? (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="p-8 text-center text-sm text-[#637381]"
                  >
                    No vendors match the current filters.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#155DFC] shrink-0">
                          <Store className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-nowrap font-semibold text-[#212B36] leading-tight mb-0.5">
                            {vendor.name}
                          </span>
                          <span className="text-xs text-[#919EAB] font-medium">
                            {vendor.vendorId}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium">
                      {vendor.contact}
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2 text-[#2563EB] text-sm">
                        <Mail size={16} />
                        <span className="truncate max-w-45">
                          {vendor.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-2 text-[#2563EB] text-sm whitespace-nowrap">
                        <Phone size={16} />
                        <span>{vendor.phone}</span>
                      </div>
                    </td>
                    <td className="p-2 md:p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {vendor.materialTypes.map((type) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-[#F3E8FF] text-[#8200DB] text-[10px] font-medium rounded-md whitespace-nowrap w-fit"
                          >
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
                        <span className="text-sm text-nowrap font-semibold text-[#212B36]">
                          {vendor.orders.active} active
                        </span>
                        <span className="text-xs text-[#919EAB] font-medium">
                          {vendor.orders.total} total
                        </span>
                      </div>
                    </td>

                    <td className="p-2 md:p-4">
                      <CommonStatusBadge
                        text={toTitleCase(vendor.status)}
                        variant={
                          normalizeStatus(vendor.status) === "active"
                            ? "green"
                            : "gray"
                        }
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
                          onClick={() =>
                            navigate(`/logistics/vendor/${vendor.id}`)
                          }
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalVendors > 0 && (
        <Pagination
          totalItems={totalVendors}
          itemsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
        />
      )}

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

      <VendorShipperFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        materialTypeOptions={materialTypeOptions}
        onApply={handleApplyFilters}
      />
    </PageWrapper>
  );
};

export default LogisticsView;
