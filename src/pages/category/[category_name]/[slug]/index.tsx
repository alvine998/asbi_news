import Layout from "@/components/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import { getSingleNews } from "@/pages/api/news";
import { INews } from "@/types/news";
import { getDatabase } from "firebase/database";
import { EyeIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailNews: NextPageWithLayout = () => {
  const [news, setNews] = useState<INews>();
  const params = useParams();
  useEffect(() => {
    const fetchNews = async () => {
      if (!params?.slug) {
        console.error("Slug is required to fetch news.");
        return;
      }
      try {
        const fetchedNews = await getSingleNews(params?.slug as string);
        setNews(fetchedNews);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNews();
  }, [params?.slug]);
  return (
    <div className="w-full bg-white px-4 shadow rounded h-auto py-4 my-4">
      <h1 className="text-4xl font-bold text-center text-black">
        {news?.title}
      </h1>
      <img
        src={news?.thumbnail}
        alt={news?.title}
        className="w-full h-full object-cover my-5"
      />
      <div className="flex gap-4 flex-row items-center">
        <p className="text-gray-600">
          {news?.author},{" "}
          {moment(news?.publishedAt).format("DD MMMM YYYY HH:mm")}
        </p>
        <EyeIcon className="w-4 h-4 text-gray-600" />
        <p className="text-gray-600">{news?.viewers}x dilihat</p>
      </div>
      <p
        className="text-md mt-4 text-justify text-black"
        dangerouslySetInnerHTML={{ __html: news?.content }}
      ></p>
      <h5 className="text-gray-800 mt-6 text-lg">
        <strong>Editor</strong>: {news?.editor}
      </h5>
      <p className="mt-2 text-black text-lg">Kata Kunci</p>
      <div className="flex flex-wrap gap-2 mb-8 mt-2">
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
    </div>
  );
};

DetailNews.getLayout = (page) => <Layout>{page}</Layout>;

export default DetailNews;
