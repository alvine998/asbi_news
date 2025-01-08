import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";

export default function index() {
  const { data: session } = useSession();
  return (
    <div className="flex justify-center items-center h-[100vh] w-full bg-blue-500 lg:px-0 px-2">
      <Head>
        <title>Asbi News</title>
      </Head>
      <div className="lg:w-1/4 w-full h-auto p-4 bg-white shadow rounded">
        <img src="/images/asbi-logo.png" alt="asbilogo" />
        <button
          type="button"
          onClick={() => {
            signIn("google");
          }}
          className="bg-white w-full shadow text-black py-2 rounded flex items-center justify-center gap-2 mt-4"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
            alt="logo"
            className="w-5 h-5"
          />
          Login By Google
        </button>
      </div>
    </div>
  );
}
