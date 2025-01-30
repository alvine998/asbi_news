// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import Button from "@/components/Button";
import Table from "@/components/DataTable";
import FormGenerator from "@/components/FormGenerator";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { useModal } from "@/hooks/useModal";
import type { NextPageWithLayout } from "@/pages/_app";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/pages/api/category";
import {
  updateNews,
  getNews,
  getSingleNews,
  getSingleNewsByID,
} from "@/pages/api/news";
import { INews } from "@/types/news";
import { createSlug } from "@/utils";
import axiosInstance from "@/utils/api";
import axios from "axios";
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import moment from "moment";
import { GetServerSideProps } from "next";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query, params } = context;
  const { id = params?.id } = query;
  try {
    const response = await axiosInstance.get(`/news?id=${id || ""}`);

    const categories: any = await axiosInstance.get("/categories");
    return {
      props: {
        detail: response.data?.items[0], // Pass data as props
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
const UpdateNews: NextPageWithLayout = ({ detail, categories }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState("");
  const router = useRouter();
  const handleUpdate = async (values: Record<string, any>) => {
    try {
      //edit
      const response = await axios.post("/api/express/news/update", {
        ...values,
        id: detail?.id,
        slug: createSlug(values?.title || detail?.title),
        thumbnail: values?.image || detail?.thumbnail
      });
      toast.success("Iklan Berhasil Diubah", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      router.push("/admin/main/news");
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

  const NewsForm: any = [
    {
      name: "title",
      label: "Judul Berita",
      type: "text",
      placeholder: "Masukkan Judul Berita",
      required: true,
      defaultValue: detail?.title,
    },
    {
      name: "category",
      label: "Kategori Berita",
      type: "select",
      options: categories.map((category: any) => ({
        label: category.name,
        value: category.id,
      })),
      defaultValue: detail?.category_id,
    },
    {
      name: "author",
      label: "Penulis",
      type: "text",
      placeholder: "Masukkan Penulis",
      required: true,
      defaultValue: detail?.author,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Masukkan Deskripsi",
      required: true,
      defaultValue: detail?.description,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "file",
      required: true,
      accept: "image/*",
      defaultValue: detail?.thumbnail,
    },
    {
      name: "content",
      label: "Isi Berita",
      type: "texteditor",
      placeholder: "Masukkan Isi Berita",
      required: true,
      defaultValue: detail?.content,
    },
    {
      name: "editor",
      label: "Editor",
      type: "text",
      placeholder: "Masukkan Editor",
      required: true,
      defaultValue: detail?.editor,
    },
    {
      name: "source",
      label: "Sumber",
      type: "text",
      placeholder: "Masukkan Sumber",
      required: true,
      defaultValue: detail?.source || "",
    },
    {
      name: "headline",
      label: "Headline",
      type: "select",
      options: [
        { label: "Ya", value: 1 },
        { label: "Tidak", value: 0 },
      ],
      defaultValue: detail?.headline,
    },
    {
      name: "breaking_news",
      label: "Breaking News",
      type: "select",
      options: [
        { label: "Ya", value: 1 },
        { label: "Tidak", value: 0 },
      ],
      defaultValue: detail?.breaking_news,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Publish", value: "publish" },
        { label: "Draft", value: "draft" },
      ],
      defaultValue: detail?.status,
    },
    {
      name: "published_at",
      label: "Tanggal Publikasi",
      type: "datetime-local",
      defaultValue: moment(detail?.published_at)?.format("YYYY-MM-DDTHH:mm"),
    },
    {
      name: "keywords",
      label: "Kata Kunci",
      type: "keywords",
      defaultValue: JSON.parse(detail?.keywords),
    },
  ];

  return (
    <div className="bg-white p-4 rounded">
      <div className="flex items-center justify-between lg:flex-row flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Ubah Berita</h1>
        <Button
          onClick={() => router.back()}
          type="button"
          variant="link"
          className="my-2"
        >
          Kembali
        </Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <FormGenerator fields={NewsForm} onSubmit={handleUpdate} />
      )}
    </div>
  );
};

UpdateNews.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default UpdateNews;
