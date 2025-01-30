import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import { FacebookIcon, InstagramIcon } from "lucide-react";
import Link from "next/link";
import { getNews } from "@/pages/api/news";
import { useRouter } from "next/router";

interface Props {
  children: React.ReactNode;
  categories: any;
  ads: any;
  breakingNews: any;
  news?: any;
}

export default function Layout({
  children,
  categories,
  ads,
  breakingNews,
  news
}: Props) {
  const [currentUrl, setCurrentUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // You are on the client-side now
      setCurrentUrl(`${window.location.origin}${router.asPath}`);
    }
  }, [router]);

  return (
    <div>
      <Head>
         {/* Basic SEO Meta Tags */}
         <title>{news?.title || "Asbi News"}</title>
            <meta name="description" content={news?.description} />
            <meta name="author" content={news?.author} />
            <meta name="keywords" content={news?.keywords?.toString()} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph Meta Tags */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={news?.title} />
            <meta property="og:description" content={news?.description} />
            <meta property="og:image" content={news?.thumbnail} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={currentUrl} />
            <meta property="article:author" content={news?.author} />
            <meta
              property="article:published_time"
              content={news?.published_at}
            />

            {/* Twitter Card Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={news?.title} />
            <meta name="twitter:description" content={news?.description} />
            <meta name="twitter:image" content={news?.thumbnail} />
            <meta name="twitter:creator" content={news?.author} />
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1465977632288270"
              crossOrigin="anonymous"
            ></Script>
            <ins
              className="block adsbygoogle"
              data-ad-client="ca-pub-1465977632288270"
              data-ad-slot="2260079280"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <Script>(adsbygoogle = window.adsbygoogle || []).push({});</Script>
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
      <Navbar categories={categories} ads={ads} />
      {breakingNews?.length > 0 ? (
        <div className="lg:px-20">
          <div className="bg-blue-300 text-gray-800 py-3">
            <div className="overflow-hidden relative">
              <div className="whitespace-nowrap lg:animate-marquee-desktop animate-marquee">
                <span className="mx-4 text-black font-bold">
                  🚨 Breaking News:
                </span>
                {breakingNews?.slice(0, 5).map((item: any) => (
                  <span key={item.id} className="mx-4 text-black">
                    {item.title}
                  </span>
                ))}
                <span className="mx-4 text-black">🚨 Breaking News:</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

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
