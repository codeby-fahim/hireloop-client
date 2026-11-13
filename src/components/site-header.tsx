"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";



const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: `/dashboard/${session?.user.role || "seeker"}` },
];

  const user = session?.user;
  const displayName = user?.name?.trim() || user?.email || "";
  const initial = displayName.charAt(0).toUpperCase();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleSignOut = async () => {
    await authClient.signOut();
    setOpen(false);
    router.replace("/");
    router.refresh();
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  // Do not render the public site header on dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/85 pt-3 backdrop-blur-xl sm:pt-4">
      <div className="mx-auto flex h-17 w-full max-w-360 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-20">
        <Link
          href="/"
          aria-label="HireLoop home"
          className={cn("shrink-0 rounded-md", focusRing)}
        >
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={154}
            height={44}
            priority
            className="h-9 w-auto sm:h-10 lg:h-11"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 rounded-[8px] border border-white/[0.07] bg-panel py-2 pr-2 pl-6 shadow-[0_1px_2px_rgba(0,0,0,0.28)] lg:flex"
        >
          <NavigationMenu className="flex-none">
            <NavigationMenuList className="flex-none justify-start gap-5">
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    active={isActive(link.href)}
                    render={<Link href={link.href} />}
                    className={cn(
                      "p-0 text-base leading-[1.8] tracking-[-0.2px] text-ink transition-colors hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:font-bold data-active:focus:bg-transparent data-active:hover:bg-transparent focus-visible:ring-2 focus-visible:ring-brand/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:outline-none",
                      focusRing,
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <span aria-hidden="true" className="h-6 w-px bg-[#a8a8a8]/40" />

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center rounded-full border border-white/10 bg-brand/25 text-sm font-semibold text-brand-soft"
                  >
                    {initial}
                  </span>
                  <span className="max-w-40 truncate text-[15px] leading-[1.45] text-ink">
                    {displayName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="h-9.5 gap-2 rounded-[8px] border-white/[0.07] bg-transparent px-4 text-[16px] leading-[1.45] font-semibold text-ink hover:bg-white/5 hover:text-white"
                >
                  <LogOutIcon className="size-4" aria-hidden="true" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                  className="h-9.5 rounded-[8px] px-4 text-[18px] leading-[1.45] font-semibold text-brand-soft hover:bg-white/5 hover:text-[#8b84ff]"
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                  className="h-13 rounded-[8px] border border-[#090a15]/10 bg-brand px-5.5 text-[18px] leading-[1.45] font-medium text-ink shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-[#6c63ff]"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile navigation */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Open menu"
                className="size-11 shrink-0 rounded-[8px] border-white/[0.07] bg-panel text-ink hover:bg-white/5 hover:text-ink lg:hidden"
              />
            }
          >
            <MenuIcon className="size-5" aria-hidden="true" />
          </SheetTrigger>

          <SheetContent
            side="right"
            showCloseButton={false}
            className="w-[min(88vw,380px)] gap-0 border-l-white/[0.07] bg-panel p-0 text-ink sm:max-w-95"
          >
            <SheetHeader className="flex-row items-center justify-between border-b border-white/[0.07] p-4">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Browse HireLoop pages and account actions.
              </SheetDescription>

              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="HireLoop home"
                className={cn("rounded-md", focusRing)}
              >
                <Image
                  src="/images/logo.png"
                  alt="HireLoop"
                  width={154}
                  height={44}
                  className="h-9 w-auto"
                />
              </Link>

              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close menu"
                    className="size-9 rounded-[8px] text-ink hover:bg-white/5 hover:text-white"
                  />
                }
              >
                <XIcon className="size-5" aria-hidden="true" />
              </SheetClose>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              <ul>
                {links.map((link) => {
                  const active = isActive(link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex h-12 items-center rounded-[8px] px-3 text-base tracking-[-0.2px] text-ink transition-colors hover:bg-white/5 hover:text-white",
                          active && "bg-white/6 font-bold",
                          focusRing,
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-2 border-t border-white/[0.07] p-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-1">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-white/10 bg-brand/25 text-sm font-semibold text-brand-soft"
                    >
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {displayName}
                      </p>
                      {user.email && (
                        <p className="truncate text-xs text-ink/60">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="h-12 w-full gap-2 rounded-[8px] border-white/[0.07] bg-transparent text-base font-semibold text-ink hover:bg-white/5 hover:text-white"
                  >
                    <LogOutIcon className="size-4.5" aria-hidden="true" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/sign-in" />}
                    onClick={() => setOpen(false)}
                    className="h-12 w-full rounded-[8px] border-white/[0.07] bg-transparent text-base font-semibold text-brand-soft hover:bg-white/5 hover:text-[#8b84ff]"
                  >
                    Sign In
                  </Button>
                  <Button
                    nativeButton={false}
                    render={<Link href="/sign-up" />}
                    onClick={() => setOpen(false)}
                    className="h-12 w-full rounded-[8px] bg-brand text-base font-medium text-ink shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-[#6c63ff]"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
