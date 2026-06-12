import React, { useState } from "react";
import { 
  Bell, 
  Clock, 
  XCircle, 
  Mail, 
  MessageSquare, 
  User, 
  Download, 
  CircleCheck,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common_component/Button";
import TitleSubtitle from "../common_component/TitleSubtitle";
import SearchFilterBar from "../common_component/SearchFilterBar";
import { LoadStatCard as StatCard } from "./LoadStatCard";
import FreightFilterModal from "./FreightFilterModal";
import Modal from "../Modal";
import AutomatedNotificationSystem from "./AutomatedNotificationSystem";
import PageWrapper from "../common_component/PageWrapper";
import { downloadFile } from "@/lib/utils";

const DeliveryNotificationsView: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [_, setIsSuccessModalOpen] = useState(false);
  const [isDeliveryStatusModalOpen, setIsDeliveryStatusModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const stats = [
    { title: "Total Sent", value: "6", icon: Bell, color: "text-[#155DFC]", borderL: "border-[#155DFC]" },
    { title: "Delivered", value: "3", icon: CircleCheck, color: "text-[#00C853]", borderL: "border-[#00C853]" },
    { title: "Pending", value: "1", icon: Clock, color: "text-[#FFAB00]", borderL: "border-[#FFAB00]" },
    { title: "Failed", value: "1", icon: XCircle, color: "text-[#FF5630]", borderL: "border-[#FF5630]" },
  ];

  const notifications = [
    {
      id: "NOT-001",
      title: "Delivery Scheduled: Primary frame steel",
      channel: "Email Confirmation",
      deliveryId: "DEL-001",
      deliveryProject: "Industrial Complex A",
      deliveryItem: "Primary Frame Steel",
      recipient: "Austin McClume",
      recipientContact: "austin@acmecorp.com",
      deliveryStatus: "Scheduled",
      recipientType: "Customer",
      sentDate: "2024-03-15",
      sentTime: "10:30 AM",
      status: "Delivered",
      statusColor: "bg-[#E6F9EE] text-[#00C853]",
      type: "email"
    },
    {
      id: "NOT-002",
      title: "Reminder: Delivery in 48 hours",
      channel: "48-Hour Reminder Channel: SMS",
      deliveryId: "DEL-001",
      deliveryProject: "Industrial Complex A",
      deliveryItem: "Primary Frame Steel",
      recipient: "Austin McClume",
      recipientContact: "+1 555-0303",
      deliveryStatus: "Rescheduled",
      recipientType: "Internal Staff",
      sentDate: "2024-03-23",
      sentTime: "8:00 AM",
      status: "Sent",
      statusColor: "bg-[#EFF6FF] text-[#155DFC]",
      type: "sms"
    },
    {
      id: "NOT-003",
      title: "Delivery Scheduled: Roll-up doors",
      channel: "Email Confirmation",
      deliveryId: "DEL-002",
      deliveryProject: "Storage Facility B",
      deliveryItem: "Primary Frame Steel",
      recipient: "Sarah Johnson",
      recipientContact: "sarah@buildtech.com",
      deliveryStatus: "In Transit",
      recipientType: "Customer",
      sentDate: "2024-03-16",
      sentTime: "2:15 PM",
      status: "Delivered",
      statusColor: "bg-[#E6F9EE] text-[#00C853]",
      type: "email"
    },
    {
      id: "NOT-004",
      title: "Reminder: Delivery tomorrow",
      channel: "48-Hour Reminder Channel: SMS",
      deliveryId: "DEL-001",
      deliveryProject: "Industrial Complex A",
      deliveryItem: "Primary Frame Steel",
      recipient: "Austin McClume",
      recipientContact: "+1 555-0303",
      deliveryStatus: "Scheduled",
      recipientType: "Internal Staff",
      sentDate: "2024-03-24",
      sentTime: "8:00 AM",
      status: "Pending",
      statusColor: "bg-[#FFF9EA] text-[#FFAB00]",
      type: "sms"
    },
    {
      id: "NOT-005",
      title: "Delivery Scheduled: Warehouse doors",
      channel: "Email Confirmation",
      deliveryId: "DEL-003",
      deliveryProject: "Warehouse Complex",
      deliveryItem: "Primary Frame Steel",
      recipient: "Mike Davis",
      recipientContact: "mike@steelmasters.com",
      deliveryStatus: "Rescheduled",
      recipientType: "Customer",
      sentDate: "2024-03-17",
      sentTime: "11:45 AM",
      status: "Delivered",
      statusColor: "bg-[#E6F9EE] text-[#00C853]",
      type: "email"
    },
    {
      id: "NOT-006",
      title: "Reminder: Delivery in 24 hours",
      channel: "24-Hour Reminder Channel: SMS",
      deliveryId: "DEL-002",
      deliveryProject: "Storage Facility B",
      deliveryItem: "Primary Frame Steel",
      recipient: "Sarah Johnson",
      recipientContact: "+1 555-0404",
      deliveryStatus: "In Transit",
      recipientType: "Internal Staff",
      sentDate: "2024-03-18",
      sentTime: "9:00 AM",
      status: "Failed",
      statusColor: "bg-[#FFF0EE] text-[#FF5630]",
      type: "sms"
    }
  ];

  const allSelected = selectedRows.length === notifications.length;
  const toggleAll = () => setSelectedRows(allSelected ? [] : notifications.map((n) => n.id));
  const toggleRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const handleResend = (e: React.MouseEvent, n: any) => {
    e.stopPropagation();
    setSelectedNotification(n);
    setIsSuccessModalOpen(true);
  };

  return (
   <PageWrapper>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TitleSubtitle 
          title="Notification History"
          subtitle="Track all delivery notifications and reminders"
        />
        <Button variant="gradient" size="md" onClick={() => downloadFile("/sample-data.csv", "notifications_export.csv")}>
          Export
        </Button>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap gap-5 lg:gap-10">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Filter */}
      <SearchFilterBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search notifications..."
        onFilterClick={() => setIsFilterModalOpen(true)}
      />

      {/* Notifications Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden font-inter">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] border-[0.6px] border-[#0000001A] text-nowrap">
                <th className="p-2 md:p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 accent-[#155DFC] cursor-pointer"
                  />
                </th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Notification</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Channel</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Delivery</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Recipient</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Delivery Status</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide">Recipient Type</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide text-center">Sent Date</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide text-center">Status</th>
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide text-center">Resend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <tr 
                  key={n.id} 
                  className={`hover:bg-gray-50 transition-colors group cursor-pointer text-nowrap ${selectedRows.includes(n.id) ? 'bg-blue-50/40' : ''}`}
                  onClick={() => navigate(`/delivery/delivery-details/${n.deliveryId}`)}
                >
                  <td className="px-4 py-4" onClick={(e) => toggleRow(e, n.id)}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(n.id)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 accent-[#155DFC] cursor-pointer"
                    />
                  </td>
                  <td className="p-2 md:p-4 min-w-[200px]">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#212B36]">{n.title}</p>
                      <p className="text-xs text-[#637381]">{n.id}</p>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#E6F0FF] flex items-center justify-center shrink-0">
                        {n.type === "email" ? (
                          <Mail size={16} className="text-[#155DFC]" />
                        ) : (
                          <MessageSquare size={16} className="text-[#155DFC]" />
                        )}
                      </div>
                      <p className="text-xs font-medium text-[#212B36] leading-tight">
                        {n.channel}
                      </p>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 min-w-[200px]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#212B36]">{n.deliveryId}</p>
                      <p className="text-xs text-[#919EAB] uppercase font-normal">{n.deliveryProject}</p>
                      <p className="text-xs text-[#637381]">{n.deliveryItem}</p>
                    </div>
                  </td>
                  <td className="p-2 md:p-4 min-w-[200px]">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0 mt-0.5">
                        <User size={12} className="text-[#8200DB]" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-[#212B36]">{n.recipient}</p>
                        <p className="text-xs text-[#637381]">{n.recipientContact}</p>
                      </div>
                    </div>
                  </td>
                  <td 
                    className="p-2 md:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setSelectedNotification(n);
                      setIsDeliveryStatusModalOpen(true);
                    }}
                  >
                    <p className="text-sm font-medium text-[#212B36]">{n.deliveryStatus}</p>
                  </td>
                  <td className="p-2 md:p-4">
                    <p className="text-sm font-medium text-[#212B36]">{n.recipientType}</p>
                  </td>
                  <td className="p-2 md:p-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="space-y-0.5 text-right">
                        <p className="text-sm font-medium text-[#212B36]">{n.sentDate}</p>
                        <p className="text-xs text-[#919EAB] uppercase font-medium">{n.sentTime}</p>
                      </div>
                      <Download size={14} className="text-[#919EAB] cursor-pointer hover:text-[#212B36] transition-colors" 
                         onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-normal tracking-wide ${n.statusColor || 'bg-gray-100 text-gray-600'}`}>
                      {n.status || 'Sent'}
                    </span>
                  </td>
                  <td className="p-2 md:p-4 text-center">
                    <Button 
                      variant="gradient" 
                      size="sm" 
                      onClick={(e) => handleResend(e, n)}
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Resend
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AutomatedNotificationSystem />
      {/* Modals */}
      <FreightFilterModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        onApply={(filters) => {
          console.log("Applying filters:", filters);
          setIsFilterModalOpen(false);
        }}
      />

      <Modal 
        isOpen={isDeliveryStatusModalOpen} 
        onClose={() => setIsDeliveryStatusModalOpen(false)} 
        width="max-w-xl" 
        hideHeader
      >
        <div className="p-4 md:p-8 text-center space-y-10 py-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-[40px] font-bold text-[#101828]">Delivery Scheduled</h2>
            <p className="text-2xl md:text-[38px] font-medium text-[#446DF6] leading-tight px-4">
              {selectedNotification?.deliveryItem || "Primary Frame Steel"} will be delivered
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-bold text-[#101828]">Date: March 25</p>
            <p className="text-xl md:text-2xl font-bold text-[#101828]">Time: 8:00 AM – 12:00 PM</p>
          </div>

          <Button 
            variant="gradient" 
            onClick={() => setIsDeliveryStatusModalOpen(false)}
            className="mx-auto w-48 h-12 text-lg rounded-xl"
            size="lg"
          >
            Ok
          </Button>
        </div>
      </Modal>
</PageWrapper>
  );
};

export default DeliveryNotificationsView;
