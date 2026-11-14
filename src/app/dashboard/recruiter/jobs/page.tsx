import { Suspense } from "react";
import Link from "next/link";
import {
  EllipsisVerticalIcon,
  GlobeIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getJobs } from "@/lib/api/jobs";
import {
  toJobPosts,
  type JobPost,
  type JobStatus,
  type LocationType,
  type Salary,
} from "@/lib/jobs/normalize";
import { DeleteJobsDialog } from "@/app/components/DeleteJobsDialog";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]";

const tableCell = "px-3 py-3 first:pl-5 last:pr-5";

function formatSalary({ min, max, currency, period }: Salary) {
  const compact = (value: number) =>
    value >= 1000 ? `${Math.round(value / 1000)}k` : String(value);

  if (!min && !max) return "Not disclosed";
  if (!min) return `Up to ${currency}${compact(max)} / ${period}`;
  if (!max) return `From ${currency}${compact(min)} / ${period}`;
  if (min === max) return `${currency}${compact(min)} / ${period}`;

  return `${currency}${compact(min)} – ${currency}${compact(max)} / ${period}`;
}

function formatDeadline(deadline: string) {
  if (!deadline) return "—";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? `${deadline}T00:00:00Z` : deadline,
  );

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function LocationIcon({ type }: { type: LocationType }) {
  const Icon = type === "remote" ? GlobeIcon : MapPinIcon;

  return (
    <Icon
      className="size-3 shrink-0 text-zinc-500"
      strokeWidth={1.75}
      aria-hidden="true"
    />
  );
}

function StatusBadge({ status }: { status: JobStatus }) {
  const active = status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        active
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
          : "border-white/10 bg-white/4 text-zinc-400",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-400" : "bg-zinc-500",
        )}
      />
      {active ? "Active" : "Expired"}
    </span>
  );
}

function JobActions({ job, className }: { job: JobPost; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-1.5", className)}>
      <button
        type="button"
        aria-label={`Update ${job.title}`}
        className={cn(
          "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-brand/10 px-2.5 text-[11px] font-medium text-zinc-100 transition-colors hover:border-brand/40 hover:bg-brand/20 hover:text-white",
          focusRing,
        )}
      >
        <PencilIcon
          className="size-3 text-brand-soft"
          strokeWidth={1.9}
          aria-hidden="true"
        />
        Update
      </button>

      <DeleteJobsDialog jobId={job._id} jobTitle={job.title} />

      <button
        type="button"
        aria-label={`More actions for ${job.title}`}
        className={cn(
          "inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/6 hover:text-zinc-200",
          focusRing,
        )}
      >
        <EllipsisVerticalIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function JobsTable({ jobs }: { jobs: JobPost[] }) {
  return (
    <div className="mt-6 hidden overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0b0e] xl:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-235 border-collapse text-left">
          <caption className="sr-only">
            Job posts, their applicants, status and deadlines
          </caption>
          <thead>
            <tr className="border-b border-white/6 bg-white/2">
              {[
                "Job title & dept",
                "Company & location",
                "Type",
                "Compensation",
                "Applicants",
                "Status",
                "Deadline",
                "Actions",
              ].map((label, index) => (
                <th
                  key={label}
                  scope="col"
                  className={cn(
                    "px-3 py-3 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase first:pl-5 last:pr-5",
                    index === 7 && "text-right",
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id}
                className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/2"
              >
                <td className={tableCell}>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        job.accent.box,
                      )}
                    >
                      <job.icon
                        className={cn("size-3.5", job.accent.icon)}
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-white">
                        {job.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-zinc-500">
                        {job.department}
                      </p>
                    </div>
                  </div>
                </td>

                <td className={tableCell}>
                  <p className="text-[12px] font-medium text-zinc-100">
                    {job.company}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                    <LocationIcon type={job.locationType} />
                    <span className="truncate">{job.location}</span>
                  </p>
                </td>

                <td className={tableCell}>
                  <span className="inline-flex rounded-md border border-white/10 bg-white/3 px-2 py-0.5 text-[10px] whitespace-nowrap text-zinc-300">
                    {job.employmentType}
                  </span>
                </td>

                <td className={tableCell}>
                  <span className="text-[12px] whitespace-nowrap text-zinc-100">
                    {formatSalary(job.salary)}
                  </span>
                </td>

                <td className={tableCell}>
                  <span className="flex items-center gap-1.5 text-[11px] whitespace-nowrap text-zinc-300">
                    <UsersIcon
                      className="size-3.5 text-zinc-500"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {job.applicants} Candidates
                  </span>
                </td>

                <td className={tableCell}>
                  <StatusBadge status={job.status} />
                  <p className="mt-1 text-[10px] text-zinc-500">
                    {job.statusNote}
                  </p>
                </td>

                <td className={tableCell}>
                  <p className="text-[12px] whitespace-nowrap text-zinc-100">
                    {formatDeadline(job.deadline)}
                  </p>
                  <p className="mt-0.5 text-[10px] whitespace-nowrap text-zinc-500">
                    Application Deadline
                  </p>
                </td>

                <td className={tableCell}>
                  <JobActions job={job} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function JobsCards({ jobs }: { jobs: JobPost[] }) {
  return (
    <div className="@container mt-6 xl:hidden">
      <ul className="grid grid-cols-1 gap-3 @[700px]:grid-cols-2">
        {jobs.map((job) => (
          <li
            key={job._id}
            className="@container rounded-xl border border-white/[0.07] bg-[#0b0b0e] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    job.accent.box,
                  )}
                >
                  <job.icon
                    className={cn("size-4", job.accent.icon)}
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {job.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {job.department}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <StatusBadge status={job.status} />
                <p className="mt-1 text-[10px] text-zinc-500">
                  {job.statusNote}
                </p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/6 pt-4 @[380px]:grid-cols-3">
              <div className="min-w-0">
                <dt className="text-[9px] font-semibold tracking-[0.12em] text-zinc-600 uppercase">
                  Company
                </dt>
                <dd className="mt-1 truncate text-[12px] text-zinc-200">
                  {job.company}
                </dd>
                <dd className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                  <LocationIcon type={job.locationType} />
                  <span className="truncate">{job.location}</span>
                </dd>
              </div>

              <div>
                <dt className="text-[9px] font-semibold tracking-[0.12em] text-zinc-600 uppercase">
                  Type
                </dt>
                <dd className="mt-1 text-[12px] text-zinc-200">
                  {job.employmentType}
                </dd>
              </div>

              <div>
                <dt className="text-[9px] font-semibold tracking-[0.12em] text-zinc-600 uppercase">
                  Compensation
                </dt>
                <dd className="mt-1 text-[12px] text-zinc-200">
                  {formatSalary(job.salary)}
                </dd>
              </div>

              <div>
                <dt className="text-[9px] font-semibold tracking-[0.12em] text-zinc-600 uppercase">
                  Applicants
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-200">
                  <UsersIcon
                    className="size-3.5 text-zinc-500"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  {job.applicants} Candidates
                </dd>
              </div>

              <div>
                <dt className="text-[9px] font-semibold tracking-[0.12em] text-zinc-600 uppercase">
                  Deadline
                </dt>
                <dd className="mt-1 text-[12px] text-zinc-200">
                  {formatDeadline(job.deadline)}
                </dd>
              </div>
            </dl>

            <JobActions
              job={job}
              className="mt-4 border-t border-white/6 pt-3 [&>button:first-child]:flex-1"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function JobsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 animate-pulse overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0b0e]"
    >
      <div className="border-b border-white/6 bg-white/2 px-5 py-3">
        <div className="h-2.5 w-32 rounded bg-white/10" />
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 border-b border-white/5 px-5 py-4 last:border-b-0"
        >
          <div className="size-8 shrink-0 rounded-lg bg-white/10" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-2.5 w-40 rounded bg-white/10" />
            <div className="h-2 w-24 rounded bg-white/5" />
          </div>
          <div className="hidden h-2.5 w-24 rounded bg-white/5 sm:block" />
          <div className="hidden h-5 w-16 rounded-full bg-white/5 md:block" />
          <div className="h-7 w-20 rounded-md bg-white/5" />
        </div>
      ))}
    </div>
  );
}

async function JobsContent() {
  const { jobs: records, error } = await getJobs();
  const jobs = toJobPosts(records);

  if (error) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-xl border border-red-500/25 bg-red-500/8 px-5 py-8 text-center"
      >
        <p className="text-sm font-medium text-red-300">
          Could not load job posts
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-red-200/70">
          {error}
        </p>
        <Link
          href="/dashboard/recruiter/jobs"
          className={cn(
            "mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3.5 text-[13px] font-medium text-zinc-100 transition-colors hover:bg-white/8",
            focusRing,
          )}
        >
          Try again
        </Link>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/2 px-6 py-16 text-center">
        <p className="text-sm font-medium text-white">No job posts yet</p>
        <p className="mt-1 text-xs text-zinc-500">
          Publish your first listing to start receiving applicants.
        </p>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            "mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-brand/90",
            focusRing,
          )}
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          New Job Post
        </Link>
      </div>
    );
  }

  return (
    <>
      <JobsTable jobs={jobs} />
      <JobsCards jobs={jobs} />
    </>
  );
}

const ManageJobsPage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] text-zinc-500"
          >
            <Link
              href="/dashboard/recruiter/jobs"
              className={cn(
                "rounded-sm transition-colors hover:text-zinc-300",
                focusRing,
              )}
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true" className="text-zinc-700">
              ›
            </span>
            <span className="text-zinc-400">Job Listings &amp; Postings</span>
          </nav>

          <h1 className="mt-2 text-[24px] leading-tight font-semibold tracking-tight text-white sm:text-[28px]">
            Manage Job Posts
          </h1>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            "group inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-linear-to-r from-brand to-[#8b5cf6] px-4 text-[13px] font-medium text-white shadow-[0_10px_28px_-10px_rgba(109,75,255,0.95)] transition-all duration-200 hover:brightness-110",
            focusRing,
          )}
        >
          <PlusIcon className="size-4" strokeWidth={2.25} aria-hidden="true" />
          New Job Post
        </Link>
      </div>

      <Suspense fallback={<JobsSkeleton />}>
        <JobsContent />
      </Suspense>
    </div>
  );
};

export default ManageJobsPage;
