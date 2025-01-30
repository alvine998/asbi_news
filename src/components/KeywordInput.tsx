import React, { useState } from "react";

interface KeywordInputProps {
  value: string[];
  onChange: (keywords: string[]) => void;
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange }) => {
  const [input, setInput] = useState<string>("");

  const handleAddKeyword = () => {
    if (input && !value.includes(input)) {
      const updatedKeywords = [...value, input];
      onChange(updatedKeywords); // Update the keywords in the parent
      setInput(""); // Clear the input field
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = value.filter((k) => k !== keyword);
    onChange(updatedKeywords); // Update the keywords in the parent
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="Enter a keyword"
        />
        <button
          type="button"
          onClick={handleAddKeyword}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tambah
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value?.map((keyword, index) => (
          <div
            key={index}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded flex items-center"
          >
            {keyword}
            <button
              type="button"
              onClick={() => handleRemoveKeyword(keyword)}
              className="ml-2 text-red-500"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordInput;
