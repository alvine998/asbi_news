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
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UpdateNews: NextPageWithLayout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [editorValue, setEditorValue] = useState("");
  const [news, setNews] = useState<INews>();
  const router = useRouter();
  const db = getDatabase();
  const params = useParams();
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      if (!params?.id) {
        console.error("ID is required to fetch news.");
        return;
      }
      try {
        const fetchedNews = await getSingleNewsByID(params?.id as string);
        setNews(fetchedNews);
        setEditorValue(fetchedNews?.content);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [params?.id]);

  const fetchCategories = async () => {
    const data: any = await getCategories();
    setCategories(data);
  };
  useEffect(() => {
    fetchCategories();
  }, [db]);
  const handleUpdate = async (values: Record<string, any>) => {
    const payload = {
      ...values,
    };
    await updateNews(news?.id as string, payload);
    router.push("/admin/main/news");
  };

  const NewsForm: any = [
    {
      name: "title",
      label: "Judul Berita",
      type: "text",
      placeholder: "Masukkan Judul Berita",
      required: true,
      defaultValue: news?.title,
    },
    {
      name: "category",
      label: "Kategori Berita",
      type: "select",
      options: categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
      defaultValue: news?.category,
    },
    {
      name: "author",
      label: "Penulis",
      type: "text",
      placeholder: "Masukkan Penulis",
      required: true,
      defaultValue: news?.author,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Masukkan Deskripsi",
      required: true,
      defaultValue: news?.description,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "file",
      required: true,
      accept: "image/*",
      defaultValue: news?.thumbnail,
    },
    {
      name: "content",
      label: "Isi Berita",
      type: "texteditor",
      placeholder: "Masukkan Isi Berita",
      required: true,
      editorValue: editorValue,
      setEditorValue: setEditorValue,
    },
    {
      name: "editor",
      label: "Editor",
      type: "text",
      placeholder: "Masukkan Editor",
      required: true,
      defaultValue: news?.editor,
    },
    {
      name: "keywords",
      label: "Kata Kunci",
      type: "keywords",
      defaultValue: news?.keywords,
    },
  ];

  return (
    <div className="bg-white p-4 rounded">
      <div className="flex items-center justify-between lg:flex-row flex-col gap-2 mb-4">
        <h1 className="text-2xl font-bold">Ubah Berita</h1>
        <Button onClick={() => router.back()} type="button" variant="link">
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
