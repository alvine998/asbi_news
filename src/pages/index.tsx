// pages/index.tsx
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/Slider";
import { AlignJustifyIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const Home = () => {
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
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto py-4 lg:px-28 px-4">
        <BannerSlider />
        <div className="mb-8 flex lg:flex-row flex-col justify-between w-full mt-4 gap-6">
          {/* Column 1 */}
          <section className="w-full flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Berita Terkini
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* News Card */}
                {[1, 2, 3].map((newsItem) => (
                  <div
                    key={newsItem}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://via.placeholder.com/400x200?text=News+${newsItem}`}
                      alt={`News ${newsItem}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        News Title {newsItem}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <Link
                        href={`/category/news/${newsItem}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Teknologi
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* News Card */}
                {[1, 2, 3].map((newsItem) => (
                  <div
                    key={newsItem}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://via.placeholder.com/400x200?text=News+${newsItem}`}
                      alt={`News ${newsItem}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        News Title {newsItem}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <Link
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Column 2 */}
          <section className="lg:w-1/3 w-full">
            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Berita Terpopuler
              </h2>
              <div className="flex flex-col gap-2">
                {/* Popular News Card */}
                <Link
                  href="/news/1"
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h5 className="text-lg font-semibold text-black">
                    Judul Berita
                  </h5>
                  <p className="text-gray-800">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor.
                  </p>
                  <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                </Link>
                <Link
                  href="/news/1"
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h5 className="text-lg font-semibold text-black">
                    Judul Berita
                  </h5>
                  <p className="text-gray-800">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor.
                  </p>
                  <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                </Link>
                <Link
                  href="/news/1"
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h5 className="text-lg font-semibold text-black">
                    Judul Berita
                  </h5>
                  <p className="text-gray-800">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor.
                  </p>
                  <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                </Link>
                <Link
                  href="/news/1"
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h5 className="text-lg font-semibold text-black">
                    Judul Berita
                  </h5>
                  <p className="text-gray-800">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor.
                  </p>
                  <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                </Link>
                <Link
                  href="/news/1"
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h5 className="text-lg font-semibold text-black">
                    Judul Berita
                  </h5>
                  <p className="text-gray-800">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor.
                  </p>
                  <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                </Link>
              </div>
            </div>
            <div className="mt-4"></div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
