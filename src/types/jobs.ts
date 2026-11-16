/**
 * Shared job domain types.
 *
 * Everything that crosses a boundary (route page, server action, API helper)
 * imports its types from here so the payload shape is defined once.
 * Import with `import type { ... }` unless you need the option arrays.
 */

/* -------------------------------------------------------------------------- */
/* Form options                                                               */
/* -------------------------------------------------------------------------- */

/** Employment types offered in the job form. */
export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

/** Categories offered in the job form. */
export const JOB_CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Operations",
  "Finance",
  "People & HR",
  "Other",
] as const;
export type JobCategory = (typeof JOB_CATEGORIES)[number];

/** How the salary figure in the form should be read. */
export const SALARY_FREQUENCIES = [
  "per hour",
  "per day",
  "per month",
  "per year",
] as const;
export type SalaryFrequency = (typeof SALARY_FREQUENCIES)[number];

/* -------------------------------------------------------------------------- */
/* Salary & view model                                                        */
/* -------------------------------------------------------------------------- */

/** Short suffix used in the table, e.g. `€25 – €40 / hr`. */
export type SalaryPeriod = "hr" | "day" | "mo" | "yr";

export type Salary = {
  min: number;
  max: number;
  currency: string;
  period: SalaryPeriod;
};

export type JobStatus = "active" | "expired";
export type LocationType = "remote" | "hybrid" | "onsite";

/** Icon keys resolved to Lucide components via `jobIcons` (`@/lib/jobs/icons`). */
export const JOB_ICON_NAMES = [
  "Briefcase",
  "Code2",
  "PenTool",
  "Server",
  "Megaphone",
  "ShieldCheck",
  "BarChart3",
  "Palette",
  "Database",
] as const;
export type JobIconName = (typeof JOB_ICON_NAMES)[number];

/** Tailwind classes for the tinted icon tile. */
export type JobAccent = { box: string; icon: string };

/**
 * Normalised job used by the recruiter dashboard. Plain, serialisable data —
 * resolved icon components are looked up in the view, not stored here.
 */
export type JobPost = {
  _id: string;
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
  icon: JobIconName;
  accent: JobAccent;
};

/* -------------------------------------------------------------------------- */
/* Job detail                                                                 */
/* -------------------------------------------------------------------------- */

export const BENEFIT_ICONS = [
  "health",
  "retirement",
  "hardware",
  "pto",
  "remote",
  "learning",
] as const;
export type BenefitIconName = (typeof BENEFIT_ICONS)[number];

export type JobBenefit = {
  label: string;
  icon: BenefitIconName;
};

/** Normalised job plus the extra content the public detail page renders. */
export type JobDetails = JobPost & {
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  benefits: JobBenefit[];
  experience: string;
  companySize: string;
  industry: string;
  website: string;
  verified: boolean;
};

/* -------------------------------------------------------------------------- */
/* API contracts                                                              */
/* -------------------------------------------------------------------------- */

/** A raw record from `GET /jobs`; the API mixes several document shapes. */
export type JobApiRecord = Record<string, unknown>;

export type JobsResult = {
  jobs: JobApiRecord[];
  error: string | null;
};

export type CreateJobResult = {
  ok: boolean;
  data: unknown;
  message?: string;
};

export type DeleteJobResult = {
  acknowledged: boolean;
  deletedCount: number;
};

/* -------------------------------------------------------------------------- */
/* Create form                                                                */
/* -------------------------------------------------------------------------- */

export type JobFormValues = {
  title: string;
  company: string;
  category: JobCategory;
  jobType: JobType;
  remote: boolean;
  location: string;
  applicationDeadline: string;
  minSalary: number;
  maxSalary: number;
  salaryFrequency: SalaryFrequency;
  responsibilities: string;
  qualifications: string;
};
