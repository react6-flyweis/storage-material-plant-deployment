import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ChevronUp, ChevronDown } from "lucide-react";
import { useGetBundlePlanQuery, useGetBundleDetailsQuery } from "@/redux/api/shipperApi";

interface TableItem {
  id: string;
  qty: number;
  item: string;
  description: string;
  length: string;
  weight: number;
  unitPrice: number;
}

type SortField = "qty" | "item" | "length" | "unitPrice" | "amount";
type SortOrder = "asc" | "desc";

const EditBundleView: React.FC = () => {
  const { projectId, bundleId } = useParams<{ projectId: string; bundleId: string }>();
  const navigate = useNavigate();

  // Load actual data from API to align mock with real values if available
  const { data: bundlePlanData } = useGetBundlePlanQuery(projectId || "", {
    skip: !projectId,
  });

  const { data: bundleDetails, isLoading, error } = useGetBundleDetailsQuery(bundleId || "", {
    skip: !bundleId,
  });

  const matchingBundle = useMemo(() => {
    if (!bundlePlanData || !bundlePlanData.bundles) return null;
    return bundlePlanData.bundles.find((b) => b.bundleNo === bundleId || b._id === bundleId);
  }, [bundlePlanData, bundleId]);

  // Transform items from API response
  const items = useMemo<TableItem[]>(() => {
    if (!bundleDetails || !bundleDetails.items) return [];
    return bundleDetails.items.map((item) => {
      const snapshot = item.sourceLineSnapshot || {};
      const unitPrice =
        (snapshot.unitPrice as number) ??
        (snapshot.rate as number) ??
        (snapshot.price as number) ??
        0;

      return {
        id: item._id,
        qty: item.qty,
        item: item.partCode,
        description: item.description || "",
        length: `${item.lengthFeet} ft`,
        weight: item.weight,
        unitPrice,
      };
    });
  }, [bundleDetails]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Automatically select all loaded items initially
  React.useEffect(() => {
    if (items.length > 0) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items]);

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  // Dynamic calculations based on checked items
  const totalWeight = useMemo(() => {
    return items
      .filter((item) => selectedIds.has(item.id))
      .reduce((sum, item) => sum + item.weight * item.qty, 0);
  }, [items, selectedIds]);

  const itemsNameStr = useMemo(() => {
    const active = items.filter((item) => selectedIds.has(item.id));
    if (active.length === 0) return "No items";
    const firstItemCode = active[0].item;
    return `${firstItemCode} × ${active.length}`;
  }, [items, selectedIds]);

  const statusStr = useMemo(() => {
    if (selectedIds.size === 0) return "Empty";
    return totalWeight > 15000 ? "Weight Warning" : "Valid";
  }, [selectedIds, totalWeight]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortField) return items;

    return [...items].sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      if (sortField === "qty") {
        valA = a.qty;
        valB = b.qty;
      } else if (sortField === "item") {
        valA = a.item;
        valB = b.item;
      } else if (sortField === "length") {
        valA = a.length;
        valB = b.length;
      } else if (sortField === "unitPrice") {
        valA = a.unitPrice;
        valB = b.unitPrice;
      } else if (sortField === "amount") {
        valA = a.qty * a.unitPrice;
        valB = b.qty * b.unitPrice;
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      } else {
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }
    });
  }, [items, sortField, sortOrder]);

  const handleSave = () => {
    setToastMessage("Bundle saved successfully!");
    setTimeout(() => {
      setToastMessage(null);
      navigate(`/load_planning/${projectId}/bundle-planner`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white font-inter">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6E38F7]"></div>
        <p className="text-gray-500 font-medium text-sm">Loading bundle details...</p>
      </div>
    );
  }

  if (error) {
    const errorObj = error as { data?: { message?: string }; message?: string };
    const errorMsg = errorObj?.data?.message || errorObj?.message || "Failed to load bundle details.";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white font-inter p-6">
        <p className="text-red-500 font-bold text-lg">Error loading bundle details</p>
        <p className="text-gray-500 text-sm max-w-md text-center">{errorMsg}</p>
        <button
          onClick={() => navigate(`/load_planning/${projectId}/bundle-planner`)}
          className="mt-4 bg-[#6E38F7] hover:bg-[#5D2EE0] text-white font-bold text-sm px-6 py-2 rounded-lg transition-colors shadow-sm"
        >
          Back to Bundle Planner
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-inter relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#10B981] text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check size={18} strokeWidth={3} />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/load_planning/${projectId}/bundle-planner`)}
            className="text-[#212B36] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#212B36]">Edit Bundle</h1>
            <p className="text-sm text-[#637381] mt-1">
              Select Items which you want to create a bundle
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#6E38F7] hover:bg-[#5D2EE0] text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Save Bundle
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-[#E2E4E6] p-6 shadow-sm space-y-8">
        {/* Top Info Table Card */}
        <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#212B36] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6 w-16">#</th>
                <th className="py-4 px-6">Bundle ID</th>
                <th className="py-4 px-6">Profile</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Length</th>
                <th className="py-4 px-6">Unit Weight</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[#212B36] font-semibold text-sm">
                <td className="py-6 px-6 text-[#637381]">1</td>
                <td className="py-6 px-6 font-bold">
                  {bundleDetails?.bundle?.bundleNo || matchingBundle?.bundleNo || bundleId || "BND-001"}
                </td>
                <td className="py-6 px-6 text-[#637381] capitalize">
                  {bundleDetails?.bundle?.bundleType || matchingBundle?.bundleType || "Beam"}
                </td>
                <td className="py-6 px-6 text-[#637381]">{itemsNameStr}</td>
                <td className="py-6 px-6 text-[#637381]">
                  {bundleDetails?.bundle?.maxLengthFeet
                    ? `${bundleDetails.bundle.maxLengthFeet} ft`
                    : matchingBundle?.maxLengthFeet
                    ? `${matchingBundle.maxLengthFeet} ft`
                    : "20 ft"}
                </td>
                <td className="py-6 px-6 text-[#637381]">
                  {totalWeight ? `${totalWeight.toLocaleString()} IBS` : "0 IBS"}
                </td>
                <td className="py-6 px-6">
                  <span
                    className={`font-bold text-sm ${statusStr === "Valid" ? "text-[#10B981]" : "text-[#F59E0B]"
                      }`}
                  >
                    {statusStr}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Items Selection Table */}
        <div className="overflow-x-auto rounded-lg border border-[#E2E4E6]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#E2E4E6] text-xs font-bold text-[#212B36] uppercase tracking-wider">
                <th className="py-4 px-6 w-16">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === items.length && items.length > 0}
                      onChange={handleToggleAll}
                      className="w-4 h-4 rounded text-[#6E38F7] border-[#D0D5DD] focus:ring-[#6E38F7] cursor-pointer"
                    />
                  </div>
                </th>
                <th className="py-4 px-6 w-24">
                  <button
                    onClick={() => handleSort("qty")}
                    className="flex items-center gap-1.5 hover:text-[#6E38F7] font-bold"
                  >
                    QTY
                    <span className="flex flex-col text-[8px] leading-[6px]">
                      <ChevronUp size={8} className={sortField === "qty" && sortOrder === "asc" ? "text-[#6E38F7]" : "text-gray-400"} />
                      <ChevronDown size={8} className={sortField === "qty" && sortOrder === "desc" ? "text-[#6E38F7]" : "text-gray-400"} />
                    </span>
                  </button>
                </th>
                <th className="py-4 px-6 w-32">
                  <button
                    onClick={() => handleSort("item")}
                    className="flex items-center gap-1.5 hover:text-[#6E38F7] font-bold"
                  >
                    Item
                    <span className="flex flex-col text-[8px] leading-[6px]">
                      <ChevronUp size={8} className={sortField === "item" && sortOrder === "asc" ? "text-[#6E38F7]" : "text-gray-400"} />
                      <ChevronDown size={8} className={sortField === "item" && sortOrder === "desc" ? "text-[#6E38F7]" : "text-gray-400"} />
                    </span>
                  </button>
                </th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6 w-32">
                  <button
                    onClick={() => handleSort("length")}
                    className="flex items-center gap-1.5 hover:text-[#6E38F7] font-bold"
                  >
                    Length
                    <span className="flex flex-col text-[8px] leading-[6px]">
                      <ChevronUp size={8} className={sortField === "length" && sortOrder === "asc" ? "text-[#6E38F7]" : "text-gray-400"} />
                      <ChevronDown size={8} className={sortField === "length" && sortOrder === "desc" ? "text-[#6E38F7]" : "text-gray-400"} />
                    </span>
                  </button>
                </th>
                <th className="py-4 px-6 w-28">Weight</th>
                <th className="py-4 px-6 w-32">
                  <button
                    onClick={() => handleSort("unitPrice")}
                    className="flex items-center gap-1.5 hover:text-[#6E38F7] font-bold"
                  >
                    Unit Price
                    <span className="flex flex-col text-[8px] leading-[6px]">
                      <ChevronUp size={8} className={sortField === "unitPrice" && sortOrder === "asc" ? "text-[#6E38F7]" : "text-gray-400"} />
                      <ChevronDown size={8} className={sortField === "unitPrice" && sortOrder === "desc" ? "text-[#6E38F7]" : "text-gray-400"} />
                    </span>
                  </button>
                </th>
                <th className="py-4 px-6 w-32">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-1.5 hover:text-[#6E38F7] font-bold"
                  >
                    Amount
                    <span className="flex flex-col text-[8px] leading-[6px]">
                      <ChevronUp size={8} className={sortField === "amount" && sortOrder === "asc" ? "text-[#6E38F7]" : "text-gray-400"} />
                      <ChevronDown size={8} className={sortField === "amount" && sortOrder === "desc" ? "text-[#6E38F7]" : "text-gray-400"} />
                    </span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4E6] text-sm text-[#212B36]">
              {sortedItems.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#F8F9FA] transition-colors ${isSelected ? "bg-[#F8F9FA]/50" : ""
                      }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="w-4 h-4 rounded text-[#6E38F7] border-[#D0D5DD] focus:ring-[#6E38F7] cursor-pointer"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">{item.qty}</td>
                    <td className="py-4 px-6 font-semibold">{item.item}</td>
                    <td className="py-4 px-6 text-[#637381] font-medium max-w-xs md:max-w-sm whitespace-normal">
                      {item.description}
                    </td>
                    <td className="py-4 px-6 font-medium text-[#212B36]">{item.length}</td>
                    <td className="py-4 px-6 text-[#637381] font-medium">{item.weight}</td>
                    <td className="py-4 px-6 text-[#637381] font-medium">
                      ${item.unitPrice.toFixed(1)}
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      ${(item.qty * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditBundleView;
