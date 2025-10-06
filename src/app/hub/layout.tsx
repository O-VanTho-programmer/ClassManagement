import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";

export default async function HubLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <LayoutDashboard>
          {children}
        </LayoutDashboard>
    );
  }