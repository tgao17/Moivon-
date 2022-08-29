import React from "react";
import styles from "./index.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Heading from "../../components/Heading";
import Text from "../../components/Text";
import Button from "../../components/Button";
import HomeSlider from "../../components/HomeSlider";
import EventSlider from "../../components/EventSlider";
import { FiArrowUpRight } from "react-icons/fi";
import HomeForm from "../../components/Form";
import { Link } from "react-router-dom";
import { useBackgroundImage } from "../../hooks/useBackgroundImage";
import { useBackgroundVideo } from "../../hooks/useBackgroundVideo";
import RouteTitle from "../../components/RouteTitle/RouteTitle";
import MostPopularAccordion from "../../components/MostPopularAccordion";
import Hero from "../../components/Hero";
function Home() {
  // useBackgroundImage();
  //useBackgroundVideo();
  return (
    <>
      <RouteTitle title="Home" />
      <Hero />
      <div className="wrapper-home d-none">
        <section className={`${styles.heroSection} section`}>
          <Container>
            <Row>
              <Col lg={8}>
                <div className={styles.heroHeading + " mb-5"}>
                  <Heading>More of the events you love </Heading>
                  <span className={styles.spanHead}>
                    Welcome to Moivon! A connection to creative events, curated
                    for you.
                    <br /> Discover all events and fall in love in each!
                    <br />
                    Lorem ipsum dolorem en rem puto qerqerium si laverawut
                  </span>
                </div>
                <div
                  className={`${styles.heroIcons} d-flex gap-4 align-items-center flex-wrap`}
                >
                  <Button type="primary" to="/all-events" as={Link}>
                    Explore Now
                  </Button>
                  <span>
                    <img src="/img/video.svg" alt="video" /> Video of our events
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="section">
          <Container>
            <Row>
              <Col lg={7}>
                <Row className={styles.customRow}>
                  <Col xs={6} sm={4} className={styles.customCol}>
                    <div className={styles.countWrapper}>
                      <Heading mb="5">2400+</Heading>
                      <Text>Art Events</Text>
                    </div>
                  </Col>
                  <Col xs={6} sm={4} className={styles.customCol}>
                    <div className={styles.countWrapper}>
                      <Heading mb="5">1200+</Heading>
                      <Text>Positive Reviews</Text>
                    </div>
                  </Col>
                  <Col xs={6} sm={4} className={styles.customCol}>
                    <div className={styles.countWrapper}>
                      <Heading mb="5">80</Heading>
                      <Text>Top Locations</Text>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>

        <section className={`${styles.teamSection} section`}>
          <Container>
            <Row>
              <Col>
                <div className={`mx-0 ${styles.sliderTeam}`}>
                  <HomeSlider />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className={`section ${styles.bottomSection}`}>
          <MostPopularAccordion />
        </section>
        <section className="section">
          <Container>
            <Row>
              <Col md={8}>
                <Heading variant="subHeading">Upcoming for you </Heading>
              </Col>
              <Col md={4}>
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
              <EventSlider />
            </div>
          </Container>
        </section>
        <section
          className={`section ${styles.connectionSection}`}
          id="about-page"
        >
          <div className={styles.paddingAll}>
            <div className={styles.bgImg}>
              <Container>
                <Row>
                  <Col md={6}>
                    <div className={styles.paddingR}>
                      <Heading variant="subHeading">
                        IT BEGINS WITH THE
                        <br /> CONNECTION...
                      </Heading>
                      <Text>
                        Moivon is inspired by a need to connect seekers of art,
                        design, and creativity to events happening around us. In
                        a day and age where structureless information overcrowds
                        our attention, it is hard to narrow down a discover
                        trajectory that caters our unique taste. Hence, Moivon
                        is created to filter out the tedious process of
                        relentless searching and planning so you can focus on
                        enjoying the curated experiences.
                      </Text>
                      <Text>
                        Reach us at{" "}
                        <a href="mailto:info@moivon.com">
                          info@moivon.com <FiArrowUpRight />
                        </a>
                      </Text>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div
                      className={`${styles.largeLogoDiv} d-flex justify-content-center align-items-center h-100`}
                    >
                      <img src="/img/large-logo.svg" alt="logo" />
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </section>
        <section
          className={`section ${styles.contactSection}`}
          id="contact-page"
        >
          <Container>
            <Row>
              <Col md={6} className="mb-4">
                <div className={`${styles.contactWrapper} ${styles.paddingR}`}>
                  <Heading variant="subHeading">
                    CONTACT US FOR ANY
                    <br /> QUESTIONS
                  </Heading>
                  <Text>
                    If you have any questions or propositions regarding to
                    Moivon’s events - you can contact us and we will reply as
                    soon as possible
                  </Text>
                  <img
                    src="/img/contact.png"
                    alt="contact"
                    width="100%"
                    height="252"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.form}>
                  <HomeForm />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  );
}

export default Home;
