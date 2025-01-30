import React, { useEffect, useRef, useState } from "react";
import Input from "./Input";
import {
  AlignJustifyIcon,
  FacebookIcon,
  Share2Icon,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getDatabase } from "firebase/database";
import { getCategories } from "@/pages/api/category";
import { getAds } from "@/pages/api/ads";
import Loader from "./Loader";
import { shuffleArray } from "@/utils";
import moment from "moment";
import "moment/locale/id"; // Import Indonesian locale
import { GetServerSideProps } from "next";
import axiosInstance from "@/utils/api";
import { useRouter } from "next/router";

// Set the locale to Indonesian
moment.locale("id");

interface Props {
  categories: any[];
  ads: any[];
}

export default function Navbar({ categories, ads }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Function to handle clicks outside of the sidebar
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [query, setQuery] = useState<string>(params?.q as string || "");

  const handleSearch = () => {
    // Call your search function or API here
    router.push(`/search/${query}`);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <header className="bg-white shadow py-2 lg:px-20 px-2">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"}>
            <img
              src="/images/asbi-logo.png"
              className="w-full lg:h-20 h-14"
              alt="asbilogo"
            />
          </Link>
          <nav className="space-x-2 lg:flex hidden gap-2 items-center">
            <p>{moment().format("dddd, DD MMMM YYYY")}</p>
            <Input
              placeholder="Cari berita disini..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </nav>
          <button className="lg:hidden block" onClick={toggleSidebar}>
            <AlignJustifyIcon size={24} color="black" />
          </button>
        </div>
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed top-0 right-0 h-full w-64 z-[999] bg-white text-black p-6 shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button className="absolute top-4 right-4" onClick={toggleSidebar}>
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <Link
                href="/"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="hover:text-gray-700"
              >
                Beranda
              </Link>
            </li>
            <li className="mb-2">
              <Link href="#" className="hover:text-gray-700">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray-700">
                Kontak Kami
              </Link>
            </li>
          </ul>
          <h2 className="text-xl font-bold mb-4 mt-4">Kategori Berita</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="mb-2">
                <Link
                  href={`/category/${category.name}`}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="hover:text-gray-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="px-4 lg:px-20 mt-4">
        {/* Ad Space */}
        <div className="w-full mb-6 flex flex-col gap-2 justify-center items-center">
          <div className="bg-gray-200 text-gray-700 text-center rounded-lg lg:w-full w-full">
            {/* <p>Your Ad Here</p> */}
            {loading ? (
              <Loader />
            ) : (
              <img
                src={shuffleArray(ads)?.[0]?.image}
                alt="ads"
                className="w-full lg:h-[250px] h-[100px] rounded"
              />
            )}

            {/* Replace with an actual ad script or image */}
          </div>
        </div>
        <div className=" mb-2 lg:flex hidden lg:gap-2 gap-2 w-full justify-center items-center border-b-2 border-t-2 border-b-gray-700 border-t-gray-700 overflow-x-auto">
          <Link
            href={`/`}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <button
              className={`${
                params?.category_name === "/" || !params?.category_name
                  ? "text-blue-700"
                  : "text-black hover:text-blue-700"
              } font-semibold lg:px-4 px-0 py-1 rounded-md  duration-200 transition-colors`}
            >
              Beranda
            </button>
          </Link>
          {categories?.slice(0, 12).map((category) => (
            <Link
              href={`/category/${category.name}`}
              onClick={() => {
                setIsOpen(false);
              }}
              key={category.id}
            >
              <button
                className={`${
                  params?.category_name === category.name
                    ? "text-blue-700"
                    : "text-black hover:text-blue-700"
                } font-semibold lg:px-4 px-0 py-1 rounded-md  duration-200 transition-colors`}
              >
                {category.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
