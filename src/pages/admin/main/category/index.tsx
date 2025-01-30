// pages/admin/dashboard.tsx
import DashboardLayout from "@/components/admin/Layout";
import Button from "@/components/Button";
import Table from "@/components/DataTable";
import FormGenerator from "@/components/FormGenerator";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModal } from "@/hooks/useModal";
import type { NextPageWithLayout } from "@/pages/_app";
import axiosInstance from "@/utils/api";
import axios from "axios";
import { getDatabase, set } from "firebase/database";
import { PencilIcon, TrashIcon } from "lucide-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { query } = context;
  const { page = 0, size = 10, search = "" } = query;
  try {
    const response = await axiosInstance.get(
      `/categories?search=${search || ""}&page=${page || 0}&size=${
        size || 10
      }&pagination=true`
    ); // Fetch data
    return {
      props: {
        table: response.data, // Pass data as props
        filters: query,
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

const Category: NextPageWithLayout = ({ table }: any) => {
  const { isOpen, closeModal, openModal, setData, data, setKey, key } =
    useModal();
  const router = useRouter();
  const [filterText, setFilterText] = useState<string>("");

  const handleCreate = async (values: Record<string, any>) => {
    try {
      const response = await axios.post("/api/express/category/create", values); // Fetch from your API route
      // fetchData();
      toast.success("Kategori Berhasil Ditambahkan", {
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
      toast.error("Failed to fetch category. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleUpdate = async (values: Record<string, any>) => {
    try {
      const response = await axios.post("/api/express/category/update", {
        ...values,
        id: data?.id,
      });
      toast.success("Kategori Berhasil Diubah", {
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
      toast.error("Failed to fetch category. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/express/category/delete", data); // Fetch from your API route
      toast.success("Kategori Berhasil Dihapus", {
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
      toast.error("Failed to fetch category. Please try again.", {
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
      required: false,
      defaultValue: data?.description,
    },
  ];

  return (
    <div>
      <div className="flex px-4 items-center lg:flex-row flex-col justify-between w-full gap-2">
        <Input
          placeholder="Cari Kategori..."
          type="search"
          onChange={(e) => setFilterText(e.target.value)}
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
        data={table?.items}
        handlePageChange={() => {}}
        handleRowsPerPageChange={() => {}}
        itemsPerPage={table?.size}
        dataLength={table?.total_items}
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
