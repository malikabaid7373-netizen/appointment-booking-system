import Link from "next/link";

import { HeartPulseIcon } from "@/components/ui/icons";

type BrandProps = {
  href?: string;
  compact?: boolean;
};

export function Brand({ href = "/", compact = false }: BrandProps) {
  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
        <HeartPulseIcon className="h-6 w-6" />
      </span>

      {!compact && (
        <span className="text-xl font-black tracking-tight text-white">
          Clinic<span className="text-cyan-300">Care</span>
        </span>
      )}
    </Link>
  );
}
