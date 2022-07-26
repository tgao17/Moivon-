import styles from "./footer.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Text from "../Text";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <section className={`${styles.footerSection} section`}>
        <Container>
          <Row className="mb-4">
            <Col sm={8}>
              <Row>
                <Col xs={6} sm={6} md={3}>
                  <div className={styles.logo}>
                    <Link to="/">
                      <img src="/img/moivon.png" alt="logo" />
                    </Link>
                  </div>
                </Col>
                <Col xs={6} sm={6} md={3}>
                  <h3>EVENTS</h3>
                  <ul>
                    <li>All Events</li>
                    <li>Classic Museum</li>
                    <li>Gallery</li>
                    <li>Feature Venue</li>
                    <li>Design Convetion</li>
                    <li>Individual</li>
                  </ul>
                </Col>
                <Col xs={6} sm={6} md={3}>
                  <h3>NAVIGATION</h3>
                  <ul>
                    <li>Upcoming events</li>
                    <li>Most popular events</li>
                    <li>Most popular events</li>
                    <li>About us</li>
                    <li>Contact us</li>
                  </ul>
                </Col>
                <Col xs={6} sm={6} md={3}>
                  <h3>social media</h3>
                  <ul>
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <li>TikTok</li>
                    <li>Twitter</li>
                  </ul>
                </Col>
              </Row>
            </Col>
            <Col sm={4}>
              <div className={styles.subscribeSection}>
                <h3 className="mb-3">Subscribe for updates</h3>
                <Form>
                  <Form.Group
                    className={`${styles.formGroup} mb-3`}
                    controlId="formGroupEmail"
                  >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your  email"
                    />
                  </Form.Group>
                </Form>
              </div>
            </Col>
          </Row>
          <Row className={styles.copyRight}>
            <Col md={6}>
              <div className="text-center">
                <Text>2022 All rights reserved — Moivon</Text>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center">
                <ul className="d-flex gap-3 justify-content-center mb-0 flex-wrap">
                  <li>Privacy Policy</li>
                  <li>Terms and Conditions</li>
                  <li>Acceptable Use Policy</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Footer;
