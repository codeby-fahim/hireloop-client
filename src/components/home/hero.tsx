import Image from "next/image";
import Link from "next/link";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trending = [
  { label: "Product Designer", href: "/jobs?q=Product+Designer" },
  { label: "AI Engineering", href: "/jobs?q=AI+Engineering" },
  { label: "Dev-ops Engineer", href: "/jobs?q=Dev-ops+Engineer" },
];

const stats = [
  {
    value: "50K",
    label: "Active Jobs",
    icon: BriefcaseBusinessIcon,
  },
  {
    value: "12K",
    label: "Companies",
    icon: Building2Icon,
  },
  {
    value: "2M",
    label: "Job Seekers",
    icon: UsersIcon,
  },
  {
    value: "97%",
    label: "Satisfaction Rate",
    icon: StarIcon,
  },
];

const fieldClasses =
  "flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 transition-colors focus-within:bg-white/[0.04] focus-within:ring-1 focus-within:ring-white/15 focus-within:ring-inset sm:px-4";
const inputClasses =
  "h-9 w-full min-w-0 bg-transparent text-[15px] text-white outline-none placeholder:text-white/45 sm:text-base";
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010]";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#010103] pt-16 pb-16 sm:pt-24 sm:pb-24 lg:pt-48.5 lg:pb-32">
      <HeroBackground />

      <div className="relative mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20">
        <div className="mx-auto flex max-w-196 flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-linear-to-r from-transparent to-white/60 md:block"
            />
            <p className="flex h-12 items-center gap-2.5 rounded-full border border-white/20 bg-[linear-gradient(180deg,rgba(71,71,71,0.55)_0%,rgba(1,1,2,0.9)_100%)] px-4 py-3 text-[13px] leading-none whitespace-nowrap text-white uppercase shadow-[inset_0_0_6px_6px_rgba(0,0,0,0.1)] sm:gap-3 sm:px-5 sm:text-[15px] lg:gap-4 lg:px-6 lg:text-xl">
              <BriefcaseBusinessIcon
                className="size-5 shrink-0 sm:size-5.5 lg:size-6"
                stroke="url(#badge-icon)"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <svg aria-hidden="true" className="absolute size-0">
                <defs>
                  <linearGradient id="badge-icon" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#fee45a" />
                    <stop offset="1" stopColor="#fea613" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-badge">50,000+ new jobs this month</span>
            </p>
            <span
              aria-hidden="true"
              className="hidden h-px w-16 bg-linear-to-l from-transparent to-white/60 md:block"
            />
          </div>

          <h1 className="mt-8 max-w-175 text-balance font-hero text-[clamp(2.25rem,6.5vw,3.5rem)] leading-[1.1] font-bold tracking-[-0.02em] text-white">
            Find Your Dream Job Today
          </h1>

          <p className="mt-4 max-w-196 text-pretty font-hero text-base leading-[1.6] text-ink/75 sm:text-lg lg:text-xl">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          <form
            action="/jobs"
            role="search"
            className="mt-10 w-full sm:mt-12"
          >
            <div className="flex flex-col gap-1 rounded-2xl border border-white/20 bg-[#101010] p-2 md:flex-row md:items-center md:gap-0">
              <label className={fieldClasses}>
                <span className="sr-only">Job title, skill or company</span>
                <SearchIcon
                  className="size-5 shrink-0 text-white/55"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  placeholder="Job title, skill or company"
                  autoComplete="off"
                  className={inputClasses}
                />
              </label>

              <span
                aria-hidden="true"
                className="mx-3 h-px bg-white/20 md:mx-0 md:h-6 md:w-px"
              />

              <label className={fieldClasses}>
                <span className="sr-only">Location or Remote</span>
                <MapPinIcon
                  className="size-5 shrink-0 text-white/55"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location or Remote"
                  autoComplete="address-level2"
                  className={inputClasses}
                />
              </label>

              <Button
                type="submit"
                aria-label="Search jobs"
                className={cn(
                  "mt-1 h-12 w-full shrink-0 gap-2 rounded-xl bg-brand px-5 text-base font-medium text-white shadow-[inset_0_2px_8px_rgba(255,255,255,0.18)] hover:bg-brand-soft md:mt-0 md:ml-6 md:size-12 md:p-0",
                  focusRing,
                )}
              >
                <SearchIcon
                  className="size-5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="md:hidden">Search Jobs</span>
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <p className="font-hero text-sm leading-[1.3] text-white/65 sm:text-base">
              Trending Position
            </p>
            <ul className="flex flex-wrap justify-center gap-2">
              {trending.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-8.25 items-center rounded-full border border-white/10 bg-[#1a1a1b] px-3 py-1.5 font-hero text-[13px] leading-normal whitespace-nowrap text-white/90 transition-colors hover:border-brand/60 hover:bg-[#242428] hover:text-white sm:text-sm",
                      focusRing,
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mt-50 sm:mt-65 lg:mt-106.5 xl:-mx-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-64.5 left-1/2 w-225 -translate-x-1/2 select-none sm:-top-77 lg:-top-106.5 lg:w-360"
          >
            <Image
              src="/images/hero-globe.png"
              alt=""
              width={1440}
              height={1244}
              sizes="(min-width: 1024px) 1440px, 900px"
              className="h-auto w-full"
            />
          </div>

          <div className="relative z-10">
            <h2 className="mx-auto max-w-150 text-balance text-center font-stats text-[26px] leading-[1.3] font-medium tracking-tight text-white/70 sm:text-[32px] lg:text-[40px]">
              Assisting over 15,000 job seekers find their dream positions.
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-[linear-gradient(45deg,#010103_5%,#2b2b2d_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/20 sm:gap-12 sm:p-5 lg:gap-18 lg:p-6"
                >
                  <stat.icon
                    className="size-6 shrink-0 text-white/90"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <p className="font-stat-value text-[2.5rem] leading-[1.15] font-semibold tracking-[-0.02em] text-white sm:text-5xl lg:text-[56px]">
                      {stat.value}
                    </p>
                    <p className="font-stats text-sm leading-[1.65] text-white/80 sm:text-base lg:text-lg">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-112 left-1/2 h-224 w-[110rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(97,79,251,0.45)_0%,rgba(92,83,254,0.18)_38%,transparent_70%)] blur-[90px]" />

      <div className="absolute top-136 left-1/2 h-208 w-384 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.42)_0%,rgba(92,83,254,0.12)_42%,transparent_72%)] blur-[120px]" />

      <div className="absolute top-24 left-1/2 h-184 w-[100rem] -translate-x-1/2 bg-[url('/images/hero-stars.png')] bg-cover bg-center opacity-25 mix-blend-screen" />

      <div className="absolute top-152 left-1/2 h-176 w-384 -translate-x-1/2 bg-[url('/images/hero-stars.png')] bg-cover bg-center opacity-40 mix-blend-screen" />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-[#010103] via-[#010103]/70 to-transparent" />
    </div>
  );
}
