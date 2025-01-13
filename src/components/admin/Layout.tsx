import { TRANSLATION } from "@/constants/translation";
import { BoxIcon, HomeIcon, NewspaperIcon, PinIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  const navs: any[] = [
    {
      name: "Dashboard",
      href: "/admin/main/dashboard",
      icon: <HomeIcon color="white" />,
    },
    {
      name: "Kategori",
      href: "/admin/main/category",
      icon: <BoxIcon color="white" />,
    },
    {
      name: "Berita",
      href: "/admin/main/news",
      icon: <NewspaperIcon color="white" />,
    },
    {
      name: "Iklan",
      href: "/admin/main/ads",
      icon: <PinIcon color="white" />,
    },
  ];

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login"); // Redirect to login if unauthenticated
    }
  }, [status, router]);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to handle clicks outside of the sidebar
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Head>
        <title>Asbi News</title>
      </Head>
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed z-20 inset-y-0 left-0 bg-blue-500 text-white w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:relative`}
      >
        <div className="p-4 font-bold text-xl border-b border-gray-400 lg:text-start text-right">
          Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navs.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
              className={`p-1 px-2 rounded hover:bg-blue-700 flex items-center gap-2 ${
                router.pathname?.includes(nav.href) ? "bg-blue-700" : ""
              }`}
            >
              {nav.icon} {nav.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-400">
          <button
            type="button"
            onClick={() => {
              signOut({ callbackUrl: "/admin/login" });
            }}
            className="w-full bg-red-500 p-1 px-2 rounded text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-x-auto">
        {/* Topbar */}
        <header className="bg-white shadow px-4 py-2 flex justify-between items-center">
          <button
            className={`lg:hidden p-2 text-gray-500 hover:text-gray-800 z-[999] ${
              isSidebarOpen ? "text-white" : ""
            }`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-black">
            {TRANSLATION.breadcrumb?.[router.pathname.split("/")[3]]}
          </h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DashboardLayout;
