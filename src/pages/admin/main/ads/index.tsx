// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import Button from "@/components/Button";
import Table from "@/components/DataTable";
import FormGenerator from "@/components/FormGenerator";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModal } from "@/hooks/useModal";
import type { NextPageWithLayout } from "@/pages/_app";
import { createAds, deleteAds, getAds, updateAds } from "@/pages/api/ads";
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

const Ads: NextPageWithLayout = () => {
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

  const fetchAds = async () => {
    const data: any = await getAds();
    setCategories(data);
    setFilteredCategories(data); // Set initial filtered categories
  };

  const handleCreate = async (values: Record<string, any>) => {
    await createAds(values);
    fetchAds();
    closeModal();
  };

  const handleUpdate = async (values: Record<string, any>) => {
    await updateAds(data?.id, values);
    fetchAds();
    closeModal();
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deleteAds(data?.id);
    fetchAds();
    closeModal();
  };

  const columns = [
    {
      name: "Nama Iklan",
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Banner",
      selector: (row: any) => (
        <img src={row.image} alt="image" className="w-20 h-20" />
      ),
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

  const AdsForm: any = [
    {
      name: "name",
      label: "Nama Iklan",
      type: "text",
      placeholder: "Masukkan Nama Iklan",
      required: true,
      defaultValue: data?.name,
    },
    {
      name: "image",
      label: "Banner",
      type: "file",
      placeholder: "Masukkan Banner",
      required: true,
      defaultValue: data?.image,
    },
  ];

  useEffect(() => {
    fetchAds();
  }, [db]);

  // Filter categories based on search query from the URL
  useEffect(() => {
    const { query }: any = router.query; // Extract 'query' from the URL
    if (query) {
      const filtered = categories.filter((item) =>
        item.name.toLowerCase().includes(query?.search.toString().toLowerCase())
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
    const filtered = categories.filter((item) =>
      item.name.toLowerCase().includes(event.target.value.toLowerCase())
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
          placeholder="Cari Iklan..."
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
          Tambah Iklan
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
          title={`${data?.id ? "Ubah" : "Tambah"} Iklan`}
        >
          <FormGenerator
            fields={AdsForm}
            onSubmit={data?.id ? handleUpdate : handleCreate}
          />
        </Modal>
      )}
      {isOpen && key === "delete" && (
        <Modal isOpen={isOpen} onClose={closeModal} title={`Hapus Kategori`}>
          <p className="text-center">
            Apakah anda yakin ingin menghapus iklan ini?
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

Ads.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Ads;
