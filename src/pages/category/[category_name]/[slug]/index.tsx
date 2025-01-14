import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getSingleNews, updateViewers } from "@/pages/api/news";
import { INews } from "@/types/news";
import { shuffleArray } from "@/utils";
import { getDatabase } from "firebase/database";
import { EyeIcon, FacebookIcon, Share2Icon } from "lucide-react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DetailNews: NextPageWithLayout = () => {
  const [news, setNews] = useState<INews>();
  const [othernews, setOtherNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
  const pathname = usePathname();
  const currentUrl = `https://www.asbinews.com${pathname}`;
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      if (!params?.slug) {
        console.error("Slug is required to fetch news.");
        setLoading(false);
        return;
      }
      try {
        const fetchedNews = await getSingleNews(params?.slug as string);
        const otherNews: any = await getNews("publish");
        setNews(fetchedNews);
        setOtherNews(otherNews);
        await updateViewers(fetchedNews?.id as string);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [params?.slug]);

  return (
    <div className="min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full bg-white px-4 shadow rounded h-auto py-4 my-4">
          <Head>
            {/* Basic SEO Meta Tags */}
            <title>{news?.title}</title>
            <meta name="description" content={news?.description} />
            <meta name="author" content={"Alvine"} />
            <meta name="keywords" content={news?.keywords?.toString()} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={news?.title} />
            <meta property="og:description" content={news?.description} />
            <meta property="og:image" content={news?.thumbnail} />
            <meta property="og:url" content={currentUrl} />
            <meta property="article:author" content={"Alvine"} />
            <meta property="article:published_time" content={news?.createdAt} />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content={news?.thumbnail} />
            <meta name="twitter:title" content={news?.title} />
            <meta name="twitter:description" content={news?.description} />
            <meta name="twitter:image" content={news?.thumbnail} />
            <meta name="twitter:creator" content={"Alvine"} />
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1465977632288270"
              crossOrigin="anonymous"
            ></Script>
            <ins
              className="block adsbygoogle"
              data-ad-client="ca-pub-1465977632288270"
              data-ad-slot="2260079280"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <Script>(adsbygoogle = window.adsbygoogle || []).push({});</Script>
          </Head>
          {params?.slug && params?.category_name && (
            <div className="flex items-center justify-center mb-4">
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-500 p-2">
                  <FacebookIcon size={24} color="white" />
                </button>
              </Link>
              <Link
                href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=Check out this amazing content!`}
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
                href={`https://api.whatsapp.com/send?text=Ayo cek berita ini: ${currentUrl}`}
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
                href={`https://t.me/share/url?url=${currentUrl}&text=Ayo cek berita ini!`}
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
                    .writeText(`${currentUrl}`)
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
          <h1 className="lg:text-4xl text-2xl font-bold text-center text-black">
            {news?.title}
          </h1>
          <img
            src={news?.thumbnail}
            alt={news?.title}
            className="w-full h-full object-cover my-5"
          />
          <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
            <p className="text-gray-600">
              {news?.author},{" "}
              {moment(news?.publishedAt).format("DD MMMM YYYY HH:mm")}
            </p>
            <div className="flex gap-2 flex-row items-center">
              <EyeIcon className="w-4 h-4 text-gray-600" />
              <p className="text-gray-600">{news?.viewers}x dilihat</p>
            </div>
          </div>
          <p
            className="text-md mt-4 text-justify text-black"
            dangerouslySetInnerHTML={{ __html: news?.content }}
          ></p>

          <hr className="mt-8 border-b-2" />
          <h5 className="text-gray-800 mt-6 text-lg">
            <strong>Editor</strong>: {news?.editor}
          </h5>
          <h5 className="text-gray-800 mt-2 text-md">
            <strong>Sumber</strong>: {news?.source}
          </h5>
          <p className="mt-2 text-black text-lg">Kata Kunci</p>
          <div className="flex flex-wrap gap-2 mt-2 mb-8">
            {news?.keywords?.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 underline">
              Berita Lainnya
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* News Card */}
              {shuffleArray(othernews)
                ?.slice(0, 3)
                .map((newsItem) => (
                  <div
                    key={newsItem?.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={`${newsItem?.thumbnail}`}
                      alt={`News ${newsItem?.id}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        {newsItem?.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {newsItem?.description?.slice(0, 100)}
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
        </div>
      )}
    </div>
  );
};

DetailNews.getLayout = (page) => <Layout>{page}</Layout>;

export default DetailNews;
