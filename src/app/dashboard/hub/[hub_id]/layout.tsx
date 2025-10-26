import LayoutDashboardHub from "@/components/LayoutDashboardHub/LayoutDashboardHub";

export default async function HubLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <LayoutDashboardHub>
          {children}
        </LayoutDashboardHub>
    );
  }