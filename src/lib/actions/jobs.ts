import type { JobFormValues } from "@/app/dashboard/recruiter/jobs/new/page";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type CreateJobResult = {
  ok: boolean;
  data: unknown;
  message?: string;
};

export type DeleteJobResult = {
  acknowledged: boolean;
  deletedCount: number;
};

const readJson = async (res: Response): Promise<unknown> => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const createJob = async (
  data: JobFormValues,
): Promise<CreateJobResult> => {
  try {
    const res = await fetch(`${BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = await readJson(res);

    if (!res.ok) {
      return {
        ok: false,
        data: payload,
        message: `The jobs service responded with ${res.status}.`,
      };
    }

    return { ok: true, data: payload };
  } catch {
    return {
      ok: false,
      data: null,
      message: "Could not reach the jobs service. Check your connection.",
    };
  }
};

export const deleteJob = async (jobId: string): Promise<DeleteJobResult> => {
  if (!jobId) throw new Error("Missing job id.");

  const res = await fetch(`${BASE_URL}/jobs/${encodeURIComponent(jobId)}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      res.status >= 500
        ? "The jobs service could not delete this post. Please try again."
        : `The jobs service responded with ${res.status}.`,
    );
  }

  const payload = (await readJson(res)) as Partial<DeleteJobResult> | null;

  return {
    acknowledged: payload?.acknowledged ?? true,
    deletedCount: typeof payload?.deletedCount === "number" ? payload.deletedCount : 0,
  };
};
