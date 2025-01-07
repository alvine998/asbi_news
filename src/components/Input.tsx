// components/Input.tsx
import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {/* Label */}
      <label className="text-gray-700 font-medium">{label}</label>

      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={value}
        onChange={onChange}
        className={`w-full px-3 py-1 border text-black ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
