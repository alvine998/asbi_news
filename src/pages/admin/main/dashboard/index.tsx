// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import type { NextPageWithLayout } from "@/pages/_app";
import axiosInstance from "@/utils/api";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const { page = 0, size = 10, search = "" } = query;
  try {
    const [popularNews, totalAds, totalCategory] = await Promise.all([
      axiosInstance.get(
        `/news?page=${page || 0}&size=${size || 10}&pagination=true&popular=1`
      ),
      axiosInstance.get(
        `/ads?page=${page || 0}&size=${size || 10}&pagination=true`
      ),
      axiosInstance.get(
        `/categories?page=${page || 0}&size=${size || 10}&pagination=true`
      ),
    ]);
    return {
      props: {
        popularNews: popularNews.data, // Pass data as props
        totalAds: totalAds.data?.total_items,
        totalCategory: totalCategory.data?.total_items,
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

const Dashboard: NextPageWithLayout = ({ popularNews, totalAds, totalCategory }: any) => {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") setIsHydrated(true);
  }, []);
  return (
    <div>
      <div className="bg-blue-200 p-4 rounded w-full">
        <p>Welcome to ASBI News Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5">
        <div>
          {isHydrated && (
            <table className="table-auto">
              <thead>
                <th className="text-center border p-2 bg-gray-200">Ranking</th>
                <th className="text-center border p-2 bg-gray-200">Berita</th>
                <th className="text-center border p-2 bg-gray-200">Dilihat</th>
              </thead>
              <tbody>
                {popularNews?.items?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="text-center border p-2 text-xs">
                      {index + 1 == 1 ? "👑" : index + 1}
                    </td>
                    <td className="text-center border p-2 text-xs">
                      {item.title}
                    </td>
                    <td className="text-center border p-2 text-xs">
                      {item.viewers}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <div className="bg-white shadow rounded p-4 lg:w-1/2 w-full">
            <p>
              Jumlah Berita: <strong>{popularNews?.total_items}</strong>
            </p>
            <p>
              Jumlah Kategori: <strong>{totalCategory}</strong>
            </p>
            <p>
              Jumlah Iklan: <strong>{totalAds}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
