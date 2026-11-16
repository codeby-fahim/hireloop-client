"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  Building2Icon,
  CalendarDaysIcon,
  ChevronDownIcon,
  GlobeIcon,
  LoaderCircleIcon,
  MapPinIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, pickOption } from "@/lib/utils";
import { toast } from "sonner";
import { createJob } from "@/lib/actions/jobs";
import { useRouter } from "next/navigation";
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
  type JobFormValues,
  type JobType,
} from "@/types/jobs";

const fieldBase =
  "h-10 rounded-lg border-white/[0.08] bg-[#101014] px-3 text-[13px] text-zinc-200 shadow-none placeholder:text-zinc-600 focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/25 dark:bg-[#101014]";

const selectBase =
  "h-10 w-full cursor-pointer appearance-none rounded-lg border border-white/[0.08] bg-[#101014] px-3 pr-9 text-[13px] text-zinc-200 outline-none transition-colors hover:border-white/15 focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/25";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080a]";

function FieldLabel({
  htmlFor,
  children,
  trailing,
}: {
  htmlFor: string;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <Label
        htmlFor={htmlFor}
        className="text-[12px] font-medium tracking-[0.01em] text-zinc-300"
      >
        {children}
      </Label>
      {trailing}
    </div>
  );
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="ml-1 text-zinc-500">
      *
    </span>
  );
}

function FormSection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/6 py-7 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2.5 text-[14px] font-medium text-white">
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.65)]"
        />
        <span className="text-zinc-300">{index}.</span>
        <span>{title}</span>
      </h2>

      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

const NewJobsPage = () => {
  const router = useRouter();
  const [jobType, setJobType] = useState<JobType>("Full-time");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const get = (key: string) => String(formData.get(key) ?? "").trim();
    const toNumber = (key: string) => {
      const value = Number(get(key));
      return Number.isFinite(value) ? value : 0;
    };

    const payload: JobFormValues = {
      title: get("title"),
      company: get("company"),
      category: pickOption(JOB_CATEGORIES, get("category"), "Other"),
      jobType,
      remote: formData.get("remote") === "on",
      location: get("location"),
      applicationDeadline: get("deadline"),
      minSalary: toNumber("minSalary"),
      maxSalary: toNumber("maxSalary"),
      salaryFrequency: pickOption(
        SALARY_FREQUENCIES,
        get("frequency"),
        "per year",
      ),
      responsibilities: get("responsibilities"),
      qualifications: get("qualifications"),
    };

    if (!payload.title || !payload.company || !payload.category) {
      setError("Job title, company name and category are required.");
      return;
    }

    if (
      payload.minSalary > 0 &&
      payload.maxSalary > 0 &&
      payload.minSalary > payload.maxSalary
    ) {
      setError("Minimum salary cannot be higher than maximum salary.");
      return;
    }

    setIsPending(true);

    try {
      const result = await createJob(payload);

      if (!result.ok) {
        setError(result.message ?? "Could not publish this job. Try again.");
        toast.error("Could not publish this job. Try again.");
        return;
      }

      toast.success("Successfully published this job.");
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      return;
    } finally {
      setIsPending(false);
    }

    router.push("/dashboard/recruiter/jobs");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-280 pb-10">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] text-zinc-500"
          >
            <Link
              href="/dashboard/recruiter/jobs"
              className={cn(
                "rounded-sm transition-colors hover:text-zinc-300",
                focusRing,
              )}
            >
              Manage Jobs
            </Link>
            <span aria-hidden="true" className="text-zinc-700">
              ›
            </span>
            <span className="text-zinc-400">Create New Listing</span>
          </nav>

          <h1 className="mt-2 text-[24px] leading-tight font-semibold tracking-tight text-white sm:text-[28px]">
            Post a New Job
          </h1>
          <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
            Fill in the position specifications to attract qualified talent
            across our network.
          </p>
        </div>

       
      </div>

      {/* Form */}
      <form
        id="new-job-form"
        onSubmit={handleSubmit}
        className="mt-6 border-t border-white/6 pt-2 sm:mt-8"
        aria-busy={isPending}
      >
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="mt-4 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300"
          >
            {success}
          </p>
        )}

        {/* 1. Basic Information */}
        <FormSection index={1} title="Basic Information">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="title">
              Job Title <RequiredMark />
            </FieldLabel>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Frontend Developer"
              autoComplete="off"
              required
              className={cn(fieldBase, "w-full")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="company">
                Company Name <RequiredMark />
              </FieldLabel>
              <div className="relative">
                <Building2Icon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="HirePulse Network"
                  autoComplete="organization"
                  required
                  className={cn(fieldBase, "w-full pl-9")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="category">
                Job Category <RequiredMark />
              </FieldLabel>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  defaultValue="Engineering & Tech"
                  required
                  className={selectBase}
                >
                  {JOB_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-medium tracking-[0.01em] text-zinc-300">
              Job Type <RequiredMark />
            </span>
            <div
              role="group"
              aria-label="Job type"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {JOB_TYPES.map((type) => {
                const active = jobType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setJobType(type)}
                    className={cn(
                      "flex h-10 cursor-pointer items-center justify-center rounded-lg border text-[13px] font-medium transition-colors",
                      active
                        ? "border-brand/60 bg-brand/12 text-white shadow-[inset_0_0_0_1px_rgba(92,83,254,0.2)]"
                        : "border-white/8 bg-white/2 text-zinc-400 hover:border-white/15 hover:text-zinc-200",
                      focusRing,
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        </FormSection>

        {/* 2. Location, Compensation & Timeline */}
        <FormSection index={2} title="Location, Compensation & Timeline">
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/2 px-4 py-3.5 transition-colors hover:border-white/15">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/4">
                <GlobeIcon
                  className="size-4 text-zinc-300"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-white">
                  Remote Work Allowed{" "}
                  <span className="font-normal text-zinc-500">(sitewide)</span>
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-zinc-500">
                  Enable worldwide or distributed candidate applications
                </span>
              </span>
            </span>

            <span className="relative inline-flex shrink-0 items-center">
              <input
                type="checkbox"
                name="remote"
                defaultChecked
                className="peer sr-only"
              />
              <span className="h-5 w-9 rounded-full bg-white/15 transition-colors peer-checked:bg-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#08080a]" />
              <span className="pointer-events-none absolute left-0.5 size-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-4 peer-checked:bg-[#0b0b0d]" />
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-end justify-between gap-3">
                <Label
                  htmlFor="location"
                  className="text-[12px] font-medium tracking-[0.01em] text-zinc-300"
                >
                  Job Location (location) <RequiredMark />
                </Label>
                <span className="text-[10px] font-medium text-zinc-600">
                  Required
                </span>
              </div>
              <div className="relative">
                <MapPinIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="New York, USA"
                  autoComplete="address-level2"
                  className={cn(fieldBase, "w-full pl-9")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="deadline">
                Application Deadline (deadline) <RequiredMark />
              </FieldLabel>
              <div className="relative">
                <CalendarDaysIcon
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  required
                  className={cn(
                    fieldBase,
                    "w-full pl-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
                  )}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="minSalary">Min Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-zinc-500"
                >
                  €
                </span>
                <Input
                  id="minSalary"
                  name="minSalary"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="25"
                  inputMode="numeric"
                  className={cn(
                    fieldBase,
                    "w-full pl-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="maxSalary">Max Salary / Rate</FieldLabel>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-zinc-500"
                >
                  €
                </span>
                <Input
                  id="maxSalary"
                  name="maxSalary"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="40"
                  inputMode="numeric"
                  className={cn(
                    fieldBase,
                    "w-full pl-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
              <div className="relative">
                <select
                  id="frequency"
                  name="frequency"
                  defaultValue="per hour"
                  className={selectBase}
                >
                  {SALARY_FREQUENCIES.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* 3. Responsibilities & Requirements */}
        <FormSection index={3} title="Responsibilities & Requirements">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="responsibilities">
              Key Responsibilities <RequiredMark />
            </FieldLabel>
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={4}
              required
              placeholder="Describe what this person will own day to day…"
              className={cn(
                "min-h-26 w-full resize-y rounded-lg border border-white/8 bg-[#101014] px-3 py-2.5 text-[13px] leading-5 text-zinc-200 shadow-none outline-none transition-colors placeholder:text-zinc-600 hover:border-white/15 focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/25",
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="qualifications">
              Qualifications & Requirements <RequiredMark />
            </FieldLabel>
            <textarea
              id="qualifications"
              name="qualifications"
              rows={4}
              required
              placeholder="List the must-have skills, experience and nice-to-haves…"
              className="min-h-26 w-full resize-y rounded-lg border border-white/8 bg-[#101014] px-3 py-2.5 text-[13px] leading-5 text-zinc-200 shadow-none outline-none transition-colors placeholder:text-zinc-600 hover:border-white/15 focus-visible:border-brand/70 focus-visible:ring-2 focus-visible:ring-brand/25"
            />
          </div>
        </FormSection>

        {/* Footer actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/6 pt-6 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-lg border border-white/8 px-4 text-[13px] text-zinc-300 hover:bg-white/6 hover:text-white"
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="group h-10 gap-2 rounded-lg bg-linear-to-r from-brand to-[#8b5cf6] px-4 text-[13px] font-medium text-white shadow-[0_10px_28px_-10px_rgba(109,75,255,0.95)] hover:brightness-110"
          >
            {isPending && (
              <LoaderCircleIcon
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Publish Job
            <ArrowRightIcon
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewJobsPage;
