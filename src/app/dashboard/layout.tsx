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
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user's name
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post("/api/users/userDetails");
        setUserName(res.data?.data?.name || "User");
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
    {
      label: "Portfolio",
      href: "/dashboard/portfolio",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen w-full">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="h-full flex flex-col justify-between">
          {/* Top section with logo and links */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom section with user name and logout */}
          <div className="mb-4 flex flex-col gap-2">
            <SidebarLink
              link={{
                label: userName || "Loading...",
                href: "/dashboard/profile",
                icon: <IconUserBolt className="h-5 w-5" />,
              }}
            />

            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition"
              )}
            >
              <IconLogout className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 dark:bg-neutral-900 p-6 overflow-y-auto h-full">
        {children}
      </main>
    </div>
  );
}

// Logo component, only visible when sidebar is open
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
