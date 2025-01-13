import React, { useState } from "react";
import TextEditor from "./TextEditor";
import KeywordInput from "./KeywordInput";
import { toast } from "react-toastify";

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
};

type FormGeneratorProps = {
  fields: Field[];
  onSubmit: (values: Record<string, any>) => void;
};

const FormGenerator: React.FC<FormGeneratorProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [base64Image, setBase64Image] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    const { name } = e.target;
    if (selectedFile) {
      // Check file size (2MB limit)
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB. Please select a smaller image.");
        return;
      }

      setFile(selectedFile);

      // Convert the image to Base64 using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setBase64Image(reader.result as string);
          setFormData((prev) => ({
            ...prev,
            [name]: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(selectedFile); // Read the image file as Base64
    }
  };

  const handleKeywordsChange = (name: string, keywords: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [name]: keywords,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked; // Type assertion
      setFormData((prev) => ({
        ...prev,
        [name]: isChecked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleChangeEditor = (
    value: string,
    name: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
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
              onChange={handleChange}
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
                onChange={(e: any) =>
                  handleChangeEditor(e, "content")
                }
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
                onChange={handleFileChange}
                accept={field.accept}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div>
                {(base64Image || field.defaultValue) && (
                  <img
                    src={base64Image || field.defaultValue}
                    alt="Preview"
                    className="mt-2 w-auto h-auto"
                  />
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
