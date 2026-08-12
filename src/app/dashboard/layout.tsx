import { requireAuth } from "@/lib/server/require-auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("/dashboard");
  return children;
}
