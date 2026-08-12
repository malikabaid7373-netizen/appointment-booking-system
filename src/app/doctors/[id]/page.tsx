import { notFound } from "next/navigation";

import { DoctorDetailsClient } from "@/components/doctors/doctor-details-client";
import { getDoctor } from "@/lib/api/doctors";

type DoctorDetailsPageProps = { params: Promise<{ id: string }> };

export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params;
  const doctorId = Number(id);
  if (!Number.isInteger(doctorId) || doctorId <= 0) notFound();
  const doctor = await getDoctor(doctorId);
  if (!doctor) notFound();
  return <DoctorDetailsClient doctor={doctor} />;
}
