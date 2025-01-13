// pages/index.tsx
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/Slider";
import { AlignJustifyIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { getDatabase } from "firebase/database";
import { getHeadlines, getNews } from "./api/news";
import { INews } from "@/types/news";
import Loader from "@/components/Loader";

const Home: NextPageWithLayout = () => {
  const [news, setNews] = useState<any[]>([]);
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Firebase Database Reference
  const db = getDatabase();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data: any = await getNews("publish");
      let headlines: any = await getHeadlines();
      const finalheadlines = headlines?.map((item: INews) => ({
        id: item?.id,
        title: item?.title,
        thumbnail: item?.thumbnail,
        link: `/category/${item?.category}/${item?.slug}`,
      }));
      setNews(data);
      setHeadlines(finalheadlines);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNews();
  }, [db]);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      {loading ? (
        <Loader />
      ) : (
        <main className="container mx-auto py-4 lg:px-4 px-4">
          <BannerSlider banners={headlines} />
          <div className="mb-8 flex lg:flex-row flex-col justify-between w-full mt-4 gap-6">
            {/* Column 1 */}
            <section className="w-full flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4 underline">
                  Berita Terkini
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* News Card */}
                  {news?.slice(0, 3).map((newsItem) => (
                    <div
                      key={newsItem}
                      className="bg-white shadow-md rounded-lg overflow-hidden"
                    >
                      <img
                        src={newsItem?.thumbnail}
                        alt={`News ${newsItem?.id}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                          {newsItem?.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {newsItem?.description?.substring(0, 100)}...
                        </p>
                        <Link
                          href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Baca Selengkapnya
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor.
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor.
                    </p>
                    <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
                  </Link>
                </div>
              </div>
              <div className="mt-4"></div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
