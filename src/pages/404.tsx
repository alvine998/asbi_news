import Link from "next/link";
import React from "react";

export default function Custom404() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
