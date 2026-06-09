import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadPlanningHeader, { type HeaderAction } from "./LoadPlanningHeader";
import Button from "../../common_component/Button";
import CommonInfoList from "../../common_component/CommonInfoList";
import SubHeading from "../../common_component/SubHeading";
import PackingListModal from "../PackingListModal";
import CheckIcon from "../../../assets/icon/checkIcon.svg";

interface Step6LoadPlanReviewProps {
  onViewPackingList: () => void;
}

const Step6LoadPlanReview: React.FC<Step6LoadPlanReviewProps> = ({
  onViewPackingList,
}) => {
  return (
    <div className="space-y-12 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
      {/* Project Header Card */}
      <CommonInfoList
        title="Project: Riverside Complex | Shipper Ref: SHP-1044"
        items={[
          { label: "Project", value: "Riverside Complex" },
          { label: "Load ID", value: "LOAD-001" },
          { label: "Shipper Reference", value: "SHP-1044" },
          { label: "Status", value: "Planning" },
        ]}
        labelWidth="min-w-[160px]"
      />
      {/* Load Summary Card */}
      <div className="space-y-6">
        <SubHeading text="Load Summary Card" />
        <div className="max-w-md space-y-4">
          {[
            { label: "Total Bundles", value: "4" },
            { label: "Total Loads", value: "2" },
            { label: "Total Weight", value: "18500 IBS" },
            { label: "Estimated Freight Request", value: "$9700" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm md:text-base">
              <span className="font-inter font-bold text-[#212B36]">
                {item.label}
              </span>
              <span className="font-inter font-bold text-[#212B36]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Truckload Summary */}
      <div className="space-y-6">
        <SubHeading text="Truckload Summary" />
        <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[900px] font-inter">
            <thead>
              <tr className="bg-[#212B36] text-white text-sm font-medium tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Load ID</th>
                <th className="py-4 px-6">Bundle</th>
                <th className="py-4 px-6">Total Weight</th>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Ready</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                { num: 1, id: "LOAD-001", bundle: 2, weight: "36000 IBS", destination: "Riverside Site A", ready: true },
                { num: 2, id: "LOAD-002", bundle: 2, weight: "44500 IBS", destination: "Riverside Site A", ready: true },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                  <td className="py-6 px-6 font-normal text-[#212B36]">{row.id}</td>
                  <td className="py-6 px-6 font-normal text-[#212B36]">{row.bundle}</td>
                  <td className="py-6 px-6 font-normal text-[#919EAB]">{row.weight}</td>
                  <td className="py-6 px-6 font-normal text-[#919EAB]">{row.destination}</td>
                  <td className="py-6 px-6">
                    {row.ready && <span className="text-[#212B36] font-normal text-lg">✔</span>}
                  </td>
                  <td className="py-6 px-6 text-center">
                    <Button
                      variant="grayFilled"
                      size="sm"
                      className="px-6 text-white font-bold"
                      onClick={onViewPackingList}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bundle Verification */}
      <div className="space-y-6">
        <SubHeading text="Bundle Verification" />
        <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[900px] font-inter">
            <thead>
              <tr className="bg-[#212B36] text-white text-sm font-medium tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Bundle ID</th>
                <th className="py-4 px-6">Parts</th>
                <th className="py-4 px-6">Weight</th>
                <th className="py-4 px-6">Packing List Generated</th>
                <th className="py-4 px-6">QR Labels Generated</th>
                <th className="py-4 px-6">Bundles Assigned to Truck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                { num: 1, id: "BND-001", parts: "STL-B12", weight: "3600 IBS" },
                { num: 2, id: "BND-002", parts: "STL-B12", weight: "2400 IBS" },
                { num: 3, id: "BND-003", parts: "STL-A03", weight: "4500 IBS" },
                { num: 4, id: "BND-004", parts: "STL-B12", weight: "2700 IBS" },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                  <td className="py-6 px-6 font-normal text-[#212B36]">{row.id}</td>
                  <td className="py-6 px-6 font-normal text-[#919EAB]">{row.parts}</td>
                  <td className="py-6 px-6 font-normal text-[#919EAB]">{row.weight}</td>
                  <td className="py-6 px-6">
                    <img src={CheckIcon} alt="check" className="w-8 h-8" />
                  </td>
                  <td className="py-6 px-6">
                    <img src={CheckIcon} alt="check" className="w-8 h-8" />
                  </td>
                  <td className="py-6 px-6">
                    <img src={CheckIcon} alt="check" className="w-8 h-8" />
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

const LoadPlanReviewView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);

  const actions: HeaderAction[] = [
    {
      label: "Approve & Create Freight Request",
      variant: "purpleFilled",
      className: "px-8 py-2.5 font-bold",
      onClick: () => {
        if (requestId) {
          navigate(`/load_planning/${requestId}/freight-selection`);
        }
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={6}
        requestId={requestId || ""}
        title="Load Plan Review"
        description="Final check of the entire load plan, including bundles, trucks, and weights, before selecting freight carriers."
        actions={actions}
      />
      <div className="p-6">
        <Step6LoadPlanReview onViewPackingList={() => setIsPackingListModalOpen(true)} />
      </div>
      <PackingListModal
        isOpen={isPackingListModalOpen}
        onClose={() => setIsPackingListModalOpen(false)}
      />
    </div>
  );
};

export default LoadPlanReviewView;
