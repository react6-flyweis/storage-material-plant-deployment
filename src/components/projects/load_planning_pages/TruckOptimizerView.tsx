import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import LoadPlanningHeader, { type HeaderAction } from "./LoadPlanningHeader";
import Button from "../../common_component/Button";
import SubHeading from "../../common_component/SubHeading";

const Step3TruckOptimizer: React.FC = () => {
  return (
    <div className="space-y-8 bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
      <div className="space-y-4">
        <SubHeading text="Truckload Table" />
        <div className="overflow-x-auto rounded-sm border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[900px] font-inter">
            <thead>
              <tr className="bg-[#212B36] text-white text-xs font-semibold tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Load ID</th>
                <th className="py-4 px-6">Bundle</th>
                <th className="py-4 px-6">Total Weight</th>
                <th className="py-4 px-6">Utilization</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                {
                  id: "LOAD-001",
                  num: 1,
                  bundles: "BND-001\nBND-002",
                  weight: "36000 IBS",
                  util: "80%",
                  status: "Ready",
                },
                {
                  id: "LOAD-002",
                  num: 2,
                  bundles: "BND-003\nBND-004",
                  weight: "44500 IBS",
                  util: "99%",
                  status: "Ready",
                },
              ].map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-6 px-6 font-normal text-gray-400">
                    {row.num}
                  </td>
                  <td className="py-6 px-6 font-normal text-[#212B36]">
                    {row.id}
                  </td>
                  <td className="py-6 px-6 font-normal text-[#637381] whitespace-pre-line leading-relaxed">
                    {row.bundles}
                  </td>
                  <td className="py-6 px-6 font-normal text-[#919EAB]">
                    {row.weight}
                  </td>
                  <td className="py-6 px-6 font-normal text-[#637381]">
                    {row.util}
                  </td>
                  <td className="py-6 px-6 font-normal text-[#637381]">
                    {row.status}
                  </td>
                  <td className="py-6 px-6 text-center">
                    <Button variant="grayFilled" size="sm">
                      Lock Truck
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        {[
          { id: "LOAD-001", weight: "36000 IBS", cost: "$4500" },
          { id: "LOAD-002", weight: "44500 IBS", cost: "$5200" },
        ].map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-black">
                Load ID
              </label>
              <input
                type="text"
                readOnly
                value={item.id}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-gray-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-black">
                Weight
              </label>
              <input
                type="text"
                readOnly
                value={item.weight}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-gray-600 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-inter font-semibold text-black">
                Estimate Cost
              </label>
              <input
                type="text"
                readOnly
                value={item.cost}
                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-black font-bold focus:outline-none"
              />
            </div>
          </div>
        ))}

        <div className="max-w-xs space-y-2">
          <label className="text-sm font-inter font-semibold text-black">
            Total Estimate Freight
          </label>
          <input
            type="text"
            readOnly
            value="$9700"
            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E4E6] rounded-lg text-sm font-inter text-black font-bold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

const TruckOptimizerView: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const actions: HeaderAction[] = [
    {
      label: "Export Load Plan",
      variant: "white",
      className: "border-[#E2E4E6] text-[#212B36] font-bold text-sm px-5",
      icon: <Download size={18} className="mr-2" />,
      onClick: () => {},
    },
    {
      label: "Generate Packing List",
      variant: "purpleFilled",
      className: "px-8 py-2.5 font-bold",
      onClick: () => {
        if (requestId) {
          navigate(`/load_planning/${requestId}/packing-list`);
        }
      },
    },
  ];

  return (
    <div className="min-h-screen">
      <LoadPlanningHeader
        currentStepIndex={3}
        requestId={requestId || ""}
        title="Truckload Optimizer"
        description="Optimize bundle assignments into truckloads to maximize utilization and prepare shipments for dispatch."
        actions={actions}
      />
      <div className="p-6">
        <Step3TruckOptimizer />
      </div>
    </div>
  );
};

export default TruckOptimizerView;
