import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getSingleNews, updateViewers } from "@/pages/api/news";
import { INews } from "@/types/news";
import { shuffleArray } from "@/utils";
import { getDatabase } from "firebase/database";
import { EyeIcon } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DetailNews: NextPageWithLayout = () => {
  const [news, setNews] = useState<INews>();
  const [othernews, setOtherNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams();
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
