import LayoutDashboardHub from "@/components/LayoutDashboardHub/LayoutDashboardHub";
import { getCurrentUser } from "@/lib/curentUser";
import { hasPermission } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function HubLayout({
    children,
    params,
  }: Readonly<{
    children: React.ReactNode;
    params: { hub_id: string };
  }>) {
    const user = await getCurrentUser();
    
    if (!user) {
      redirect("/auth");
    }
    
    // Check if user has at least VIEW_HUB permission (basic access to hub)
    // Individual pages will have more specific permission checks
    const hasAccess = await hasPermission(user.userId, params.hub_id, "VIEW_HUB");
    
    if (!hasAccess) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">
              You don't have permission to access this hub.
            </p>
          </div>
        </div>
      );
    }
    
    return (
        <LayoutDashboardHub>
          {children}
        </LayoutDashboardHub>
    );
  }