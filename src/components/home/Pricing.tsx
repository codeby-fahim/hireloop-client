"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChartColumnIcon,
  CrownIcon,
  PlusIcon,
  ZapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly";

type PricingPlan = {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  featured: boolean;
  subtitle: string;
  features: string[];
  icon: typeof CrownIcon;
};

const billingOptions: { value: BillingCycle; label: string; badge?: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly", badge: "25%" },
];

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    featured: false,
    subtitle: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    icon: CrownIcon,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 17,
    yearlyPrice: 13,
    featured: true,
    subtitle: "Start building your insights hub:",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    icon: ChartColumnIcon,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 99,
    yearlyPrice: 74,
    featured: false,
    subtitle: "Start building your insights hub:",
    features: [
      "Everything in Pro",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
    icon: ZapIcon,
  },
];

const focusRing =
  "focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070708] focus-visible:outline-none";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#070708] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.2em] text-zinc-400 uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]"
            />
            <span>Pricing</span>
            <span
              aria-hidden="true"
              className="size-1.5 rounded-xs bg-indigo-500 shadow-[0_0_8px_#6366f1]"
            />
          </div>

          <h2 className="text-[30px] leading-[1.15] font-semibold tracking-tight text-balance text-white sm:text-[38px] lg:text-[44px]">
            Pay for the leverage,{" "}
            <br className="hidden sm:inline" />
            not the listings
          </h2>
        </div>

        {/* Billing cycle toggle */}
        <div className="mt-8 flex justify-center">
          <div
            role="group"
            aria-label="Billing cycle"
            className="inline-flex items-center rounded-full border border-white/8 bg-[#141417] p-1"
          >
            {billingOptions.map((option) => {
              const active = billingCycle === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setBillingCycle(option.value)}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200",
                    active
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-white",
                    focusRing,
                  )}
                >
                  <span>{option.label}</span>
                  {option.badge && (
                    <span className="rounded-full bg-fuchsia-600 px-1.5 py-0.5 text-[10px] leading-none font-semibold text-white">
                      {option.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plans */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {pricingPlans.map((plan, index) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const isLast = index === pricingPlans.length - 1;

            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col justify-between rounded-2xl p-5 transition-colors duration-300 sm:p-6 lg:p-7",
                  plan.featured
                    ? "border border-white/15 bg-linear-to-b from-[#17161c] to-[#111114] shadow-[0_0_60px_-25px_rgba(139,92,246,0.45)]"
                    : "border border-white/[0.07] bg-[#0d0d0f] hover:border-white/15",
                  isLast && "sm:col-span-2 lg:col-span-1",
                )}
              >
                <div>
                  {/* Plan name + price */}
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/6 pb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg border border-white/6 bg-[#1c1b22]">
                        <plan.icon
                          className="size-4 text-purple-400"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-base font-medium text-white">
                        {plan.name}
                      </span>
                    </div>

                    <p className="flex items-baseline">
                      <span className="text-[30px] leading-none font-semibold tracking-tight text-white sm:text-[34px]">
                        ${price}
                      </span>
                      <span className="ml-1 text-[11px] text-zinc-400">
                        /month
                      </span>
                    </p>
                  </div>

                  <p className="mt-4 text-xs font-medium text-zinc-300">
                    {plan.subtitle}
                  </p>

                  <ul className="mt-4 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs leading-5 text-zinc-400 sm:text-[13px]"
                      >
                        <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-zinc-300">
                          <PlusIcon
                            className="size-2.5"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  aria-label={`Choose the ${plan.name} plan`}
                  className={cn(
                    "group mt-8 flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-4 py-3 text-xs font-medium transition-colors duration-200",
                    plan.featured
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "border border-white/5 bg-[#1a1a1e] text-zinc-200 hover:bg-[#232329]",
                    focusRing,
                  )}
                >
                  <span>Choose This Plan</span>
                  <ArrowRightIcon
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA over the wireframe globe */}
      <div className="relative mt-12 sm:mt-16 lg:mt-20">
        <div className="relative isolate mx-auto flex w-full max-w-[1600px] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-14 text-center sm:px-6 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20">
          {/* Background globe + glow */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/cta-globe-lines.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top opacity-60 select-none"
            />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_42%_at_50%_62%,rgba(99,88,255,0.42)_0%,rgba(92,83,254,0.16)_45%,transparent_74%)]" />

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[#070708] via-[#070708]/80 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-[#070708] via-[#070708]/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl">
            <h3 className="text-[28px] leading-[1.18] font-semibold tracking-tight text-balance text-white sm:text-[36px] lg:text-[42px]">
              Your next role is{" "}
              <br className="hidden sm:inline" />
              already looking for you
            </h3>

            <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-zinc-300/90 sm:text-sm">
              Build a profile in three minutes. The matches start arriving
              tomorrow morning.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className={cn(
                  "w-full rounded-lg bg-white px-5 py-2.5 text-xs font-medium text-zinc-950 shadow-sm transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] sm:w-auto",
                  focusRing,
                )}
              >
                Create a free account
              </Link>

              <Link
                href="#pricing"
                className={cn(
                  "w-full rounded-lg border border-white/10 bg-white/8 px-5 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-white/[0.14] sm:w-auto",
                  focusRing,
                )}
              >
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
