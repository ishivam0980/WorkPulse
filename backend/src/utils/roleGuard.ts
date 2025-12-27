import { PermissionType } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./role-permission";

export const roleGuard = (
  role: keyof typeof RolePermissions | undefined,
  requiredPermissions: PermissionType[]
) => {
  if (!role) {
    throw new UnauthorizedException(
      "You do not have a valid role in this workspace"
    );
  }

  const permissions = RolePermissions[role];

  if (!permissions) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }

  const hasPermission = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasPermission) {
    throw new UnauthorizedException(
      "You do not have the necessary permissions to perform this action"
    );
  }
};
