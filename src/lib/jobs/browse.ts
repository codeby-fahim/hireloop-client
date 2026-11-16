import { JOB_TYPES, type JobPost, type SalaryPeriod } from "@/types/jobs";

/**
 * URL + filtering helpers for `/browse-jobs`.
 *
 * The same helpers run on the server (to resolve the current page) and in the
 * client filter controls (to build the next URL), so the query string format
 * only exists in one place.
 */

export const BROWSE_PATH = "/browse-jobs";
export const BROWSE_PAGE_SIZE = 4;

export const BROWSE_SORTS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "title", label: "Job Title (A–Z)" },
] as const;

export type BrowseSort = (typeof BROWSE_SORTS)[number]["value"];

export type BrowseState = {
  /** Free-text search across title, company, department and location. */
  query: string;
  /** Location/remote filter (populated by the homepage search form). */
  location: string;
  /** Selected employment types (`Full-time`, `Contract`, ...). */
  types: string[];
  sort: BrowseSort;
  /** 1-based page number. */
  page: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const readParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value.join(",") : (value ?? "");

const isSort = (value: string): value is BrowseSort =>
  BROWSE_SORTS.some((option) => option.value === value);

/** Normalises whatever the URL contains into a predictable state object. */
export const parseBrowseState = (params: RawSearchParams): BrowseState => {
  const requestedTypes = readParam(params.type)
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const sortParam = readParam(params.sort);
  const parsedPage = Number.parseInt(readParam(params.page), 10);

  return {
    query: readParam(params.q).trim().slice(0, 120),
    location: readParam(params.location).trim().slice(0, 120),
    types: JOB_TYPES.filter((type) => requestedTypes.includes(type.toLowerCase())),
    sort: isSort(sortParam) ? sortParam : "recent",
    page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
};

/** Builds a canonical `/browse-jobs` URL; defaults are omitted for clean links. */
export const buildBrowseUrl = (state: Partial<BrowseState> = {}): string => {
  const params = new URLSearchParams();
  const query = state.query?.trim();
  const location = state.location?.trim();

  if (query) params.set("q", query);
  if (location) params.set("location", location);
  if (state.types?.length) params.set("type", state.types.join(","));
  if (state.sort && state.sort !== "recent") params.set("sort", state.sort);
  if (state.page && state.page > 1) params.set("page", String(state.page));

  const search = params.toString();
  return search ? `${BROWSE_PATH}?${search}` : BROWSE_PATH;
};

/** `employmentType` is free text in the API, so compare without casing. */
const matchesType = (job: JobPost, type: string) =>
  job.employmentType.toLowerCase() === type.toLowerCase();

export const filterJobs = (
  jobs: JobPost[],
  { query, location = "", types }: Pick<BrowseState, "query" | "types"> & {
    location?: string;
  },
): JobPost[] => {
  const needle = query.trim().toLowerCase();
  const place = location.trim().toLowerCase();
  const selected = types.map((type) => type.toLowerCase());

  return jobs.filter((job) => {
    if (selected.length > 0 && !selected.some((type) => matchesType(job, type))) {
      return false;
    }

    if (
      place &&
      ![job.location, job.locationType].join(" ").toLowerCase().includes(place)
    ) {
      return false;
    }

    if (!needle) return true;

    return [job.title, job.company, job.department, job.location, job.employmentType]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });
};

/** Number of jobs per employment type, for the filter checkboxes. */
export const countJobTypes = (jobs: JobPost[]): Record<string, number> =>
  Object.fromEntries(
    JOB_TYPES.map((type) => [
      type,
      jobs.filter((job) => matchesType(job, type)).length,
    ]),
  );

const yearlyFactor: Record<SalaryPeriod, number> = {
  hr: 2080,
  day: 260,
  mo: 12,
  yr: 1,
};

/** Normalises mixed salary periods so `Highest Salary` is comparable. */
const yearlySalary = (job: JobPost) =>
  (job.salary.max || job.salary.min) * yearlyFactor[job.salary.period];

/** ObjectIds embed their creation timestamp in the first 4 bytes. */
const createdAt = (job: JobPost) =>
  /^[0-9a-f]{24}$/i.test(job._id) ? Number.parseInt(job._id.slice(0, 8), 16) : 0;

export const sortJobs = (jobs: JobPost[], sort: BrowseSort): JobPost[] => {
  const sorted = [...jobs];

  if (sort === "salary") {
    return sorted.sort(
      (a, b) => yearlySalary(b) - yearlySalary(a) || a.title.localeCompare(b.title),
    );
  }

  if (sort === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Newest first, then alphabetical so the order is stable for demo rows.
  return sorted.sort(
    (a, b) => createdAt(b) - createdAt(a) || a.title.localeCompare(b.title),
  );
};

export type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
};

export const paginate = <T,>(
  items: T[],
  page: number,
  pageSize = BROWSE_PAGE_SIZE,
): Paginated<T> => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = (current - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total: items.length,
    pageSize,
  };
};

export type PageToken = number | "ellipsis";

/** Page numbers with ellipses, e.g. `1 … 4 5 6 … 12`. */
export const getPageTokens = (current: number, totalPages: number): PageToken[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);

  for (let offset = -1; offset <= 1; offset += 1) {
    const page = current + offset;
    if (page > 1 && page < totalPages) pages.add(page);
  }

  if (current <= 3) [2, 3, 4].forEach((page) => pages.add(page));
  if (current >= totalPages - 2) {
    [totalPages - 3, totalPages - 2, totalPages - 1].forEach((page) => pages.add(page));
  }

  const sorted = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  return sorted.flatMap((page, index) => {
    const previous = sorted[index - 1];
    return previous && page - previous > 1 ? ["ellipsis" as const, page] : [page];
  });
};
