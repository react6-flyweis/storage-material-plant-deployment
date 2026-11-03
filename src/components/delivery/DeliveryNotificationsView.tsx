import React, { useState } from "react";
import {
  Bell,
  Clock,
  XCircle,
  Mail,
  MessageSquare,
  User,
  CircleCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../common_component/Button";
import TitleSubtitle from "../common_component/TitleSubtitle";
import SearchFilterBar from "../common_component/SearchFilterBar";
import { LoadStatCard as StatCard } from "./LoadStatCard";
import NotificationFilterModal, { type NotificationFilters } from "./NotificationFilterModal";
import Modal from "../Modal";
import AutomatedNotificationSystem from "./AutomatedNotificationSystem";
import PageWrapper from "../common_component/PageWrapper";
import {
  useGetNotificationDetailsQuery,
  exportNotificationDetails,
  type DeliveryNotificationItem,
} from "@/redux/api/deliveriesApi";
import { useAppSelector } from "@/redux/hooks";

function formatNotificationDate(isoString?: string): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function formatNotificationTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

function formatDetailDate(dateString?: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatDetailTimeWindow(start?: string, end?: string): string {
  if (!start && !end) return "Standard Delivery Window";
  const formatTime = (t?: string) => {
    if (!t) return "";
    if (t.includes("AM") || t.includes("PM")) return t;
    const parts = t.split(":");
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return t;
  };
  if (start && end) {
    return `${formatTime(start)} – ${formatTime(end)}`;
  }
  return formatTime(start || end);
}

function getStatusBadgeClass(status?: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("deliver")) {
    return "bg-[#E6F9EE] text-[#00C853]";
  }
  if (s.includes("pend")) {
    return "bg-[#FFF9EA] text-[#FFAB00]";
  }
  if (s.includes("fail") || s.includes("error") || s.includes("cancel")) {
    return "bg-[#FFF0EE] text-[#FF5630]";
  }
  if (s.includes("sent")) {
    return "bg-[#EFF6FF] text-[#155DFC]";
  }
  return "bg-gray-100 text-gray-700";
}

const DeliveryNotificationsView: React.FC = () => {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<NotificationFilters>({});
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeliveryStatusModalOpen, setIsDeliveryStatusModalOpen] = useState(false);
  const [selectedNotification] = useState<DeliveryNotificationItem | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [resendNotificationInfo, setResendNotificationInfo] = useState<DeliveryNotificationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const { data: notificationsData, isLoading, isFetching } = useGetNotificationDetailsQuery({
    page,
    limit: 20,
    search: searchTerm.trim() || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    leadId: filters.leadId || undefined,
    status: filters.status || undefined,
    channel: filters.channel || undefined,
  });

  const notifications = notificationsData?.notifications || [];
  const statsResponse = notificationsData?.stats || {
    total: 0,
    sent: 0,
    delivered: 0,
    pending: 0,
    failed: 0,
  };
  const totalCount = notificationsData?.total ?? 0;

  const stats = [
    { title: "Total Sent", value: String(statsResponse.total ?? 0), icon: Bell, color: "text-[#155DFC]", borderL: "border-[#155DFC]" },
    { title: "Delivered", value: String(statsResponse.delivered ?? 0), icon: CircleCheck, color: "text-[#00C853]", borderL: "border-[#00C853]" },
    { title: "Pending", value: String(statsResponse.pending ?? 0), icon: Clock, color: "text-[#FFAB00]", borderL: "border-[#FFAB00]" },
    { title: "Failed", value: String(statsResponse.failed ?? 0), icon: XCircle, color: "text-[#FF5630]", borderL: "border-[#FF5630]" },
  ];

  const allSelected = notifications.length > 0 && selectedRows.length === notifications.length;
  const toggleAll = () => {
    setSelectedRows(allSelected ? [] : notifications.map((n) => n.notificationId));
  };
  const toggleRow = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const handleResend = (e: React.MouseEvent, n: DeliveryNotificationItem) => {
    e.stopPropagation();
    setResendNotificationInfo(n);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportNotificationDetails(
        {
          search: searchTerm.trim() || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          leadId: filters.leadId || undefined,
          status: filters.status || undefined,
          channel: filters.channel || undefined,
        },
        accessToken
      );
      showToast("success", "Notification details exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      showToast("error", "Failed to export notification details");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageWrapper>
      {/* Toast message */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce transition-all ${toastMessage.type === "error" ? "bg-red-500" : "bg-[#10B981]"
            }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle size={18} strokeWidth={2.5} />
          ) : (
            <CheckCircle2 size={18} strokeWidth={2.5} />
          )}
          {toastMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <TitleSubtitle
          title="Notification History"
          subtitle="Track all delivery notifications and reminders"
        />
        <Button
          variant="gradient"
          size="md"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Exporting...
            </>
          ) : (
            "Export"
          )}
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
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
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
                {/* <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide text-center">Status</th> */}
                <th className="p-2 md:p-4 text-xs font-semibold text-[#364153] uppercase tracking-wide text-center">Resend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-[#155DFC]" size={32} />
                      <p className="text-sm text-gray-500 font-medium">Loading notifications...</p>
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Bell size={36} className="text-gray-300" />
                      <p className="text-base font-semibold text-gray-700">No notifications found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((n) => {
                  const isSms = n.channel?.toLowerCase().includes("sms");
                  const recipientType = n.recipientType || (isSms ? "Internal Staff" : "Customer");
                  const displayStatus = n.status || n.deliveryStatus || "Sent";
                  const statusBadgeClass = getStatusBadgeClass(displayStatus);

                  return (
                    <tr
                      key={n.notificationId}
                      className={`hover:bg-gray-50 transition-colors group cursor-pointer text-nowrap ${selectedRows.includes(n.notificationId) ? 'bg-blue-50/40' : ''}`}
                      onClick={() => {
                        if (n.deliveryId) {
                          navigate(`/delivery/delivery-details/${n.deliveryId}`);
                        }
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => toggleRow(e, n.notificationId)}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(n.notificationId)}
                          onChange={() => { }}
                          className="w-4 h-4 rounded border-gray-300 accent-[#155DFC] cursor-pointer"
                        />
                      </td>
                      <td className="p-2 md:p-4 min-w-[200px]">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-[#212B36]">{n.notificationType || "Delivery Notification"}</p>
                          <p className="text-xs text-[#637381]">{n.notificationId}</p>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 min-w-[150px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E6F0FF] flex items-center justify-center shrink-0">
                            {isSms ? (
                              <MessageSquare size={16} className="text-[#155DFC]" />
                            ) : (
                              <Mail size={16} className="text-[#155DFC]" />
                            )}
                          </div>
                          <p className="text-xs font-medium text-[#212B36] leading-tight">
                            {n.channel || (isSms ? "SMS" : "Email")}
                          </p>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 min-w-[200px]">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-[#212B36]">{n.deliveryNumber || n.deliveryId || "-"}</p>
                          <p className="text-xs text-[#919EAB] uppercase font-normal">{n.project || "-"}</p>
                          <p className="text-xs text-[#637381]">{n.materialType || "-"}</p>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 min-w-[200px]">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0 mt-0.5">
                            <User size={12} className="text-[#8200DB]" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-[#212B36]">{n.recipient || "-"}</p>
                            <p className="text-xs text-[#637381]">{n.recipientContact || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide ${statusBadgeClass}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="p-2 md:p-4">
                        <p className="text-sm font-medium text-[#212B36]">{recipientType}</p>
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="space-y-0.5 text-right">
                            <p className="text-sm font-medium text-[#212B36]">{formatNotificationDate(n.sentAt)}</p>
                            <p className="text-xs text-[#919EAB] uppercase font-medium">{formatNotificationTime(n.sentAt)}</p>
                          </div>
                          {/* <Download
                            size={14}
                            className="text-[#919EAB] cursor-pointer hover:text-[#212B36] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExport();
                            }}

                          /> */}
                        </div>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalCount > 20 && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 rounded-b-[14px]">
            <div className="flex flex-1 justify-between sm:hidden">
              <Button
                variant="white"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <Button
                variant="white"
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 20 >= totalCount || isFetching}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 20, totalCount)}
                  </span>{" "}
                  of <span className="font-medium">{totalCount}</span> results
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="white"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= totalCount || isFetching}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AutomatedNotificationSystem />

      {/* Filter Modal */}
      <NotificationFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filters}
        onApply={(f) => {
          setFilters(f);
          setPage(1);
          setIsFilterModalOpen(false);
        }}
      />

      {/* Detail Modal */}
      <Modal
        isOpen={isDeliveryStatusModalOpen}
        onClose={() => setIsDeliveryStatusModalOpen(false)}
        width="max-w-xl"
        hideHeader
      >
        <div className="p-4 md:p-8 text-center space-y-10 py-12">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-[40px] font-bold text-[#101828]">
              {selectedNotification?.notificationType || "Delivery Scheduled"}
            </h2>
            <p className="text-2xl md:text-[38px] font-medium text-[#446DF6] leading-tight px-4">
              {selectedNotification?.materialType || "Material"} will be delivered
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xl md:text-2xl font-bold text-[#101828]">
              Date: {formatDetailDate(selectedNotification?.deliveryDate)}
            </p>
            <p className="text-xl md:text-2xl font-bold text-[#101828]">
              Time: {formatDetailTimeWindow(selectedNotification?.timeWindowStart, selectedNotification?.timeWindowEnd)}
            </p>
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

      {/* Resend Confirmation Modal */}
      <Modal
        isOpen={!!resendNotificationInfo}
        onClose={() => setResendNotificationInfo(null)}
        width="max-w-md"
        hideHeader
      >
        <div className="p-6 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#155DFC] flex items-center justify-center mx-auto">
            <RotateCcw size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#212B36]">Resend Notification</h3>
            <p className="text-sm text-gray-500">
              Resend notification to <span className="font-semibold text-gray-700">{resendNotificationInfo?.recipient}</span> ({resendNotificationInfo?.recipientContact})?
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="white"
              onClick={() => setResendNotificationInfo(null)}
              size="md"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={() => {
                setResendNotificationInfo(null);
                showToast("success", `Notification re-sent to ${resendNotificationInfo?.recipient}`);
              }}
              size="md"
            >
              Confirm Resend
            </Button>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default DeliveryNotificationsView;
