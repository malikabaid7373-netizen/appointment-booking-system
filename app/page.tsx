const features = [
  {
    title: "Find a Doctor",
    description: "Browse available doctors and choose the right specialist.",
  },
  {
    title: "Book an Appointment",
    description: "Select a suitable date and time without calling the clinic.",
  },
  {
    title: "Manage Bookings",
    description: "View, track, and cancel your appointments from one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-[75vh] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="mb-5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
          Clinic Appointment System
        </span>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          Book your clinic appointment
          <span className="text-emerald-400"> quickly and easily</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Find doctors, choose an available time, and manage your appointments
          through one simple bilingual platform.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Book an Appointment
          </button>

          <button
            type="button"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:border-slate-500 hover:bg-slate-900"
          >
            Admin Login
          </button>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-3 text-slate-400">
              Book your appointment in three simple steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 font-bold text-slate-950">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}