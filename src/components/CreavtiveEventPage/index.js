import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./index.module.css";
import React from "react";
import { Link } from "react-router-dom";
import Heading from "../../components/Heading";
import Button from "../Button";

export default function CreavtiveEventPage() {
  return (
    <>
      <div className={styles.CustomContainer}>
        <Container>
          <Row>
            <Col lg={12}>
              <div className={styles.heroHeading}>
                <Heading>
                  FINDING YOUR NEXT CREATIVE EVENT
                  <br /> SHOULD BE SO EASY{" "}
                </Heading>
                <span className={styles.spanHead}>
                  Welcome to Moivon, your one source for uncovering
                  <br /> art, creative, and design events. Explore our curated
                  <br />
                  list made for you and fall in love in each!
                </span>

                <div
                  className={`${styles.heroIcons} d-flex gap-4 align-items-center flex-wrap`}
                >
                  <Button type="primary" to="/all-events" as={Link}>
                    Explore Now
                  </Button>
                  <span>
                    <img src="/img/video.svg" alt="video" />
                    <h6>Video of our events</h6>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <img
                className={styles.herosectionImg}
                src="/img/Arrow.svg"
                alt="Arrow"
                onClick={() => {
                  window.scrollBy(0, window.innerHeight);
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
