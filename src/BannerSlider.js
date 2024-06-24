// src/components/BannerSlider.js
import React from 'react';
import Slider from 'react-slick';
import useBannerStore from './stores/useBannerStore';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './BannerSlider.css'; // 커스터마이징 CSS 파일 추가

const BannerSlider = () => {
  const { banners, setCurrentBanner } = useBannerStore();
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // 전환 속도 (밀리초 단위)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (index) => setCurrentBanner(index),
    fade: true, // 페이드 애니메이션 추가
    cssEase: 'linear' // 애니메이션 이징 함수 설정
  };

  return (
    <Slider {...settings}>
      {banners.map((banner, index) => (
        <div key={index}>
          <img src={banner} alt={`Banner ${index + 1}`} className="banner-image" />
        </div>
      ))}
    </Slider>
  );
};

export default BannerSlider;
