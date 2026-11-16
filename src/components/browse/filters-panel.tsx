"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { JOB_TYPES } from "@/types/jobs";
import { buildBrowseUrl, type BrowseState } from "@/lib/jobs/browse";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

const PANEL_ID = "job-type-filters";

type FiltersPanelProps = {
  state: BrowseState;
  counts: Record<string, number>;
  /** Number of jobs before any filter is applied. */
  total: number;
};

export function FiltersPanel({ state, counts, total }: FiltersPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedCount = state.types.length;
  const active = selectedCount > 0;

  const push = (patch: Partial<BrowseState>) => {
    startTransition(() => {
      router.push(buildBrowseUrl({ ...state, page: 1, ...patch }), {
        scroll: false,
      });
    });
  };

  const toggleType = (type: string, checked: boolean) => {
    push({
      types: checked
        ? [...state.types, type]
        : state.types.filter((selected) => selected !== type),
    });
  };

  return (
    <div className="lg:sticky lg:top-24">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        className={cn(
          "flex h-12 w-full items-center gap-2.5 rounded-xl border border-white/[0.07] bg-[#0b0b0e] px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-white/15 lg:hidden",
          focusRing,
        )}
      >
        <SlidersHorizontalIcon className="size-4 text-zinc-400" aria-hidden="true" />
        Filters
        {selectedCount > 0 && (
          <span className="grid size-5 place-items-center rounded-full bg-brand text-[11px] font-semibold text-white">
            {selectedCount}
          </span>
        )}
        <ChevronDownIcon
          className={cn(
            "ml-auto size-4 text-zinc-500 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={PANEL_ID}
        className={cn(
          "mt-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0b0e] lg:mt-0 lg:block",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/6 px-5 py-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontalIcon
              className="size-4 text-zinc-400"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold text-white">Filters</h2>
          </div>

          {active && (
            <button
              type="button"
              onClick={() => push({ types: [] })}
              disabled={isPending}
              className={cn(
                "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/6 hover:text-white disabled:cursor-wait disabled:opacity-60",
                focusRing,
              )}
            >
              <RotateCcwIcon className="size-3" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>

        <fieldset className="px-5 py-4" disabled={isPending}>
          <legend className="text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            Job Type
          </legend>

          <ul className="mt-3 space-y-0.5">
            {JOB_TYPES.map((type) => {
              const checked = state.types.includes(type);
              const count = counts[type] ?? 0;
              const disabled = count === 0 && !checked;

              return (
                <li key={type}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2 transition-colors hover:bg-white/[0.04]",
                      disabled && "cursor-not-allowed opacity-45 hover:bg-transparent",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onCheckedChange={(value) => toggleType(type, value)}
                      aria-label={`${type} — ${count} ${count === 1 ? "job" : "jobs"}`}
                    />
                    <span className="flex-1 text-[13px] text-zinc-300">
                      {type}
                    </span>
                    <span className="text-[11px] tabular-nums text-zinc-500">
                      {count}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="border-t border-white/6 px-5 py-3 text-[11px] text-zinc-500">
          {total} {total === 1 ? "job" : "jobs"} available
        </div>
      </div>
    </div>
  );
}
