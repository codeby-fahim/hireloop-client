import Link from "next/link";
import {
  Code2Icon,
  EllipsisVerticalIcon,
  GlobeIcon,
  MapPinIcon,
  MegaphoneIcon,
  PenToolIcon,
  PencilIcon,
  PlusIcon,
  ServerIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type JobStatus = "active" | "expired";
type LocationType = "remote" | "hybrid" | "onsite";

type Salary = {
  min: number;
  max: number;
  currency: string;
  period: "hr" | "day" | "mo" | "yr";
};

export type JobPost = {
  id: string;
  title: string;
  department: string;
  company: string;
  location: string;
  locationType: LocationType;
  employmentType: string;
  salary: Salary;
  applicants: number;
  status: JobStatus;
  statusNote: string;
  deadline: string;
  icon: LucideIcon;
  accent: { box: string; icon: string };
};

// TODO: replace with the GET /api/jobs response once the endpoint exists.
const dummyJobs: JobPost[] = [
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    company: "HirePulse Network",
    location: "Remote (New York, USA)",
    locationType: "remote",
    employmentType: "Full-time",
    salary: { min: 25, max: 40, currency: "€", period: "hr" },
    applicants: 34,
    status: "active",
    statusNote: "Posted 4d ago",
    deadline: "2025-05-30",
    icon: Code2Icon,
    accent: { box: "bg-sky-500/10", icon: "text-sky-400" },
  },
  {
    id: "senior-product-designer",
    title: "Senior Product Designer",
    department: "Design",
    company: "HirePulse Labs",
    location: "London, UK (Hybrid)",
    locationType: "hybrid",
    employmentType: "Full-time",
    salary: { min: 90000, max: 115000, currency: "€", period: "yr" },
    applicants: 19,
    status: "active",
    statusNote: "Posted 1w ago",
    deadline: "2025-06-14",
    icon: PenToolIcon,
    accent: { box: "bg-orange-500/10", icon: "text-orange-400" },
  },
  {
    id: "devops-specialist",
    title: "DevOps Specialist",
    department: "Infrastructure",
    company: "HirePulse Platform",
    location: "Berlin, Germany",
    locationType: "onsite",
    employmentType: "Full-time",
    salary: { min: 85000, max: 120000, currency: "€", period: "yr" },
    applicants: 12,
    status: "active",
    statusNote: "Posted 2w ago",
    deadline: "2025-06-30",
    icon: ServerIcon,
    accent: { box: "bg-cyan-500/10", icon: "text-cyan-400" },
  },
  {
    id: "product-marketing-lead",
    title: "Product Marketing Lead",
    department: "Marketing",
    company: "HirePulse Network",
    location: "Remote (EU, US)",
    locationType: "remote",
    employmentType: "Full-time",
    salary: { min: 80000, max: 105000, currency: "€", period: "yr" },
    applicants: 27,
    status: "active",
    statusNote: "Posted 3d ago",
    deadline: "2025-07-15",
    icon: MegaphoneIcon,
    accent: { box: "bg-violet-500/10", icon: "text-violet-400" },
  },
  {
    id: "qa-automation-engineer",
    title: "QA Automation Engineer",
    department: "Quality",
    company: "HirePulse Platform",
    location: "Dubai, United Arab (Hybrid)",
    locationType: "hybrid",
    employmentType: "Part-time",
    salary: { min: 35, max: 50, currency: "€", period: "hr" },
    applicants: 8,
    status: "expired",
    statusNote: "Closed",
    deadline: "2025-05-01",
    icon: ShieldCheckIcon,
    accent: { box: "bg-emerald-500/10", icon: "text-emerald-400" },
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]";

function formatSalary({ min, max, currency, period }: Salary) {
  const compact = (value: number) =>
    value >= 1000 ? `${Math.round(value / 1000)}k` : String(value);

  return `${currency}${compact(min)} – ${currency}${compact(max)} / ${period}`;
}

function formatDeadline(deadline: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${deadline}T00:00:00Z`));
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

      <button
        type="button"
        aria-label={`Delete ${job.title}`}
        title="Delete job post"
        className={cn(
          "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/4 text-zinc-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400",
          focusRing,
        )}
      >
        <Trash2Icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
      </button>

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

const ManageJobsPage = () => {
  const jobs = dummyJobs;

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

      {/* Desktop / tablet table */}
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
                      "px-3 py-3 text-[10px] first:pl-5 last:pr-5 font-semibold tracking-[0.12em] whitespace-nowrap text-zinc-500 uppercase",
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
                  key={job.id}
                  className="border-b border-white/5 transition-colors last:border-b-0 hover:bg-white/2"
                >
                  <td className="px-3 py-3 first:pl-5 last:pr-5">
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

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <p className="text-[12px] font-medium text-zinc-100">
                      {job.company}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                      <LocationIcon type={job.locationType} />
                      <span className="truncate">{job.location}</span>
                    </p>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <span className="inline-flex rounded-md border border-white/10 bg-white/3 px-2 py-0.5 text-[10px] whitespace-nowrap text-zinc-300">
                      {job.employmentType}
                    </span>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <span className="text-[12px] whitespace-nowrap text-zinc-100">
                      {formatSalary(job.salary)}
                    </span>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <span className="flex items-center gap-1.5 text-[11px] whitespace-nowrap text-zinc-300">
                      <UsersIcon
                        className="size-3.5 text-zinc-500"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {job.applicants} Candidates
                    </span>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <StatusBadge status={job.status} />
                    <p className="mt-1 text-[10px] text-zinc-500">
                      {job.statusNote}
                    </p>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <p className="text-[12px] whitespace-nowrap text-zinc-100">
                      {formatDeadline(job.deadline)}
                    </p>
                    <p className="mt-0.5 text-[10px] whitespace-nowrap text-zinc-500">
                      Application Deadline
                    </p>
                  </td>

                  <td className="px-3 py-3 first:pl-5 last:pr-5">
                    <JobActions job={job} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / small-screen cards */}
      <div className="@container mt-6 xl:hidden">
        <ul className="grid grid-cols-1 gap-3 @[700px]:grid-cols-2">
          {jobs.map((job) => (
            <li
              key={job.id}
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

      {jobs.length === 0 && (
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
      )}
    </div>
  );
};

export default ManageJobsPage;
