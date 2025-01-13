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
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CreateNews: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const db = getDatabase();

  const fetchCategories = async () => {
    setLoading(true);
    const data: any = await getCategories();
    setCategories(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchCategories();
  }, [db]);
  const handleCreate = async (values: Record<string, any>) => {
    const payload = {
      ...values,
      category_name: categories?.find(
        (category) => category.id === values.category
      )?.name,
      slug: createSlug(values.title),
      viewers: 0,
      status: values.status,
      headline: values.headline ? 1 : 0,
      publishedAt:
        values.status === "publish" ? new Date().toISOString() : null,
    };
    await createNews(payload);
    router.push("/admin/main/news");
  };

  const [editorValue, setEditorValue] = useState("Ketik disini...");

  const NewsForm: any = [
    {
      name: "title",
      label: "Judul Berita",
      type: "text",
      placeholder: "Masukkan Judul Berita",
      required: true,
    },
    {
      name: "category",
      label: "Kategori Berita",
      type: "select",
      options: categories.map((category) => ({
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
      name: "headline",
      label: "Headline",
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
      name: "keywords",
      label: "Kata Kunci",
      type: "keywords",
    },
  ];

  return (
    <div className="bg-white p-4 rounded">
      <h1 className="text-2xl font-bold">Buat Berita</h1>
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
