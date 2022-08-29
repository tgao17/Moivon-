import React from "react";
import styles from "./home.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import Text from "../Text";
import { useQuery } from "@tanstack/react-query";
import { ALL_QUERIES } from "../../utils/endpoints";
import Loader from "../Loader";
import { fetchHeroSlider } from "../../services/SliderService";
import { prepareImageSrc } from "../../utils/api";

const PER_PAGE = 25;
const PAGE = 1;

function HomeSlider() {
  const { isLoading, isError, error, data } = useQuery(
    ALL_QUERIES.QUERY_HERO_SLIDER(),
    () => fetchHeroSlider({ page: PAGE, perPage: PER_PAGE })
  );

  if (isLoading) return <Loader />;
  if (isError) return <p>{error}</p>;

  return (
    <>
      <Swiper
        modules={[Navigation]}
        className="swiper-slider-no-zoom"
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
        {!isLoading &&
          data?.data?.data?.map((hero, index) => (
            <SwiperSlide key={`hero_slider_${index}`}>
              <div className={styles.wrapper}>
                <div className={styles.image}>
                  {hero?.images?.map((heroImg, idx) => (
                    <img
                      key={`heroimage_${idx}`}
                      src={prepareImageSrc(heroImg?.image)}
                      alt={heroImg?._id}
                      width="100%"
                    />
                  ))}
                </div>
                <Text>{hero?.description}</Text>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </>
  );
}
export default HomeSlider;
