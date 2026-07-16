import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getQRCodeUrl = (data: string | object, size = "250x250") => {
  const dataStr = typeof data === "object" ? JSON.stringify(data) : data;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(dataStr)}`;
};

export const getPackingListUrl = (packingListId?: string): string => {
  if (!packingListId) return "";
  const standaloneBase = import.meta.env.VITE_STANDLONE_PAGE_BASE || "";
  return `${standaloneBase.replace(/\/+$/, "")}/packing-list/${packingListId}`;
};

export const getPackingListQRCodeUrl = (packingListId?: string, size = "250x250"): string => {
  const url = getPackingListUrl(packingListId);
  return url ? getQRCodeUrl(url, size) : "";
};

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

export const formatValue = (value?: string) => {
  if (!value) return "";
  const match = value.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (match) {
    const parsed = parseFloat(match[0]);
    return isNaN(parsed) ? "" : parsed.toFixed(2);
  }
  return "";
};

export const printQRCodeLabel = (data: QRModalData) => {
  const qrDataObj = {
    project: data.projectName || "",
    shipper: data.shipperRef || "",
    load_id: data.loadId || "",
    bundle_id: data.id || "",
    parts: data.parts || "",
    weight: formatValue(data.weight),
    length: formatValue(data.length),
  };

  const standaloneBase = import.meta.env.VITE_STANDLONE_PAGE_BASE || "";
  const qrCodeUrl = data.bundleId
    ? getQRCodeUrl(`${standaloneBase.replace(/\/+$/, "")}/bundle/${data.bundleId}`, "250x250")
    : getQRCodeUrl(qrDataObj, "250x250");

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
            <div class="row"><span class="label">Weight:</span><span class="value">${qrDataObj.weight ? `${qrDataObj.weight} LBS` : "N/A"}</span></div>
            <div class="row"><span class="label">Length:</span><span class="value">${qrDataObj.length ? `${qrDataObj.length} ft` : "N/A"}</span></div>
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

export function getLeadProjectName(
  lead?: {
    projectName?: string | null;
    customerId?: { firstName?: string | null; name?: string | null } | null;
    buildingType?: string | null;
    location?: string | null;
  } | null,
  customer?: { firstName?: string | null; name?: string | null } | null
) {
  // console.log(lead)
  if (lead?.projectName && lead.projectName !== "Untitled Lead" && lead.projectName !== "Untitled" && lead.projectName !== "N/A") {
    return lead.projectName;
  }
  const firstName = customer?.firstName || customer?.name || lead?.customerId?.firstName || lead?.customerId?.name || "Unknown";
  const parts: string[] = [firstName];
  if (lead?.buildingType && lead.buildingType !== "N/A" && lead.buildingType !== "—" && lead.buildingType !== "-") {
    parts.push(lead.buildingType);
  }
  if (lead?.location && lead.location !== "N/A" && lead.location !== "—" && lead.location !== "-") {
    parts.push(lead.location);
  }
  return parts.join("-");
}

export const truncateMiddle = (str: string, maxLength = 24) => {
  if (!str || str.length <= maxLength) return str;
  const mid = Math.ceil((maxLength - 3) / 2);
  return `${str.slice(0, mid)}...${str.slice(-mid)}`;
};

export function projectDisplayName(row?: {
  projectName?: string;
  customerName?: string;
  buildingType?: string;
  location?: string;
  jobId?: string;
  projectId?: string;
} | null) {
  if (!row) return "Unnamed project";
  if (row.projectName?.trim()) return row.projectName.trim();
  const parts = [
    row.customerName?.trim(),
    row.buildingType?.trim(),
    row.location?.trim(),
  ].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  return row.jobId || row.projectId || "Unnamed project";
}




