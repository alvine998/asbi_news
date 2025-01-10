import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "success" | "danger" | "link";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "primary",
}) => {
  if (variant === "primary") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 duration-200 transition-all lg:w-auto w-full ${className}`}
      >
        {children}
      </button>
    );
  }

  if (variant === "success") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 duration-200 transition-all lg:w-auto w-full ${className}`}
      >
        {children}
      </button>
    );
  }

  if (variant === "danger") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 duration-200 transition-all lg:w-auto w-full ${className}`}
      >
        {children}
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-white text-black py-1 px-4 rounded hover:bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 duration-200 transition-all lg:w-auto w-full ${className}`}
      >
        {children}
      </button>
    );
  }
};

export default Button;
