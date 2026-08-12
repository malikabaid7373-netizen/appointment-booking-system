import { requireAuth } from "@/lib/server/require-auth";

export default async function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  await requireAuth("/appointments");
  return children;
}
