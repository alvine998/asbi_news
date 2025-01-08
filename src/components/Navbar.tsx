import React, { useState } from "react";
import Input from "./Input";
import { AlignJustifyIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const categories: any[] = [
    { id: 1, name: "Bisnis" },
    { id: 2, name: "Teknologi" },
    { id: 3, name: "Olahraga" },
    { id: 4, name: "Politik" },
    { id: 5, name: "Hiburan" },
    { id: 6, name: "Kesehatan" },
    { id: 7, name: "Ekonomi" },
    { id: 8, name: "Sains" },
    { id: 9, name: "Agama" },
    { id: 10, name: "Budaya" },
    { id: 11, name: "Internasional" },
    { id: 12, name: "Opini" },
  ];
  const params = useParams();
  return (
    <div>
      <header className="bg-blue-600 text-white py-2 lg:px-28 px-2">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ASBI News</h1>
          <nav className="space-x-4 lg:block hidden">
            <Input placeholder="Cari berita disini..." />
          </nav>
          <button className="lg:hidden block" onClick={toggleSidebar}>
            <AlignJustifyIcon size={24} color="white" />
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
              <a href="#" className="hover:text-gray-700">
                Beranda
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="hover:text-gray-700">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-700">
                Kontak Kami
              </a>
            </li>
          </ul>
          <h2 className="text-xl font-bold mb-4 mt-4">Kategori Berita</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="mb-2">
                <Link
                  href={`/category/${category.name}`}
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
        <div className=" mb-8 lg:flex hidden lg:gap-4 gap-2 w-full justify-center items-center border-b-2 border-t-2 border-b-gray-700 border-t-gray-700 overflow-x-auto">
          {categories.map((category) => (
            <Link href={`/category/${category.name}`} onClick={()=>{setIsOpen(false)}} key={category.id}>
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