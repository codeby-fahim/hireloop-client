"use client";

/**
 * Tiny localStorage-backed stores for job ids (bookmarks, applications).
 *
 * Each store owns a `Set` of listeners so React can subscribe with
 * `useSyncExternalStore` — no setState-in-effect hydration mismatch.
 */

const parseIds = (raw: string | null): string[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
};

export type JobIdStore = {
  read: () => string[];
  subscribe: (listener: () => void) => () => void;
  /** Returns the new state, or `null` when storage rejected the write. */
  toggle: (jobId: string) => "saved" | "removed" | null;
  add: (jobId: string) => boolean;
};

export const createJobIdStore = (storageKey: string): JobIdStore => {
  const listeners = new Set<() => void>();

  const emit = () => {
    for (const listener of listeners) listener();
  };

  const read = (): string[] => {
    try {
      return parseIds(window.localStorage.getItem(storageKey));
    } catch {
      return [];
    }
  };

  const write = (ids: string[]): boolean => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(ids));
      emit();
      return true;
    } catch {
      return false;
    }
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    // Keep other tabs in sync.
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey) listener();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return {
    read,
    subscribe,
    toggle: (jobId) => {
      const current = read();
      const isSaved = current.includes(jobId);
      const next = isSaved
        ? current.filter((id) => id !== jobId)
        : [...current, jobId];

      if (!write(next)) return null;

      return isSaved ? "removed" : "saved";
    },
    add: (jobId) => {
      const current = read();
      if (current.includes(jobId)) return true;

      return write([...current, jobId]);
    },
  };
};
