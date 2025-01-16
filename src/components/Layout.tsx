import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import { FacebookIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: any) {
  return (
    <div>
      <Head>
        <title>ASBI News</title>
        <meta name="description" content="Stay updated with the latest news" />
        <meta
          name="google-site-verification"
          content="uVxJQ0hfthaSi9m9faH2ieprZZkMiwbiO7OYIKH_ogQ"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-1465977632288270"
        ></meta>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1465977632288270"
          crossOrigin="anonymous"
        ></Script>
      </Head>
      <Navbar />
      <main className="px-4 lg:px-28">{children}</main>
      <div className="flex items-center justify-center mb-4">
        <Link
          href={`https://www.facebook.com/profile.php?id=61571829176710`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-blue-500 p-2">
            <FacebookIcon size={24} color="white" />
          </button>
        </Link>
        <Link
          href={`https://x.com/ASBINews`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-white shadow p-2">
            <img
              src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/x-jvgvt5gje92oz29ez4fgd.png/x-0muuxjzgzvtlpaduv3p4k2s.png?_a=DAJFJtWIZAAC"
              alt="xicon"
              className="w-6"
            />
          </button>
        </Link>

        <Link
          href={`https://instagram.com/asbinews.id`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-violet-500 shadow p-2">
            <InstagramIcon size={24} color="white" />
          </button>
        </Link>

        <Link
          href={`https://tiktok.com/@asbi.news`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-black shadow p-2 py-3">
            <img
              src="https://www.pagetraffic.com/blog/wp-content/uploads/2022/06/new-latest-tiktok-logo-png.png"
              alt="tiktok"
              className="w-6"
            />
          </button>
        </Link>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}
