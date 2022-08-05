import React from "react";
import styles from "./event.module.css";
import { AiOutlineStar, AiOutlineHeart } from "react-icons/ai";
import Button from "../Button";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { format } from "date-fns";
import { prepareImageSrc } from "../../utils/api";
import { formatCurrency } from "../../utils/helpers";

const getEventDetailPath = (id) => `/event-detail/${id}`;

function Event({
  event,
  showArrowOnHover,
  showGalleryOnHover,
  customGridClass,
}) {
  return (
    <>
      <div className={styles.eventWrapper}>
        <div className="eventWrapper">
          <div
            className={`${styles.image} event-single-slider ${
              showArrowOnHover ? "all-event-slider" : ""
            }`}
          >
            <Carousel interval={null}>
              {event?.images?.map((imageData) => (
                <Carousel.Item>
                  <Link to={getEventDetailPath(event._id)}>
                    <img
                      draggable="false"
                      src={prepareImageSrc(imageData?.image)}
                      alt={imageData?._id}
                    />
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div
            className={`${styles.galleryBtn} hide-gallery-btn ${
              showGalleryOnHover ? "show-gallery-btn" : ""
            }`}
          >
            <Link to={getEventDetailPath(event._id)}>
              <Button>Gallery</Button>
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <Link to={getEventDetailPath(event._id)}>
            <div className="d-flex justify-content-between px-3">
              <h3>{event?.title}</h3>

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
            <div className={"gallery-border"} style={{ borderBottom: "0" }}>
              <div className={`${styles.gridDiv} `}>
                <div
                  className={`${styles.dateDiv}  ${styles.borderRight} ${customGridClass}`}
                >
                  <span className={`${styles.title} title`}>Date</span>
                  <span className={`${styles.date} date`}>
                    {event?.dates &&
                      format(new Date(event?.dates), "dd LLL yyyy")}
                  </span>
                </div>
                <div
                  className={`${styles.locationDiv}  ${styles.borderRight} ${customGridClass}`}
                >
                  <a
                    href={event?.location}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    rel="noreferrer"
                  >
                    <span className={`${styles.title} title`}>Location</span>
                    <span className={`${styles.location} location`}>
                      {" "}
                      Bourbon st, 40{" "}
                    </span>
                  </a>
                </div>
                <div
                  className={`${styles.entryDiv}  ${styles.borderRight} ${customGridClass}`}
                >
                  <span className={`${styles.title} title`}>Entry fee</span>
                  <span className={`${styles.entry} entry`}>
                    {formatCurrency(event?.price)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Event;
