import React from "react";
import styles from "./index.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import Text from "../../components/Text";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Event from "../../components/Event";
import RouteTitle from "../../components/RouteTitle/RouteTitle";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { ALL_QUERIES } from "../../utils/endpoints";
import {
  fetchRelatedEvents,
  fetchSingleEvent,
} from "../../services/EventService";
import { prepareImageSrc } from "../../utils/api";
import {
  formatCurrency,
  getMapsLocation,
  isValidURL,
} from "../../utils/helpers";
import Loader from "../../components/Loader";
import EventLoadingTile from "../../components/EventLoadingTile";

function EventDetail() {
  const pagination = {
    clickable: true,
  };
  const { eventId } = useParams();

  // fetching single event to show
  const { data, isLoading, isError, error } = useQuery(
    ALL_QUERIES.QUERY_SINGLE_EVENT({ eventId }),
    () => fetchSingleEvent({ eventId })
  );

  // fetching all events to show at the bottom
  const {
    data: allEventsData,
    isLoading: allEventsIsLoading,
    isError: allEventsIsError,
    error: allEventError,
  } = useQuery(ALL_QUERIES.QUERY_RELATED_EVENTS(), fetchRelatedEvents);

  if (isLoading) return <Loader />;

  if (isError) return <p>{error}</p>;

  return (
    <>
      <RouteTitle title="Event Detail" />
      <section className="section">
        <Container>
          <Row>
            <Col>
              <div className={`border-b ${styles.topHead}`}>
                <div
                  className={`${styles.eventHead} d-flex align-items-center gap-3 flex-wrap w-100`}
                >
                  <Heading
                    mb="0"
                    variant="subHeading"
                    customClass={`text-transform ${styles.eventHeader}`}
                    title={data?.data?.data?.title}
                  >
                    {data?.data?.data?.title}
                  </Heading>
                  {/* <span className={styles.type}>CLASSIC MUSEUM</span> */}
                  <span className={styles.type}>
                    {data?.data?.data?.genre?.genre}
                  </span>
                  <Button
                    className={styles.bookNowButton}
                    style={{ width: 180 }}
                    type="outline"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <div className={`${styles.imgSlider} py-4`}>
                <Swiper
                  modules={[Pagination, Navigation]}
                  className="swiper-slider-no-zoom"
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={pagination}
                  navigation={true}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {data?.data?.data?.images?.map((imageData) => (
                    <SwiperSlide key={imageData._id}>
                      <img
                        src={prepareImageSrc(imageData?.image)}
                        alt={imageData?._id}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </Col>
            <Col md={5}>
              <div className={`${styles.content} py-4 ps-2`}>
                <div className={styles.gridDiv}>
                  <div className={`${styles.dateDiv}  ${styles.borderRight}`}>
                    <span className={styles.title}>Date</span>
                    <span className={styles.date}>
                      {data?.data?.data?.startDate &&
                        format(
                          new Date(data?.data?.data?.startDate),
                          "dd LLL yyyy"
                        )}
                    </span>
                  </div>
                  <div
                    className={`text-truncate ${styles.locationDiv}  ${styles.borderRight}`}
                    title={data?.data?.data?.location}
                  >
                    <span className={styles.title}>Location</span>
                    <span className={styles.location}>
                      <a
                        className="text-uppercase"
                        href={
                          data?.data?.data?.location
                            ? getMapsLocation(data?.data?.data?.location)
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {data?.data?.data?.location}
                      </a>
                    </span>
                  </div>
                  <div className={`${styles.entryDiv}  ${styles.borderRight}`}>
                    <span className={styles.title}>DOORS OPEN</span>
                    <span className={styles.entry}>
                      {data?.data?.data?.startDate &&
                        format(
                          parseISO(data?.data?.data?.startDate),
                          "hh:mm a"
                        )}
                    </span>
                  </div>
                  <div className={`${styles.entryDiv} ${styles.borderRight}`}>
                    <span className={styles.title}>Entry fee</span>
                    <span className={styles.entry}>
                      {data?.data?.data?.price !== 0
                        ? formatCurrency(data?.data?.data?.price)
                        : "FREE"}
                    </span>
                  </div>
                </div>
                <div className={`border-b ${styles.aboutContent}`}>
                  <h3 className="mt-4 mb-3">About event</h3>
                  <Text>{data?.data?.data?.description}</Text>
                </div>
                <div className={`border-b ${styles.aboutContent}`}>
                  <h3>VENUE</h3>
                  {isValidURL(data?.data?.data?.venue) ? null : (
                    <Text>{data?.data?.data?.venue}</Text>
                  )}
                  <a
                    href={
                      data?.data?.data?.venue
                        ? getMapsLocation(data?.data?.data?.venue)
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button type="outline">OPEN MAP</Button>
                  </a>
                </div>
                <div className={`border-b ${styles.aboutContent}`}>
                  <h3>ABOUT INSTITUTION</h3>
                  <div className="d-flex align-items-center gap-4 py-3">
                    <img src="/img/bg-logo.png" alt="" />
                    <div className={styles.info}>
                      <h4>Moivon Company</h4>
                      <span>eVENTS ORGANIZATOR</span>
                    </div>
                  </div>
                  <Text>{data?.data?.data?.eventOrgDetail}</Text>
                  <Button type="outline">VISIT WEBSITE</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={`section ${styles.content} ${styles.lastSection}`}>
        <Container>
          <Row>
            <Col md={6}>
              <h3>RELATED EVENTS</h3>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-end align-items-center mb-4">
                <Link to="/all-events">
                  <span>
                    View All <FiArrowUpRight />
                  </span>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          {/* ${styles.slider} */}
          <div className={`mx-0 `}>
            {allEventsIsLoading ? (
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                <EventLoadingTile tileCount={3} />
              </div>
            ) : allEventsIsError ? (
              <p>{allEventError}</p>
            ) : (
              <Row>
                {allEventsData?.data?.data?.map((event) => (
                  <Col md={4} key={event._id}>
                    <Event
                      event={event}
                      showArrowOnHover
                      customGridClass="customGridClass"
                    />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
export default EventDetail;
