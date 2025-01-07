// pages/index.tsx
import Input from "@/components/Input";
import BannerSlider from "@/components/Slider";
import Head from "next/head";
import Link from "next/link";

const Home = () => {
  const categories: any[] = [
    { id: 1, name: "Bisnis" },
    { id: 2, name: "Teknologi" },
    { id: 3, name: "Olahraga" },
    { id: 4, name: "Politik" },
    { id: 5, name: "Hiburan" },
    { id: 6, name: "Kesehatan" },
    { id: 7, name: "Ekonomi" },
    { id: 8, name: "Sains" },
    { id: 9, name: "Agama" },
    { id: 10, name: "Budaya" },
    { id: 11, name: "Internasional" },
    { id: 12, name: "Opini" },
  ];
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>ASBI News</title>
        <meta name="description" content="Stay updated with the latest news" />
      </Head>

      {/* Header */}
      <header className="bg-blue-600 text-white py-2 px-28">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">ASBI News</h1>
          <nav className="space-x-4">
            <Input placeholder="Cari berita disini..." />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-4 px-28">
        {/* Ad Space */}
        <div className="ad-space">
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          ></script>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-1465977632288270"
            data-ad-slot="1465977632288270"
            data-ad-format="auto"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
        <div className="w-full mb-6 flex justify-center items-center">
          <div className="bg-gray-200 text-gray-700 text-center py-4 rounded-lg w-1/2">
            <p>Your Ad Here</p>
            {/* Replace with an actual ad script or image */}
          </div>
        </div>
        <div className="mb-8 flex gap-4 justify-center items-center border-b-2 border-t-2 border-b-gray-700 border-t-gray-700">
          {categories.map((category) => (
            <Link href={`/category/${category.name}`} key={category.id}>
              <button className="text-black font-semibold px-4 py-1 rounded-md hover:text-blue-700 duration-200 transition-colors">
                {category.name}
              </button>
            </Link>
          ))}
        </div>
        <BannerSlider />
        <div className="mb-8 flex justify-between w-full mt-4 gap-6">
          {/* Column 1 */}
          <section className="w-full flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Berita Terkini
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* News Card */}
                {[1, 2, 3].map((newsItem) => (
                  <div
                    key={newsItem}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://via.placeholder.com/400x200?text=News+${newsItem}`}
                      alt={`News ${newsItem}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        News Title {newsItem}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 underline">
                Teknologi
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* News Card */}
                {[1, 2, 3].map((newsItem) => (
                  <div
                    key={newsItem}
                    className="bg-white shadow-md rounded-lg overflow-hidden"
                  >
                    <img
                      src={`https://via.placeholder.com/400x200?text=News+${newsItem}`}
                      alt={`News ${newsItem}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">
                        News Title {newsItem}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read more
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Column 2 */}
          <section className="w-1/3">
            <h2 className="text-2xl font-semibold mb-4 underline">
              Berita Terpopuler
            </h2>
            <div className="flex flex-col gap-2">
              {/* Popular News Card */}
              <Link
                href="/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
              </Link>
              <Link
                href="/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
              </Link>
              <Link
                href="/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
              </Link>
              <Link
                href="/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
              </Link>
              <Link
                href="/news/1"
                className="bg-white shadow-md rounded-lg p-4"
              >
                <h5 className="text-lg font-semibold text-black">
                  Judul Berita
                </h5>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor.
                </p>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 ASBI News. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
