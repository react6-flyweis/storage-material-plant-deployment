import { useMemo, useState } from "react";
import ProductionTable from "./ProductionTable";
import UploadDrawingsModal from "./UploadDrawingsModal";
// import LeadsDetailsModal from "./leads/LeadsDetailsModal";
import StatCard from "./ui/stat-card";
import TitleSubtitle from "./common_component/TitleSubtitle";
import { productionManagementText } from "@/data/text/productionManagementText";
import SuccessModal from "./common_component/SuccessModal";
import { useGetProjectStatsQuery } from "@/redux/api/projectApi";

import { UserPlus, Check, CircleDollarSign, ChartSpline } from "lucide-react";
import PageWrapper from "./common_component/PageWrapper";

const defaultStats = {
  totalProjects: 0,
  activeProjects: 0,
  pendingCustomerApproval: 0,
  cancelledProjects: 0,
};

const ProductionManagementView = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const {
    data: projectStats = defaultStats,
    isLoading: isProjectStatsLoading,
    isFetching: isProjectStatsFetching,
  } = useGetProjectStatsQuery();

  const stats = useMemo(
    () => [
      {
        title: "Total Projects",
        value: String(projectStats?.totalProjects ?? 0),
        icon: <UserPlus className="md:size-6 size-4 text-[#1E51A4]" />,
        color: "bg-[#1E51A4]",
      },
      {
        title: "Active Projects",
        value: String(projectStats?.activeProjects ?? 0),
        icon: <Check className="md:size-6 size-4 text-[#3AB449]" />,
        color: "bg-[#3AB449]",
      },
      {
        title: "Pending Customer Approval",
        value: String(projectStats?.pendingCustomerApproval ?? 0),
        icon: <CircleDollarSign className="md:size-6 size-4 text-[#EAB308]" />,
        color: "bg-[#EAB308]",
      },
      {
        title: "Canceled Projects",
        value: String(projectStats?.cancelledProjects ?? 0),
        icon: <ChartSpline className="md:size-6 size-4 text-[#FD8D5B]" />,
        color: "bg-[#FD8D5B]",
      },
    ],
    [projectStats],
  );

  return (
    <PageWrapper>
      <TitleSubtitle
        title={productionManagementText.header.title}
        subtitle={productionManagementText.header.subtitle}
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={isProjectStatsLoading || isProjectStatsFetching}
          />
        ))}
      </div>

      {/* Action Buttons moved into ProductionTable */}

      {/* Table */}
      <ProductionTable />

      {/* <LeadsDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      /> */}

      <UploadDrawingsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={() => {
          setIsUploadModalOpen(false);
          setIsSuccessModalOpen(true);
        }}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={"Drawings Uploaded Successfully"}
      />
    </PageWrapper>
  );
};

export default ProductionManagementView;
