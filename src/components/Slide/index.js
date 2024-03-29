import React, { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "./slide.module.css";
import { AiOutlineStar, AiOutlineHeart } from "react-icons/ai";
import Button from "../Button";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useSwiper } from "swiper/react";
import { prepareImageSrc } from "../../utils/api";
import { format } from "date-fns";
import { formatCurrency, getMapsLocation } from "../../utils/helpers";

const getEventDetailPath = (id) => `/event-detail/${id}`;

const getEventText = (startDate, endDate) => {
  const parsedStartDate = Date.parse(startDate);
  const parsedEndDate = Date.parse(endDate);
  const todayDate = Date.now();
  // is future event
  const isFutureDate = todayDate < parsedStartDate && todayDate < parsedEndDate;
  if (isFutureDate) {
    return "FUTURE";
  }

  // is past event
  const isPastDate = todayDate > parsedStartDate && todayDate > parsedEndDate;
  if (isPastDate) {
    return "PAST";
  }


  const isEventBetweenStartAndEndDate = todayDate > parsedStartDate && todayDate < parsedEndDate;
  if(isEventBetweenStartAndEndDate) {
    // if the difference in days > 1, show days remaining
    const difference = parsedEndDate - todayDate;
    const differenceInDays = Math.ceil(
      Math.abs(difference / (24 * 60 * 60 * 1000))
    );

    if(differenceInDays <= 1) {
      return "FINAL DAY";
    }

    return differenceInDays;
  }
}

const ContentWrapper = ({ eventId, children }) => {
  let Component = () => (
    <Link to={`/event-detail/${eventId}`} draggable="false">
      {children}
    </Link>
  );

  return <Component />;
};

function Slide({
  event,
  showArrowOnHover,
  showGalleryOnHover,
  customGridClass,
}) {
  const swiper = useSwiper();
  const bootstrapCarouselRef = useRef();
  const eventText = event.startDate && event.endDate && getEventText(event?.startDate, event?.endDate);
  const isDayRemainingMode = typeof eventText === "number" || ["FINAL DAY"].includes(eventText);
  const remainingDaysText = typeof eventText === "number" ? `${eventText} DAYS LEFT` : eventText;

  const imageCarouselHandler = useSwipeable({
    onSwipedLeft: () => bootstrapCarouselRef.current.next(),
    onSwipedRight: () => bootstrapCarouselRef.current.prev(),
    swipeDuration: 1000,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const contentCarouselHandler = useSwipeable({
    onSwipedLeft: () => swiper.slideNext(),
    onSwipedRight: () => swiper.slidePrev(),
    swipeDuration: 2000,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const renderMapsLocation = () => {
    return getMapsLocation(event?.location);
  };

  return (
    <>
      <div
        className={`${styles.eventWrapper} lighten-container no-selection`}
        draggable="false"
      >
        <div
          className={`${styles.image} event-single-slider ${
            showArrowOnHover ? "all-event-slider" : ""
          }`}
          {...imageCarouselHandler}
        >
          {/* {showPreviousAndNextButton && (
            <span
              className="prev-btn"
              onClick={() => swiper.slidePrev()}
            ></span>
          )} */}
          <Carousel
            // indicators={allowLinks}
            interval={null}
            ref={bootstrapCarouselRef}
            className={ (event?.images?.length > 1) ? '' : 'event-single-sliderr' }
          >
            {event?.images?.map((imageData, index) => (
              <Carousel.Item key={`image_slide_${index}`}>
                <Link to={getEventDetailPath(event._id)} draggable="false">
                  <img
                    draggable="false"
                    src={prepareImageSrc(imageData?.image)}
                    alt={imageData?._id}
                  />
                </Link>
              </Carousel.Item>
            ))}
          </Carousel>
          {isDayRemainingMode && (
            <div className={styles.daysReminingInfo}>
              <Link to={getEventDetailPath(event._id)} draggable="false">
                <Button>{remainingDaysText}</Button>
              </Link>
            </div>
          )}
          {/* {showPreviousAndNextButton && (
            <span
              className="next-btn"
              onClick={() => swiper.slideNext()}
            ></span>
          )} */}
        </div>
        {showGalleryOnHover && (
          <div className={styles.galleryBtn}>
            <Link to={getEventDetailPath(event._id)} draggable="false">
              <Button>{event?.genre?.genre}</Button>
            </Link>
          </div>
        )}
        <div
          className={styles.content}
          //  {...contentCarouselHandler}
        >
          <ContentWrapper eventId={event._id}>
            <div
              className={`${styles.titleContainer} d-flex justify-content-between align-items-center px-3`}
            >
              <h3 className="text-truncate" title={event.title}>
                {event.title}
              </h3>

              <div className="d-flex gap-2">
                {/* <span className="d-flex align-items-center">
                  <AiOutlineStar />
                  4.2
                </span> */}
                <span className="d-flex align-items-center">
                  <AiOutlineHeart />
                  {/* 120 */}
                </span>
              </div>
            </div>
            <div
              className={`d-flex align-items-center gallery-border ${styles.descriptionContainer}`}
              style={{ borderBottom: "0" }}
              draggable="false"
            >
              <div className={`${styles.gridDiv} `}>
                <div
                  className={`${styles.dateDiv} ${styles.borderRight} ${customGridClass}`}
                >
                  <span className={`${styles.title} title`}>Date</span>
                  <span className={`${styles.date} date`}>
                    {event?.startDate &&
                      format(new Date(event?.startDate), "dd LLL")}
                  </span>
                </div>
                <div
                  title={event?.location}
                  className={`text-truncate ${styles.locationDiv}  ${styles.borderRight} ${customGridClass}`}
                >
                  <a
                    draggable="false"
                    href={renderMapsLocation()}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    rel="noreferrer"
                  >
                    <span className={`${styles.title} title`}>Location</span>
                    <span
                      className={`text-uppercase ${styles.location} location`}
                    >
                      {event?.location.split(',')[0]}
                      {/* {" "}
                      {isValidURL(event?.location)
                        ? "Open Map"
                        : event?.location}{" "} */}
                    </span>
                  </a>
                </div>
                <div
                  className={`${styles.entryDiv}  ${styles.borderRight} ${customGridClass}`}
                >
                  <span className={`${styles.title} title`}>Entry fee</span>
                  <span className={`${styles.entry} entry`}>
                    {event?.price !== 0 ? formatCurrency(event?.price) : "FREE"}
                  </span>
                </div>
              </div>
            </div>
          </ContentWrapper>
        </div>
      </div>
    </>
  );
}
export default Slide;
