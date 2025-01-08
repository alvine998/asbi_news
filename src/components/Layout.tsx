import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";

export default function Layout({ children }: any) {
  return (
    <div>
      <Head>
        <title>ASBI News</title>
        <meta name="description" content="Stay updated with the latest news" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1465977632288270"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <Navbar />
      <main className="px-4 lg:px-28">{children}</main>
      <Footer />
    </div>
  );
}
