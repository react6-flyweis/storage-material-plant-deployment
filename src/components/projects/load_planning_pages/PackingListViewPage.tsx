import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import LoadPlanningHeader, { type HeaderAction } from "./LoadPlanningHeader";
import Button from "../../common_component/Button";
import CommonInfoList from "../../common_component/CommonInfoList";
import SubHeading from "../../common_component/SubHeading";
import PackingListModal from "../PackingListModal";

interface Step4PackingListProps {
  onViewPackingList: () => void;
}

const Step4PackingList: React.FC<Step4PackingListProps> = ({
  onViewPackingList,
}) => {
  return (
    <div className="space-y-8 bg-white rounded-[14px] border border-gray-100 shadow-sm p-4 md:p-8">
      <CommonInfoList
        title="Project: Riverside Complex | Truckloads: 2"
        items={[
          { label: "Project", value: "Riverside Complex" },
          { label: "Upload ID", value: "UPL-001" },
          { label: "Bundles Created", value: "5" },
          { label: "Total Weight", value: "18500 IBS" },
        ]}
        labelWidth="min-w-[160px]"
      />
      <div className="space-y-6">
        <SubHeading text="Optimization Summary Card" />
        <div className="max-w-md space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-inter font-semibold text-[#212B36]">
              Truck Loads
            </span>
            <span className="font-inter font-bold text-[#212B36]">2</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-inter font-semibold text-[#212B36]">
              Total Bundles
            </span>
            <span className="font-inter font-bold text-[#212B36]">4</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-inter font-semibold text-[#212B36]">
              Total Weight
            </span>
            <span className="font-inter font-bold text-[#212B36]">
              18500 IBS
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-inter font-semibold text-[#212B36]">
              Packing List Generated
            </span>
            <span className="font-inter font-semibold text-[#212B36]">
              2
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-8" />

      <div className="space-y-4">
        <SubHeading text="Packing List" />
        <div className="overflow-x-auto rounded-sm border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[900px] font-inter">
            <thead>
              <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Load ID</th>
                <th className="py-4 px-6">Truck</th>
                <th className="py-4 px-6">Bundles</th>
                <th className="py-4 px-6">Weight</th>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                {
                  id: "LOAD-001",
                  num: 1,
                  truck: "TX-2141",
                  bundles: 3,
                  weight: "36000 IBS",
                  destination: "Riverside Site A",
                  status: "Ready",
                },
                {
                  id: "LOAD-002",
                  num: 2,
                  truck: "TX-4712",
                  bundles: 2,
                  weight: "45500 IBS",
                  destination: "Riverside Site A",
                  status: "Ready",
                },
              ].map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors font-inter"
                >
                  <td className="py-6 px-6 font-normal">{row.num}</td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    {row.id}
                  </td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    {row.truck}
                  </td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    {row.bundles}
                  </td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    <div className="leading-tight">
                      <div>{row.weight.split(" ")[0]}</div>
                      <div>{row.weight.split(" ")[1]}</div>
                    </div>
                  </td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    {row.destination}
                  </td>
                  <td className="py-6 px-6 font-normal text-(--text-color-gray-4)">
                    {row.status}
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="grayFilled" size="sm">
                        <Download size={18} strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="grayFilled"
                        size="sm"
                        className="px-6"
                        onClick={onViewPackingList}
                      >
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PackingListViewPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);

  const actions: HeaderAction[] = [
    {
      label: "Generate QR Label",
      variant: "purpleFilled",
      className: "px-8 py-2.5 font-bold",
      onClick: () => {
        if (requestId) {
          navigate(`/load_planning/${requestId}/qr-label`);
        }
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={4}
        requestId={requestId || ""}
        title="Packing List"
        description="Generate and manage packing lists for truckloads and bundles."
        actions={actions}
      />
      <div className="p-6">
        <Step4PackingList onViewPackingList={() => setIsPackingListModalOpen(true)} />
      </div>
      <PackingListModal
        isOpen={isPackingListModalOpen}
        onClose={() => setIsPackingListModalOpen(false)}
      />
    </div>
  );
};

export default PackingListViewPage;
