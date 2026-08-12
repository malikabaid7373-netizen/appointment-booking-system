import { HomeClient } from "@/components/home-client";
import { getDoctors } from "@/lib/api/doctors";

export default async function HomePage() {
  const doctors = await getDoctors();
  return <HomeClient doctors={doctors} />;
}
