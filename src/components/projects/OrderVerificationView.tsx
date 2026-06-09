import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MoveLeft, Scale } from "lucide-react";
import Button from "../common_component/Button";
import uploadIcon from "@/assets/icon/upload.svg";
import ProcessingFilesModal from "@/components/projects/ProcessingFilesModal";
import CommonDropdown from "../common_component/CommonDropdown";
import TitleSubtitle from "../common_component/TitleSubtitle";
import {
  useGetConsolidatedBOMUrlQuery,
} from "@/redux/api/projectApi";
import {
  useGetShipperDocumentQuery,
  useGetProjectShipperRequestsQuery,
  useCompareShipperRequestMutation,
} from "@/redux/api/shipperApi";

const OrderVerificationView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, requestId } = useParams();

  const { data: shipperDoc } = useGetShipperDocumentQuery(requestId || "", {
    skip: !requestId,
  });
  const { data: bomUrlData } = useGetConsolidatedBOMUrlQuery(projectId || "", {
    skip: !projectId,
  });

  const [selectedVendor, setSelectedVendor] = useState("");

  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);

  const [bomFile, setBomFile] = useState<string | null>("");
  const [shipperFile, setShipperFile] = useState<string | null>("");

  const { data: shipperRequestsData } = useGetProjectShipperRequestsQuery(projectId || "", {
    skip: !projectId || !!requestId,
  });

  const vendorOptions = (shipperRequestsData?.shipperRequests || []).map((req) => ({
    label: req.vendorName,
    value: req.vendorName,
  }));

  useEffect(() => {
    if (shipperDoc?.fileName) {
      setTimeout(() => {
        setShipperFile(shipperDoc.fileName);
      }, 0);
    }
    if (shipperDoc?.vendorName) {
      setTimeout(() => {
        setSelectedVendor(shipperDoc.vendorName);
      }, 0);
    }
  }, [shipperDoc]);

  useEffect(() => {
    if (!requestId && shipperRequestsData?.shipperRequests && shipperRequestsData.shipperRequests.length > 0) {
      const exists = shipperRequestsData.shipperRequests.some(
        (req) => req.vendorName === selectedVendor
      );
      if (!exists) {
        setTimeout(() => {
          setSelectedVendor(shipperRequestsData.shipperRequests[0].vendorName);
        }, 0);
      }
    }
  }, [shipperRequestsData, requestId, selectedVendor]);

  useEffect(() => {
    if (!requestId && shipperRequestsData?.shipperRequests) {
      const match = shipperRequestsData.shipperRequests.find(
        (req) => req.vendorName === selectedVendor
      );
      setTimeout(() => {
        if (match) {
          setShipperFile(match.fileName || "");
        } else {
          setShipperFile("");
        }
      }, 0);
    }
  }, [selectedVendor, shipperRequestsData, requestId]);

  useEffect(() => {
    if (bomUrlData?.fileUrl) {
      const url = bomUrlData.fileUrl;
      const requestId = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
      setTimeout(() => {
        setBomFile(decodeURIComponent(requestId) || "Consolidated_BOM.xlsx");
      }, 0);
    }
  }, [bomUrlData]);

  const [compareShipperRequest, { isLoading: isComparing }] = useCompareShipperRequestMutation();

  const activeRequestId = requestId || shipperRequestsData?.shipperRequests?.find(
    (req) => req.vendorName === selectedVendor
  )?.requestId;

  const handleCompare = async () => {
    if (!activeRequestId) return;
    try {
      await compareShipperRequest(activeRequestId).unwrap();
      setIsProcessingModalOpen(true);
    } catch (err) {
      console.error("Failed to start comparison:", err);
    }
  };

  return (
    <div className="p-2 md:p-4">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8 flex-wrap w-full">
        <Button variant="primary" onClick={() => navigate(-1)} size="sm">
          <MoveLeft size={18} className="mr-2" />
          Back
        </Button>
        <TitleSubtitle
          title="Order Verification"
          subtitle="File Update & Compare"
        />
      </div>

      {/* ── Main Card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[20px] p-4 lg:p-8 shadow-sm border border-[#F4F6F8] max-w-6xl mx-auto">
        {!requestId && (
          <div className="mb-8 relative max-w-md">
            <CommonDropdown
              label="Select Vendor"
              options={vendorOptions}
              value={selectedVendor}
              onChange={setSelectedVendor}
              placeholder="Select Vendor"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8 mb-12">
          {/* BOM File Card */}
          <div className="border border-[#E2E4E6] rounded-[14px] p-3 lg:p-8 flex flex-col items-center justify-center text-center bg-white min-h-[260px]">
            <div className="mb-4">
              <img
                src={uploadIcon}
                alt="BOM File"
                className="md:w-12 md:h-12 h-8 w-8"
              />
            </div>
            <h3 className="text-base md:text-lg font-archivo font-semibold text-black mb-4">
              BOM File
            </h3>
            {bomFile ? (
              <div className="px-6 py-2 border border-[#1E51A4] rounded-lg text-[#1E51A4] text-sm font-inter font-medium bg-white">
                {bomFile}
              </div>
            ) : (
              <p className="text-xs md:text-sm font-inter text-[#637381]">
                No BOM file found
              </p>
            )}
          </div>

          {/* Shipper File Card */}
          <div className="border border-[#E2E4E6] rounded-[14px] p-4 md:p-8 flex flex-col items-center justify-center text-center bg-white min-h-[260px]">
            <div className="mb-4">
              <img
                src={uploadIcon}
                alt="Shipper File"
                className="md:w-12 md:h-12 h-8 w-8"
              />
            </div>
            <h3 className="text-base md:text-lg font-archivo font-semibold text-black mb-4">
              Shipper File
            </h3>
            {shipperFile ? (
              <div className="px-6 py-2 border border-[#1E51A4] rounded-lg text-[#1E51A4] text-sm font-inter font-medium bg-white">
                {shipperFile}
              </div>
            ) : (
              <p className="text-xs md:text-sm font-inter text-[#637381]">
                No shipper file found
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleCompare} disabled={!bomFile || !shipperFile || isComparing} variant="purpleFilled">
            <Scale className="size-6 mr-2" />
            Compare Files
          </Button>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────── */}


      <ProcessingFilesModal
        isOpen={isProcessingModalOpen}
        onClose={() => setIsProcessingModalOpen(false)}
      />
    </div>
  );
};

export default OrderVerificationView;
