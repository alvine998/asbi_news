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
import { createNews, getNews } from "@/pages/api/news";
import { createSlug } from "@/utils";
import axiosInstance from "@/utils/api";
import axios from "axios";
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query, params } = context;
  const { id = params?.id } = query;
  try {
    const categories: any = await axiosInstance.get("/categories?pagination=false");
    return {
      props: {
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

const CreateNews: NextPageWithLayout = ({ categories }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleCreate = async (values: Record<string, any>) => {
    try {
      // 
      const response = await axios.post("/api/express/news/create", {
        ...values,
        slug: createSlug(values.title),
        thumbnail: values?.image
      });
      toast.success("Berita Berhasil Ditambahkan", {
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
    },
    {
      name: "category_id",
      label: "Kategori Berita",
      type: "select",
      options: categories.map((category: any) => ({
        label: category.name,
        value: category.id,
      })),
    },
    {
      name: "author",
      label: "Penulis",
      type: "text",
      placeholder: "Masukkan Penulis",
      required: true,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Masukkan Deskripsi",
      required: true,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "file",
      required: true,
      accept: "image/*",
    },
    {
      name: "content",
      label: "Isi Berita",
      type: "texteditor",
      placeholder: "Masukkan Isi Berita",
      required: true,
    },
    {
      name: "editor",
      label: "Editor",
      type: "text",
      placeholder: "Masukkan Editor",
      required: true,
    },
    {
      name: "source",
      label: "Sumber",
      type: "text",
      placeholder: "Masukkan Sumber",
      required: true,
    },
    {
      name: "headline",
      label: "Headline",
      type: "select",
      options: [
        { label: "Ya", value: 1 },
        { label: "Tidak", value: 0 },
      ],
    },
    {
      name: "breaking_news",
      label: "Breaking News",
      type: "select",
      options: [
        { label: "Ya", value: 1 },
        { label: "Tidak", value: 0 },
      ],
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Publish", value: "publish" },
        { label: "Draft", value: "draft" },
      ],
    },
    {
      name: "published_at",
      label: "Tanggal Publikasi",
      type: "datetime-local",
    },
    {
      name: "keywords",
      label: "Kata Kunci",
      type: "keywords",
    },
  ];

  return (
    <div className="bg-white p-4 rounded">
      <h1 className="text-2xl font-bold">Buat Berita</h1>
      <Button
        onClick={() => router.back()}
        type="button"
        variant="link"
        className="my-2"
      >
        Kembali
      </Button>
      {loading ? (
        <Loader />
      ) : (
        <FormGenerator fields={NewsForm} onSubmit={handleCreate} />
      )}
    </div>
  );
};

CreateNews.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CreateNews;
