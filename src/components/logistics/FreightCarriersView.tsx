import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, Filter, Plus, Mail, Phone, 
  Eye, Edit2, Trash2, Truck, Star
} from "lucide-react";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import CommonStatusBadge from "../common_component/CommonStatusBadge";
import SuccessModal from "../common_component/SuccessModal";
import FreightFilterModal from "../delivery/FreightFilterModal";
// We might need a CarrierModal later, for now using VendorModal as placeholder or create CarrierModal
import VendorModal from "./VendorModal"; 

const mockCarriers = [
  {
    carrierId: "CAR-001",
    name: "IronHaul Logistics",
    contact: "James Wilson",
    email: "james@expressfreight.com",
    phone: "(555) 777-8888",
    bids: { active: 4, total: 89 },
    awarded: { count: 67, winRate: "75%" },
    avgBid: "$2,850",
    avgBidDetail: "Responds within 45 min",
    rating: 4.8,
    status: "Active",
    serviceType: "Freight Transport",
    serviceArea: "Texas, Oklahoma",
    equipmentType: "Flatbed, Dry Van"
  },
  {
    carrierId: "CAR-002",
    name: "Nationwide Logistics",
    contact: "Patricia Davis",
    email: "patricia@nationwidelogistics.com",
    phone: "(555) 888-9999",
    bids: { active: 6, total: 134 },
    awarded: { count: 102, winRate: "76%" },
    avgBid: "$3,200",
    avgBidDetail: "Responds within 45 min",
    rating: 4.9,
    status: "Active",
    serviceType: "Heavy Material Transport",
    serviceArea: "Texas, Louisiana",
    equipmentType: "Flatbed"
  },
  {
    carrierId: "CAR-003",
    name: "Regional Transport Co.",
    contact: "Carlos Rodriguez",
    email: "carlos@regionaltransport.com",
    phone: "(555) 999-0000",
    bids: { active: 3, total: 56 },
    awarded: { count: 42, winRate: "75%" },
    avgBid: "$1,950",
    avgBidDetail: "Responds within 45 min",
    rating: 4.5,
    status: "Active",
    serviceType: "Construction Freight",
    serviceArea: "Texas, New Mexico",
    equipmentType: "Dry Van"
  },
  {
    carrierId: "CAR-004",
    name: "Metro Hauling Services",
    contact: "Susan Lee",
    email: "susan@metrohauling.com",
    phone: "(555) 000-1111",
    bids: { active: 2, total: 45 },
    awarded: { count: 34, winRate: "76%" },
    avgBid: "$4,100",
    avgBidDetail: "Responds within 45 min",
    rating: 4.6,
    status: "Active",
    serviceType: "Steel & Equipment Transport",
    serviceArea: "Multi-State",
    equipmentType: "Flatbed, Heavy Haul"
  }
];

const FreightCarriersView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState({ title: "", subTitle: "" });

  const filteredCarriers = useMemo(() => {
    return mockCarriers.filter(carrier => 
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAddCarrier = () => {
    setModalMode("add");
    setSelectedCarrier(null);
    setIsCarrierModalOpen(true);
  };

  const handleEditCarrier = (carrier: any) => {
    setModalMode("edit");
    setSelectedCarrier(carrier);
    setIsCarrierModalOpen(true);
  };

  const handleDeleteCarrier = (carrierId: string) => {
    setSuccessMsg({
      title: "Carrier Deleted Successfully!",
      subTitle: `Carrier ID: ${carrierId}`
    });
    setIsSuccessModalOpen(true);
  };

  const handleSaveCarrier = (data: any) => {
    setIsCarrierModalOpen(false);
    setSuccessMsg({
      title: modalMode === "add" ? "Carrier Added Successfully!" : "Carrier Updated Successfully!",
      subTitle: `Carrier Name: ${data.name}`
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
    "Carrier",
    "Contact",
    "Email",
    "Phone",
    "Bids",
    "Awarded",
    "Avg Bid",
    "Rating",
    "Status",
    "Service Type",
    "Service Area",
    "Equipment Type",
    "Actions"
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-1 pt-1">
        <TitleSubtitle 
          title="Carrier Master" 
          subtitle="Manage freight haulers and carriers for bidding" 
        />
      </div>

      {/* Action Bar */}
      <div className="bg-white p-2 lg:p-3 rounded-[14px] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by carrier name, contact, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-[150px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
        </div>
        <div className="flex flex-wrap ml-auto items-center gap-2">
          <Button variant="grayFilled" onClick={() => setIsFilterModalOpen(true)}>
            <Filter size={18} /> Filter
          </Button>
          <Button variant="gradient" onClick={handleAddCarrier}>
            <Plus size={18} /> Add Carrier
          </Button>
        </div>
      </div>

      {/* Carrier Table */}
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
              {filteredCarriers.map((carrier) => (
                <tr key={carrier.carrierId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#DBEAFE] flex items-center justify-center text-[#155DFC] shrink-0">
                        <Truck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-nowrap font-semibold text-[#212B36] leading-tight mb-0.5">{carrier.name}</span>
                        <span className="text-xs text-[#919EAB] font-medium">{carrier.carrierId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium">
                    {carrier.contact}
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2 text-[#2563EB] text-sm">
                      <Mail size={16} />
                      <span className="truncate max-w-[150px]">{carrier.email}</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-2 text-[#2563EB] text-sm whitespace-nowrap">
                      <Phone size={16} />
                      <span>{carrier.phone}</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-nowrap font-semibold text-[#212B36]">{carrier.bids.active} active</span>
                      <span className="text-xs text-[#919EAB] font-medium">{carrier.bids.total} total</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex flex-col text-center">
                      <span className="text-sm font-semibold text-green-600">{carrier.awarded.count}</span>
                      <span className="text-xs text-[#919EAB] font-medium">{carrier.awarded.winRate} win rate</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[#212B36]">{carrier.avgBid}</span>
                      <span className="text-[10px] text-gray-400 font-medium italic leading-tight">{carrier.avgBidDetail}</span>
                    </div>
                  </td>
                  <td className="p-2 md:p-4">
                    {renderStars(carrier.rating)}
                  </td>
                  <td className="p-2 md:p-4">
                    <CommonStatusBadge text={carrier.status} variant="green" icon />
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#212B36] font-medium whitespace-nowrap">
                    {carrier.serviceType}
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#637381] whitespace-nowrap">
                    {carrier.serviceArea}
                  </td>
                  <td className="p-2 md:p-4 text-sm text-[#637381] whitespace-nowrap">
                    {carrier.equipmentType}
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center gap-3">
                      <button 
                        className="p-1 rounded text-gray-600 transition-colors"
                        onClick={() => navigate(`/logistics/carrier/${carrier.carrierId}`)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="p-1 rounded text-blue-600 transition-colors"
                        onClick={() => handleEditCarrier(carrier)}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        className="p-1 hover:bg-red-50 rounded text-red-500 transition-colors"
                        onClick={() => handleDeleteCarrier(carrier.carrierId)}
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
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
        mode={modalMode}
        initialData={selectedCarrier}
        onSave={handleSaveCarrier}
        entityType="Carrier"
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

export default FreightCarriersView;
