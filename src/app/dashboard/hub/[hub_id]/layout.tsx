import LayoutDashboardHub from "@/components/LayoutDashboardHub/LayoutDashboardHub";
import { getCurrentUser } from "@/lib/curentUser";
import { redirect } from "next/navigation";

export default async function HubLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const user = await getCurrentUser();
    
    if (!user) {
      redirect("/auth");
    }
    
    return (
        <LayoutDashboardHub>
          {children}
        </LayoutDashboardHub>
    );
  }