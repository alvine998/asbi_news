import Layout from "@/components/Layout";
import { NextPageWithLayout } from "@/pages/_app";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState } from "react";

/**
 * This is the main index page for a category.
 *
 * @returns The component for the index page.
 */
const ListCategory: NextPageWithLayout = () => {
  const params = useParams();
  const router = useRouter();
  const [page, setPage] = useState<any>(router.query?.page || "1");

  const nextPage = () => {
    setPage(+page + 1);
    router.push(`/category/${params?.category_name}?page=${+page + 1}`);
  };

  const prevPage = () => {
    setPage(+page - 1);
    router.push(`/category/${params?.category_name}?page=${+page - 1}`);
  };

  const handlePageChange = (page: any) => {
    setPage(page);
    router.push(`/category/${params?.category_name}?page=${page}`);
  };
  return (
    <div>
      <div className="mb-8 flex lg:flex-row flex-col justify-between w-full mt-4 gap-6">
        {/* Column 1 */}
        <section className="w-full flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4 underline">
              Berita {params?.category_name}
            </h2>
            <div className="flex flex-col gap-6 ">
              {/* News Card */}
              {[1, 2, 3, 4, 5].map((newsItem) => (
                <div
                  key={newsItem}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex lg:flex-row flex-col"
                >
                  <img
                    src={`https://via.placeholder.com/400x200?text=News+${newsItem}`}
                    alt={`News ${newsItem}`}
                    className="w-full lg:w-1/4 h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      News Title {newsItem}
                    </h3>
                    <p className="text-gray-800 mb-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <p className="text-gray-600 mb-4">9 jam yang lalu</p>
                    <Link
                      href={`/category/${params?.category_name}/${newsItem}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div>
              <ul className="flex justify-center mt-4">
                <li className="mx-2">
                  <button
                    onClick={prevPage}
                    type="button"
                    className={`${
                      router.query?.page === "1" ||
                      router.query?.page === undefined
                        ? "pointer-events-none text-black hidden"
                        : "text-blue-600 hover:underline block"
                    } duration-200 transition-all`}
                  >
                    &laquo; Previous
                  </button>
                </li>
                <li className="mx-2">
                  <button
                    onClick={() => handlePageChange("1")}
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
                    onClick={() => handlePageChange("2")}
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
                    onClick={() => handlePageChange("3")}
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
                    onClick={nextPage}
                    type="button"
                    className={`${
                      router.query?.page === "3"
                        ? "pointer-events-none text-black"
                        : "text-blue-600 hover:underline"
                    } duration-200 transition-all`}
                  >
                    Next &raquo;
                  </button>
                </li>
              </ul>
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
                href="/category/Teknologi/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-800">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
                <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
              </Link>
              <Link
                href="/category/Teknologi/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-800">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
                <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
              </Link>
              <Link
                href="/category/Teknologi/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-800">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
                <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
              </Link>
              <Link
                href="/category/Teknologi/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-800">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
                <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
              </Link>
              <Link
                href="/category/Teknologi/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-800">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
                <p className="text-gray-500 mb-4 mt-2">6 jam yang lalu</p>
              </Link>
            </div>
          </div>
          <div className="mt-4"></div>
        </section>
      </div>
    </div>
  );
};

ListCategory.getLayout = (page) => <Layout>{page}</Layout>;

export default ListCategory;
