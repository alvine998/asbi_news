// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import Button from "@/components/Button";
import Table from "@/components/DataTable";
import FormGenerator from "@/components/FormGenerator";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModal } from "@/hooks/useModal";
import type { NextPageWithLayout } from "@/pages/_app";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/pages/api/category";
import { deleteNews, getNews } from "@/pages/api/news";
import { INews } from "@/types/news";
import axiosInstance from "@/utils/api";
import axios from "axios";
import { getDatabase, set } from "firebase/database";
import {
  PencilIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  TrashIcon,
} from "lucide-react";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const {
    page = 0,
    size = 10,
    search = "",
    status = "",
    headline = "",
    breaking_news = "",
  } = query;
  try {
    const response = await axiosInstance.get(
      `/news?search=${search || ""}&page=${page || 0}&size=${
        size || 10
      }&pagination=true&status=${status}&headline=${headline}&breaking_news=${breaking_news}`
    ); // Fetch data

    const categories: any = await axiosInstance.get("/categories");
    return {
      props: {
        table: response.data, // Pass data as props
        filters: query,
        categories: categories?.data?.items || [],
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

const News: NextPageWithLayout = ({ table, filters, categories }: any) => {
  const { isOpen, closeModal, openModal, setData, data, setKey, key } =
    useModal();
  const router = useRouter();

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/express/news/delete", data); // Fetch from your API route
      toast.success("Berita Berhasil Dihapus", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push("");
      closeModal();
    } catch (error) {
      console.error("Client-side Error:", error);
      toast.error("Failed to fetch ads. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const toggleHandler = async (data: any, updateData: string) => {
    try {
      const payload1 = {
        headline: data.headline == 1 ? 0 : 1,
      };
      const payload2 = {
        breaking_news: data.breaking_news == 1 ? 0 : 1,
      };
      const payload = {
        ...data,
        ...(updateData == "headline" ? payload1 : payload2),
      };
      const response = await axios.post("/api/express/news/update", payload); // Fetch from your API route
      toast.success(updateData + " Berhasil Diubah", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push("");
      closeModal();
    } catch (error) {
      console.error("Client-side Error:", error);
      toast.error("Failed to fetch ads. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const columns = [
    {
      name: "Judul",
      selector: (row: any) => row.title?.substring(0, 30) + "...",
      sortable: true,
    },
    {
      name: "Kategori",
      selector: (row: INews) => row?.category_name,
      sortable: true,
    },
    {
      name: "Deskripsi",
      selector: (row: INews) => row.description?.substring(0, 30) + "...",
      sortable: true,
    },
    {
      name: "Penulis",
      selector: (row: INews) => row.author,
      sortable: true,
    },
    {
      name: "Editor",
      selector: (row: INews) => row.editor,
      sortable: true,
    },
    {
      name: "Sumber",
      selector: (row: INews) => row.source || "-",
      sortable: true,
    },
    {
      name: "Dilihat",
      selector: (row: INews) => row.viewers + "x",
      sortable: true,
    },
    {
      name: "Headline",
      selector: (row: INews) => (
        <>
          <button
            type="button"
            onClick={() => {
              toggleHandler(row, "headline");
            }}
            className={`w-12 h-6 rounded-full ${
              row?.headline == 1 ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transition-transform transform ${
                row?.headline == 1 ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Breaking News",
      selector: (row: INews) => (
        <>
          <button
            type="button"
            onClick={() => {
              toggleHandler(row, "breaking_news");
            }}
            className={`w-12 h-6 rounded-full ${
              row?.breaking_news == 1 ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full shadow transition-transform transform ${
                row?.breaking_news == 1 ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: INews) => row.status,
      sortable: true,
    },
    {
      name: "Tanggal Publish",
      selector: (row: INews) =>
        moment(row?.published_at)?.format("DD-MM-YYYY HH:mm"),
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row: INews) => (
        <div>
          <button
            className="text-green-500"
            title="Ubah"
            onClick={() => {
              router.push(`/admin/main/news/${row.id}/edit`);
            }}
          >
            <PencilIcon className="w-6 h-6" />
          </button>
          <button
            className="text-red-500 ml-4"
            title="Hapus"
            onClick={() => {
              openModal();
              setData(row);
              setKey("delete");
            }}
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      ),
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="flex px-4 items-center lg:flex-row flex-col justify-between w-full gap-2">
        <Input
          placeholder="Cari Berita..."
          type="search"
          onChange={(e) => {
            router.push(`?search=${e.target.value}`);
          }}
          className="lg:w-auto w-full"
        />
        <Button
          onClick={() => {
            router.push(`/admin/main/news/create`);
          }}
        >
          Tambah Berita
        </Button>
      </div>
      <Table
        columns={columns}
        data={table?.items}
        handlePageChange={() => {}}
        handleRowsPerPageChange={() => {}}
        itemsPerPage={table?.size || 10}
        dataLength={table?.total_items}
      />

      {isOpen && key === "delete" && (
        <Modal isOpen={isOpen} onClose={closeModal} title={`Hapus Berita`}>
          <p className="text-center">
            Apakah anda yakin ingin menghapus berita ini?
          </p>
          <form onSubmit={handleDelete}>
            <div className="flex justify-end gap-2 w-full mt-2">
              <Button type="submit">Hapus</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

News.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default News;
