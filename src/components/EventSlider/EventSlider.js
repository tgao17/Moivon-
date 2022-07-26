import React, { useEffect } from "react";
import styles from "./eventslider.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { useQuery } from "@tanstack/react-query";

import Event from "../Event/Event";
import { ALL_QUERIES } from "../../utils/endpoints";
import { fetchAllEvent } from "../../services/Events";

function EventSlider() {
  const { data, isLoading, isError, error } = useQuery(
    ALL_QUERIES.QUERY_ALL_EVENTS(),
    fetchAllEvent
  );
  const pagination = {
    clickable: true,
  };

  if (isLoading) return <p>Loading .... </p>;

  if (isError) return <p>{error}</p>;

  console.log(data, "data");

  return (
    <>
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={3.5}
        navigation={true}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        breakpoints={{
          // when window width is >= 640px
          0: {
            slidesPerView: 1.1,
          },
          // when window width is >= 576px
          576: {
            slidesPerView: 1.5,
          },
          // when window width is >= 768px
          768: {
            slidesPerView: 2.5,
          },
          // when window width is >= 1200px
          1200: {
            slidesPerView: 3.5,
          },
        }}
      >
        {data?.data?.data?.map((event) => (
          <SwiperSlide key={event.id}>
            <Event event={{ id: event.id, ...event.attributes }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
export default EventSlider;
