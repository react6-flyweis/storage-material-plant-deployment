import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react"
import Heading from "../common_component/Heading";
import pdfIcon from "@/assets/icon/dashboard/pdfIcon.svg";
import xlxsIcon from "@/assets/icon/dashboard/xlxs.svg";

import Button from "../common_component/Button";
import BOMListContent from "./BOMListContent";

const BOMView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();


  const project = {
    name: "ABC Construction",
    customerName: "John Doe",

  }

  const bomData = {
    id: "BOM-001",
    projectName: project?.name || "ABC Construction",
    customerName: "John Doe",
    date: "01.09.26",
    jobId: "BLDG-D",
    summary: {
      totalItems: 125,
      totalWeight: "32,000 lbs",
      totalPanelsArea: "3,300 sqm",
    },
    items: [
      { qty: 5, mark: "S-1", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 8, mark: "S-2", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 6, mark: "S-3", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 5, mark: "S-4", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 8, mark: "S-5", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 6, mark: "S-6", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 3, mark: "S-7", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 4, mark: "S-8", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 2, mark: "S-9", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
      { qty: 4, mark: "S-10", description: "STUD", part: "C42516", color: "RO", angle: "-", thick: "16 GA", length: "8'-7 1/4\"", weight: "16.00" },
    ],
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
          <Button variant="white" size="sm">
            <img src={xlxsIcon} alt="xlsx" className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
          <Button
            variant="white"
            size="sm"
          >
            <img src={pdfIcon} alt="pdf" className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
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

