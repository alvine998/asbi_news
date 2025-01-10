import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Script from "next/script";

export default function Layout({ children }: any) {
  return (
    <div>
      <Head>
        <title>ASBI News</title>
        <meta name="description" content="Stay updated with the latest news" />
        <meta name="google-site-verification" content="uVxJQ0hfthaSi9m9faH2ieprZZkMiwbiO7OYIKH_ogQ" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-146597763228827"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      <Navbar />
      <main className="px-4 lg:px-28">{children}</main>
      <Footer />
    </div>
  );
}
