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
      `/ads?search=${search || ""}&page=${page || 0}&size=${
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

const Ads: NextPageWithLayout = ({ table, filters }: any) => {
  const { isOpen, closeModal, openModal, setData, data, setKey, key } =
    useModal();
  const router = useRouter();
  const [selected, setSelected] = useState<any>("header");
  // Firebase Database Reference

  const handleCreate = async (values: Record<string, any>) => {
    try {
      console.log(values, "lalal");
      const response = await axios.post("/api/express/ads/create", {
        ...values,
        width: values?.type == "header" ? 1080 : 300,
        height: values?.type == "header" ? 300 : 300,
      }); // Fetch from your API route
      toast.success("Iklan Berhasil Ditambahkan", {
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

  const handleUpdate = async (values: Record<string, any>) => {
    try {
      const response = await axios.post("/api/express/ads/update", {
        ...values,
        id: data?.id,
      });
      toast.success("Iklan Berhasil Diubah", {
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

  const handleDelete = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/express/ads/delete", data); // Fetch from your API route
      toast.success("Iklan Berhasil Dihapus", {
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
      name: "Nama Iklan",
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: "Tipe",
      selector: (row: any) => row.type,
      sortable: true,
    },
    {
      name: "Banner",
      selector: (row: any) => (
        <>
          {row?.type == "video" ? (
            <a href={row.image} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Lihat Video
            </a>
          ) : (
            <img src={row.image} alt="image" className="w-20 h-20" />
          )}
        </>
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
      name: "title",
      label: "Nama Iklan",
      type: "text",
      placeholder: "Masukkan Nama Iklan",
      required: true,
      defaultValue: data?.title,
    },
    {
      name: "type",
      label: "Jenis Iklan",
      type: "select",
      options: [
        { value: "header", label: "Header" },
        { value: "side", label: "Pamflet" },
        { value: "video", label: "Video" },
      ],
      required: true,
      defaultValue: data?.type,
      setSelected: setSelected,
    },
    {
      name: "image",
      label: selected === "video" ? "Video" : "Banner",
      type: "file",
      placeholder: "Masukkan Link URL",
      required: true,
      defaultValue: data?.image,
    },
  ];

  return (
    <div>
      <div className="flex px-4 items-center lg:flex-row flex-col justify-between w-full gap-2">
        <Input
          placeholder="Cari Iklan..."
          type="search"
          onChange={(e) => {
            router.push(`?search=${e.target.value}`);
          }}
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
        data={table?.items}
        handlePageChange={() => {}}
        handleRowsPerPageChange={() => {}}
        itemsPerPage={table?.size || 10}
        dataLength={table?.total_items}
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
            selected={selected}
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
