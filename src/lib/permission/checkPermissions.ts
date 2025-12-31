import { PermissionCode } from "../permissions";

/**
 * @param permissions - Array of permission codes the user has
 * @param requiredPermission - Single permission or array of permissions (user needs at least one)
 * @returns true if user has at least one of the required permissions or is Owner
 */
export function checkPermissions(
    permissions: string[],
    requiredPermission: PermissionCode | PermissionCode[]
): boolean {
    // Owner has all permissions
    if (permissions.includes("Owner")) {
        return true;
    }

    const requiredPermissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

    return requiredPermissions.some(perm => permissions.includes(perm));
}