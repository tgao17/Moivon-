import React from "react";
import styles from "./home.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import Text from "../Text";

const sliderData = [
  {
    image: "/img/slider-main.png",
    text: "MOIVON’S EVENTS 2023/ “INSPIRATION ARTS & LIFESTYLE”",
  },
  {
    image: "/img/slider-main.png",
    text: "MOIVON’S EVENTS 2023/ “INSPIRATION ARTS & LIFESTYLE”",
  },
  {
    image: "/img/slider-main.png",
    text: "MOIVON’S EVENTS 2023/ “INSPIRATION ARTS & LIFESTYLE”",
  },
  {
    image: "/img/slider-main.png",
    text: "MOIVON’S EVENTS 2023/ “INSPIRATION ARTS & LIFESTYLE”",
  },
];
function HomeSlider() {
  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        breakpoints={{
          // when window width is >= 640px
          0: {
            slidesPerView: 1,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 1,
          },
          // when window width is >= 1200px
          1200: {
            slidesPerView: 1,
          },
        }}
      >
        {sliderData?.map((data) => (
          <SwiperSlide>
            <div className={styles.wrapper}>
              <div className={styles.image}>
                <img src={data?.image} alt="slider" width="100%" />
              </div>
              <Text>{data?.text}</Text>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
export default HomeSlider;
