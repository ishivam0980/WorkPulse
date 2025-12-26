import { Loader } from "lucide-react";

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
