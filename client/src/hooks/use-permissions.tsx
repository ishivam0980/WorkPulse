import { useAuthContext } from "@/context/auth-provider";
import { PermissionType } from "@/constant";
import { useGetWorkspaceMembersQuery } from "@/hooks/api/use-workspace";

export const usePermissions = (workspaceId: string) => {
  const { user } = useAuthContext();
  const { data } = useGetWorkspaceMembersQuery(workspaceId);

  const currentUserMember = data?.members.find(
    (member) => member.userId._id === user?._id
  );

  const permissions = currentUserMember?.role.permissions || [];

  const hasPermission = (permission: PermissionType): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: PermissionType[]): boolean => {
    return permissionList.some((permission) => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList: PermissionType[]): boolean => {
    return permissionList.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    role: currentUserMember?.role.name,
  };
};
