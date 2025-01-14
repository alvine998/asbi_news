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
import { toast } from "react-toastify";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [ads, setAds] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const db = getDatabase();
  const params = useParams();
  const pathname = usePathname();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data: any = await getCategories();
      const ads: any = await getAds();
      setCategories(data);
      setAds(shuffleArray(ads)[0]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [db]);

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

  return (
    <div>
      <header className="bg-white shadow py-2 lg:px-28 px-2">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={"/"}>
            <img
              src="/images/asbi-logo.png"
              className="w-full lg:h-20 h-14"
              alt="asbilogo"
            />
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

      <div className="px-4 lg:px-28 mt-4">
        {/* Ad Space */}
        <div className="w-full mb-6 flex flex-col gap-2 justify-center items-center">
          <div className="bg-gray-200 text-gray-700 text-center rounded-lg lg:w-full w-full">
            {/* <p>Your Ad Here</p> */}
            {loading ? (
              <Loader />
            ) : (
              <img
                src={ads?.image}
                alt="ads"
                className="w-full lg:h-[250px] h-[100px] rounded"
              />
            )}

            {/* Replace with an actual ad script or image */}
          </div>
          {params?.slug && params?.category_name && (
            <div className="flex items-center justify-center">
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=https://asbinews.com/category/${params?.category_name}/${params?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-500 p-2">
                  <FacebookIcon size={24} color="white" />
                </button>
              </Link>
              <Link
                href={`https://twitter.com/intent/tweet?url=https://asbinews.com/category/${params?.category_name}/${params?.slug}&text=Check out this amazing content!`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-white shadow p-2">
                  <img
                    src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/x-jvgvt5gje92oz29ez4fgd.png/x-0muuxjzgzvtlpaduv3p4k2s.png?_a=DAJFJtWIZAAC"
                    alt="xicon"
                    className="w-6"
                  />
                </button>
              </Link>

              <Link
                href={`https://api.whatsapp.com/send?text=Ayo cek berita ini: https://asbinews.com/category/${params?.category_name}/${params?.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-green-500 shadow p-2">
                  <img
                    src="https://static-00.iconduck.com/assets.00/whatsapp-icon-2040x2048-8b5th74o.png"
                    alt="waicon"
                    className="w-6"
                  />
                </button>
              </Link>

              <Link
                href={`https://t.me/share/url?url=https://asbinews.com/category/${params?.category_name}/${params?.slug}&text=Ayo cek berita ini!`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-400 shadow p-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png"
                    alt="teleicon"
                    className="w-6"
                  />
                </button>
              </Link>

              <button
                className="bg-black p-2"
                onClick={() => {
                  navigator.clipboard
                    .writeText(
                      `https://asbinews.com/category/${params?.category_name}/${params?.slug}`
                    )
                    .then(() => {
                      toast.success("Link berhasil disalin!", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                      });
                    })
                    .catch((err) => {
                      console.error("Failed to copy link: ", err);
                    });
                }}
              >
                <Share2Icon size={24} color="white" />
              </button>
            </div>
          )}
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
