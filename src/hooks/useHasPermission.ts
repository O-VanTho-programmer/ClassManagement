import { useGetUserHubPermission } from "./useGetUserHubPermission";
import { useUser } from "@/context/UserContext";
import { checkPermissions } from "@/lib/permission/checkPermissions";
import { PermissionCode } from "@/lib/permissions";

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

  const hasAccess = checkPermissions(permissions, requiredPermission);

  return { hasPermission: hasAccess, isLoading };
}

