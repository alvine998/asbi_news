// pages/index.tsx
import Footer from "@/components/Footer";
import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/Slider";
import { AlignJustifyIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { getDatabase } from "firebase/database";
import { getNews, getNewsPerCategory } from "./api/news";
import { INews } from "@/types/news";
import Loader from "@/components/Loader";
import moment from "moment";
import { filterAndCombine, formatCurrency, shuffleArray } from "@/utils";
import axios from "axios";
import { GetServerSideProps } from "next";
import axiosInstance from "@/utils/api";

interface Props {
  categories: any;
}

const Home: NextPageWithLayout = ({
  breaking_news,
  headline_news,
  news_today,
  recommended_news,
  popular_news,
  categories,
  side_ads,
  video_ads,
  tech_news,
}: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [kurs, setKurs] = useState<any>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
    }
  }, []);

  const getKurs = async () => {
    try {
      const result = await axios.get(
        `https://api.frankfurter.dev/v1/latest?base=USD`
      );
      setKurs(result.data.rates);
      localStorage.setItem(
        "kurs",
        JSON.stringify(moment().format("YYYY-MM-DD"))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const existKurs: any = localStorage.getItem("kurs");
    // Run the task immediately and schedule the next one
    if (!existKurs) {
      getKurs();
    }
    if (moment().format("YYYY-MM-DD") !== JSON.parse(existKurs)) {
      getKurs();
    }
  }, []);

  const currencySettings = [
    { code: "IDR", locale: "id-ID", currency: "IDR" },
    { code: "EUR", locale: "de-DE", currency: "EUR" },
    { code: "MYR", locale: "ms-MY", currency: "MYR" },
    { code: "AUD", locale: "en-AU", currency: "AUD" },
    { code: "JPY", locale: "ja-JP", currency: "JPY" },
    { code: "KRW", locale: "ko-KR", currency: "KRW" },
    { code: "CNY", locale: "zh-CN", currency: "CNY" },
  ];

  const finalheadlines = headline_news?.map((item: INews) => ({
    id: item?.id,
    title: item?.title,
    thumbnail: item?.thumbnail,
    link: `/category/${item?.category_name}/${item?.slug}`,
  }));
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
          <BannerSlider banners={finalheadlines} />
          <div className="mb-8 flex lg:flex-row flex-col justify-between w-full mt-4 gap-6">
            {/* Column 1 */}
            <section className="w-full flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-semibold mb-4 underline">
                  Berita Terkini
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {news_today.map((newsItem: any) => (
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
                        <h3 className="lg:text-md font-semibold mb-2">
                          {newsItem?.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {newsItem?.description?.substring(0, 100)}...
                        </p>
                        <p className="text-black mb-2 font-bold text-xs">
                          {moment(newsItem?.createdAt).format("DD MMMM YYYY")}
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
                {tech_news?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* News Tech */}
                    {shuffleArray(tech_news)
                      ?.slice(0, 2)
                      ?.map((newsItem: any) => (
                        <div
                          key={newsItem?.id}
                          className="bg-white shadow-md rounded-lg overflow-hidden flex lg:flex-row flex-col"
                        >
                          <img
                            src={newsItem?.thumbnail}
                            alt={`News ${newsItem?.id}`}
                            className="w-full lg:w-1/3 md:h-auto h-48 object-cover"
                          />
                          <div className="md:p-2 p-4">
                            <h3 className="text-lg font-semibold">
                              {newsItem?.title}
                            </h3>
                            <p className="text-gray-800">
                              {newsItem?.description?.substring(0, 100)}
                            </p>
                            <p className="text-gray-600">
                              {moment()?.format("DD MMMM YYYY HH:mm")}
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
                )}
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 underline">
                  Rekomendasi Berita Untukmu
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {shuffleArray(recommended_news)
                    ?.slice(0, 3)
                    .map((newsItem: any) => (
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

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommended_news?.slice(0, 26).map((newsItem: any) => (
                  <div
                    key={newsItem?.id}
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
                    {popular_news?.map((newsItem: INews) => (
                      <Link
                        key={newsItem?.id}
                        href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                        className="bg-white shadow-md rounded-lg px-4 py-2"
                      >
                        <h5 className="text-sm lg:text-md font-semibold text-black">
                          {newsItem?.title}
                        </h5>
                        <p className="text-gray-800 lg:text-md text-xs">
                          {newsItem?.description?.slice(0, 100)}
                        </p>
                        <p className="text-gray-800 font-bold lg:text-md text-xs">
                          {moment(newsItem?.published_at)?.format(
                            "DD MMMM YYYY HH:mm"
                          )}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 w-full h-auto py-2 px-4 bg-blue-200 shadow rounded">
                <h1 className="font-bold text-black text-center text-xl underline">
                  Kurs Dollar
                </h1>
                <div className="flex flex-col mt-4 border border-black">
                  {currencySettings.map(({ code, locale, currency }) => (
                    <div
                      key={code}
                      className="flex justify-between items-center border border-black"
                    >
                      <p className="font-bold text-black border border-black p-1 w-full">
                        {code}
                      </p>
                      <p className="text-black border border-black p-1 w-full">
                        {formatCurrency(kurs[code], locale, currency)}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  * Kurs diperbarui setiap 1 hari sekali pada 00:00 WIB
                </p>
              </div>

              <div>
                <img
                  src={
                    (shuffleArray(side_ads)?.[0] as { image: string })?.image
                  }
                  alt="side ads"
                  className="mt-10 rounded w-full lg:h-auto h-auto object-cover"
                />
              </div>

              <div className="w-full mt-10">
                <video
                  width={500}
                  height={300}
                  muted
                  loop
                  autoPlay
                  className="mt-4 rounded"
                >
                  <source
                    src={
                      (shuffleArray(video_ads)?.[0] as { image: string })?.image
                    }
                    type="video/mp4"
                  />
                </video>
              </div>
            </section>
          </div>
        </main>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  try {
    const [
      breaking_news,
      headline_news,
      news_today,
      recommended_news,
      popular_news,
      tech_news,
      ads,
      side_ads,
      video_ads,
      categories,
    ] = await Promise.all([
      axiosInstance.get(
        `/news?pagination=false&status=publish&breaking_news=1`
      ),
      axiosInstance.get(
        `/news?pagination=true&size=5&status=publish&headline=1`
      ),
      axiosInstance.get(`/news?pagination=true&page=0&size=3&status=publish`),
      axiosInstance.get(`/news?pagination=false&status=publish&recommended=1`),
      axiosInstance.get(`/news?pagination=true&page=0&size=6&status=publish&popular=1`),
      axiosInstance.get(
        `/news?pagination=false&status=publish&category_name=Teknologi`
      ),
      axiosInstance.get(`/ads?type=header`),
      axiosInstance.get(`/ads?type=side`),
      axiosInstance.get(`/ads?type=video`),
      axiosInstance.get("/categories"),
    ]);

    return {
      props: {
        breaking_news: breaking_news.data?.items,
        headline_news: headline_news.data?.items,
        news_today: news_today.data?.items,
        recommended_news: recommended_news.data?.items,
        popular_news: popular_news.data?.items,
        categories: categories?.data?.items || [],
        ads: ads?.data?.items || [],
        side_ads: side_ads?.data?.items || [],
        video_ads: video_ads?.data?.items || [],
        tech_news: tech_news.data?.items,
      },
    };
  } catch (error) {
    console.error("Server-side Error:", error);
    return {
      props: {
        data: null,
      },
    };
  }
};

Home.getLayout = (page: ReactElement) => (
  <Layout
    categories={(page.props as any).categories || []}
    ads={(page.props as any).ads || []}
    breakingNews={(page.props as any).breaking_news || []}
  >
    {page}
  </Layout>
);

export default Home;
