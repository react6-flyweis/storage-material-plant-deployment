import React from "react";
import { X } from "lucide-react";
import Modal from "../Modal";
import Button from "../common_component/Button";
import { getQRCodeUrl } from "@/lib/utils";

export interface QRModalData {
  projectName?: string;
  shipperRef?: string;
  loadId?: string | number;
  id?: string;
  bundleId?: string;
  parts?: string;
  weight?: string;
  length?: string;
}

interface QRCodeDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QRModalData | null;
}

const QRCodeDataModal: React.FC<QRCodeDataModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  const qrDataObj = {
    project: data.projectName || "",
    shipper: data.shipperRef || "",
    load_id: data.loadId || "LOAD-001",
    bundle_id: data.id || "BND-001",
    parts: data.parts || "STL-B12",
    weight: data.weight?.replace(/[^0-9]/g, '') || "3600",
    length: data.length?.replace(/[^0-9]/g, '') || "20",
  };

  const standaloneBase = import.meta.env.VITE_STANDLONE_PAGE_BASE || "";
  const qrCodeUrl = data.bundleId
    ? getQRCodeUrl(`${standaloneBase.replace(/\/+$/, "")}/bundle/${data.bundleId}`, "250x250")
    : getQRCodeUrl(qrDataObj, "250x250");

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Label - ${qrDataObj.bundle_id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f4f6f8;
            }
            .container {
              border: 1px solid #e2e4e6;
              background-color: #ffffff;
              padding: 30px;
              width: 380px;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              text-align: center;
            }
            .qr-code {
              width: 220px;
              height: 220px;
              margin: 0 auto 24px auto;
              padding: 10px;
              border: 1px solid #f0f0f0;
              border-radius: 12px;
              background: #fff;
            }
            .qr-code img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .project-title {
              font-size: 20px;
              font-weight: 700;
              color: #212b36;
              margin-bottom: 20px;
              word-break: break-all;
            }
            .details {
              text-align: left;
              background-color: #f8f9fb;
              padding: 16px;
              border-radius: 12px;
              font-size: 14px;
              border: 1px solid #f1f3f5;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              border-bottom: 1px dashed #e2e4e6;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #637381;
            }
            .value {
              font-weight: 500;
              color: #212b36;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="project-title">${qrDataObj.project}</div>
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="details">
              <div class="row"><span class="label">Shipper:</span><span class="value">${qrDataObj.shipper}</span></div>
              <div class="row"><span class="label">Load ID:</span><span class="value">${qrDataObj.load_id}</span></div>
              <div class="row"><span class="label">Bundle ID:</span><span class="value">${qrDataObj.bundle_id}</span></div>
              <div class="row"><span class="label">Parts:</span><span class="value">${qrDataObj.parts}</span></div>
              <div class="row"><span class="label">Weight:</span><span class="value">${qrDataObj.weight}</span></div>
              <div class="row"><span class="label">Length:</span><span class="value">${qrDataObj.length}</span></div>
              ${data.bundleId ? `<div class="row"><span class="label" style="min-width: 60px;">URL:</span><span class="value" style="word-break: break-all; text-align: right;">${standaloneBase.replace(/\/+$/, "")}/bundle/${data.bundleId}</span></div>` : ""}
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} hideHeader width="max-w-2xl">
      <div className="relative p-2 md:p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-2 md:right-2  bg-black text-white rounded-full p-1.5 shadow-sm hover:bg-gray-800 transition-colors z-50"
        >
          <X className="size-3 md:size-4" />
        </button>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-inter font-bold text-center mb-10 text-[#212B36]">
          QR Code Data
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          {/* QR Code Dynamic Image */}
          <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 bg-white border border-gray-150 flex items-center justify-center p-2 rounded-lg">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Data List */}
          <div className="flex-1 space-y-2">
            <h3 className="text-lg md:text-xl font-inter font-semibold text-(--text-color-gray-5)">
              project={qrDataObj.project}
            </h3>
            <div className="space-y-1 text-sm md:text-base font-normal">
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Shipper :</span>
                <span className="text-(--text-color-gray-5) font-medium">shipper={qrDataObj.shipper}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Load :</span>
                <span className="text-(--text-color-gray-5) font-medium">load_id={qrDataObj.load_id}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Bundle :</span>
                <span className="text-(--text-color-gray-5) font-medium">bundle_id={qrDataObj.bundle_id}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Parts :</span>
                <span className="text-(--text-color-gray-5) font-medium">parts={qrDataObj.parts}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Weight :</span>
                <span className="text-(--text-color-gray-5) font-medium">weight={qrDataObj.weight}</span>
              </p>
              <p className="flex gap-2">
                <span className="text-(--text-color-gray-4) min-w-[80px]">Length :</span>
                <span className="text-(--text-color-gray-5) font-medium">Length={qrDataObj.length}</span>
              </p>
              {data.bundleId && (
                <p className="flex gap-2">
                  <span className="text-(--text-color-gray-4) min-w-[80px]">URL :</span>
                  <span className="text-(--text-color-gray-5) font-medium break-all">
                    {`${standaloneBase.replace(/\/+$/, "")}/bundle/${data.bundleId}`}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-12">
          <Button variant="gradient" size="lg" className="w-full" onClick={handlePrint}>
            Export PDF
          </Button>
          <Button variant="gradient" size="lg" className="w-full" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeDataModal;
