// components/BannerSlider.tsx
import Link from "next/link";
import React from "react";
import Slider from "react-slick";

const BannerSlider = ({ banners }: { banners: any[] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="relative mx-auto w-full max-w-screen-xl overflow-hidden">
      <Slider {...settings}>
        {banners?.map((banner) => (
          <Link key={banner.id} href={banner.link} className="block w-full">
            <img
              src={banner.thumbnail}
              alt={`Banner ${banner.id}`}
              className="w-full lg:h-[500px] h-[200px] object-cover"
            />
            <h1 className="text-white text-center lg:-mt-20 -mt-10 lg:text-2xl text-xs bg-gray-500 py-2 px-2 absolute rounded">
              {banner?.title?.substring(0, 100)}{" "}
              {banner?.title?.length > 100 ? "..." : ""}
            </h1>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
