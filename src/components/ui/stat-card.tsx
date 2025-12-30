import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  // `color` may be a Tailwind background class like 'bg-blue-600' or a CSS color string like '#1e40af'
  color?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  color,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "sm:p-5 px-3 py-2 rounded-md text-white border-none",
        className,
        color
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="md:text-base text-xs opacity-90">{title}</p>
          <p className="md:text-2xl text-base mt-1 w-[70px] sm:w-auto overflow-y-hidden overflow-x-auto">
            {value}
          </p>
        </div>

        <div className="bg-white sm:p-2 p-1 rounded-md">{icon}</div>
      </div>
    </Card>
  );
}
