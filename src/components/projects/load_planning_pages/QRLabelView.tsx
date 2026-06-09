import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import LoadPlanningHeader, { type HeaderAction } from "./LoadPlanningHeader";
import Button from "../../common_component/Button";
import CommonInfoList from "../../common_component/CommonInfoList";
import SubHeading from "../../common_component/SubHeading";
import PackingListModal from "../PackingListModal";

interface Step5QRLabelProps {
  onViewLabel: () => void;
}

const Step5QRLabel: React.FC<Step5QRLabelProps> = ({
  onViewLabel,
}) => {
  return (
    <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
      {/* Project Header Card */}
      <CommonInfoList
        title="Project: Riverside Complex | Shipper Ref: SHP-1044"
        items={[
          { label: "Project", value: "Riverside Complex" },
          { label: "Upload ID", value: "UPL-001" },
          { label: "Bundles Created", value: "5" },
          { label: "Total Weight", value: "18500 IBS" },
        ]}
        labelWidth="min-w-[160px]"
      />

      {/* Summary Card Section */}
      <div className="space-y-6">
        <SubHeading text="Summary Card" />
        <div className="max-w-md space-y-4">
          {[
            { label: "Total Bundles", value: "4" },
            { label: "Labels Generated", value: "4" },
            { label: "Labels Printed", value: "3" },
            { label: "Pending Labels", value: "1" },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center text-sm md:text-base">
              <span className="font-inter font-semibold text-[#212B36]">
                {item.label}
              </span>
              <span className="font-inter font-bold text-[#212B36]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-100 my-8" />

      {/* Bundle Label List Table */}
      <div className="space-y-4">
        <SubHeading text="Bundle Label List" />
        <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[900px] font-inter">
            <thead>
              <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Bundle ID</th>
                <th className="py-4 px-6">Load ID</th>
                <th className="py-4 px-6">Parts</th>
                <th className="py-4 px-6">Length</th>
                <th className="py-4 px-6">Weight</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                { num: 1, id: "BND-001", load: "LOAD-001", parts: "STL-B12", length: "20 ft", weight: "3600 IBS", status: "Generated" },
                { num: 2, id: "BND-002", load: "LOAD-002", parts: "STL-B12", length: "12 ft", weight: "2400 IBS", status: "Generated" },
                { num: 3, id: "BND-003", load: "LOAD-003", parts: "STL-A03", length: "15 ft", weight: "4500 IBS", status: "Generated" },
                { num: 4, id: "BND-004", load: "LOAD-004", parts: "STL-B12", length: "20 ft", weight: "2700 IBS", status: "Generated" },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-6 px-6 font-normal text-gray-400">{row.num}</td>
                  <td className="py-6 px-6 font-bold text-[#212B36]">{row.id}</td>
                  <td className="py-6 px-6 font-normal text-[#212B36]">{row.load}</td>
                  <td className="py-6 px-6 font-normal text-[#637381]">{row.parts}</td>
                  <td className="py-6 px-6 font-normal text-[#637381]">{row.length}</td>
                  <td className="py-6 px-6 font-normal text-[#637381]">{row.weight}</td>
                  <td className="py-6 px-6 font-normal text-[#637381]">{row.status}</td>
                  <td className="py-6 px-6">
                    <div className="flex items-center justify-center gap-3">
                      <Button variant="grayFilled" size="sm" className="p-2 min-w-0">
                        <Download size={18} className="text-white" />
                      </Button>
                      <Button
                        variant="grayFilled"
                        size="sm"
                        className="px-6 text-[#637381] font-bold"
                        onClick={onViewLabel}
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

const QRLabelView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);

  const actions: HeaderAction[] = [
    {
      label: "Review Load Plan",
      variant: "purpleFilled",
      className: "px-8 py-2.5 font-bold",
      onClick: () => {
        if (requestId) {
          navigate(`/load_planning/${requestId}/load-plan-review`);
        }
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={5}
        requestId={requestId || ""}
        title="QR Label Generator"
        description="Generate and print QR labels for bundles and pallets to enable scanning and tracking."
        actions={actions}
      />
      <div className="p-6">
        <Step5QRLabel onViewLabel={() => setIsPackingListModalOpen(true)} />
      </div>
      <PackingListModal
        isOpen={isPackingListModalOpen}
        onClose={() => setIsPackingListModalOpen(false)}
      />
    </div>
  );
};

export default QRLabelView;
