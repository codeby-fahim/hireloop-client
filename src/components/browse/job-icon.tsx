import { jobIcons } from "@/lib/jobs/icons";
import type { JobIconName } from "@/types/jobs";

/** Renders a job's stored icon key through the shared Lucide map. */
export function JobIcon({
  name,
  className,
}: {
  name: JobIconName;
  className?: string;
}) {
  const Icon = jobIcons[name];

  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
