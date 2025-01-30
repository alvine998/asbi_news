import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getSingleNews, updateViewers } from "@/pages/api/news";
import { INews } from "@/types/news";
import { shuffleArray } from "@/utils";
import DOMPurify from "dompurify";
import { getDatabase } from "firebase/database";
import { EyeIcon, FacebookIcon, Share2Icon } from "lucide-react";
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

const DetailNews: NextPageWithLayout = ({ other_news, detail_news }: any) => {
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
            src={news?.thumbnail}
            alt={news?.title}
            className="w-full h-full object-cover my-5"
          />
          <div className="flex lg:gap-4 gap-2 lg:flex-row flex-col">
            <p className="text-gray-600">
              {news?.author},{" "}
              {moment(news?.published_at).format("DD MMMM YYYY HH:mm")}
            </p>
            <div className="flex gap-2 flex-row items-center">
              <EyeIcon className="w-4 h-4 text-gray-600" />
              <p className="text-gray-600">{news?.viewers}x dilihat</p>
            </div>
          </div>
          <div
            className="text-md mt-4 text-justify text-black ql-editor"
            dangerouslySetInnerHTML={{ __html: news?.content }}
          ></div>

          <hr className="mt-8 border-b-2" />
          <h5 className="text-gray-800 mt-6 text-lg">
            <strong>Editor</strong>: {news?.editor}
          </h5>
          <h5 className="text-gray-800 mt-2 text-md">
            <strong>Sumber</strong>: {news?.source}
          </h5>
          <p className="mt-2 text-black text-lg">Kata Kunci</p>
          <div className="flex flex-wrap gap-2 mt-2 mb-8">
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
            <h2 className="text-2xl font-semibold mb-4 underline">
              Berita Lainnya
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* News Card */}
              {shuffleArray(other_news)
                ?.slice(0, 3)
                .map((newsItem: any) => (
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
                      <a
                        href={`/category/${newsItem?.category_name}/${newsItem?.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Baca Selengkapnya
                      </a>
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

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query, params } = context;
  try {
    const [detail_news, other_news, ads, categories] = await Promise.all([
      axiosInstance.get(
        `/news?pagination=true&size=1&status=publish&slug=${query?.slug}`
      ),
      axiosInstance.get(`/news?pagination=true&size=20&status=publish`),
      axiosInstance.get(`/ads?type=header`),
      axiosInstance.get("/categories"),
    ]);

    return {
      props: {
        other_news: other_news.data?.items,
        detail_news: detail_news.data?.items?.[0],
        categories: categories?.data?.items || [],
        ads: ads?.data?.items || [],
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
    news={(page.props as any).detail_newsnews || null}
  >
    {page}
  </Layout>
);

export default DetailNews;
