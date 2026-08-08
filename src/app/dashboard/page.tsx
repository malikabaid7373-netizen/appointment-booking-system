import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen text-white">
      <SiteHeader />
      <DashboardClient />
      <SiteFooter />
    </main>
  );
}
