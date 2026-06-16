import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react"
import Heading from "../common_component/Heading";
// import pdfIcon from "@/assets/icon/dashboard/pdfIcon.svg";
import xlxsIcon from "@/assets/icon/dashboard/xlxs.svg";

import Button from "../common_component/Button";
import BOMListContent from "./BOMListContent";

import {
  useGetPlantProjectDetailQuery,
  useGetConsolidatedBOMQuery,
  useGetConsolidatedBOMUrlQuery,
} from "@/redux/api/projectApi";

const BOMView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const {
    data: projectDetail,
    isLoading: isProjectLoading,
    error: projectError,
  } = useGetPlantProjectDetailQuery(projectId || "");

  const {
    data: consolidatedBOMData,
    isLoading: isBOMLoading,
    error: bomError,
  } = useGetConsolidatedBOMQuery(projectId || "");

  const {
    data: bomUrlData,
    isLoading: isBomUrlLoading,
  } = useGetConsolidatedBOMUrlQuery(projectId || "");

  if (isProjectLoading || isBOMLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E51A4]"></div>
        <p className="text-gray-500 font-inter font-medium text-sm">
          Loading BOM details...
        </p>
      </div>
    );
  }

  if (bomError || projectError) {
    const is404 = bomError && "status" in bomError && bomError.status === 404;
    return (
      <div className="xl:pr-5 px-2 pb-10 space-y-6">
        <div className="flex items-center gap-4 mt-2">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="BOM Files Details" />
        </div>
        <div className="p-10 text-center bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-semibold text-lg font-inter text-[#212B36]">
            {is404 ? "Consolidated BOM Not Generated Yet" : "Error Loading BOM Details"}
          </p>
          <p className="text-sm text-gray-500 font-inter max-w-md">
            {is404
              ? "The consolidated Bill of Materials (BOM) has not been generated for this project. Please make sure that BOM files have been uploaded and processed."
              : "Something went wrong while retrieving the consolidated BOM. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  const consolidatedBOM = consolidatedBOMData?.consolidatedBOM;
  if (!consolidatedBOM) {
    return null;
  }

  const bomData = {
    id: consolidatedBOM._id || "N/A",
    projectName: projectDetail?.projectName || "N/A",
    customerName: projectDetail?.client
      ? `${projectDetail.client.firstName} ${projectDetail.client.lastName}`
      : "N/A",
    date: consolidatedBOM.createdAt
      ? new Date(consolidatedBOM.createdAt).toLocaleDateString()
      : "N/A",
    jobId: projectDetail?.jobId || "N/A",
    summary: {
      totalItems: consolidatedBOM.itemCount || 0,
      totalWeight: `${consolidatedBOM?.totalWeight?.toFixed(2)} lbs`,
      totalPanelsArea: consolidatedBOM.totalPanelsArea,
    },
    items: (consolidatedBOM.items || []).map((item) => ({
      qty: item.totalQty || 0,
      mark: item.markIds && item.markIds.length > 0 ? item.markIds.join(", ") : "-",
      description: item.description || "-",
      part: item.partCode || "-",
      color: item.partColor || "-",
      angle: "-",
      thick: "-",
      length: `${item.totalLengthFeet || 0} ${item.costUnit || "FT"}`,
      weight: item.totalWeight ? item.totalWeight.toString() : "0",
    })),
  };

  const handleDownload = () => {
    if (bomUrlData?.fileUrl) {
      window.open(bomUrlData.fileUrl, "_blank");
    }
  };

  return (
    <div className="xl:pr-5 px-2 pb-10 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-4">
          <Button
            variant="blueFilled"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 shrink-0"
          >
            <ArrowLeft size={18} strokeWidth={2.5} /> Back
          </Button>
          <Heading text="BOM Files Details" />
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <Button
            variant="white"
            size="sm"
            onClick={handleDownload}
            disabled={isBomUrlLoading || !bomUrlData?.fileUrl}
          >
            <img src={xlxsIcon} alt="xlsx" className="w-4 h-4 mr-2" />
            {isBomUrlLoading ? "Loading..." : "Download Excel"}
          </Button>
          {/* 
          <Button
            variant="white"
            size="sm"
          >
            <img src={pdfIcon} alt="pdf" className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          */}
          <Button
            size="sm"
            variant="purpleFilled"
            onClick={() => navigate(`/projects/${projectId}/generate-shipper-order`)}
          >
            Share with Shippers
          </Button>
        </div>
      </div>

      <BOMListContent bomData={bomData} />
    </div>
  );
};

export default BOMView;

