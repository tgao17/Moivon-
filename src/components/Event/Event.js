import React from "react";
import styles from "./event.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { format } from "date-fns";
import { AiOutlineStar, AiOutlineHeart } from "react-icons/ai";
import Button from "../Button";
import { prepareImageSrc } from "../../utils/api";
import { formatCurrency } from "../../utils/helpers";
import { Link } from "react-router-dom";

function Event({ event }) {
  const pagination = {
    clickable: true,
  };
  return (
    <>
      <div className={styles.eventWrapper}>
        <div className={styles.image}>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={pagination}
            navigation={false}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {event?.image?.data?.map((imageData) => (
              <SwiperSlide key={imageData.id}>
                <img
                  src={prepareImageSrc(imageData?.attributes?.url)}
                  alt={imageData?.attributes?.alternativeText}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.galleryBtn}>
          <Button>Gallery</Button>
        </div>
        <div className={styles.content}>
          <div className="d-flex justify-content-between px-3">
            <h3 className="truncate-1" title={event.title}>
              <Link to={`/event/${event.id}`}>{event.title}</Link>
            </h3>
            <div className="d-flex gap-2">
              <span className="d-flex">
                <AiOutlineStar />
                4.2
              </span>
              <span className="d-flex">
                <AiOutlineHeart />
                120
              </span>
            </div>
          </div>
          <div className="gallery-border" style={{ borderBottom: "0" }}>
            <div className={styles.gridDiv}>
              <div className={`${styles.dateDiv}  ${styles.borderRight}`}>
                <span className={styles.title}>Date</span>
                <span className={styles.date}>
                  {format(new Date(event?.dates), "dd LLL yyyy")}
                </span>
              </div>
              <div className={`${styles.locationDiv}  ${styles.borderRight}`}>
                <span className={styles.title}>Location</span>
                <span className={styles.location}>Bourbon st, 40</span>
              </div>
              <div className={`${styles.entryDiv}  ${styles.borderRight}`}>
                <span className={styles.title}>Entry fee</span>
                <span className={styles.entry}>
                  {formatCurrency(event?.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Event;
