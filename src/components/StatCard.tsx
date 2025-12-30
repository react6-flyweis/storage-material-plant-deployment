import React from "react";
import { Card } from "./ui/card";
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
        "sm:p-5 p-2 rounded-md text-white border-none shrink-0",
        className,
        color
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="sm:text-sm text-xs opacity-90">{title}</p>
          <p className="sm:text-2xl text-lg mt-1 w-[50px] sm:w-auto overflow-x-auto">
            {value}
          </p>
        </div>

        <div className="bg-white sm:p-2 p-1 rounded-md">{icon}</div>
      </div>
    </Card>
  );
}
