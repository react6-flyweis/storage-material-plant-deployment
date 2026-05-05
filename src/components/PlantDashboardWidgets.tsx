import type { ShipperFile, PlantAlert, FreightCarrier } from "@/data/productionMockData";

// ─── Icon helpers ────────────────────────────────────────────────────────────
const ShipperIcon = ({ color }: { color: string }) => (
  <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  </div>
);

const alertIconMap: Record<string, { bg: string; icon: React.ReactNode }> = {
  shipper: {
    bg: "bg-[#DBEAFE]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
  },
  order: {
    bg: "bg-[#FEE2E2]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  drawing: {
    bg: "bg-[#F3E8FF]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  production: {
    bg: "bg-[#FEF3C7]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
};

const shipperColors = [
  "bg-[#EF4444]",
  "bg-[#F59E0B]",
  "bg-[#8B5CF6]",
  "bg-[#3B82F6]",
  "bg-[#10B981]",
];

const TruckIcon = () => (
  <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
interface PlantDashboardWidgetsProps {
  shipperFiles: ShipperFile[];
  plantAlerts: PlantAlert[];
  freightCarriers: FreightCarrier[];
}

const PlantDashboardWidgets: React.FC<PlantDashboardWidgetsProps> = ({
  shipperFiles,
  plantAlerts,
  freightCarriers,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {/* ─── Recent Shipper Files ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl flex flex-col">
        <div className="p-5 pb-3">
          <h3 className="text-base font-semibold text-gray-900">
            Recent Shipper Files Received
          </h3>
        </div>
        <div className="flex-1 px-5 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {shipperFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <ShipperIcon color={shipperColors[idx % shipperColors.length]} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {file.shpId} | {file.company}
                  </p>
                </div>
                <span className="bg-[#DBEAFE] text-[#3B82F6] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {file.items} Items
                </span>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-700 font-medium">{file.date}</p>
                  <p className="text-[10px] text-gray-400">{file.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 mt-3">
          <button className="w-full text-center text-[#3B82F6] font-semibold text-sm hover:underline">
            View All Shipper Files
          </button>
        </div>
      </div>

      {/* ─── Plant Alerts ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl flex flex-col">
        <div className="p-5 pb-3">
          <h3 className="text-base font-semibold text-gray-900">Plant Alerts</h3>
        </div>
        <div className="flex-1 px-5 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {plantAlerts.map((alert, idx) => {
              const visual = alertIconMap[alert.type] || alertIconMap.shipper;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${visual.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    {visual.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 font-medium leading-snug">
                      {alert.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {alert.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 mt-3">
          <button className="w-full text-center text-[#3B82F6] font-semibold text-sm hover:underline">
            View All Alerts
          </button>
        </div>
      </div>

      {/* ─── Freight Carriers ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl flex flex-col">
        <div className="p-5 pb-3">
          <h3 className="text-base font-semibold text-gray-900">
            Freight Carriers
          </h3>
        </div>
        <div className="flex-1 px-5 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {freightCarriers.map((carrier, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <TruckIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {carrier.name}
                  </p>
                  <p className="text-xs text-gray-400">{carrier.loads}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${
                    carrier.status === "On Time"
                      ? "bg-[#D1FAE5] text-[#065F46]"
                      : "bg-[#FEE2E2] text-[#991B1B]"
                  }`}
                >
                  {carrier.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 mt-3">
          <button className="w-full text-center text-[#3B82F6] font-semibold text-sm hover:underline">
            View All Carriers
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDashboardWidgets;
