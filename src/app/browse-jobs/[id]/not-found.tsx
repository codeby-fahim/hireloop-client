import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, SearchXIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Job Not Found | HireLoop",
  description:
    "This job listing could not be found. It may have been filled or removed.",
};

export default function JobNotFound() {
  return (
    <main className="flex-1 bg-[#010103] pb-20">
      <div className="mx-auto flex w-full max-w-360 flex-col items-center px-4 pt-20 text-center sm:px-6 sm:pt-28 lg:px-10 xl:px-20">
        <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400">
          <SearchXIcon className="size-6" strokeWidth={1.7} aria-hidden="true" />
        </span>

        <p className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
          404 — Job not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          This role is no longer available
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          The job you are looking for may have been filled, closed, or removed by
          the employer. Browse the latest openings to find your next opportunity.
        </p>

        <Link
          href="/browse-jobs"
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-lg border border-white bg-white px-5 text-sm font-semibold text-[#0b0b0e] transition-colors hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#010103] focus-visible:outline-none"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to Browse Jobs
        </Link>
      </div>
    </main>
  );
}
