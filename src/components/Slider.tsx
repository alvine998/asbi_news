// components/BannerSlider.tsx
import Link from "next/link";
import React from "react";
import Slider from "react-slick";

const BannerSlider: React.FC = () => {
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

  const banners = [
    {
      id: 1,
      image: "https://via.placeholder.com/1200x400?text=Banner+1",
      link: "/banner1",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/1200x400?text=Banner+2",
      link: "/banner2",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/1200x400?text=Banner+3",
      link: "/banner3",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-screen-xl overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner) => (
          <Link key={banner.id} href={banner.link} className="block">
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full lg:h-auto h-[200px] object-cover"
            />
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default BannerSlider;
