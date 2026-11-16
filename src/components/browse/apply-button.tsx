"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, LoaderCircleIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { createJobIdStore } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";

const appliedJobs = createJobIdStore("hireloop:applied-jobs");
const getServerSnapshot = () => false;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

export function ApplyButton({
  jobId,
  jobTitle,
}: {
  jobId: string;
  jobTitle: string;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const getSnapshot = useCallback(
    () => appliedJobs.read().includes(jobId),
    [jobId],
  );
  const applied = useSyncExternalStore(
    appliedJobs.subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const apply = () => {
    if (applied) return;

    if (!session?.user) {
      toast.info("Sign in to apply for this role.");
      router.push("/sign-in");
      return;
    }

    if (!appliedJobs.add(jobId)) {
      toast.error("Could not record this application. Please try again.");
      return;
    }

    toast.success(`Application sent for “${jobTitle}”.`);
  };

  return (
    <button
      type="button"
      onClick={apply}
      disabled={applied || isPending}
      className={cn(
        "inline-flex h-9.5 min-w-28 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors disabled:cursor-default",
        applied
          ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-300"
          : "border-white bg-white text-[#0b0b0e] hover:bg-zinc-200",
        focusRing,
      )}
    >
      {applied ? (
        <CheckIcon className="size-4" strokeWidth={2.5} aria-hidden="true" />
      ) : isPending ? (
        <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <SendIcon className="size-4" aria-hidden="true" />
      )}
      {applied ? "Applied" : "Apply Now"}
    </button>
  );
}
