import type { ProductionMetric } from "@/data/productionMockData";
import type { TabType } from "@/pages/PlantPage";
import FilterDropdown from "./common_component/FilterDropdown";
import alignBoxBottomLeftFilled from "@/assets/icon/dashboard/align-box-bottom-left-filled.svg";
import moneybag from "@/assets/icon/dashboard/moneybag.svg";
import cashbanknote from "@/assets/icon/dashboard/cash-banknote.svg";
import truckIcon from "@/assets/icon/dashboard/truck-delivery.svg";
import barChart3Icon from "@/assets/icon/dashboard/bar-chart-icon.svg";

const iconMap: Record<ProductionMetric["icon"], React.FC<{ size?: number }>> = {
  graph: (props) => <img src={alignBoxBottomLeftFilled} alt="planned tonnage" className={`size-16 lg:size-${props?.size ? props.size : 20}`} />,
  moneybillnote: (props) => <img src={cashbanknote} alt="produced tonnage" className={`size-16 lg:size-${props?.size ? props.size : 20}`} />,
  moneybag: (props) => <img src={moneybag} alt="utilization" className={`size-16 lg:size-${props?.size ? props.size : 20}`} />,
  truck: (props) => <img src={truckIcon} alt="on-time delivery" className={`size-16 lg:size-${props?.size ? props.size : 20}`} />,
  chart: (props) => <img src={barChart3Icon} alt="rework rejection" className={`size-16 lg:size-${props?.size ? props.size : 20}`} />,
};

interface ProductionOverviewProps {
  metrics: ProductionMetric[];
  filterLabel: string;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProductionOverview: React.FC<ProductionOverviewProps> = ({
  metrics,
  filterLabel,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className=" rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-base md:text-lg font-semibold text-[#212B36]">
          Production Overview{" "}
          <span className="text-[#212B36] font-semibold">({filterLabel})</span>
        </h2>
        <FilterDropdown
          activeTab={activeTab}
          onTabChange={onTabChange}
          options={[
            { label: "Today", value: "today" },
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" },
          ]}
        />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        {metrics.map((metric, idx) => {
          const Icon = iconMap[metric.icon];
          return (
            <div
              key={idx}
              className="border-2 border-[#3B82F6] rounded-[5px] px-4 py-3 pr-1 flex items-center gap-4 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="xl:w-12 lg:w-10 md:w-10 w-8 xl:h-12 lg:h-10 md:h-10 h-8 p-1.5 rounded-lg bg-[#3B82F6] flex items-center justify-center text-white shrink-0 text">
                <Icon  />
              </div>
              <div className="min-w-0">
                <p className="xl:text-sm lg:text-sm md:text-xs text-xs text-[#637381] font-normal truncate">
                  {metric.label}
                </p>
                <p className="xl:text-lg lg:text-base md:text-base text-sm font-semibold text-[#212B36] leading-tight mt-0.5">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductionOverview;
