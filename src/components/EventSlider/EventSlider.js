import React, { useState, useRef } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Slide from "../Slide";

const eventData = [
  {
    image: "/img/event-1.png",
    title: "Art1 Member Monday",
    gallery: [
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-3.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
    ],
  },
  {
    image: "/img/event-2.png",
    title: "Art2 Member Monday",
    gallery: [
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-3.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
    ],
  },
  {
    image: "/img/event-3.png",
    title: "Art3 Member Monday",
    gallery: [
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-3.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
    ],
  },
  {
    image: "/img/event-1.png",
    title: "Art4 Member Monday",
    gallery: [
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-3.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
    ],
  },
  {
    image: "/img/event-2.png",
    title: "Art5 Member Monday",
    gallery: [
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-3.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-1.png",
        title: "Art Member Monday",
      },
      {
        image: "/img/event-2.png",
        title: "Art Member Monday",
      },
    ],
  },
];
function EventSlider() {
  const pagination = {
    clickable: true,
  };
  const swiperRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <Swiper
        ref={swiperRef}
        className="swiperSliderHome"
        modules={[Navigation]}
        initialSlide={0}
        spaceBetween={20}
        slidesPerView={3.5}
        loop
        navigation={false}
        centeredSlides={true}
        centeredSlidesBounds={true}
        // cannot grab
        allowTouchMove={false}
        onSlideChange={(s) => console.log("slide change", s)}
        onSwiper={(swiper) => console.log(swiper, "swiper")}
        onActiveIndexChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        onClick={(swiper) =>
          swiperRef.current.swiper.slideTo(swiper.clickedIndex)
        }
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
        {eventData?.map((data, index) => (
          <SwiperSlide key={`slide_${index}`}>
            <Slide
              event={data}
              slideIndex={index}
              currentIndex={currentIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
export default EventSlider;
