import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getNewsByCategory } from "@/pages/api/news";
import { INews } from "@/types/news";
import { filterAndCombine } from "@/utils";
import axiosInstance from "@/utils/api";
import { getDatabase } from "firebase/database";
import moment from "moment";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";

/**
 * This is the main index page for a category.
 *
 * @returns The component for the index page.
 */
const SearchNews: NextPageWithLayout = ({news, popular_news}: any) => {
  const params: any = useParams();
  const router = useRouter();
  const [page, setPage] = useState<any>(router.query?.page || "1");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [populars, setPopulars] = useState<any[]>([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1); // Reset to the first page on rows change
    
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div className="mb-8 flex lg:flex-row flex-col justify-between w-full mt-4 gap-6">
          {/* Column 1 */}
          <section className="w-full flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Cari Berita
              </h2>
              {news?.length > 0 ? (
                <>
                  <div className="flex flex-col gap-6 ">
                    {/* News Card */}
                    {news?.map((newsItem: INews) => (
                      <div
                        key={newsItem?.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden flex lg:flex-row flex-col"
                      >
                        <img
                          src={newsItem?.thumbnail}
                          alt={`News ${newsItem?.id}`}
                          className="w-full lg:w-1/4 h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {newsItem?.title}
                          </h3>
                          <p className="text-gray-800 mb-2">
                            {newsItem?.description?.substring(0, 100)}
                          </p>
                          <p className="text-gray-600 mb-4">
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

                  {/* Pagination */}
                  {filtered?.length > 5 && (
                    <div>
                      <ul className="flex justify-center mt-4">
                        <li className="mx-2">
                          <button
                            onClick={() => handleRowsPerPageChange(5)}
                            type="button"
                            className={`${
                              router.query?.page === "1" ||
                              router.query?.page === undefined
                                ? "pointer-events-none text-black hidden"
                                : "text-blue-600 hover:underline block"
                            } duration-200 transition-all`}
                          >
                            &laquo; Sebelumnya
                          </button>
                        </li>
                        <li className="mx-2">
                          <button
                            onClick={() => handlePageChange(1)}
                            type="button"
                            className={`${
                              router.query?.page === "1" ||
                              router.query?.page === undefined
                                ? "pointer-events-none text-black"
                                : "text-blue-600 hover:underline"
                            } duration-200 transition-all`}
                          >
                            1
                          </button>
                        </li>
                        <li className="mx-2">
                          <button
                            onClick={() => handlePageChange(2)}
                            type="button"
                            className={`${
                              router.query?.page === "2"
                                ? "pointer-events-none text-black"
                                : "text-blue-600 hover:underline"
                            } duration-200 transition-all`}
                          >
                            2
                          </button>
                        </li>
                        <li className="mx-2">
                          <button
                            onClick={() => handlePageChange(3)}
                            type="button"
                            className={`${
                              router.query?.page === "3"
                                ? "pointer-events-none text-black"
                                : "text-blue-600 hover:underline"
                            } duration-200 transition-all`}
                          >
                            3
                          </button>
                        </li>
                        <li className="mx-2">
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            type="button"
                            className={`${
                              router.query?.page === "3"
                                ? "pointer-events-none text-black"
                                : "text-blue-600 hover:underline"
                            } duration-200 transition-all`}
                          >
                            Selanjutnya &raquo;
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <h2 className="mt-2 text-2xl text-black ">Berita Tidak Ditemukan</h2>
              )}
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
                      <h5 className="text-sm lg:text-lg font-semibold text-black">
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
          </section>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query, params } = context;
  try {
    const [news, popular_news, ads, categories] = await Promise.all([
      axiosInstance.get(
        `/news?pagination=true&size=${query?.size || 10}&status=publish&search=${params?.q}`
      ),
      axiosInstance.get(`/news?pagination=false&status=publish&popular=1`),
      axiosInstance.get(`/ads?type=header`),
      axiosInstance.get("/categories"),
    ]);

    return {
      props: {
        popular_news: popular_news.data?.items,
        news: news.data?.items,
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

SearchNews.getLayout = (page: ReactElement) => (
  <Layout
    categories={(page.props as any).categories || []}
    ads={(page.props as any).ads || []}
    breakingNews={(page.props as any).breaking_news || []}
  >
    {page}
  </Layout>
);

export default SearchNews;
