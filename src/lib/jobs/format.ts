import type { Salary } from "@/types/jobs";

const periodLabels: Record<Salary["period"], string> = {
  hr: "hr",
  day: "day",
  mo: "mo",
  yr: "yr",
};

const compact = (value: number) =>
  value >= 1000 ? `${Math.round(value / 1000)}k` : String(value);

/** `€85k – €120k / yr`, `Up to €35k / mo`, or `Not disclosed`. */
export function formatSalary({ min, max, currency, period }: Salary) {
  const suffix = periodLabels[period] ?? "yr";

  if (!min && !max) return "Not disclosed";
  if (!min) return `Up to ${currency}${compact(max)} / ${suffix}`;
  if (!max) return `From ${currency}${compact(min)} / ${suffix}`;
  if (min === max) return `${currency}${compact(min)} / ${suffix}`;

  return `${currency}${compact(min)} – ${currency}${compact(max)} / ${suffix}`;
}

/** `Jun 30, 2025`, or an em dash for missing/invalid dates. */
export function formatDeadline(deadline: string) {
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
