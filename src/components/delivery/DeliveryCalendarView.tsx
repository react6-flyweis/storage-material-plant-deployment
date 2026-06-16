import React, { useRef, useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, isSameMonth, subMonths, addMonths, setMonth, setYear } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Package,
  Truck,
  Clock
} from "lucide-react";
import Button from "../common_component/Button";
import Modal from "../Modal";
import FilterDropdown from "../common_component/FilterDropdown";
import { type Delivery, statusConfig, DeliveryCard } from "./DeliveryComponents";
import DailyDeliveriesModal from "./DailyDeliveriesModal";
import RescheduleDeliveryModal from "./RescheduleDeliveryModal";
import SuccessModal from "../common_component/SuccessModal";
import TitleSubtitle from "../common_component/TitleSubtitle";
import PageWrapper from "../common_component/PageWrapper";
import DeliveryFilterModal from "./DeliveryFilterModal";
import { useGetCalendarDeliveriesQuery, type CalendarDeliveryItem } from "@/redux/api/deliveriesApi";
import { getLeadProjectName } from "@/lib/utils";

const mapApiDeliveryToDelivery = (item: CalendarDeliveryItem, dateStr: string): Delivery => {
  const statusMap: Record<string, Delivery["status"]> = {
    scheduled: "Scheduled",
    confirmed: "Confirmed",
    in_transit: "In Transit",
    delivered: "Delivered",
    delayed: "Delayed",
    cancelled: "Cancelled",
    draft: "Draft",
    bidding_sent: "Bidding Sent",
    carrier_selected: "Carrier Selected",
  };
  const uiStatus = statusMap[item.status] || "Scheduled";

  return {
    id: item._id || item.delivery?._id || item.requestId || "",
    title: item.description || item.delivery?.description || item.delivery?.loadDescription || "Shipment",
    projectId: item.deliveryNumber || item.delivery?.deliveryNumber || item.requestId || "",
    status: uiStatus,
    badges: [],
    project: getLeadProjectName(item.project, item.customer),
    customer: item.customer?.name || "N/A",
    timeWindow: item.deliveryTime || item.delivery?.deliveryTime || item.delivery?.timings || "N/A",
    receivingContact: item.poc?.receivingPoc || item.delivery?.receivingPoc || item.customer?.name || "N/A",
    vendor: item.carrier?.carrierName || item.shipperVendor?.vendorName || "N/A",
    siteLocation: item.deliveryLocation || item.delivery?.deliveryLocation || "N/A",
    requiredEquipment: item.equipment?.join(", ") || item.delivery?.loadingEquipment?.join(", ") || "None",
    internalOwner: "N/A",
    carrier: item.carrier?.carrierName || "N/A",
    freightLoad: item.requestId || "",
    date: dateStr,
  };
};

const MiniDeliveryCard = ({ delivery }: { delivery: Delivery }) => {
  const config = statusConfig[delivery.status];
  return (
    <div className="bg-white p-3 rounded-xl border-l-4 shadow-sm border border-gray-100 space-y-2 text-left" style={{ borderLeftColor: config.dotColor }}>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.dotColor }} />
        <p className="text-[11px] font-semibold text-[#212B36] truncate">{delivery.project}</p>
      </div>
      <p className="text-[9px] font-medium text-[#637381]">{delivery.customer}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[9px] text-[#637381]"><Package size={10} /> {delivery.title}</div>
        <div className="flex items-center gap-1.5 text-[9px] text-[#637381]"><Truck size={10} /> {delivery.vendor}</div>
        <div className="flex items-center gap-1.5 text-[9px] text-[#637381]"><Clock size={10} /> {delivery.timeWindow}</div>
      </div>
      <p className="text-[9px] font-semibold pt-1" style={{ color: config.dotColor }}>{delivery.status}</p>
    </div>
  );
};

const SelectDateModal = ({ isOpen, onClose, onSelect, initialDate }: { isOpen: boolean; onClose: () => void; onSelect: (date: Date) => void; initialDate: Date }) => {
  const [viewDate, setViewDate] = useState(initialDate);
  const [tempDate, setTempDate] = useState(initialDate);

  if (!isOpen) return null;

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const handleNextMonth = () => setViewDate(addMonths(viewDate, 1));

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-[440px]">
      <div className="p-4 space-y-4 font-inter">
        <h2 className="text-base md:text-xl font-semibold text-[#212B36]">Select Date</h2>
        <div className="border border-gray-300 rounded-2xl p-4 space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-[#212B36]" />
            </button>
            <div className="flex gap-2 text-sm font-semibold">
              <FilterDropdown
                activeTab={format(viewDate, "M")}
                onTabChange={(val) => setViewDate(setMonth(viewDate, parseInt(val) - 1))}
                options={Array.from({ length: 12 }, (_, i) => ({
                  label: format(new Date(2000, i, 1), "MMM"),
                  value: (i + 1).toString()
                }))}
                icon={<></>}
              />

              <FilterDropdown
                activeTab={format(viewDate, "yyyy")}
                onTabChange={(val) => setViewDate(setYear(viewDate, parseInt(val)))}
                options={Array.from({ length: 20 }, (_, i) => {
                  const year = new Date().getFullYear() - 10 + i;
                  return { label: year.toString(), value: year.toString() };
                })}
                icon={<></>}
              />
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ChevronRight size={20} className="text-[#212B36]" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <span key={day} className="text-xs font-medium text-[#919EAB] pb-2 uppercase tracking-wider">{day}</span>
            ))}
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, viewDate);
              const isSelected = isSameDay(day, tempDate);
              return (
                <button
                  key={idx}
                  onClick={() => setTempDate(day)}
                  className={`h-11 w-11 flex items-center justify-center rounded-md text-sm font-medium transition-all relative ${isSelected ? "bg-[#212B36] text-white shadow-lg z-10" :
                    isCurrentMonth ? "text-[#212B36] hover:bg-gray-50" : "text-[#919EAB] opacity-40 hover:bg-gray-50"
                    }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4 pt-2">
          <Button onClick={onClose} variant="white">Cancel</Button>
          <Button onClick={() => { onSelect(tempDate); onClose(); }}
            variant="purpleFilled">Save</Button>
        </div>
      </div>
    </Modal>
  );
};

const DeliveryCalendarView: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [activeView, setActiveView] = useState("Day");
  const [currentDate, setCurrentDate] = useState(new Date("2026-06-12"));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // New modal states
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isMarkDeliveredModalOpen, setIsMarkDeliveredModalOpen] = useState(false);
  const [isRescheduleSuccessOpen, setIsRescheduleSuccessOpen] = useState(false);
  const [isReminderSuccessOpen, setIsReminderSuccessOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeDeliveryId, setActiveDeliveryId] = useState<string>("");

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    if (activeView === "Day") calendarApi.changeView("dayGridDay");
    else if (activeView === "Week") calendarApi.changeView("dayGridWeek");
    else if (activeView === "Month") calendarApi.changeView("dayGridMonth");
  }, [activeView]);

  const dateRange = useMemo(() => {
    let fromDate: Date;
    let toDate: Date;

    if (activeView === "Day") {
      fromDate = currentDate;
      toDate = currentDate;
    } else if (activeView === "Week") {
      fromDate = startOfWeek(currentDate, { weekStartsOn: 0 });
      toDate = endOfWeek(currentDate, { weekStartsOn: 0 });
    } else {
      fromDate = startOfMonth(currentDate);
      toDate = endOfMonth(currentDate);
    }

    return {
      fromDate: format(fromDate, "yyyy-MM-dd"),
      toDate: format(toDate, "yyyy-MM-dd"),
    };
  }, [currentDate, activeView]);

  const { data: calendarData } = useGetCalendarDeliveriesQuery({
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate,
    projectId: filters.project || undefined,
    customerId: filters.customer || undefined,
  });

  const deliveries: Delivery[] = useMemo(() => {
    if (!calendarData?.dates) return [];
    return calendarData.dates.flatMap((dateGroup) =>
      (dateGroup.deliveries || []).map((d) => mapApiDeliveryToDelivery(d, dateGroup.date))
    );
  }, [calendarData]);

  const todaysDeliveriesCount = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todayGroup = calendarData?.dates?.find((d) => d.date === todayStr);
    return todayGroup ? todayGroup.totalDeliveries : 0;
  }, [calendarData]);

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    calendarRef.current?.getApi().gotoDate(date);
    setIsDatePickerOpen(false);
  };

  const handleDateClick = (arg: { date: Date }) => {
    if (activeView === "Month") {
      setSelectedDay(arg.date);
      setIsDailyModalOpen(true);
    }
  };

  const handleReschedule = (id: string) => {
    setActiveDeliveryId(id);
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = () => {
    setIsRescheduleModalOpen(false);
    setIsRescheduleSuccessOpen(true);
  };

  const handleMarkDelivered = (id: string) => {
    setActiveDeliveryId(id);
    setIsMarkDeliveredModalOpen(true);
  };

  const handleSendReminder = (_id: string) => {
    setIsReminderSuccessOpen(true);
  };

  const renderEventContent = (eventInfo: { event: { extendedProps: Delivery } }) => {
    const delivery = eventInfo.event.extendedProps;

    if (activeView === "Day") {
      return (
        <DeliveryCard
          delivery={delivery}
          onReschedule={handleReschedule}
          onMarkDelivered={handleMarkDelivered}
          onSendReminder={handleSendReminder}
        />
      );
    } else if (activeView === "Week") {
      return <MiniDeliveryCard delivery={delivery} />;
    } else {
      // Month view summary
      return (
        <div className="mt-1 space-y-1 w-full px-1">
          <div className="h-1 bg-[#2B7FFF] rounded-full w-full" />
          <p className="text-[10px] font-bold text-[#212B36] truncate">{delivery.title}</p>
        </div>
      );
    }
  };

  const filteredDeliveries = selectedDay
    ? deliveries.filter(d => isSameDay(new Date(d.date), selectedDay))
    : [];

  return (
    <PageWrapper>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <TitleSubtitle title="Delivery Calendar" subtitle="Schedule and track deliveries in calendar view" />

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="blueFilled" size="sm" onClick={() => setIsFilterModalOpen(true)}>Filters</Button>
          <div onClick={() => setIsDatePickerOpen(true)} className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#212B36] cursor-pointer hover:border-[#1E51A4]">
            <span>{format(currentDate, "dd MMM yyyy")}</span>
            <CalendarDays size={18} className="text-[#637381]" />
          </div>
          <div className="flex p-1 bg-white border border-gray-200 rounded-lg">
            {["Day", "Week", "Month"].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-6 py-1.5 text-sm font-bold rounded-md transition-all ${activeView === view ? "bg-[#1E51A4] text-white shadow-sm" : "text-[#637381]"}`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[14px] border border-gray-100 overflow-hidden p-4 calendar-custom">
        <div className="flex flex-wrap gap-4 mb-8 mt-2">
          <div className="px-5 py-2.5 bg-[#4169B830] text-[#02318C] rounded-[8px] text-sm font-normal">Today's Deliveries: {todaysDeliveriesCount} deliveries</div>
          <div className="px-5 py-2.5 bg-[#4169B830] text-[#02318C] rounded-[8px] text-sm font-normal flex items-center gap-2">Weather: ☀ Clear</div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridDay"
          initialDate={currentDate}
          headerToolbar={false}
          dayHeaderFormat={activeView === "Week" ? { weekday: "short", day: "numeric", month: "short" } : { weekday: "long", month: "long", day: "numeric", year: "numeric" }}
          events={deliveries.map(d => ({
            id: d.id,
            title: d.title,
            start: d.date,
            extendedProps: d
          }))}
          eventContent={renderEventContent}
          dateClick={handleDateClick}
          dayCellClassNames={() => "calendar-day-cell cursor-pointer"}
          eventClassNames={() => "calendar-event-item cursor-pointer"}
          height="auto"
        />
      </div>

      <div className="bg-[#F8F9FA] rounded-[16px] border border-gray-100 p-6 md:p-8">
        <p className="text-sm font-bold text-[#212B36] mb-6">Status Legend</p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: config.dotColor }} />
              <span className="text-sm font-medium text-[#637381]">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <SelectDateModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelect={handleDateSelect}
        initialDate={currentDate}
      />

      <DeliveryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={(f) => {
          setFilters(f);
          setIsFilterModalOpen(false);
        }}
      />

      <DailyDeliveriesModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        date={selectedDay}
        deliveries={filteredDeliveries}
        onReschedule={handleReschedule}
        onMarkDelivered={handleMarkDelivered}
        onSendReminder={handleSendReminder}
      />

      <RescheduleDeliveryModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        deliveryId={activeDeliveryId}
        onSubmit={handleRescheduleSubmit}
      />

      <SuccessModal
        isLogoBottom={false}
        isOpen={isMarkDeliveredModalOpen}
        onClose={() => setIsMarkDeliveredModalOpen(false)}
        title="Your delivery is Marked as Delivered"
        buttonText="Ok"
      >
        <div className="space-y-3 pt-2 pb-6">
          <p className="text-lg font-semibold text-[#212B36]">
            Delivered Time : <span className="font-normal">11:00 AM</span>
          </p>
          <p className="text-lg font-semibold text-[#212B36]">
            Received By: <span className="font-normal">Receiver Name</span>
          </p>
          <p className="text-lg font-semibold text-[#212B36]">
            Delivery Notes : <span className="font-normal">NA</span>
          </p>
        </div>
      </SuccessModal>

      <SuccessModal
        isLogoBottom={false}
        isOpen={isRescheduleSuccessOpen}
        onClose={() => setIsRescheduleSuccessOpen(false)}
        title="Your delivery for Primary Frame Steel has been rescheduled."
        buttonText="Ok"
      >
        <div className="space-y-3 pt-2 pb-6">
          <p className="text-lg font-semibold text-[#212B36]">
            New Date: <span className="font-normal">March 27</span>
          </p>
          <p className="text-lg font-semibold text-[#212B36]">
            Time Window: <span className="font-normal">10:00 AM – 2:00 PM</span>
          </p>
          <p className="text-lg font-semibold text-[#212B36]">
            Contact: <span className="font-normal">John Site Manager</span>
          </p>
        </div>
      </SuccessModal>

      <SuccessModal
        isLogoBottom={false}
        isOpen={isReminderSuccessOpen}
        onClose={() => setIsReminderSuccessOpen(false)}
        title="Reminder Sent Successfully"
        buttonText="Ok"
      />

      <style>{`
        .calendar-custom .fc { font-family: 'Inter', sans-serif; border: none; }
        .calendar-custom .fc-theme-standard td, .calendar-custom .fc-theme-standard th { border: 1px solid #F4F6F8; }
        .calendar-custom .fc-col-header-cell { background: white; padding: 16px 0; }
        .calendar-custom .fc-col-header-cell-cushion { font-size: 14px; font-weight: 700; color: #212B36; text-transform: uppercase; }
        .calendar-custom .fc-daygrid-day-number { font-weight: 700; color: #212B36; padding: 12px; }
        .calendar-custom .fc-event { background: transparent; border: none; padding: 0; }
        .fc-h-event { background-color: transparent !important; border: none !important; }
        .calendar-custom .fc-daygrid-day-frame { min-height: 120px; }
        .calendar-custom .fc-day-today { background: #F4F6F8 !important; }
        .calendar-custom .fc-day-today .fc-col-header-cell-cushion { color: #2B7FFF; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E4E6; border-radius: 10px; }
      `}</style>
    </PageWrapper>
  );
};

export default DeliveryCalendarView;
