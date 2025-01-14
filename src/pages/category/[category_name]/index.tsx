import Layout from "@/components/Layout";
import Loader from "@/components/Loader";
import { NextPageWithLayout } from "@/pages/_app";
import { getNews, getNewsByCategory } from "@/pages/api/news";
import { INews } from "@/types/news";
import { filterAndCombine } from "@/utils";
import { getDatabase } from "firebase/database";
import moment from "moment";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

/**
 * This is the main index page for a category.
 *
 * @returns The component for the index page.
 */
const ListCategory: NextPageWithLayout = () => {
  const params: any = useParams();
  const router = useRouter();
  const [page, setPage] = useState<any>(router.query?.page || "1");
  const [news, setNews] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [populars, setPopulars] = useState<any[]>([]);

  // Firebase Database Reference
  const db = getDatabase();

  const fetchNews = async () => {
    setLoading(true);
    const dataCategoryName: any = await getNews(
      "category_name",
      params?.category_name as string
    );
    const dataPublish: any = await getNews("publish");
    let data = filterAndCombine(dataCategoryName, dataPublish);
    const popularData: any = await getNews("popular");
    const finalData = filterAndCombine(dataPublish, popularData);
    setNews(data);
    setPopulars(finalData);
    setFiltered(data); // Set initial filtered categories
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [db, params?.category_name]);

  useEffect(() => {
    const { query }: any = router.query; // Extract 'query' from the URL
    if (query) {
      const filtered = news.filter((item) =>
        item.name.toLowerCase().includes(query?.search.toString().toLowerCase())
      );
      setFiltered(filtered);
    } else {
      setFiltered(news); // If no query, show all news
    }
  }, [router.query, news]); // Run effect whenever the query or categories change

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1); // Reset to the first page on rows change
  };

  // Filter data by the search text
  // const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterText(event.target.value);
  //   const filtered = news.filter((item) =>
  //     item.name.toLowerCase().includes(event.target.value.toLowerCase())
  //   );
  //   setFiltered(filtered);
  // };

  // Calculate the data to be displayed based on the current page and rows per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered?.slice(indexOfFirstItem, indexOfLastItem);
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
                Berita {params?.category_name}
              </h2>
              {currentItems?.length > 0 ? (
                <>
                  <div className="flex flex-col gap-6 ">
                    {/* News Card */}
                    {currentItems?.map((newsItem: INews) => (
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
                            href={`/category/${params?.category_name}/${newsItem?.slug}`}
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
                <h2 className="mt-2 text-2xl text-black ">Belum Ada Berita</h2>
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
      )}
    </div>
  );
};

ListCategory.getLayout = (page) => <Layout>{page}</Layout>;

export default ListCategory;
