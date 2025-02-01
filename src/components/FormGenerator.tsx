import React, { useState } from "react";
import TextEditor from "./TextEditor";
import KeywordInput from "./KeywordInput";
import { toast } from "react-toastify";
import axios from "axios";
import axiosInstance from "@/utils/api";
import Loader from "./Loader";

type Field = {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "select"
    | "checkbox"
    | "textarea"
    | "file"
    | "texteditor"
    | "keywords";
  options?: { label: string; value: string | number }[]; // For select fields
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  accept?: string;
  editorValue?: any;
  setEditorValue?: any;
  selected?: any;
  setSelected?: any;
};

type FormGeneratorProps = {
  fields: Field[];
  onSubmit: (values: Record<string, any>) => void;
  selected?: any;
};

const FormGenerator: React.FC<FormGeneratorProps> = ({
  fields,
  onSubmit,
  selected,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedFile = e.target.files?.[0];
  //   const { name } = e.target;
  //   if (selectedFile) {
  //     // Check file size (2MB limit)
  //     if (selectedFile.size > 2 * 1024 * 1024) {
  //       toast.error("File size exceeds 2MB. Please select a smaller image.");
  //       return;
  //     }

  //     setFile(selectedFile);

  //     // Convert the image to Base64 using FileReader
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       if (reader.result) {
  //         setBase64Image(reader.result as string);
  //         setFormData((prev) => ({
  //           ...prev,
  //           [name]: reader.result as string,
  //         }));
  //       }
  //     };
  //     reader.readAsDataURL(selectedFile); // Read the image file as Base64
  //   }
  // };

  const handleKeywordsChange = (name: string, keywords: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: keywords,
    }));
  };

  //

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    setSelected?: any,
    isSelect?: boolean
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked; // Type assertion
      setFormData((prev) => ({
        ...prev,
        [name]: isChecked,
      }));
    } else {
      if (isSelect && name == "type") {
        setSelected(value);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeEditor = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      image: file,
      // keywords: JSON.parse(formData.keywords),
    });
  };

  // const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) return setLoading(false);
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Silakan Upload file dengan ukuran maksimal 3MB", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = new FormData();
      formData.append(selected === "video" ? "video" : "image", file);
      let url = selected === "video" ? "/upload/video" : "/upload/v2";
      const response: any = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(response?.data?.filePath);
      setLoading(false);
    };

    reader.readAsDataURL(file);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-1">
          <label htmlFor={field.name} className="font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              onChange={(e) => handleChange(e, field.setSelected, true)}
              defaultValue={field.defaultValue}
              required={field.required}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              required={field.required}
              defaultValue={field.defaultValue}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : field.type === "texteditor" ? (
            <>
              <TextEditor
                value={field.defaultValue || ""}
                placeholder={field.placeholder}
                onChange={(e: any) => handleChangeEditor(e, "content")}
              />
            </>
          ) : field.type === "keywords" ? (
            <>
              <KeywordInput
                value={field.defaultValue || formData[field.name] || []}
                onChange={(keywords) =>
                  handleKeywordsChange(field.name, keywords)
                }
              />
              <input
                type="hidden"
                name="keywords"
                value={formData[field.name]}
              />
            </>
          ) : field.type === "file" ? (
            <>
              <input
                id={field.name}
                type={"file"}
                name={field.name}
                onChange={handleUpload}
                accept={field.accept}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div>
                {file || field.defaultValue ? (
                  <>
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        {selected === "video" ? (
                          <a
                            href={file || undefined}
                            target="_blank"
                            className="text-blue-500"
                          >
                            Selesai Upload Video
                          </a>
                        ) : (
                          <img
                            src={file || field.defaultValue}
                            alt="Preview"
                            className="mt-2 w-auto h-auto"
                          />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : (
            <>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                onChange={handleChange}
                required={field.required}
                defaultValue={field.defaultValue}
                accept={field.accept}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
      >
        Simpan
      </button>
    </form>
  );
};

export default FormGenerator;
