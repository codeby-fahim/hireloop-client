import { cache, Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  ClockIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  HouseIcon,
  LaptopIcon,
  MapPinIcon,
  PiggyBankIcon,
  PlaneIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react";
import { getJobs } from "@/lib/api/jobs";
import { toJobDetails } from "@/lib/jobs/detail";
import {
  formatDeadline,
  formatSalary,
  LOCATION_TYPE_LABELS,
} from "@/lib/jobs/format";
import { cn } from "@/lib/utils";
import { ApplyButton } from "@/components/browse/apply-button";
import { BookmarkButton } from "@/components/browse/bookmark-button";
import { JobIcon } from "@/components/browse/job-icon";
import type {
  BenefitIconName,
  JobBenefit,
  JobDetails,
} from "@/types/jobs";

type JobDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * The route resolves the job before rendering (so an unknown id returns a real
 * 404 instead of a 200 with not-found content), which is the supported
 * "blocking route" behaviour for Cache Components.
 */
export const instant = false;

type JobLookup = {
  job: JobDetails | null;
  error: string | null;
};

/**
 * The jobs service has no detail endpoint, so resolve the record from the
 * full list. `cache` shares the fetch between `generateMetadata` and the page
 * within a single request.
 */
const findJob = cache(async (id: string): Promise<JobLookup> => {
  const { jobs, error } = await getJobs();
  if (error) return { job: null, error };

  const job =
    jobs
      .flatMap((record, index) => {
        const details = toJobDetails(record, index);
        return details ? [details] : [];
      })
      .find((details) => details._id === id) ?? null;

  return { job, error: null };
});

export async function generateMetadata({
  params,
}: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { job, error } = await findJob(id);

  // Only treat a resolved-as-missing id as a 404 — an API outage must fall
  // through to the page's error state, not claim the job was removed.
  if (!job) {
    if (!error) notFound();

    return { title: "Job Details | HireLoop", robots: { index: false } };
  }

  return {
    title: `${job.title} at ${job.company} | HireLoop`,
    description: job.description.replace(/\s+/g, " ").slice(0, 157),
  };
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

const benefitIcons: Record<BenefitIconName, LucideIcon> = {
  health: HeartPulseIcon,
  retirement: PiggyBankIcon,
  hardware: LaptopIcon,
  pto: PlaneIcon,
  remote: HouseIcon,
  learning: GraduationCapIcon,
};

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#0b0b0e] p-4">
      <dt className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
        <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/5 text-zinc-400">
          <Icon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        {label}
      </dt>
      <dd className="mt-2.5 text-sm leading-snug font-medium wrap-break-word text-white">
        {value}
      </dd>
      {hint ? (
        <dd className="mt-0.5 text-[11px] text-zinc-500">{hint}</dd>
      ) : null}
    </div>
  );
}

function DetailSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-b border-white/6 py-6 first:pt-0 last:border-b-0 last:pb-0"
    >
      <h2
        id={id}
        className="text-lg font-semibold tracking-tight text-white sm:text-xl"
      >
        {title}
      </h2>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li
          key={`${index}-${item.slice(0, 24)}`}
          className="flex gap-3 text-sm leading-6 text-zinc-400"
        >
          <span
            aria-hidden="true"
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-soft"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SnapshotRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-2 text-zinc-500">
        <Icon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
        {label}
      </dt>
      <dd
        className={cn(
          "text-right text-zinc-300",
          tone === "success" && "font-medium text-emerald-400",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function CompanyOverview({ job }: { job: JobDetails }) {
  const initial = job.company.trim().charAt(0).toUpperCase() || "H";

  return (
    <section
      aria-labelledby="company-overview"
      className="rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-5"
    >
      <h2 id="company-overview" className="text-base font-semibold text-white">
        Company Overview
      </h2>

      <div className="relative mt-4 aspect-video overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(150deg,#1d1b2f_0%,#101016_55%,#08080b_100%)] sm:aspect-21/8 lg:aspect-16/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-size-[28px_28px]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-10 -right-8 size-32 rounded-full bg-brand/30 blur-2xl"
        />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/6 text-xl font-semibold text-white backdrop-blur-sm">
            {initial}
          </span>
        </div>
        <span className="absolute inset-x-3 bottom-3 truncate text-[10px] font-semibold tracking-[0.16em] text-white/60 uppercase">
          {job.company}
        </span>
      </div>

      <dl className="mt-4 space-y-3 text-xs">
        <div className="flex items-start justify-between gap-3 border-b border-white/6 pb-3">
          <dt className="text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            Size
          </dt>
          <dd className="text-right text-zinc-300">{job.companySize}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            Industry
          </dt>
          <dd className="text-right text-zinc-300">{job.industry}</dd>
        </div>
      </dl>

      <a
        href={job.website}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-4 inline-flex h-9.5 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/4 text-[13px] font-medium text-zinc-200 transition-colors hover:bg-white/8",
          focusRing,
        )}
      >
        Visit Website
        <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}

function JobSnapshot({ job }: { job: JobDetails }) {
  return (
    <section
      aria-labelledby="job-snapshot"
      className="rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-5"
    >
      <h2 id="job-snapshot" className="text-base font-semibold text-white">
        Job Snapshot
      </h2>

      <dl className="mt-4 space-y-3 text-xs">
        <SnapshotRow
          icon={CalendarClockIcon}
          label="Apply before"
          value={formatDeadline(job.deadline)}
        />
        <SnapshotRow
          icon={UsersIcon}
          label="Applicants"
          value={`${job.applicants} ${job.applicants === 1 ? "candidate" : "candidates"}`}
        />
        <SnapshotRow
          icon={ClockIcon}
          label="Posted"
          value={job.statusNote}
        />
        <SnapshotRow
          icon={CheckCircle2Icon}
          label="Status"
          value={job.status === "active" ? "Open" : "Closed"}
          tone={job.status === "active" ? "success" : undefined}
        />
      </dl>
    </section>
  );
}

function BenefitGrid({ benefits }: { benefits: JobBenefit[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {benefits.map((benefit) => {
        const Icon = benefitIcons[benefit.icon];

        return (
          <li
            key={benefit.label}
            className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/2 px-3.5 py-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/8 bg-white/4 text-brand-soft">
              <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="text-[13px] text-zinc-300">{benefit.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-500/25 bg-red-500/8 px-6 py-14 text-center"
    >
      <p className="text-sm font-semibold text-red-300">
        Could not load this job
      </p>
      <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-red-200/70">
        {message}
      </p>
      <Link
        href="/browse-jobs"
        className={cn(
          "mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-4 text-[13px] font-medium text-zinc-100 transition-colors hover:bg-white/8",
          focusRing,
        )}
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
        Back to Browse Jobs
      </Link>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading job details…</span>

      <div aria-hidden="true" className="animate-pulse space-y-4">
        <div className="h-3 w-44 rounded bg-white/8" />

        <div className="rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="size-16 shrink-0 rounded-2xl bg-white/8" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-56 rounded bg-white/10" />
                <div className="h-3.5 w-40 rounded bg-white/5" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="size-9 rounded-lg bg-white/8" />
              <div className="h-9.5 w-28 rounded-lg bg-white/8" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-xl border border-white/[0.07] bg-[#0b0b0e]"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="h-120 rounded-2xl border border-white/[0.07] bg-[#0b0b0e]" />
          <div className="h-80 rounded-2xl border border-white/[0.07] bg-[#0b0b0e] max-lg:hidden" />
        </div>
      </div>
    </div>
  );
}

async function JobDetailContent({ params }: JobDetailPageProps) {
  const { id } = await params;
  const { job, error } = await findJob(id);

  if (error) return <ErrorState message={error} />;

  if (!job) notFound();

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500"
      >
        <Link
          href="/browse-jobs"
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-sm transition-colors hover:text-zinc-200",
            focusRing,
          )}
        >
          <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
          Browse Jobs
        </Link>
        <ChevronRightIcon
          className="size-3.5 shrink-0 text-zinc-700"
          aria-hidden="true"
        />
        <span className="truncate text-zinc-300" aria-current="page">
          Job Details
        </span>
      </nav>

      {/* Hero */}
      <header className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className={cn(
                "grid size-14 shrink-0 place-items-center rounded-2xl sm:size-16",
                job.accent.box,
              )}
            >
              <JobIcon
                name={job.icon}
                className={cn("size-7 sm:size-8", job.accent.icon)}
              />
            </span>

            <div className="min-w-0">
              <h1 className="text-2xl leading-tight font-semibold tracking-tight text-white sm:text-3xl">
                {job.title}
              </h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-zinc-400">
                <span className="font-medium text-zinc-300">{job.company}</span>
                {job.verified && (
                  <>
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-zinc-600"
                    />
                    <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                      <BadgeCheckIcon
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      Verified Employer
                    </span>
                  </>
                )}
              </p>

              <p className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <MapPinIcon
                    className="size-3.5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon
                    className="size-3.5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {job.applicants}{" "}
                  {job.applicants === 1 ? "applicant" : "applicants"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon
                    className="size-3.5"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  {job.statusNote}
                </span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start">
            <BookmarkButton jobId={job._id} jobTitle={job.title} />
            {job.status === "active" ? (
              <ApplyButton jobId={job._id} jobTitle={job.title} />
            ) : (
              <span className="inline-flex h-9.5 min-w-28 items-center justify-center rounded-lg border border-white/10 bg-white/4 px-4 text-sm font-semibold text-zinc-500">
                Applications Closed
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Quick facts */}
      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={WalletIcon}
          label="Salary Range"
          value={formatSalary(job.salary)}
        />
        <StatCard
          icon={MapPinIcon}
          label="Location"
          value={job.location}
          hint={LOCATION_TYPE_LABELS[job.locationType]}
        />
        <StatCard
          icon={BriefcaseIcon}
          label="Job Type"
          value={job.employmentType === "—" ? "Not specified" : job.employmentType}
        />
        <StatCard
          icon={GraduationCapIcon}
          label="Experience"
          value={job.experience}
        />
      </dl>

      {/* Body */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <article className="rounded-2xl border border-white/[0.07] bg-[#0b0b0e] px-5 py-6 sm:px-7 sm:py-7">
          <DetailSection id="job-description" title="Job Description">
            <div className="space-y-3.5">
              {job.description.split(/\n{2,}/).map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-7 text-zinc-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </DetailSection>

          <DetailSection id="responsibilities" title="Responsibilities">
            <BulletList items={job.responsibilities} />
          </DetailSection>

          <DetailSection id="requirements" title="Requirements">
            <ul className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md border border-white/10 bg-white/4 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-300"
                >
                  {skill}
                </li>
              ))}
            </ul>

            <div className="mt-5">
              <BulletList items={job.qualifications} />
            </div>
          </DetailSection>

          <DetailSection id="benefits" title="Benefits">
            <BenefitGrid benefits={job.benefits} />
          </DetailSection>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <CompanyOverview job={job} />
          <JobSnapshot job={job} />
        </aside>
      </div>
    </>
  );
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const { job, error } = await findJob(id);

  // Resolve before the response starts streaming so an unknown id returns a
  // real 404 status instead of a 200 page with not-found content.
  if (!error && !job) notFound();

  return (
    <main className="flex-1 bg-[#010103] pb-20">
      <div className="mx-auto w-full max-w-360 px-4 pt-10 sm:px-6 sm:pt-14 lg:px-10 xl:px-20">
        <Suspense fallback={<DetailSkeleton />}>
          <JobDetailContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
