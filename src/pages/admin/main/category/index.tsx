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
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Category: NextPageWithLayout = () => {
  const { isOpen, closeModal, openModal, setData, data, setKey, key } =
    useModal();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState<string>("");
  // Firebase Database Reference
  const db = getDatabase();

  const fetchCategories = async () => {
    const data: any = await getCategories();
    setCategories(data);
    setFilteredCategories(data); // Set initial filtered categories
  };

  const handleCreate = async (values: Record<string, any>) => {
    await createCategory(values);
    fetchCategories();
    closeModal();
  };

  const handleUpdate = async (values: Record<string, any>) => {
    await updateCategory(data?.id, values);
    fetchCategories();
    closeModal();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deleteCategory(data?.id);
    fetchCategories();
    closeModal();
  };

  const columns = [
    {
      name: "Nama",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Deskripsi",
      selector: (row: any) => row.description,
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

  const CategoryForm: any = [
    {
      name: "name",
      label: "Nama Kategori",
      type: "text",
      placeholder: "Masukkan Nama Kategori",
      required: true,
      defaultValue: data?.name,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      placeholder: "Masukkan Deskripsi",
      required: true,
      defaultValue: data?.description,
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, [db]);

  // Filter categories based on search query from the URL
  useEffect(() => {
    const { query }: any = router.query; // Extract 'query' from the URL
    if (query) {
      const filtered = categories.filter((category) =>
        category.name
          .toLowerCase()
          .includes(query?.search.toString().toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories); // If no query, show all categories
    }
  }, [router.query, categories]); // Run effect whenever the query or categories change

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
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  // Calculate the data to be displayed based on the current page and rows per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div>
      <div className="flex px-4 items-center lg:flex-row flex-col justify-between w-full gap-2">
        <Input
          placeholder="Cari Kategori..."
          type="search"
          onChange={handleFilterChange}
          className="lg:w-auto w-full"
        />
        <Button
          onClick={() => {
            openModal();
            setData(null);
            setKey("create");
          }}
        >
          Tambah Kategori
        </Button>
      </div>
      <Table
        columns={columns}
        data={currentItems}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        itemsPerPage={itemsPerPage}
        dataLength={filteredCategories.length}
      />

      {isOpen && (key === "create" || key === "update") && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={`${data?.id ? "Ubah" : "Tambah"} Kategori`}
        >
          <FormGenerator
            fields={CategoryForm}
            onSubmit={data?.id ? handleUpdate : handleCreate}
          />
        </Modal>
      )}
      {isOpen && key === "delete" && (
        <Modal isOpen={isOpen} onClose={closeModal} title={`Hapus Kategori`}>
          <p className="text-center">
            Apakah anda yakin ingin menghapus kategori ini?
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

Category.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Category;
