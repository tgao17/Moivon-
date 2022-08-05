import React, { useState } from "react";
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
import { utcToZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { ALL_QUERIES } from "../../utils/endpoints";
import { fetchRelatedEvents, fetchSingleEvent } from "../../services/Events";
import { prepareImageSrc } from "../../utils/api";
import { formatCurrency } from "../../utils/helpers";
import Loader from "../../components/Loader";

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

  console.log(data, "Data from a single query!");

  return (
    <>
      <RouteTitle title="Event Detail" />
      <section className="section">
        <Container>
          <Row>
            <Col>
              <div className={`border-b ${styles.topHead}`}>
                <div
                  className={`${styles.eventHead} d-flex align-items-center gap-3 flex-wrap`}
                >
                  <Heading mb="0" variant="subHeading">
                    {data?.data?.data?.title}
                  </Heading>
                  <span className={styles.type}>CLASSIC MUSEUM</span>
                </div>
                <Button type="outline">Book Now</Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <div className={`${styles.imgSlider} py-4`}>
                <Swiper
                  modules={[Pagination, Navigation]}
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
                      {format(new Date(data?.data?.data?.dates), "dd LLL yyyy")}
                    </span>
                  </div>
                  <div
                    className={`${styles.locationDiv}  ${styles.borderRight}`}
                  >
                    <span className={styles.title}>Location</span>
                    <span className={styles.location}>
                      {data?.data?.data?.location}
                    </span>
                  </div>
                  <div className={`${styles.entryDiv}  ${styles.borderRight}`}>
                    <span className={styles.title}>DOORS OPEN</span>
                    <span className={styles.entry}>
                      {format(
                        new Date(
                          utcToZonedTime(data?.data?.data?.dates, "utc")
                        ),
                        "HH:MM a"
                      )}
                    </span>
                  </div>
                  <div className={`${styles.entryDiv}  ${styles.borderRight}`}>
                    <span className={styles.title}>Entry fee</span>
                    <span className={styles.entry}>
                      {formatCurrency(data?.data?.data?.price)}
                    </span>
                  </div>
                </div>
                <div className={`border-b ${styles.aboutContent}`}>
                  <h3>About event</h3>
                  <Text>{data?.data?.data?.description}</Text>
                </div>
                <div className={`border-b ${styles.aboutContent}`}>
                  <h3>VENUE</h3>
                  <Text>{data?.data?.data?.venue}</Text>
                  <Button type="outline">OPEN MAP</Button>
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
              <Loader />
            ) : allEventsIsError ? (
              <p>{allEventError}</p>
            ) : (
              <Row>
                {allEventsData?.data?.data?.map((event) => (
                  <Col md={4}>
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
