import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlueBellIcon from "@/assets/BlueBellIcon.svg";
import YellowBellIcon from "@/assets/yellowBellIcon.svg";
import GreenBellIcon from "@/assets/greenBellIcon.svg";
import SalmonBellIcon from "@/assets/salmonBellIcon.svg";
import StatCard from "../ui/stat-card";
import TitleSubtitle from "../common_component/TitleSubtitle";
import Button from "../common_component/Button";
import PageWrapper from "../common_component/PageWrapper";
import Pagination from "../Pagination";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  type NotificationItem,
  type NotificationType,
  type NotificationPriority,
} from "@/redux/api/notificationsApi";
import {
  CheckCheck,
  Trash2,
  Bell,
  Clock,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileText,
  Truck,
  Layers,
  DollarSign,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// Format ISO date to human readable relative time or date string
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 172800) return "Yesterday";
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const filterTabs = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "High Priority", value: "high_priority" },
  { label: "Delivery", value: "delivery" },
  { label: "Drawing", value: "drawing" },
  { label: "Payment", value: "payment" },
  { label: "Material Request", value: "material_request" },
  { label: "Chat", value: "chat" },
];

const NotificationsView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Compute API query params from UI tab selection
  const queryParams = {
    page,
    limit,
    read: (activeTab === "unread" ? "false" : "") as "true" | "false" | "",
    priority: activeTab === "high_priority" ? "high" : "",
    type:
      activeTab !== "all" &&
        activeTab !== "unread" &&
        activeTab !== "high_priority"
        ? activeTab
        : "",
  };

  // Poll notifications query every 30 seconds
  const { data, isLoading, isFetching, isError, error } =
    useGetNotificationsQuery(queryParams, {
      pollingInterval: 30000,
    });

  const [markAsRead, { isLoading: isMarkingRead }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAllRead }] =
    useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = data?.notifications || [];
  const totalItems = data?.total || 0;
  const stats = data?.stats || {
    total: 0,
    unread: 0,
    highPriority: 0,
    today: 0,
  };

  const statCardsData = [
    {
      title: "Total Notifications",
      value: stats.total.toString(),
      icon: (
        <img
          src={BlueBellIcon}
          alt="total-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#1D51A4]",
    },
    {
      title: "Unread",
      value: stats.unread.toString(),
      icon: (
        <img
          src={GreenBellIcon}
          alt="unread-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#3AB449]",
    },
    {
      title: "High Priority",
      value: stats.highPriority.toString(),
      icon: (
        <img
          src={YellowBellIcon}
          alt="high-priority-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#F59E0B]",
    },
    {
      title: "Today",
      value: stats.today.toString(),
      icon: (
        <img
          src={SalmonBellIcon}
          alt="today-notifications"
          className="md:size-5 size-4"
        />
      ),
      color: "bg-[#FD8D5B]",
    },
  ];

  // Map notification type / priority to distinct visual styling & icon
  const getNotificationVisuals = (
    type: NotificationType,
    priority: NotificationPriority
  ) => {
    let bg = "bg-blue-50 text-blue-600 border-blue-100";
    let icon = <Bell className="w-5 h-5" />;

    switch (type) {
      case "delivery":
      case "freight_bid":
        bg = "bg-amber-50 text-amber-600 border-amber-100";
        icon = <Truck className="w-5 h-5" />;
        break;
      case "drawing":
        bg = "bg-purple-50 text-purple-600 border-purple-100";
        icon = <Layers className="w-5 h-5" />;
        break;
      case "payment":
      case "invoice":
      case "quotation":
        bg = "bg-emerald-50 text-emerald-600 border-emerald-100";
        icon = <DollarSign className="w-5 h-5" />;
        break;
      case "material_request":
        bg = "bg-indigo-50 text-indigo-600 border-indigo-100";
        icon = <FileText className="w-5 h-5" />;
        break;
      case "meeting":
        bg = "bg-cyan-50 text-cyan-600 border-cyan-100";
        icon = <Calendar className="w-5 h-5" />;
        break;
      case "chat":
        bg = "bg-sky-50 text-sky-600 border-sky-100";
        icon = <MessageSquare className="w-5 h-5" />;
        break;
      case "escalation":
        bg = "bg-rose-50 text-rose-600 border-rose-100";
        icon = <AlertCircle className="w-5 h-5" />;
        break;
      case "task":
      case "followup":
        bg = "bg-orange-50 text-orange-600 border-orange-100";
        icon = <Sparkles className="w-5 h-5" />;
        break;
      default:
        bg = "bg-slate-50 text-slate-600 border-slate-100";
        icon = <Bell className="w-5 h-5" />;
    }

    if (priority === "high") {
      bg = "bg-red-50 text-red-600 border-red-100";
    }

    return { bg, icon };
  };

  // Route user based on refModel and refId or leadId
  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await markAsRead(item._id).unwrap();
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }

    const { refModel, refId, leadId } = item;
    const model = (refModel || "").toLowerCase();
    const id = refId || leadId;

    if (!id && !leadId) return;

    switch (model) {
      case "delivery":
      case "freightload":
      case "freightrequest":
        navigate(`/delivery/delivery-details/${id || leadId}`);
        break;
      case "project":
      case "lead":
        navigate(`/projects/${id || leadId}`);
        break;
      case "drawing":
      case "projectdrawing":
        navigate(`/projects/${leadId || id}/view-drawings`);
        break;
      case "shipperfile":
      case "shipperquote":
        navigate(`/projects/${leadId || id}/shipper-files`);
        break;
      case "materialrequest":
        navigate(`/projects/${leadId || id}/material-request`);
        break;
      case "loadplan":
        navigate(`/load_planning/details/${id || leadId}`);
        break;
      case "packinglist":
        navigate(`/load_planning/packing-list/${leadId || id}`);
        break;
      case "bom":
        navigate(`/projects/${leadId || id}/view-bom`);
        break;
      case "chat":
        navigate(`/communication`);
        break;
      default:
        if (leadId) {
          navigate(`/projects/${leadId}`);
        }
        break;
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-2">
        <TitleSubtitle
          title="Notifications"
          subtitle="Stay updated with project changes, approvals, drawings, dispatches, billings, and communication."


        />
        <div className="flex items-center gap-2">
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
          {stats.unread > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead}
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 hover:border-blue-300"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isMarkingAllRead ? "Marking..." : "Mark All as Read"}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-5">
        {statCardsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-xs p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-700 font-medium text-sm xl:text-base mr-2">
            Filter:
          </span>
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <Button
                variant={isActive ? "blueFilled" : "outline"}
                key={tab.value}
                size="sm"
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className="capitalize"
              >
                {tab.label}
                {tab.value === "unread" && stats.unread > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-500 text-white text-[11px] rounded-full font-semibold">
                    {stats.unread}
                  </span>
                )}
                {tab.value === "high_priority" && stats.highPriority > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white text-[11px] rounded-full font-semibold">
                    {stats.highPriority}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-rose-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-base">
              Failed to load notifications
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(error as { data?: { message?: string } })?.data?.message ||
                "Please check your network connection and try again."}
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="divide-y divide-gray-100">
              {notifications.map((item) => {
                const visual = getNotificationVisuals(
                  item.type,
                  item.priority
                );
                return (
                  <div
                    key={item._id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-4 md:p-5 flex items-start gap-4 transition-colors cursor-pointer group relative ${item.isRead
                      ? "bg-white hover:bg-slate-50/80"
                      : "bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-blue-600"
                      }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${visual.bg}`}
                    >
                      {visual.icon}
                    </div>

                    {/* Notification Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3
                          className={`text-base font-semibold transition-colors ${item.isRead
                            ? "text-gray-800 group-hover:text-blue-600"
                            : "text-gray-900 font-bold group-hover:text-blue-700"
                            }`}
                        >
                          {item.title}
                        </h3>

                        {/* Priority / Type badges */}
                        {item.priority === "high" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700 uppercase tracking-wide">
                            High Priority
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 capitalize">
                          {item.type?.replace(/_/g, " ")}
                        </span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-2">
                        {item.body}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTimeAgo(item.createdAt)}
                        </span>
                        {item.refModel && (
                          <span className="flex items-center gap-1 text-blue-600/80 hover:text-blue-700">
                            <ExternalLink className="w-3 h-3" />
                            <span>View {item.refModel}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      {!item.isRead && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsRead(e, item._id)}
                          disabled={isMarkingRead}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, item._id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="border-t border-gray-100 px-4 py-2 bg-slate-50/50">
              <Pagination
                totalItems={totalItems}
                itemsPerPage={limit}
                currentPage={page}
                onPageChange={(newPage) => setPage(newPage)}
                rowsPerPage={limit}
                onRowsPerPageChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            </div>
          </>
        ) : (
          <div className="p-16 text-center text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 text-base">
              No notifications found
            </p>
            <p className="text-xs text-gray-400 mt-1">
              You are all caught up! There are no notifications in this category.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default NotificationsView;

