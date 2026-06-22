import React from "react";
import { Calendar, FileText } from "lucide-react";
import SubHeading from "../common_component/SubHeading";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Activity {
  building: string;
  action: string;
  date: string;
}

interface ProjectStatsAndActivityProps {
  currentStep: string;
  stepNumber: number;
  totalSteps: number;
  startedDate: string;
  estimateCompletion: string;
  activities: Activity[];
  notes: string[];
}

const ProjectStatsAndActivity: React.FC<ProjectStatsAndActivityProps> = ({
  currentStep,
  stepNumber,
  totalSteps,
  startedDate,
  estimateCompletion,
  activities = [],
  notes = [],
}) => {
  const percentage = (stepNumber / totalSteps) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
      {/* Project Status Card */}
      <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm">
        <SubHeading text="Project Status" />
        <div className="flex flex-col items-center mt-4">
          <div className="size-48">
            <CircularProgressbarWithChildren
              value={percentage}
              strokeWidth={10}
              styles={buildStyles({
                pathColor: "var(--button-bg-primary-color)",
                trailColor: "#E5E7EB",
                strokeLinecap: "round",
              })}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-sm md:text-base text-[#6F6F6F] font-inter">Step</p>
                <p className="text-lg md:text-5xl font-bold text-[#111827] font-inter my-1">
                  {stepNumber}
                </p>
                <p className="text-sm md:text-base text-[#6F6F6F] font-inter">
                  of {totalSteps}
                </p>
              </div>
            </CircularProgressbarWithChildren>
          </div>

          <div className="mt-10 space-y-6 w-full px-2">
            <div>
              <p className="text-sm text-[#6F6F6F] font-inter mb-1">
                Current step
              </p>
              <p className="text-sm md:text-lg font-semibold text-(--button-bg-primary-color) font-inter">
                {currentStep}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 text-[#111827]">
                <Calendar className="size-5 md:size-6" />
              </div>
              <div>
                <p className="text-sm md:text-base font-normal text-[#111827] font-inter">
                  Started on
                </p>
                <p className="text-sm md:text-base text-[#6F6F6F] font-inter">
                  {startedDate}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm md:text-base font-normal text-[#111827] font-inter">
                Estimate Completion
              </p>
              <p className="text-sm md:text-base text-[#6F6F6F] font-inter">
                {estimateCompletion}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm flex flex-col">
        <SubHeading text="Recent Activity" />
        <div className="flex-1 flex flex-col justify-center mt-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="size-12 rounded-full bg-purple-50 flex items-center justify-center mb-3 text-(--text-color-purple)">
                <Calendar className="size-6 text-(--text-color-purple)" />
              </div>
              <p className="text-sm font-semibold text-[#212B36] font-inter">No recent activity</p>
              <p className="text-xs text-[#6F6F6F] font-inter mt-1 max-w-[200px]">
                Activities and updates for this project will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-8 relative">
              {/* Vertical Dashed Line */}
              <div className="absolute left-[9px] top-2 bottom-2 border-l-2 border-dashed border-gray-100" />

              {activities.map((activity, index) => (
                <div key={index} className="flex gap-6 relative">
                  {/* Purple Circle with Dot */}
                  <div className="size-5 rounded-full border-2 border-(--text-color-purple) bg-white flex items-center justify-center z-10 mt-1 shrink-0">
                    <div className="size-2 bg-(--text-color-purple) rounded-full" />
                  </div>

                  <div className="space-y-1">
                    {activity.building && (
                      <p className="text-sm font-bold text-(--text-color-purple) font-inter">
                        {activity.building}
                      </p>
                    )}
                    <p className="text-sm text-[#212B36] font-inter font-medium leading-tight">
                      {activity.action}
                    </p>
                    <div className="flex items-center gap-2 text-[#919EAB]">
                      <Calendar size={14} className="shrink-0" />
                      <span className="text-sm font-inter font-medium">
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notes Card */}
      <div className="bg-white rounded-[14px] border border-[#0513214D] p-4 md:p-6 shadow-sm flex flex-col">
        <SubHeading text="Notes" />
        <div className="flex-1 flex flex-col justify-center mt-4">
          {notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-[#6F6F6F]">
                <FileText className="size-6" />
              </div>
              <p className="text-sm font-semibold text-[#212B36] font-inter">No notes yet</p>
              <p className="text-xs text-[#6F6F6F] font-inter mt-1 max-w-[200px]">
                Add notes to keep track of important project information.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {notes.map((note, index) => (
                <div key={index} className="last:border-0">
                  <p className="text-sm lg:text-base text-[#6F6F6F] font-inter leading-relaxed">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectStatsAndActivity;
