import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { createAdminSocket } from "@/lib/socket";
import ProjectAssignedDialog from "@/components/ProjectAssignedDialog";
import Modal from "@/components/Modal";
import Button from "@/components/common_component/Button";
import { FileSpreadsheet, Scale, Truck } from "lucide-react";

interface ShipperFilePayload {
  leadId: string;
  requestId: string;
  vendorId: string;
  vendorName: string;
  submittedAt: string;
  quoteValue: number;
}

interface ShipperComparisonPayload {
  jobId: string;
  requestId: string;
  leadId: string;
  vendorId: string;
}

interface FreightBidSubmittedPayload {
  leadId: string;
  deliveryId: string;
  deliveryNumber: string;
  bidId: string;
  carrierId: string;
  carrierName: string;
  submittedAt: string;
  quotedAmount: number;
  projectName: string;
  jobId: string;
}

export default function GlobalSocketListener() {
  const navigate = useNavigate();
  const accessToken = useAppSelector((state: RootState) => state.auth.accessToken);

  // States for Modals
  const [assignedProject, setAssignedProject] = useState<{ leadId: string; poOrderId: string; projectName: string } | null>(null);
  const [isAssignedDialogOpen, setIsAssignedDialogOpen] = useState(false);

  const [shipperFile, setShipperFile] = useState<ShipperFilePayload | null>(null);
  const [isShipperFileOpen, setIsShipperFileOpen] = useState(false);

  const [comparison, setComparison] = useState<ShipperComparisonPayload | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const [freightBid, setFreightBid] = useState<FreightBidSubmittedPayload | null>(null);
  const [isFreightBidOpen, setIsFreightBidOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = createAdminSocket(accessToken);
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Global Socket.io listener connected to /admin namespace");
    });

    // 1. project_assigned
    socket.on("project_assigned", (data: { leadId: string; poOrderId: string; projectName: string }) => {
      console.log("socket event: project_assigned", data);
      setAssignedProject(data);
      setIsAssignedDialogOpen(true);
      window.dispatchEvent(new CustomEvent("socket_project_assigned", { detail: data }));
    });

    // 2. bom_extraction_complete
    socket.on("bom_extraction_complete", (data: { jobId: string; buildingNumber: number; totalItems: number }) => {
      console.log("socket event: bom_extraction_complete", data);
      window.dispatchEvent(new CustomEvent("socket_bom_extraction_complete", { detail: data }));
    });

    // 3. bom_extraction_failed
    socket.on("bom_extraction_failed", (data: { jobId: string; buildingNumber: number; error: string }) => {
      console.log("socket event: bom_extraction_failed", data);
      window.dispatchEvent(new CustomEvent("socket_bom_extraction_failed", { detail: data }));
    });

    // 4. shipper_file_submitted
    socket.on("shipper_file_submitted", (data: ShipperFilePayload) => {
      console.log("socket event: shipper_file_submitted", data);
      setShipperFile(data);
      setIsShipperFileOpen(true);
      window.dispatchEvent(new CustomEvent("socket_shipper_file_submitted", { detail: data }));
    });

    // 5. all_shipper_files_submitted
    socket.on("all_shipper_files_submitted", (data: { leadId: string; consolidatedBOMId: string; vendorCount: number }) => {
      console.log("socket event: all_shipper_files_submitted", data);
      window.dispatchEvent(new CustomEvent("socket_all_shipper_files_submitted", { detail: data }));
    });

    // 6. shipper_comparison_complete
    socket.on("shipper_comparison_complete", (data: ShipperComparisonPayload) => {
      console.log("socket event: shipper_comparison_complete", data);
      setComparison(data);
      setIsComparisonOpen(true);
      window.dispatchEvent(new CustomEvent("socket_shipper_comparison_complete", { detail: data }));
    });

    // 7. shipper_comparison_failed
    socket.on("shipper_comparison_failed", (data: { jobId: string; requestId: string; leadId: string; vendorId: string; error: string }) => {
      console.log("socket event: shipper_comparison_failed", data);
      window.dispatchEvent(new CustomEvent("socket_shipper_comparison_failed", { detail: data }));
    });

    // 8. freight_bid_submitted
    socket.on("freight_bid_submitted", (data: FreightBidSubmittedPayload) => {
      console.log("socket event: freight_bid_submitted", data);
      setFreightBid(data);
      setIsFreightBidOpen(true);
      window.dispatchEvent(new CustomEvent("socket_freight_bid_submitted", { detail: data }));
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken]);

  const handleViewProjectDetails = () => {
    if (assignedProject) {
      navigate(`/projects/${assignedProject.leadId}`);
      setIsAssignedDialogOpen(false);
    }
  };

  const handleViewShipperQuotation = () => {
    if (shipperFile) {
      navigate(`/projects/${shipperFile.leadId}/shipper-files/${shipperFile.requestId}`);
      setIsShipperFileOpen(false);
    }
  };

  const handleViewComparisonResult = () => {
    if (comparison) {
      navigate(`/load_planning/${comparison.requestId}/comparison-result`);
      setIsComparisonOpen(false);
    }
  };

  const handleViewFreightRequest = () => {
    if (freightBid) {
      navigate(`/delivery/freight-request/${freightBid.deliveryId}`);
      setIsFreightBidOpen(false);
    }
  };

  return (
    <>
      {/* 1. Project Assigned Dialog */}
      <ProjectAssignedDialog
        open={isAssignedDialogOpen}
        onClose={() => setIsAssignedDialogOpen(false)}
        payload={assignedProject}
        onViewDetails={handleViewProjectDetails}
      />

      {/* 2. Shipper File Received Modal */}
      <Modal isOpen={isShipperFileOpen} onClose={() => setIsShipperFileOpen(false)} hideHeader={true} width="max-w-md">
        <div className="p-4 text-left">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Shipper File Received
              </h3>
              <p className="text-sm text-slate-500">
                A new quote file has been uploaded by the vendor
              </p>
            </div>
          </div>

          {/* Details Card */}
          {shipperFile && (
            <div className="mb-5 bg-linear-to-br from-emerald-50 to-teal-50/50 p-4 rounded-xl border border-emerald-100/50">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                Vendor Name
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3">
                {shipperFile.vendorName}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-2 border-t border-emerald-100/30">
                {/* <div>
                  <div className="text-xs text-slate-500">Request ID</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{shipperFile.requestId}</div>
                </div> */}
                <div>
                  <div className="text-xs text-slate-500">Quote Value</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    ${shipperFile.quoteValue ? shipperFile.quoteValue.toLocaleString() : "0"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsShipperFileOpen(false)}
              className="w-full sm:w-28 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </Button>
            <Button
              variant="blueFilled"
              onClick={handleViewShipperQuotation}
              className="w-full sm:w-36 py-2 text-sm font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              View Details
            </Button>
          </div>
        </div>
      </Modal>

      {/* 3. Shipper Comparison Completed Modal */}
      <Modal isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} hideHeader={true} width="max-w-md">
        <div className="p-4 text-left">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Shipper Comparison Done
              </h3>
              <p className="text-sm text-slate-500">
                Quotations comparison report is now ready
              </p>
            </div>
          </div>

          {/* Details Card */}
          {comparison && (
            <div className="mb-5 bg-linear-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100/50">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Comparison Status
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3">
                Completed Successfully
              </h4>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsComparisonOpen(false)}
              className="w-full sm:w-28 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </Button>
            <Button
              variant="blueFilled"
              onClick={handleViewComparisonResult}
              className="w-full sm:w-40 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Comparison
            </Button>
          </div>
        </div>
      </Modal>

      {/* 4. Freight Bid Submitted Modal */}
      <Modal isOpen={isFreightBidOpen} onClose={() => setIsFreightBidOpen(false)} hideHeader={true} width="max-w-md">
        <div className="p-4 text-left">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                New Freight Bid Submitted
              </h3>
              <p className="text-sm text-slate-500">
                A carrier has submitted a new bid for a delivery
              </p>
            </div>
          </div>

          {/* Details Card */}
          {freightBid && (
            <div className="mb-5 bg-linear-to-br from-blue-50 to-indigo-50/50 p-4 rounded-xl border border-blue-100/50">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                Project Name
              </div>
              <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3">
                {freightBid.projectName}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm mt-2 pt-2 border-t border-blue-100/30">
                <div>
                  <div className="text-xs text-slate-500">Carrier</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {freightBid.carrierName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Quoted Amount</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    ${freightBid.quotedAmount ? freightBid.quotedAmount.toLocaleString() : "0"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Delivery Number</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {freightBid.deliveryNumber}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsFreightBidOpen(false)}
              className="w-full sm:w-28 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:bg-slate-50"
            >
              Dismiss
            </Button>
            <Button
              variant="blueFilled"
              onClick={handleViewFreightRequest}
              className="w-full sm:w-36 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Bid
            </Button>
          </div>
        </div>
      </Modal>

    </>
  );
}
