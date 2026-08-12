import { notFound } from "next/navigation";

import { BookAppointmentClient } from "@/components/booking/book-appointment-client";
import { getDoctor } from "@/lib/api/doctors";
import { requireAuth } from "@/lib/server/require-auth";

type BookAppointmentPageProps = { params: Promise<{ id: string }> };

export default async function BookAppointmentPage({ params }: BookAppointmentPageProps) {
  const { id } = await params;
  const doctorId = Number(id);
  if (!Number.isInteger(doctorId) || doctorId <= 0) notFound();
  await requireAuth(`/doctors/${doctorId}/book`);
  const doctor = await getDoctor(doctorId);
  if (!doctor) notFound();
  return <BookAppointmentClient doctor={doctor} />;
}
