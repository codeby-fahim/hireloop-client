"use client";

import { useCallback, useSyncExternalStore } from "react";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";
import { createJobIdStore } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";

const savedJobs = createJobIdStore("hireloop:saved-jobs");

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

const getServerSnapshot = () => false;

export function BookmarkButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const getSnapshot = useCallback(
    () => savedJobs.read().includes(jobId),
    [jobId],
  );
  const saved = useSyncExternalStore(
    savedJobs.subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = () => {
    const result = savedJobs.toggle(jobId);

    if (!result) {
      toast.error("Could not save this job in your browser.");
      return;
    }

    if (result === "saved") {
      toast.success(`Saved “${jobTitle}”.`);
    } else {
      toast.info(`Removed “${jobTitle}” from saved jobs.`);
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
