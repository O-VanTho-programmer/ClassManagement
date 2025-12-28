import { getCurrentUser } from "@/lib/curentUser";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { redirect } from "next/navigation";

interface PermissionGuardProps {
  children: React.ReactNode;
  hubId: string;
  requiredPermission: string | string[];
  fallback?: React.ReactNode;
}

/**
 * Server component that checks if user has required permission before rendering children
 */
export default async function PermissionGuard({
  children,
  hubId,
  requiredPermission,
  fallback
}: PermissionGuardProps) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/auth");
  }
  
  const hasAccess = await hasPermission(user.userId, hubId, requiredPermission as any);
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required permission: {Array.isArray(requiredPermission) ? requiredPermission.join(", ") : requiredPermission}
          </p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

