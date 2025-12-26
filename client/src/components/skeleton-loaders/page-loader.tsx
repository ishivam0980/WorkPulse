import { Loader } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex-1 w-full flex items-center justify-center py-20">
      <Loader className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
};
