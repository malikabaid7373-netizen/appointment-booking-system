import { HeartPulseIcon } from "@/components/ui/icons";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="text-center">
        <div className="pulse-ring relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 shadow-2xl shadow-cyan-500/25">
          <HeartPulseIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-2xl font-black tracking-tight">
          Clinic<span className="text-cyan-300">Care</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">Preparing your care experience…</p>
      </div>
    </main>
  );
}
