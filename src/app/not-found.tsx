import Link from "next/link";

import { Brand } from "@/components/layout/brand";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <div className="max-w-lg text-center">
        <Brand />
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
          404 · Page not found
        </p>
        <h1 className="mt-4 text-4xl font-black">This page is not available.</h1>
        <p className="mt-4 leading-7 text-slate-400">
          The link may be outdated, or the page may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-3 font-bold text-slate-950"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
