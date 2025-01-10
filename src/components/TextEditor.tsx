// components/Editor.tsx
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill to disable SSR (client-side only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  editorValue: any;
  setEditorValue: any;
  placeholder: any;
  handleChange: any
}

const TextEditor = ({ editorValue, setEditorValue, placeholder, handleChange }: Props) => {

  return (
    <div>
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        modules={TextEditor.modules}
        placeholder={placeholder}
      />
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
