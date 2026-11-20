import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGetPlantProjectsQuery } from "@/redux/api/projectApi";
import { getPlantLifecycleStatusConfig } from "@/constants/plantLifecycle";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export interface HeaderSearchProps {
  className?: string;
}

export function HeaderSearch({ className }: HeaderSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: projectsData, isLoading } = useGetPlantProjectsQuery(
    { page: 1, limit: 20 },
    { skip: !debouncedSearch.trim() },
  );

  const allProjects = projectsData?.projects ?? [];

  const searchLower = debouncedSearch.trim().toLowerCase();
  const matchingProjects = searchLower
    ? allProjects.filter((project) => {
        const projectName = (project.projectName || "").toLowerCase();
        const jobId = (project.jobId || "").toLowerCase();
        const clientName = (project.clientName || "").toLowerCase();
        const customerFullName = `${project.customer?.firstName || ""} ${project.customer?.lastName || ""}`.toLowerCase();
        const location = (project.location || "").toLowerCase();

        return (
          projectName.includes(searchLower) ||
          jobId.includes(searchLower) ||
          clientName.includes(searchLower) ||
          customerFullName.includes(searchLower) ||
          location.includes(searchLower)
        );
      })
    : [];

  const isDebouncing = searchTerm.trim() !== debouncedSearch.trim();
  const showDropdown = isOpen && Boolean(searchTerm.trim());

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectProject = (projectId: string) => {
    setIsOpen(false);
    setSearchTerm("");
    navigate(`/projects/${projectId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" && matchingProjects.length > 0 && isOpen) {
      handleSelectProject(matchingProjects[0]._id);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex-1 max-w-lg hidden md:block", className)}
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects by name, jobId, client, location..."
          className="pl-9 pr-8 bg-gray-50 border-gray-200 text-sm focus-visible:bg-white transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden min-w-72">
          {isLoading || isDebouncing ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              <span>Searching projects...</span>
            </div>
          ) : matchingProjects.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">
              No projects found
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/80 border-b border-gray-100">
                Projects
              </div>
              <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {matchingProjects.map((project) => {
                  const customerName =
                    [project.customer?.firstName, project.customer?.lastName]
                      .filter(Boolean)
                      .join(" ") ||
                    project.clientName ||
                    "Unknown Client";

                  return (
                    <li key={project._id}>
                      <button
                        type="button"
                        onClick={() => handleSelectProject(project._id)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-gray-50 transition-colors flex flex-col gap-0.5 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {project.projectName || "Untitled Project"}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {project.drawingStatus &&
                              project.drawingStatus !== "none" && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                                  {project.drawingStatus.replace(/_/g, " ")}
                                </span>
                              )}
                            {project.lifecycleStatus && (
                              <span
                                className={cn(
                                  "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                                  getPlantLifecycleStatusConfig(
                                    project.lifecycleStatus,
                                  ).badgeClassName,
                                )}
                              >
                                {
                                  getPlantLifecycleStatusConfig(
                                    project.lifecycleStatus,
                                  ).label
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="truncate">{customerName}</span>
                          {project.jobId && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="font-mono text-[11px] text-gray-400">
                                #{project.jobId}
                              </span>
                            </>
                          )}
                          {project.location && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="truncate text-[11px] text-gray-400">
                                {project.location}
                              </span>
                            </>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderSearch;
