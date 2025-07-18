"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconUserBolt,
  IconLayoutDashboard,
  IconLogout,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post("/api/users/userDetails");
        const name = res.data?.data?.name || "user";
        setUserName(name);
        setSlug(generateSlug(name));
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        router.push("/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
        <div
          className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconLayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <IconUserBolt className="h-5 w-5" />,
    },
    {
      label: "Skills",
      href: "/dashboard/skills",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Experience",
      href: "/dashboard/experience",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Education",
      href: "/dashboard/education",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Certificates",
      href: "/dashboard/certificate",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="h-full flex flex-col justify-between">
          <div className="flex flex-col overflow-y-auto">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 px-2">
            <button
              onClick={() =>
                slug && window.open(`/portfolio/${slug}`, "_blank")
              }
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md transition w-full"
              )}
              title="View Portfolio"
            >
              <IconLayoutDashboard className="h-5 w-5 mr-2" />
              {open && "View Portfolio"}
            </button>

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition w-full"
              )}
              title="Logout"
            >
              <IconLogout className="h-5 w-5 mr-2" />
              {open && "Logout"}
            </button>

            <div
              className={cn(
                "mt-2 px-3 py-2 text-xl font-medium text-gray-500 dark:text-gray-400 flex items-center border-t border-gray-200 dark:border-gray-700",
                open ? "justify-start" : "justify-center"
              )}
              title={userName || "User"}
            >
              {open ? (
                <span className="truncate">{userName}</span>
              ) : (
                <IconUserBolt className="h-5 w-5" />
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 bg-gray-100 dark:bg-neutral-900 p-6 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}

const Logo = ({ open }: { open: boolean }) => {
  if (!open) return null;

  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold"
      >
        PORTIFY
      </motion.span>
    </a>
  );
};