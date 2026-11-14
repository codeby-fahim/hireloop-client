"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { deleteJob } from "@/lib/actions/jobs";

const triggerStyles =
  "inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/4 text-zinc-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a] disabled:pointer-events-none disabled:opacity-60";

type DeleteJobsDialogProps = {
  jobId: string;
  jobTitle: string;
  className?: string;
};

export function DeleteJobsDialog({
  jobId,
  jobTitle,
  className,
}: DeleteJobsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    setOpen(next);
  };

  const handleDelete = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      const { deletedCount } = await deleteJob(jobId);

      if (deletedCount < 1) {
        toast.warning("Job post was not found", {
          description: "It may have already been deleted. Refreshing the list.",
        });
      } else {
        toast.success("Job post deleted", {
          description: `“${jobTitle}” has been removed permanently.`,
        });
      }

      setOpen(false);
      router.refresh();
    } catch (cause) {
      toast.error("Could not delete job post", {
        description:
          cause instanceof Error && cause.message
            ? cause.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        aria-label={`Delete ${jobTitle}`}
        title="Delete job post"
        disabled={isPending}
        className={cn(triggerStyles, className)}
      >
        <Trash2Icon className="size-4" strokeWidth={1.6} aria-hidden="true" />
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this job post?</AlertDialogTitle>
          <AlertDialogDescription>
            “{jobTitle}” will be permanently removed, along with its listing
            details. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            aria-busy={isPending}
            onClick={() => void handleDelete()}
          >
            {isPending ? (
              <>
                <LoaderCircleIcon className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2Icon className="size-4" />
                Delete
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
