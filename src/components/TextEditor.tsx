// components/Editor.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to disable SSR (client-side only)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TextEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: any;
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState(value || "Ketik disini");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShow(true);
    }
  }, []);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content); // Propagate the changes
  };

  return (
    <div>
      {show && editorValue !== "" && (
        <ReactQuill
          value={editorValue}
          onChange={handleChange}
          theme="snow"
          modules={TextEditor.modules}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

TextEditor.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    ["link"],
    ["image"],
    ["blockquote"],
    ["code-block"],
  ],
};

export default TextEditor;
