import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EventAccordion from "../EventAccordion";
import Heading from "../Heading";
import styles from "./index.module.css";
import { useQuery } from "@tanstack/react-query";
import { ALL_QUERIES } from "../../utils/endpoints";
import { fetchMostFavoriteEvents } from "../../services/EventService";
import Loader from "../Loader";
import { prepareImageSrc } from "../../utils/api";
import { Link } from "react-router-dom";

const MostPopularAccordion = () => {
  const { isLoading, isError, error, data } = useQuery(
    ALL_QUERIES.QUERY_MOST_POPULAR(),
    () => fetchMostFavoriteEvents()
  );

  const [show, setShow] = useState(null);

  useEffect(() => {
    setShow(
      !isLoading
        ? data?.data?.data?.length >= 2
          ? data?.data?.data?.[1]?._id
          : data?.data?.data?.[0]?._id
        : null
    );
  }, [data?.data]);

  if (isLoading) return <Loader />;
  if (isError) return <p>{error}</p>;

  const getImage = () => {
    const foundObject = data?.data?.data?.find((e) => e._id === show);
    return foundObject?.images?.[0]?.image;
  };

  const getEventLink = () => {
    const foundObject = data?.data?.data?.find((e) => e._id === show);
    return foundObject?._id;
  };

  return (
    <Container className={`position-relative ${styles.customcontainer}`}>
      <Row>
        <Col md={5}>
          <div className={styles.paddingRight}>
            <Heading variant="subHeading">
              Most popular
              <br /> this week
            </Heading>
            <div className={`${styles.dreamContent} `}>
              {data?.data?.data?.length > 0 ? (
                data?.data?.data?.map((event, idx) => (
                  <EventAccordion
                    isExpanded={event._id === show}
                    onExpand={() => setShow(event._id)}
                    key={event._id}
                    event={event}
                  />
                ))
              ) : (
                <h3 className="mt-2 text-base text-white">
                  No popular events added!
                </h3>
              )}
            </div>
          </div>
        </Col>
        <Col md={7}>
          <div className="w-100 h-100">
            {!isLoading && data?.data?.data?.length > 0 && (
              <Link to={`/event-detail/${getEventLink()}`}>
                <img
                  className={styles.image}
                  src={prepareImageSrc(getImage())}
                  alt=""
                  width="100%"
                  height="100%"
                />
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MostPopularAccordion;
