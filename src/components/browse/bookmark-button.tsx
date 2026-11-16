"use client";

import { useCallback, useSyncExternalStore } from "react";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "hireloop:saved-jobs";
const listeners = new Set<() => void>();

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

/**
 * Saved jobs live in localStorage. A tiny external store keeps every
 * bookmark button in sync (and lets React read the value without a
 * setState-in-effect hydration mismatch).
 */
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notify() {
  listeners.forEach((listener) => listener());
}

function readSavedJobs(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

const getServerSnapshot = () => false;

export function BookmarkButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const getSnapshot = useCallback(
    () => readSavedJobs().includes(jobId),
    [jobId],
  );
  const saved = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const current = readSavedJobs();
    const isSaved = current.includes(jobId);
    const next = isSaved
      ? current.filter((id) => id !== jobId)
      : [...current, jobId];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      toast.error("Could not save this job in your browser.");
      return;
    }

    notify();

    if (isSaved) {
      toast.info(`Removed “${jobTitle}” from saved jobs.`);
    } else {
      toast.success(`Saved “${jobTitle}”.`);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${jobTitle} from saved jobs` : `Save ${jobTitle}`}
      title={saved ? "Saved job — click to remove" : "Save this job"}
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border transition-colors",
        saved
          ? "border-brand/40 bg-brand/15 text-brand-soft"
          : "border-white/8 bg-white/[0.03] text-zinc-500 hover:border-white/20 hover:text-zinc-200",
        focusRing,
      )}
    >
      <BookmarkIcon
        className="size-4"
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.9}
        aria-hidden="true"
      />
    </button>
  );
}
