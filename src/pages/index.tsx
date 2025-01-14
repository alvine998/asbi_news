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
import moment from "moment";
import { shuffleArray } from "@/utils";

const Home: NextPageWithLayout = () => {
  const [news, setNews] = useState<any[]>([]);
  const [headlines, setHeadlines] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [populars, setPopulars] = useState<any[]>([]);

  // Firebase Database Reference
  const db = getDatabase();

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data: any = await getNews("publish");
      const popularData: any = await getNews("publish", true);

      let headlines: any = await getHeadlines();
      const finalheadlines = headlines?.map((item: INews) => ({
        id: item?.id,
        title: item?.title,
        thumbnail: item?.thumbnail,
        link: `/category/${item?.category}/${item?.slug}`,
      }));
      setNews(data);
      setPopulars(popularData);
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
      <Head>
        <title>Asbi News</title>
        <meta
          name="description"
          content="Asbi News adalah platform berita terkini dan terpercaya di Indonesia. Dapatkan informasi terkini tentang politik, ekonomi, dan teknologi melalui berita terbaik kami."
        />
        <meta
          name="keywords"
          content="asbinews, asbi, berita, politik, ekonomi, teknologi"
        />
        <meta name="author" content="Alvine" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://asbinews.com/" />

        <meta property="og:title" content="Asbi News" />
        <meta
          property="og:description"
          content="Asbi News adalah platform berita terkini dan terpercaya di Indonesia. Dapatkan informasi terkini tentang politik, ekonomi, dan teknologi melalui berita terbaik kami."
        />
        <meta property="og:url" content="https://asbinews.com/" />
        <meta property="og:image" content="/images/asbi-logo.png" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Asbi News" />
        <meta
          name="twitter:description"
          content="Asbi News adalah platform berita terkini dan terpercaya di Indonesia. Dapatkan informasi terkini tentang politik, ekonomi, dan teknologi melalui berita terbaik kami."
        />
        <meta name="twitter:image" content="/images/asbi-logo.png" />
      </Head>
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
                  Rekomendasi Berita Untukmu
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* News Card */}
                  {shuffleArray(news)
                    ?.slice(0, 3)
                    .map((newsItem) => (
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
            </section>

            {/* Column 2 */}
            <section className="lg:w-1/3 w-full">
              {loading ? (
                <Loader />
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 underline">
                    Berita Terpopuler
                  </h2>
                  <div className="flex flex-col gap-2">
                    {/* Popular News Card */}
                    {populars?.map((newsItem: INews) => (
                      <Link
                        key={newsItem?.id}
                        href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                        className="bg-white shadow-md rounded-lg p-4"
                      >
                        <h5 className="text-lg font-semibold text-black">
                          {newsItem?.title}
                        </h5>
                        <p className="text-gray-800">
                          {newsItem?.description?.slice(0, 100)}
                        </p>
                        <p className="text-gray-500 mb-4 mt-2">
                          {moment(newsItem?.publishedAt)?.format(
                            "DD MMMM YYYY HH:mm"
                          )}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      )}
    </div>
  );
};

Home.getLayout = (page) => <Layout>{page}</Layout>;

export default Home;
