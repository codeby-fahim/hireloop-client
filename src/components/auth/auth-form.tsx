"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusinessIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
};

type UserRole = "seeker" | "recruiter" | "admin";

const copy = {
  "sign-in": {
    overline: "Welcome to HireLoop",
    title: "Welcome back",
    description:
      "Sign in to continue your job search or manage your hiring pipeline.",
    submit: "Sign in",
  },
  "sign-up": {
    overline: "Join HireLoop",
    title: "Create your account",
    description:
      "Start finding better opportunities — or better candidates — in minutes.",
    submit: "Create account",
  },
} satisfies Record<AuthMode, Record<string, string>>;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

const inputClasses =
  "h-11 rounded-xl border-white/10 bg-white/[0.04] px-3.5 text-[15px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] placeholder:text-white/35 focus-visible:border-brand/70 focus-visible:ring-brand/20 dark:bg-white/[0.04]";

const checkboxClasses =
  "size-4 rounded-[4px] border-white/25 bg-white/[0.04] data-checked:border-brand data-checked:bg-brand data-checked:text-white focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0e]";

const labelClasses = "text-[13px] font-medium tracking-[0.01em] text-white/70";

const roles = [
  {
    value: "seeker" satisfies UserRole,
    label: "Job Seeker",
    description: "Find your next role",
    icon: UserRoundIcon,
  },
  {
    value: "recruiter" satisfies UserRole,
    label: "Recruiter",
    description: "Hire great talent",
    icon: BriefcaseBusinessIcon,
  },
  {
    value: "admin" satisfies UserRole,
    label: "Admin",
    description: "Manage the platform",
    icon: ShieldCheckIcon,
  },
] as const;

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const content = copy[mode];
  const isSignUp = mode === "sign-up";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const roleValue = formData.get("role");
    const role: UserRole =
      roleValue === "recruiter" || roleValue === "admin" ? roleValue : "seeker";

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await authClient.signUp.email({
          name,
          email,
          password,
          role,
        });

        if (signUpError) {
          setError(
            signUpError.message ?? "Could not create your account. Try again.",
          );
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
          rememberMe: formData.get("remember") !== null,
        });

        if (signInError) {
          setError(signInError.message ?? "Invalid email or password.");
          return;
        }
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden bg-[#010103] px-4 py-10 sm:px-6 sm:py-16">
      <AuthBackground />

      <div className="relative z-10 w-full max-w-120">
        <div className="text-center">
          <p className="font-badge text-[11px] tracking-[0.28em] text-brand-soft uppercase">
            {content.overline}
          </p>
          <h1 className="mt-3 text-balance font-hero text-[2rem] leading-[1.1] font-bold tracking-[-0.02em] text-white sm:text-[2.5rem]">
            {content.title}
          </h1>
          <p className="mx-auto mt-3 max-w-105 text-pretty font-hero text-sm leading-[1.6] text-ink/55 sm:text-base">
            {content.description}
          </p>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(26,26,31,0.92)_0%,rgba(8,8,10,0.96)_100%)] p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-7 lg:p-8">
          <span
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand/60 to-transparent"
          />

          <nav aria-label="Authentication">
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/30 p-1">
              <Link
                href="/sign-in"
                aria-current={mode === "sign-in" ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  mode === "sign-in"
                    ? "bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/50 hover:text-white/80",
                  focusRing,
                )}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                aria-current={mode === "sign-up" ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                  mode === "sign-up"
                    ? "bg-white/8 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/50 hover:text-white/80",
                  focusRing,
                )}
              >
                Sign up
              </Link>
            </div>
          </nav>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-5"
          >
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className={labelClasses}>
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                  className={inputClasses}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className={labelClasses}>
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className={inputClasses}
              />
            </div>

            {isSignUp && (
              <fieldset className="flex flex-col gap-2">
                <legend className={labelClasses}>I am a</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {roles.map((role) => (
                    <label
                      key={role.value}
                      className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/3 p-3 transition-colors hover:border-white/20 has-checked:border-brand/70 has-checked:bg-brand/10 has-focus-visible:ring-2 has-focus-visible:ring-brand/50 sm:flex-col sm:gap-2.5"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        defaultChecked={role.value === "seeker"}
                        className="peer sr-only"
                      />
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/6 text-white/60 transition-colors peer-checked:bg-brand/20 peer-checked:text-brand-soft">
                        <role.icon
                          className="size-4.5"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="min-w-0 pt-0.5 sm:pt-0">
                        <span className="block text-sm font-medium text-white">
                          {role.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-4 text-white/45">
                          {role.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="password" className={labelClasses}>
                  Password
                </Label>
                {!isSignUp && (
                  <Link
                    href="/forgot-password"
                    className={cn(
                      "rounded-sm text-xs text-brand-soft transition-colors hover:text-[#8b84ff]",
                      focusRing,
                    )}
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  className={cn(inputClasses, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className={cn(
                    "absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/5 hover:text-white",
                    focusRing,
                  )}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4.5" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="size-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs leading-4 text-white/40">
                  Use 8 or more characters.
                </p>
              )}
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className={labelClasses}>
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={cn(inputClasses, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirmPassword}
                    className={cn(
                      "absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/5 hover:text-white",
                      focusRing,
                    )}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="size-4.5" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="size-4.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!isSignUp && (
              <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-white/60">
                <Checkbox
                  id="remember"
                  name="remember"
                  className={checkboxClasses}
                />
                Remember me
              </label>
            )}

            {isSignUp && (
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  name="terms"
                  required
                  className={cn(checkboxClasses, "mt-0.5")}
                />
                <div className="text-sm leading-5 text-white/50">
                  <Label
                    htmlFor="terms"
                    className="inline font-normal text-white/50"
                  >
                    I agree to the
                  </Label>{" "}
                  <Link
                    href="/terms"
                    className="text-white/85 underline underline-offset-2 transition-colors hover:text-white"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-white/85 underline underline-offset-2 transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm leading-5 text-red-300"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="mt-1 h-12 w-full rounded-xl border border-[#090a15]/10 bg-brand text-base font-medium text-white shadow-[inset_0_2px_8px_rgba(255,255,255,0.18)] hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <LoaderCircleIcon
                    className="size-4.5 animate-spin"
                    aria-hidden="true"
                  />
                  {isSignUp ? "Creating account…" : "Signing in…"}
                </span>
              ) : (
                content.submit
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-white/45">
          {isSignUp ? "Already have an account?" : "New to HireLoop?"}{" "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className={cn(
              "rounded-sm font-medium text-brand-soft transition-colors hover:text-[#8b84ff]",
              focusRing,
            )}
          >
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </main>
  );
}

function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute -top-96 left-1/2 h-176 w-360 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.32)_0%,rgba(92,83,254,0.08)_45%,transparent_72%)] blur-[100px]" />

      <div className="absolute -bottom-112 left-1/2 h-192 w-340 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.38)_0%,rgba(92,83,254,0.08)_45%,transparent_72%)] blur-[120px]" />

      <div className="absolute inset-0 bg-[url('/images/hero-stars.png')] bg-size-[1100px_auto] bg-top bg-repeat opacity-20 mix-blend-screen" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#010103_85%)]" />
    </div>
  );
}
