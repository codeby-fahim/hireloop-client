"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";
import {
  BROWSE_SORTS,
  buildBrowseUrl,
  type BrowseSort,
  type BrowseState,
} from "@/lib/jobs/browse";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function SortSelect({ state }: { state: BrowseState }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-[13px] text-zinc-400">
      <span className="whitespace-nowrap">Sort by</span>
      <span className="relative">
        <select
          value={state.sort}
          aria-label="Sort jobs by"
          disabled={isPending}
          onChange={(event) => {
            const sort = event.target.value as BrowseSort;
            startTransition(() => {
              router.push(buildBrowseUrl({ ...state, sort, page: 1 }), {
                scroll: false,
              });
            });
          }}
          className={cn(
            "h-9 cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#15151a] pr-8 pl-3 text-[13px] font-medium text-zinc-100 transition-colors hover:border-white/20 disabled:cursor-wait disabled:opacity-60",
            focusRing,
          )}
        >
          {BROWSE_SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-zinc-500"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </label>
  );
}
