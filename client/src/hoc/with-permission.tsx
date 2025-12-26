import React from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionType } from "@/constant";

type WithPermissionProps = {
  permission: PermissionType;
  workspaceId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const WithPermission = ({
  permission,
  workspaceId,
  children,
  fallback = null,
}: WithPermissionProps) => {
  const { hasPermission } = usePermissions(workspaceId);

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export function withPermissionHOC<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  permission: PermissionType,
  getWorkspaceId: (props: T) => string
) {
  return function WithPermissionComponent(props: T) {
    const workspaceId = getWorkspaceId(props);
    const { hasPermission } = usePermissions(workspaceId);

    if (!hasPermission(permission)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
