import * as React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ResponsiveTable({ children, className, ...props }: ResponsiveTableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin",
        className
      )}
      {...props}
    >
      <div className="min-w-[640px] sm:min-w-0">
        {children}
      </div>
    </div>
  );
}
