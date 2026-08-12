import { DoctorsPageClient } from "@/components/doctors/doctors-page-client";
import { getDoctors } from "@/lib/api/doctors";

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return <DoctorsPageClient doctors={doctors} />;
}
