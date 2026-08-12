import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2.3-6 4.2 12 2.2-6H21" />
    </IconBase>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
    </IconBase>
  );
}

export function BadgeCheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 9.7 5.2l-3.2-.4-.5 3.2L3.8 10.3 5 13.3l-1.2 3 2.2 2.3.5 3.2 3.2-.4L12 23l2.3-1.6 3.2.4.5-3.2 2.2-2.3-1.2-3 1.2-3L18 8l-.5-3.2-3.2.4L12 3Z" />
      <path d="m8.5 13 2.2 2.2 4.8-5" />
    </IconBase>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </IconBase>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12 4 4L19 6" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

export function EyeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </IconBase>
  );
}

export function EyeOffIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m3 3 18 18" />
      <path d="M10.6 6.2A10.7 10.7 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.3 3.1" />
      <path d="M6.7 6.7C4 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1 0 2-.2 2.8-.5" />
      <path d="M10.1 10.1a2.7 2.7 0 0 0 3.8 3.8" />
    </IconBase>
  );
}

export function HeartPulseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      <path d="M7 12h2l1.2-3 2.1 6 1.2-3H17" />
    </IconBase>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </IconBase>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconBase>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z" />
    </IconBase>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M20 6v5h-5" />
      <path d="M4 18v-5h5" />
      <path d="M18.5 9A7 7 0 0 0 6.2 6.2L4 8" />
      <path d="M5.5 15A7 7 0 0 0 17.8 17.8L20 16" />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </IconBase>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3-1.2 3.3L7.5 7.5l3.3 1.2L12 12l1.2-3.3 3.3-1.2-3.3-1.2L12 3Z" />
      <path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z" />
      <path d="m19 13-.8 2.2L16 16l2.2.8L19 19l.8-2.2L22 16l-2.2-.8L19 13Z" />
    </IconBase>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
    </IconBase>
  );
}

export function StethoscopeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 2v6a4 4 0 0 0 8 0V2" />
      <path d="M4 2h4M12 2h4" />
      <path d="M10 15a6 6 0 0 0 12 0v-1" />
      <circle cx="19" cy="11" r="2" />
    </IconBase>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </IconBase>
  );
}

export function XIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}


export function CheckCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </IconBase>
  );
}

export function LayoutDashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

export function UserRoundIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </IconBase>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z" />
    </IconBase>
  );
}

export function LanguagesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h7M7.5 3v2c0 4-2 7-5 9" />
      <path d="M4 10c1.5 2 3.5 3.5 6 4" />
      <path d="m14 21 4-10 4 10M15.5 17h5" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </IconBase>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </IconBase>
  );
}
