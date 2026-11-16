"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";
import { buildBrowseUrl, type BrowseState } from "@/lib/jobs/browse";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

/** Chips for the filters that are currently applied, with one-click removal. */
export function ActiveFilters({ state }: { state: BrowseState }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasFilters =
    state.query.length > 0 ||
    state.location.length > 0 ||
    state.types.length > 0;
  if (!hasFilters) return null;

  const push = (patch: Partial<BrowseState>) => {
    startTransition(() => {
      router.push(buildBrowseUrl({ ...state, page: 1, ...patch }), {
        scroll: false,
      });
    });
  };

  return (
    <div
      role="group"
      aria-label="Active filters"
      aria-busy={isPending}
      className="mt-3 flex flex-wrap items-center gap-2"
    >
      {state.query && (
        <FilterChip
          label={`“${state.query}”`}
          onRemove={() => push({ query: "" })}
        />
      )}

      {state.location && (
        <FilterChip
          label={`Location: ${state.location}`}
          onRemove={() => push({ location: "" })}
        />
      )}

      {state.types.map((type) => (
        <FilterChip
          key={type}
          label={type}
          onRemove={() => push({ types: state.types.filter((value) => value !== type) })}
        />
      ))}

      <button
        type="button"
        onClick={() => push({ query: "", location: "", types: [] })}
        disabled={isPending}
        className={cn(
          "cursor-pointer rounded-md px-1.5 py-1 text-[11px] font-medium text-zinc-400 underline-offset-2 transition-colors hover:text-white hover:underline disabled:cursor-wait disabled:opacity-60",
          focusRing,
        )}
      >
        Clear all
      </button>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/12 py-1 pr-1 pl-2.5 text-[11px] font-medium text-brand-soft">
      <span className="max-w-52 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className={cn(
          "grid size-4 cursor-pointer place-items-center rounded-full text-brand-soft/80 transition-colors hover:bg-brand/25 hover:text-white",
          focusRing,
        )}
      >
        <XIcon className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}
