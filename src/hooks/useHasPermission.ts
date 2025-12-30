import { useGetUserHubPermission } from "./useGetUserHubPermission";
import { useUser } from "@/context/UserContext";
import { PERMISSIONS, PermissionCode } from "@/lib/permissions";

export function useHasPermission(
  hubId: string | undefined,
  requiredPermission: PermissionCode | PermissionCode[]
): { hasPermission: boolean; isLoading: boolean } {
  const user = useUser();
  const { data: permissions = [], isLoading } = useGetUserHubPermission(
    hubId || "",
    user?.userId || ""
  );

  if (!user?.userId || !hubId) {
    return { hasPermission: false, isLoading: isLoading };
  }

  // Owner has all permissions
  if (permissions.includes("Owner")) {
    return { hasPermission: true, isLoading };
  }

  const requiredPermissions = Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission];

  const hasAccess = requiredPermissions.some((perm) =>
    permissions.includes(perm)
  );

  return { hasPermission: hasAccess, isLoading };
}

