"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";
import { buildBrowseUrl, type BrowseState } from "@/lib/jobs/browse";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

export function BrowseSearch({ state }: { state: BrowseState }) {
  const router = useRouter();
  // The parent re-mounts this component (keyed by `state.query`), so `value`
  // always starts in sync when the URL changes elsewhere.
  const [value, setValue] = useState(state.query);
  const [isPending, startTransition] = useTransition();

  const navigate = (query: string) => {
    startTransition(() => {
      router.push(buildBrowseUrl({ ...state, query, page: 1 }), { scroll: false });
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(value);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-[#0b0b0e] p-2.5 transition-colors focus-within:border-brand/40 sm:flex-row sm:items-center sm:p-3"
    >
      <div className="relative flex-1">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500"
          strokeWidth={1.9}
          aria-hidden="true"
        />

        <input
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Job title, keyword, company or location"
          aria-label="Search jobs"
          autoComplete="off"
          className={cn(
            "h-11 w-full rounded-xl bg-transparent pr-10 pl-10 text-sm text-white placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:appearance-none sm:h-12",
            focusRing,
          )}
        />

        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue("");
              if (state.query) navigate("");
            }}
            aria-label="Clear search"
            className={cn(
              "absolute top-1/2 right-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/8 hover:text-white",
              focusRing,
            )}
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all hover:bg-[#6c63ff] disabled:cursor-wait disabled:opacity-70 sm:h-12",
          focusRing,
        )}
      >
        {isPending ? (
          <LoaderCircleIcon className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <SearchIcon className="size-4" aria-hidden="true" />
        )}
        {isPending ? "Searching…" : "Search Jobs"}
      </button>
    </form>
  );
}
