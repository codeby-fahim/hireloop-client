import {
  BarChart3Icon,
  BriefcaseIcon,
  Code2Icon,
  DatabaseIcon,
  MegaphoneIcon,
  PaletteIcon,
  PenToolIcon,
  ServerIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react";
import { JOB_ICON_NAMES, type JobIconName } from "@/types/jobs";

/**
 * The only place that maps a job's `icon` key to a renderable Lucide
 * component. `JobPost.icon` stays a plain string so job data can cross the
 * server/client boundary without carrying React components.
 */
export const jobIcons = {
  Briefcase: BriefcaseIcon,
  Code2: Code2Icon,
  PenTool: PenToolIcon,
  Server: ServerIcon,
  Megaphone: MegaphoneIcon,
  ShieldCheck: ShieldCheckIcon,
  BarChart3: BarChart3Icon,
  Palette: PaletteIcon,
  Database: DatabaseIcon,
} satisfies Record<JobIconName, LucideIcon>;

const iconNameByKey = new Map(
  JOB_ICON_NAMES.map((name) => [name.toLowerCase(), name] as const),
);

/**
 * `"Code2Icon"`, `"code2"` and `"Code 2"` all resolve to `"Code2"`.
 * Unknown or missing names fall back to the briefcase.
 */
export const toJobIconName = (value: string | null): JobIconName => {
  if (!value) return "Briefcase";

  const key = value
    .replace(/[^a-z0-9]/gi, "")
    .replace(/icon$/i, "")
    .toLowerCase();

  return iconNameByKey.get(key) ?? "Briefcase";
};
