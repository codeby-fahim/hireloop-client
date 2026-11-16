import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseIcon,
  CalendarClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FlameIcon,
  GlobeIcon,
  LayersIcon,
  MapPinIcon,
  RotateCcwIcon,
  SearchXIcon,
  UsersIcon,
  WalletIcon,
  ZapIcon,
} from "lucide-react";
import { getJobs } from "@/lib/api/jobs";
import { formatSalary, LOCATION_TYPE_LABELS } from "@/lib/jobs/format";
import {
  BROWSE_PAGE_SIZE,
  buildBrowseUrl,
  countJobTypes,
  filterJobs,
  getPageTokens,
  paginate,
  parseBrowseState,
  sortJobs,
  type BrowseState,
} from "@/lib/jobs/browse";
import { toJobPosts } from "@/lib/jobs/normalize";
import { cn } from "@/lib/utils";
import { ActiveFilters } from "@/components/browse/active-filters";
import { BookmarkButton } from "@/components/browse/bookmark-button";
import { BrowseSearch } from "@/components/browse/browse-search";
import { FiltersPanel } from "@/components/browse/filters-panel";
import { JobIcon } from "@/components/browse/job-icon";
import { SortSelect } from "@/components/browse/sort-select";
import type { JobPost } from "@/types/jobs";

export const metadata: Metadata = {
  title: "Browse Jobs | HireLoop",
  description:
    "Search professional roles by keyword, job type and salary. Find your next opportunity on HireLoop.",
};

type BrowseJobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

function Chip({
  icon: Icon,
  children,
}: {
  icon: typeof WalletIcon;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.035] px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-300">
      <Icon className="size-3.5 text-zinc-500" strokeWidth={1.8} aria-hidden="true" />
      {children}
    </span>
  );
}

function Badge({
  tone,
  icon: Icon,
  children,
}: {
  tone: "easy" | "hot" | "closed";
  icon?: typeof ZapIcon;
  children: ReactNode;
}) {
  const tones = {
    easy: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    hot: "border-orange-500/25 bg-orange-500/10 text-orange-300",
    closed: "border-white/10 bg-white/4 text-zinc-400",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        tones[tone],
      )}
    >
      {Icon ? <Icon className="size-3" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

function JobCard({ job }: { job: JobPost }) {
  const isActive = job.status === "active";
  const isHot = isActive && job.applicants >= 10;

  return (
    <li className="group relative rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-4 transition-colors hover:border-brand/30 hover:bg-[#0d0d13] sm:p-5">
      <div className="flex items-start gap-3.5 sm:gap-4">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12",
            job.accent.box,
          )}
        >
          <JobIcon
            name={job.icon}
            className={cn("size-5 sm:size-6", job.accent.icon)}
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] leading-snug font-semibold text-white sm:text-base">
                <Link
                  href={`/browse-jobs/${job._id}`}
                  className={cn(
                    "rounded-sm transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-soft",
                    focusRing,
                  )}
                >
                  {job.title}
                </Link>
              </h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                <span className="truncate font-medium text-zinc-300">
                  {job.company}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden size-1 shrink-0 rounded-full bg-zinc-600 sm:block"
                />
                <span className="inline-flex min-w-0 items-center gap-1">
                  {job.locationType === "remote" ? (
                    <GlobeIcon
                      className="size-3 shrink-0 text-zinc-500"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  ) : (
                    <MapPinIcon
                      className="size-3 shrink-0 text-zinc-500"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{job.location}</span>
                </span>
              </p>
            </div>

            <span className="relative z-10 shrink-0">
              <BookmarkButton jobId={job._id} jobTitle={job.title} />
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip icon={WalletIcon}>{formatSalary(job.salary)}</Chip>
            <Chip icon={BriefcaseIcon}>{job.employmentType}</Chip>
            <Chip icon={GlobeIcon}>{LOCATION_TYPE_LABELS[job.locationType]}</Chip>
            <Chip icon={LayersIcon}>{job.department}</Chip>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/6 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {isActive ? (
            <Badge tone="easy" icon={ZapIcon}>
              Easy Apply
            </Badge>
          ) : (
            <Badge tone="closed">Closed</Badge>
          )}
          {isHot && (
            <Badge tone="hot" icon={FlameIcon}>
              Hot Job
            </Badge>
          )}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <UsersIcon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
            {job.applicants} {job.applicants === 1 ? "applicant" : "applicants"}
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <CalendarClockIcon
              className="size-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            {job.statusNote}
          </span>
          <ChevronRightIcon
            className="size-3.5 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-soft"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>
      </div>
    </li>
  );
}

function Pagination({
  state,
  page,
  totalPages,
}: {
  state: BrowseState;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const arrows = "grid size-9 place-items-center rounded-lg border text-sm";
  const tokens = getPageTokens(page, totalPages);

  return (
    <nav aria-label="Job results pagination" className="flex items-center gap-1.5">
      {page > 1 ? (
        <Link
          href={buildBrowseUrl({ ...state, page: page - 1 })}
          aria-label="Previous page"
          className={cn(
            arrows,
            "border-white/10 bg-white/3 text-zinc-300 transition-colors hover:border-brand/40 hover:text-white",
            focusRing,
          )}
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(arrows, "border-white/5 bg-white/2 text-zinc-700")}
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" />
        </span>
      )}

      {tokens.map((token, index) =>
        token === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="grid size-9 place-items-center text-sm text-zinc-600"
          >
            …
          </span>
        ) : (
          <Link
            key={token}
            href={buildBrowseUrl({ ...state, page: token })}
            aria-current={token === page ? "page" : undefined}
            aria-label={`Page ${token}`}
            className={cn(
              arrows,
              token === page
                ? "border-brand bg-brand font-semibold text-white"
                : "border-white/10 bg-white/3 text-zinc-300 transition-colors hover:border-brand/40 hover:text-white",
              focusRing,
            )}
          >
            {token}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={buildBrowseUrl({ ...state, page: page + 1 })}
          aria-label="Next page"
          className={cn(
            arrows,
            "border-white/10 bg-white/3 text-zinc-300 transition-colors hover:border-brand/40 hover:text-white",
            focusRing,
          )}
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={cn(arrows, "border-white/5 bg-white/2 text-zinc-700")}
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

function NoResults({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/2 px-6 py-16 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-white/8 bg-white/4">
        <SearchXIcon className="size-5 text-zinc-400" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-semibold text-white">
        {hasFilters ? "No jobs match your filters" : "No open roles right now"}
      </p>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500">
        {hasFilters
          ? "Try a different keyword, widen the job type filter, or clear everything and start again."
          : "New opportunities are added regularly — check back soon or explore the dashboard."}
      </p>
      {hasFilters ? (
        <Link
          href={buildBrowseUrl()}
          className={cn(
            "mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 text-[13px] font-medium text-zinc-100 transition-colors hover:bg-white/8",
            focusRing,
          )}
        >
          <RotateCcwIcon className="size-3.5" aria-hidden="true" />
          Clear all filters
        </Link>
      ) : null}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-8 rounded-2xl border border-red-500/25 bg-red-500/8 px-6 py-12 text-center"
    >
      <p className="text-sm font-semibold text-red-300">
        Could not load the job board
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-red-200/70">
        {message}
      </p>
      <Link
        href={buildBrowseUrl()}
        className={cn(
          "mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 text-[13px] font-medium text-zinc-100 transition-colors hover:bg-white/8",
          focusRing,
        )}
      >
        <RotateCcwIcon className="size-3.5" aria-hidden="true" />
        Try again
      </Link>
    </div>
  );
}

function BrowseSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading jobs…</span>

      <div
        aria-hidden="true"
        className="mt-8 animate-pulse space-y-4"
      >
        <div className="h-18 rounded-2xl border border-white/[0.07] bg-[#0b0b0e]" />

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          <div className="h-72 rounded-2xl border border-white/[0.07] bg-[#0b0b0e] max-lg:hidden" />

          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 w-48 rounded bg-white/8" />
              <div className="h-9 w-32 rounded-lg bg-white/8" />
            </div>

            <div className="mt-5 space-y-4">
              {Array.from({ length: BROWSE_PAGE_SIZE }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-5"
                >
                  <div className="flex gap-4">
                    <div className="size-12 shrink-0 rounded-xl bg-white/8" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-2/5 rounded bg-white/10" />
                      <div className="h-3 w-3/5 rounded bg-white/5" />
                      <div className="flex gap-2 pt-1">
                        <div className="h-6 w-28 rounded-md bg-white/5" />
                        <div className="h-6 w-20 rounded-md bg-white/5" />
                        <div className="hidden h-6 w-24 rounded-md bg-white/5 sm:block" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function BrowseContent({ searchParams }: BrowseJobsPageProps) {
  const [params, { jobs: records, error }] = await Promise.all([
    searchParams,
    getJobs(),
  ]);

  if (error) return <ErrorState message={error} />;

  const state = parseBrowseState(params);
  const jobs = toJobPosts(records);

  // Counts ignore the type filter so every checkbox keeps its own total while
  // the query narrows the list.
  const counts = countJobTypes(
    filterJobs(jobs, {
      query: state.query,
      location: state.location,
      types: [],
    }),
  );
  const filtered = filterJobs(jobs, state);
  const sorted = sortJobs(filtered, state.sort);
  const { items, page, totalPages, total } = paginate(sorted, state.page);

  const hasFilters =
    state.query.length > 0 ||
    state.location.length > 0 ||
    state.types.length > 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * BROWSE_PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * BROWSE_PAGE_SIZE, total);

  return (
    <>
      <div className="mt-8">
        <BrowseSearch key={state.query} state={state} />
        <ActiveFilters state={state} />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
        <FiltersPanel state={state} counts={counts} total={jobs.length} />

        <section aria-label="Job results" className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[15px] text-zinc-400">
              Found{" "}
              <span className="font-semibold text-white">{total}</span>{" "}
              Professional {total === 1 ? "Job" : "Jobs"}
            </h2>
            <SortSelect state={state} />
          </div>

          {items.length === 0 ? (
            <NoResults hasFilters={hasFilters} />
          ) : (
            <>
              <ul className="mt-5 space-y-4">
                {items.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-4 border-t border-white/6 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-zinc-500">
                  Showing{" "}
                  <span className="font-medium text-zinc-300">
                    {rangeStart}–{rangeEnd}
                  </span>{" "}
                  of <span className="font-medium text-zinc-300">{total}</span>{" "}
                  {total === 1 ? "job" : "jobs"}
                </p>
                <Pagination state={state} page={page} totalPages={totalPages} />
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default function BrowseJobsPage({ searchParams }: BrowseJobsPageProps) {
  return (
    <main className="flex-1 bg-[#010103] pb-20">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20">
        <header className="pt-10 sm:pt-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-brand-soft uppercase">
            Discover opportunities
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Browse Jobs
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Explore hand-picked roles from teams that are hiring right now. Search
            by keyword, narrow down by job type, and save the ones you love.
          </p>
        </header>

        <Suspense fallback={<BrowseSkeleton />}>
          <BrowseContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
