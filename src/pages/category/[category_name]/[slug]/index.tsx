import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getSingleNews, updateViewers } from "@/pages/api/news";
import { INews } from "@/types/news";
import { shuffleArray } from "@/utils";
import DOMPurify from "dompurify";
import { getDatabase } from "firebase/database";
import { EyeIcon, FacebookIcon, PlusIcon, Share2Icon } from "lucide-react";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Script from "next/script";
import React, { ReactElement, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-quill-new/dist/quill.snow.css";
import { GetServerSideProps } from "next";
import axiosInstance from "@/utils/api";
import axios from "axios";
import { useRouter } from "next/router";

const DetailNews: NextPageWithLayout = ({
  other_news,
  detail_news,
  side_ads,
}: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  let news = detail_news;

  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // You are on the client-side now
      setCurrentUrl(`${window.location.origin}${router.asPath}`);
    }
  }, [router]);

  const updateViews = async () => {
    try {
      const payload = {
        id: news?.id,
        viewers: (news?.viewers || 0) + 1,
      };
      const response = await axios.post("/api/express/news/update", payload); // Fetch from your API route
    } catch (error) {
      console.error("Client-side Error:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(false);
      updateViews();
    }
  }, []);

  let keywords = process.env.NEXT_PUBLIC_API_BASE_URL?.includes("localhost")
    ? news?.keywords
    : JSON.parse(news.keywords);

  return (
    <div className="min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full bg-white px-4 shadow rounded h-auto py-4 my-4">
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
          <h1 className="lg:text-4xl text-2xl font-bold text-center text-black">
            {news?.title}
          </h1>
          <img
            src={
              news?.thumbnail?.includes("https://")
                ? news?.thumbnail
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${news?.thumbnail}`
            }
            alt={news?.title}
            className="w-full h-full object-cover my-5"
          />
          <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
            <p className="text-gray-600">
              {news?.author},{" "}
              {moment(news?.published_at)
                .subtract(7, "hours")
                .format("DD MMMM YYYY HH:mm")}
            </p>
            <div className="flex gap-2 flex-row items-center">
              <EyeIcon className="w-4 h-4 text-gray-600" />
              <p className="text-gray-600">{news?.viewers}x dilihat</p>
            </div>
          </div>
          <div
            className="text-md mt-4 text-justify text-black ql-editor quill-content prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(news?.content) as string,
            }}
          ></div>

          <hr className="mt-4 border-b-2" />
          <h5 className="text-gray-800 mt-1 text-lg">
            <strong>Editor</strong>: {news?.editor}
          </h5>
          <h5 className="text-gray-800 mt-1 text-md">
            <strong>Sumber</strong>: {news?.source}
          </h5>
          <p className="mt-1 text-black text-lg">Kata Kunci</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {keywords?.map((tag: any, index: number) => (
              <span
                key={index}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            {/* Berita Lainnya */}
            <h2 className="text-2xl font-semibold mb-2 mt-2 underline">
              Berita Lainnya
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {/* News Card */}
              {shuffleArray(other_news)
                ?.slice(0, 4)
                .map((newsItem: any) => (
                  <div
                    key={newsItem?.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden flex flex-row"
                  >
                    <img
                      src={
                        newsItem?.thumbnail?.includes("https://")
                          ? newsItem?.thumbnail
                          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${newsItem?.thumbnail}`
                      }
                      alt={`News ${newsItem?.id}`}
                      className="w-1/2 lg:w-1/3 md:h-auto h-auto object-cover"
                    />
                    <div className="p-1">
                      <h3 className="lg:text-lg text-xs font-semibold">
                        {newsItem?.title?.substring(0, 100)}...
                      </h3>
                      <p className="text-gray-600 lg:text-md text-xs">
                        {moment(newsItem?.published_at)
                          ?.subtract(7, "hours")
                          ?.format("DD MMMM YYYY HH:mm")}
                      </p>
                      <Link
                        href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                        className="text-blue-600 hover:underline font-medium lg:text-md text-xs"
                      >
                        Baca Selengkapnya
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            {/* Baca Juga */}
            <h2 className="text-2xl font-semibold mb-2 mt-2 underline">
              Baca Juga
            </h2>
            <div className="flex flex-col gap-2 mt-2">
              {/* Numbering Card */}
              {shuffleArray(other_news)
                ?.slice(0, 4)
                .map((newsItem: any, idx: number) => (
                  <Link
                    href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                    key={newsItem}
                    className="bg-blue-100 shadow-md rounded-lg overflow-hidden flex gap-1 flex-row items-center p-2"
                  >
                    <div className="bg-blue-400 rounded-full p-2 items-center justify-center w-[40px] md:w-[40px] sm:w-[40px]">
                      <p className="text-white text-center">{idx + 1}</p>
                    </div>
                    <div className="p-1 w-full mt-1">
                      <h3 className="lg:text-md font-semibold mb-2">
                        {newsItem?.title}
                      </h3>
                      {/* <p className="text-black mb-2 font-bold text-xs">
                      {moment(newsItem?.createdAt)
                        ?.subtract(7, "hours")
                        .format("DD MMMM YYYY")}
                    </p> */}
                    </div>
                  </Link>
                ))}
            </div>

            {/* Ads & Berita Pilihan Harian */}
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 items-end">
              <div>
                <img
                  src={
                    (
                      shuffleArray(side_ads)?.[0] as { image: string }
                    )?.image?.includes("https://")
                      ? (shuffleArray(side_ads)?.[0] as { image: string })
                          ?.image
                      : `${process.env.NEXT_PUBLIC_API_BASE_URL}${
                          (shuffleArray(side_ads)?.[0] as { image: string })
                            ?.image
                        }`
                  }
                  alt="side ads"
                  className="mt-10 rounded w-full lg:h-auto h-auto object-cover"
                />
              </div>
              <div>
                <div className="flex flex-col gap-2 border-2 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <h2 className="lg:text-4xl text-xl font-semibold">
                      Berita Pilihan Harian
                    </h2>
                    <PlusIcon />
                  </div>
                  {shuffleArray(other_news)
                    ?.slice(0, 4)
                    .map((newsItem: any) => (
                      <div className="border-b-2 pb-2">
                        {/* Desktop */}
                        <Link
                          href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                          className="p-1 bg-gray-300 rounded w-full lg:flex flex-row gap-2 justify-between lg:items-start items-center hidden"
                        >
                          <div className="lg:p-2 p-1 w-full">
                            <p className="lg:text-sm text-xs">
                              {moment(newsItem?.published_at).format(
                                "dddd, DD MMMM YYYY HH:mm"
                              )}
                            </p>
                            <p className="lg:text-md text-sm font-bold mt-2">
                              {newsItem?.title}
                            </p>
                            <p className="lg:text-xs">
                              {newsItem?.description?.substring(0, 100)}
                              ...
                            </p>
                          </div>
                          <div className="lg:w-1/2 w-full">
                            <img
                              src={
                                newsItem?.thumbnail?.includes("https://")
                                  ? newsItem?.thumbnail
                                  : `${process.env.NEXT_PUBLIC_API_BASE_URL}${newsItem?.thumbnail}`
                              }
                              alt="pesona"
                              className="lg:w-auto w-full h-full"
                            />
                          </div>
                        </Link>

                        {/* Mobile */}
                        <Link
                          href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                          className="bg-white shadow-md rounded-lg overflow-hidden lg:hidden flex flex-row"
                        >
                          <div className="md:p-2 p-2">
                            <p className="text-gray-600 lg:text-md text-xs">
                              {moment(newsItem?.published_at)
                                ?.subtract(7, "hours")
                                ?.format("DD MMMM YYYY HH:mm")}
                            </p>
                            <h3 className="lg:text-lg text-xs font-semibold">
                              {newsItem?.title?.substring(0, 50)}...
                            </h3>
                          </div>
                          <img
                            src={
                              newsItem?.thumbnail?.includes("https://")
                                ? newsItem?.thumbnail
                                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${newsItem?.thumbnail}`
                            }
                            alt={`News ${newsItem?.id}`}
                            className="w-1/2 lg:w-1/3 md:h-auto h-auto object-cover"
                          />
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query, params } = context;
  try {
    const [detail_news, other_news, ads, categories, breaking_news, side_ads] =
      await Promise.all([
        axiosInstance.get(
          `/news?pagination=true&size=1&status=publish&slug=${query?.slug}`
        ),
        axiosInstance.get(`/news?pagination=true&size=20&status=publish`),
        axiosInstance.get(`/ads?type=header`),
        axiosInstance.get("/categories"),
        axiosInstance.get(
          `/news?pagination=false&status=publish&breaking_news=1`
        ),
        axiosInstance.get(`/ads?type=side`),
      ]);

    return {
      props: {
        other_news: other_news.data?.items,
        detail_news: detail_news.data?.items?.[0],
        categories: categories?.data?.items || [],
        ads: ads?.data?.items || [],
        breaking_news: breaking_news.data?.items,
        side_ads: side_ads.data?.items,
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

DetailNews.getLayout = (page: ReactElement) => (
  <Layout
    categories={(page.props as any).categories || []}
    ads={(page.props as any).ads || []}
    breakingNews={(page.props as any).breaking_news || []}
    news={(page.props as any).detail_news || null}
  >
    {page}
  </Layout>
);

export default DetailNews;
