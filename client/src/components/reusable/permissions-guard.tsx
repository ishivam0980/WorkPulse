import React from "react";
import { useParams } from "react-router-dom";
import { Lock } from "lucide-react";

import { PermissionType } from "@/constant";
import { usePermissions } from "@/hooks/use-permissions";

interface PermissionsGuardProps {
  requiredPermission: PermissionType;
  children: React.ReactNode;
  showMessage?: boolean;
  fallback?: React.ReactNode;
}

export const PermissionsGuard: React.FC<PermissionsGuardProps> = ({
  requiredPermission,
  showMessage = false,
  fallback,
  children,
}) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { hasPermission } = usePermissions(workspaceId!);

  if (!hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showMessage) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
          <Lock className="h-5 w-5" />
          <p className="text-sm italic">
            You don't have permission to access this
          </p>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
};

export default PermissionsGuard;
