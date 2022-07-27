import React, { useState } from "react";
import styles from "./index.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Form from "react-bootstrap/Form";
import DateTimePicker from "react-datetime-picker";
// Import Swiper styles
import "swiper/css";

import Text from "../../components/Text";
import { useBackgroundVideo } from "../../hooks/useBackgroundVideo";

const eventImg = [
  {
    image: "/img/detail-img.png",
  },
  {
    image: "/img/detail-img.png",
  },
  {
    image: "/img/detail-img.png",
  },
];

function UploadEvent() {
  const pagination = {
    clickable: true,
  };
  useBackgroundVideo();
  const [value, onChange] = useState(new Date());
  return (
    <>
      <section className={`section ${styles.uploadSection}`}>
        <Container>
          <Row className="mb-4 border-b">
            <Col md={12}>
              <div className={` ${styles.topHead}`}>
                <Heading mb="0" variant="subHeading">
                  UPLOAD
                </Heading>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={7} className="mb-3">
              <div className={`${styles.imgSlider} `}>
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={pagination}
                  navigation={true}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                >
                  {eventImg?.map((data) => (
                    <SwiperSlide>
                      <img src={data?.image} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="d-flex justify-content-between flex-wrap mt-3">
                <Text>PREVIEW</Text>
                <Text variant="white">
                  UPLOAD UP TO 5 IMAGES/ VIDEOS (10 MB MAX)
                </Text>
                <div className={styles.uploadDiv}>
                  <input type="file" />
                  <Text>UPLOAD</Text>
                </div>
              </div>
            </Col>
            <Col md={5} className="mb-3">
              <Form className="ps-2 ">
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupTitle"
                >
                  <Form.Label>Title:</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupDate"
                >
                  <Form.Label>Date:</Form.Label>

                  <DateTimePicker onChange={onChange} value={value} />
                </Form.Group>
                <div className="d-flex gap-3">
                  <Form.Group
                    className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                    controlId="formGroupGenre"
                  >
                    <Form.Label>Genre:</Form.Label>
                    <Form.Select aria-label="ALL EVENTS">
                      <option>CLASSIC MUSEUM</option>
                      <option value="1">GALLERY</option>
                      <option value="2">FEATURE VENUE</option>
                      <option value="3">DESIGN CONVENTION</option>
                      <option value="4">INDIVIDUAL</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group
                    className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                    controlId="formGroupPrice"
                  >
                    <Form.Label>price:</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                </div>

                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupLocation"
                >
                  <Form.Label>location:</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <Form.Group
                  className={`${styles.formGroup} mb-3`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>DEscription:</Form.Label>
                  <Form.Control as="textarea" rows="5" />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-3 d-flex align-items-center gap-3`}
                  controlId="formGroupVenue"
                >
                  <Form.Label>Venue:</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-2`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>Describe your event organization:</Form.Label>
                  <Form.Control as="textarea" />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UploadEvent;
