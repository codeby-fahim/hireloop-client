"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export type Role = "seeker" | "recruiter" | "admin" | "recruite";

export interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

export const menuItemsByRols: Record<string, MenuItem[]> = {
  seeker: [
    {
      id: "seeker-dashboard",
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      id: "seeker-jobs",
      name: "Jobs",
      url: "/dashboard/seeker/jobs",
      icon: Briefcase,
    },
    {
      id: "seeker-saved-jobs",
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      id: "seeker-applications",
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      id: "seeker-billing",
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: Wallet,
    },
    {
      id: "seeker-settings",
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],
  recruiter: [
    {
      id: "recruiter-dashboard",
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      id: "recruiter-company",
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      id: "recruiter-jobs",
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      id: "recruiter-add-job",
      name: "Add job",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      id: "recruiter-applications",
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      id: "recruiter-settings",
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    {
      id: "admin-dashboard",
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-companies",
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      id: "admin-jobs",
      name: "Jobs",
      url: "/dashboard/admin/jobs",
      icon: Briefcase,
    },
    {
      id: "admin-payments",
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: Wallet,
    },
    {
      id: "admin-settings",
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
};

// Aliases for convenience
menuItemsByRols.recruite = menuItemsByRols.recruiter;
export const menuItemsByRoles = menuItemsByRols;

const roleTitles: Record<string, string> = {
  admin: "Admin Console",
  seeker: "Seeker Portal",
  recruiter: "Recruiter Portal",
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const rawRole = (session?.user as { role?: string } | undefined)?.role || "seeker";
  const role = rawRole.toLowerCase();
  const currentMenuItems = menuItemsByRols[role] || menuItemsByRols.seeker;
  const roleLabel = roleTitles[role] || "Dashboard";

  const user = session?.user;
  const displayName = user?.name?.trim() || user?.email || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <Sidebar className="border-r border-white/8 bg-[#0c0c10] text-ink">
      <SidebarHeader className="border-b border-white/8 px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="HireLoop"
              width={112}
              height={32}
              priority
              className="h-7 w-auto"
            />
          </Link>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand-soft uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {currentMenuItems.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== `/dashboard/${role}` && pathname.startsWith(item.url));

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.name}
                    render={<Link href={item.url} />}
                    className={cn(
                      "h-10 rounded-lg px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand/15 text-white font-semibold shadow-xs"
                        : "text-zinc-400 hover:bg-white/6 hover:text-zinc-200"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        isActive ? "text-brand-soft" : "text-zinc-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/8 p-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-white/6 bg-white/2 p-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 bg-brand/25 text-xs font-semibold text-brand-soft"
            >
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{displayName}</p>
              <p className="truncate text-[11px] text-zinc-500 capitalize">{user?.role || role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
