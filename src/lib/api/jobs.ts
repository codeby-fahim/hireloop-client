import { connection } from "next/server";

export type JobApiRecord = Record<string, unknown>;

export type JobsResult = {
  jobs: JobApiRecord[];
  error: string | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const isRecord = (value: unknown): value is JobApiRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The jobs service has returned a bare array so far, but accept the common
 * envelope shapes too so a backend change does not blank the page.
 */
const toRecords = (payload: unknown): JobApiRecord[] => {
  if (Array.isArray(payload)) return payload.filter(isRecord);

  if (isRecord(payload)) {
    for (const key of ["jobs", "data", "results", "items"]) {
      const value = payload[key];
      if (Array.isArray(value)) return value.filter(isRecord);
    }
  }

  return [];
};

export const getJobs = async (): Promise<JobsResult> => {
  // Jobs must be fresh per request. Deferring to request time keeps the fetch
  // out of the prerendered shell (the caller streams it behind <Suspense>).
  await connection();

  try {
    const res = await fetch(`${BASE_URL}/jobs`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return {
        jobs: [],
        error: `The jobs service responded with ${res.status} ${res.statusText}.`,
      };
    }

    const payload: unknown = await res.json();
    return { jobs: toRecords(payload), error: null };
  } catch (cause) {
    console.error("[jobs] Failed to load jobs:", cause);
    return {
      jobs: [],
      error:
        "Could not reach the jobs service. Make sure the API is running and try again.",
    };
  }
};
