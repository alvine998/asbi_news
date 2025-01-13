// components/Editor.tsx
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { type } from "os";

// Dynamically import ReactQuill to disable SSR (client-side only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  editorValue: any;
  setEditorValue: any;
  placeholder: any;
  handleChange: any;
}

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
  const [editorValue, setEditorValue] = useState(value || "");

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
      {show && (
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
