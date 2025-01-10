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
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const News: NextPageWithLayout = () => {
  const { isOpen, closeModal, openModal, setData, data, setKey, key } =
    useModal();
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  // Firebase Database Reference
  const db = getDatabase();

  const fetchNews = async () => {
    const data: any = await getNews();
    setNews(data);
    setFiltered(data); // Set initial filtered categories
  };

  const fetchCategories = async () => {
    const data: any = await getCategories();
    setCategories(data);
  };

  const handleUpdate = async (values: Record<string, any>) => {
    await updateCategory(data?.id, values);
    fetchNews();
    closeModal();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deleteNews(data?.id);
    fetchNews();
    closeModal();
  };

  const columns = [
    {
      name: "Judul",
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: "Kategori",
      selector: (row: any) =>
        categories?.find((c: any) => c.id === row.category)?.name,
      sortable: true,
    },
    {
      name: "Deskripsi",
      selector: (row: any) => row.description,
      sortable: true,
    },
    {
      name: "Penulis",
      selector: (row: any) => row.author,
      sortable: true,
    },
    {
      name: "Editor",
      selector: (row: any) => row.editor,
      sortable: true,
    },
    {
      name: "Kata Kunci",
      selector: (row: any) => row.keywords?.join(", "),
      sortable: true,
    },
    {
      name: "Aksi",
      selector: (row: any) => (
        <div>
          <button
            className="text-green-500"
            title="Ubah"
            onClick={() => {
              openModal();
              setData(row);
              setKey("update");
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

  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [db]);

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

  // Handle change in page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setItemsPerPage(rowsPerPage);
    setCurrentPage(1); // Reset to the first page on rows change
  };

  // Filter data by the search text
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
    const filtered = news.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFiltered(filtered);
  };

  // Calculate the data to be displayed based on the current page and rows per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="flex px-4 items-center lg:flex-row flex-col justify-between w-full gap-2">
        <Input
          placeholder="Cari Berita..."
          type="search"
          onChange={handleFilterChange}
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
        data={currentItems}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        itemsPerPage={itemsPerPage}
        dataLength={filtered.length}
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
