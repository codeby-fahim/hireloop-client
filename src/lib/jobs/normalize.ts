import { toJobIconName } from "@/lib/jobs/icons";
import type {
  JobAccent,
  JobApiRecord,
  JobPost,
  JobStatus,
  LocationType,
  SalaryPeriod,
} from "@/types/jobs";

const asRecord = (value: unknown): JobApiRecord | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JobApiRecord)
    : null;

const asString = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
};

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const defaultAccents: JobAccent[] = [
  { box: "bg-sky-500/10", icon: "text-sky-400" },
  { box: "bg-orange-500/10", icon: "text-orange-400" },
  { box: "bg-cyan-500/10", icon: "text-cyan-400" },
  { box: "bg-violet-500/10", icon: "text-violet-400" },
  { box: "bg-emerald-500/10", icon: "text-emerald-400" },
  { box: "bg-rose-500/10", icon: "text-rose-400" },
];

const resolveAccent = (value: unknown, index: number): JobAccent => {
  const record = asRecord(value);
  const box = asString(record?.box);
  const icon = asString(record?.icon);

  if (box && icon) return { box, icon };

  return defaultAccents[index % defaultAccents.length];
};

const salaryPeriods: Record<string, SalaryPeriod> = {
  hr: "hr",
  hour: "hr",
  hourly: "hr",
  "per hour": "hr",
  day: "day",
  daily: "day",
  "per day": "day",
  mo: "mo",
  month: "mo",
  monthly: "mo",
  "per month": "mo",
  yr: "yr",
  year: "yr",
  yearly: "yr",
  annual: "yr",
  annually: "yr",
  "per year": "yr",
};

const resolvePeriod = (value: string | null): SalaryPeriod =>
  (value ? salaryPeriods[value.toLowerCase()] : undefined) ?? "yr";

const resolveLocationType = (
  record: JobApiRecord,
  location: string,
): LocationType => {
  const explicit = asString(record.locationType)?.toLowerCase();

  if (explicit === "remote" || explicit === "hybrid" || explicit === "onsite") {
    return explicit;
  }

  if (record.remote === true) return "remote";
  if (/hybrid/i.test(location)) return "hybrid";
  if (/remote/i.test(location)) return "remote";

  return "onsite";
};

const resolveStatus = (record: JobApiRecord, deadline: string): JobStatus => {
  const explicit = asString(record.status)?.toLowerCase();

  if (explicit === "active" || explicit === "expired") return explicit;

  if (!deadline) return "active";

  const closedAt = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? `${deadline}T23:59:59Z` : deadline,
  ).getTime();

  if (Number.isNaN(closedAt)) return "active";

  return closedAt < Date.now() ? "expired" : "active";
};

const resolveApplicants = (value: unknown): number => {
  if (Array.isArray(value)) return value.length;

  const parsed = asNumber(value);
  return parsed !== null && parsed > 0 ? Math.trunc(parsed) : 0;
};

/**
 * Converts a raw `GET /jobs` record into the shape the UI renders.
 * Two payload flavours exist today (form-created + seeded demo), and either
 * can be missing optional fields, so every value falls back to a safe default.
 */
export const toJobPost = (raw: unknown, index = 0): JobPost | null => {
  const record = asRecord(raw);
  if (!record) return null;

  const id = asString(record._id) ?? asString(record.id);
  const title = asString(record.title);
  if (!id || !title) return null;

  const salaryRecord = asRecord(record.salary);
  const location = asString(record.location) ?? "Not specified";
  const deadline =
    asString(record.deadline) ?? asString(record.applicationDeadline) ?? "";
  const status = resolveStatus(record, deadline);

  return {
    _id: id,
    title,
    department:
      asString(record.department) ?? asString(record.category) ?? "General",
    company: asString(record.company) ?? "—",
    location,
    locationType: resolveLocationType(record, location),
    employmentType:
      asString(record.employmentType) ?? asString(record.jobType) ?? "—",
    salary: {
      min: asNumber(salaryRecord?.min) ?? asNumber(record.minSalary) ?? 0,
      max: asNumber(salaryRecord?.max) ?? asNumber(record.maxSalary) ?? 0,
      currency: asString(salaryRecord?.currency) ?? "€",
      period: resolvePeriod(
        asString(salaryRecord?.period) ?? asString(record.salaryFrequency),
      ),
    },
    applicants: resolveApplicants(record.applicants),
    status,
    statusNote:
      asString(record.statusNote) ??
      (status === "active" ? "Open for applications" : "Closed"),
    deadline,
    icon: toJobIconName(asString(record.icon)),
    accent: resolveAccent(record.accent, index),
  };
};

export const toJobPosts = (records: JobApiRecord[] | null | undefined): JobPost[] =>
  (records ?? []).flatMap((record, index) => {
    const job = toJobPost(record, index);
    return job ? [job] : [];
  });
