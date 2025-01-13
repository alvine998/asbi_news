import React, { useEffect, useState } from "react";
import Input from "./Input";
import { AlignJustifyIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getDatabase } from "firebase/database";
import { getCategories } from "@/pages/api/category";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const db = getDatabase();

  const fetchCategories = async () => {
    const data: any = await getCategories();
    setCategories(data);
  };
  useEffect(() => {
    fetchCategories();
  }, [db]);
  const params = useParams();
  return (
    <div>
      <header className="bg-white shadow py-2 lg:px-28 px-2">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"}>
            <img src="/images/asbi-logo.png" className="w-full lg:h-20 h-14" alt="asbilogo" />
          </Link>
          <nav className="space-x-4 lg:block hidden">
            <Input placeholder="Cari berita disini..." />
          </nav>
          <button className="lg:hidden block" onClick={toggleSidebar}>
            <AlignJustifyIcon size={24} color="black" />
          </button>
        </div>
        {/* Sidebar */}
        <div
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

      <div className="px-4 lg:px-28 mt-4">
        {/* Ad Space */}
        <div className="w-full mb-6 flex justify-center items-center">
          <div className="bg-gray-200 text-gray-700 text-center py-4 rounded-lg lg:w-1/2 w-full">
            <p>Your Ad Here</p>
            {/* Replace with an actual ad script or image */}
          </div>
        </div>
        <div className=" mb-8 lg:flex hidden lg:gap-2 gap-2 w-full justify-center items-center border-b-2 border-t-2 border-b-gray-700 border-t-gray-700 overflow-x-auto">
          <Link
            href={`/`}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <button
              className={`${
                params?.category_name === "/"
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
