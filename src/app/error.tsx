"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="glass-panel max-w-lg rounded-3xl p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-300">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-black">We could not load this page.</h1>
        <p className="mt-4 leading-7 text-slate-400">
          Make sure the Django API is running, then try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 font-bold text-slate-950"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
