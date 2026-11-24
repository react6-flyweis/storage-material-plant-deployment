import {
  FolderOpen,
  HelpCircle,
  PlayCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tourCoordinator } from "../tour.service";
import { useTourStore } from "../tour.store";
import type { TourDefinition } from "../tour.types";
import { plantOperationsTour } from "../tours/plant-operations.tour";
import { orderFlowTour } from "../tours/order-flow.tour";
import { projectDetailsTour } from "../tours/project-details.tour";

interface TourMenuEntry {
  tour: TourDefinition;
  label: string;
  hint: string;
  icon: LucideIcon;
  iconClassName: string;
}

const TOUR_MENU: TourMenuEntry[] = [
  {
    tour: plantOperationsTour,
    label: "Start Walkthrough",
    hint: "Full walkthrough across all operational pages",
    icon: PlayCircle,
    iconClassName: "text-[#1D51A4]",
  },
  {
    tour: orderFlowTour,
    label: "Order Flow Guide",
    hint: "The complete flow, from project to delivery",
    icon: Workflow,
    iconClassName: "text-[#FF8800]",
  },
  {
    tour: projectDetailsTour,
    label: "Project Details Guide",
    hint: "Every section, upload modal and sub-page",
    icon: FolderOpen,
    iconClassName: "text-[#EAB308]",
  },
];

export function TourHubMenu() {
  const navigate = useNavigate();
  const { isAudioMuted, toggleAudioMute, resetAllTours } = useTourStore();

  const handleLaunchTour = (tour: TourDefinition) => {
    tourCoordinator.init(navigate);
    void tourCoordinator.startTour(tour);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAudioMute();
    toast.info(isAudioMuted ? "Voice guidance enabled" : "Voice guidance muted");
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resetAllTours();
    toast.success("Walkthrough history reset");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          data-tour="tour-hub-btn"
          className="rounded-full hover:bg-slate-100"
          title="Product Walkthrough"
        >
          <HelpCircle className="size-5 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-white shadow-lg border border-slate-200 p-2"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Product Walkthrough
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleToggleMute}
              onPointerDown={(e) => e.stopPropagation()}
              className="size-7 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              title={isAudioMuted ? "Unmute voice guidance" : "Mute voice guidance"}
            >
              {isAudioMuted ? (
                <VolumeX className="size-4 text-red-500" />
              ) : (
                <Volume2 className="size-4 text-blue-600" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              onPointerDown={(e) => e.stopPropagation()}
              className="size-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Reset walkthrough history"
            >
              <RotateCcw className="size-3.5" />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {TOUR_MENU.map(({ tour, label, hint, icon: Icon, iconClassName }) => (
          <DropdownMenuItem
            key={tour.id}
            onClick={() => handleLaunchTour(tour)}
            className="flex items-center gap-2 cursor-pointer py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Icon className={`size-4 ${iconClassName}`} />
            <div>
              <div className="font-medium">{label}</div>
              <div className="text-xs text-slate-500">{hint}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
