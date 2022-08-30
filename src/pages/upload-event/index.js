import React, { useState, useRef, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
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

import Text from "../../components/Text";
import { useBackgroundVideo } from "../../hooks/useBackgroundVideo";
import RouteTitle from "../../components/RouteTitle/RouteTitle";
import { createPublicEvent } from "../../services/EventService";
import { checkMaxFileSize, isEmpty } from "../../utils/helpers";
import {
  MAX_IMAGE_SIZE_IN_MB,
  MAX_ALLOWED_IMAGES,
} from "../../utils/constants";
import { ALL_QUERIES } from "../../utils/endpoints";
import { fetchAllGenres } from "../../services/GenreService";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  startDate: yup.date("Invalid Date").required("Required"),
  endDate: yup.date("Invalid Date").required("Required"),
  venue: yup.string().required("Required"),
});

const dateTimePickerProps = {
  yearPlaceholder: "YYYY",
  hourPlaceholder: "H",
  minutePlaceholder: "M",
  secondPlaceholder: "ss",
  monthPlaceholder: "MM",
  dayPlaceholder: "DD",
  showLeadingZeros: true,
  // disableClock: true,
  calendarIcon: null,
  locale: "en-US",
};

const pagination = {
  clickable: true,
};

function UploadEvent() {
  useBackgroundVideo();
  const resolver = useYupValidationResolver(validationSchema);

  const toastId = useRef(null);
  const inputFileRef = useRef();
  const [images, setImages] = useState([]);
  const [showPrice, setShowPrice] = useState(false);

  const { data: allGenres, isLoading: allGenresLoading } = useQuery(
    ALL_QUERIES.QUERY_ALL_GENRES(),
    fetchAllGenres
  );

  const { mutate: createPublicEventMutation } = useMutation(
    (newQuery) =>
      createPublicEvent({
        images: newQuery.images,
        json_data: newQuery.data,
      }),
    {
      onSuccess: () => {
        toast.remove(toastId.current);
        const successId = toast.success("Event created successfully!");
        reset();
        setImages([]);
        setTimeout(() => toast.remove(successId), 3000);
      },
    }
  );

  const onInputFileReset = () => (inputFileRef.current.value = "");

  const onImageChange = (event) => {
    const { files } = event.target;
    const allFiles = Array.from(files);

    if (allFiles.length === 0) return;

    onInputFileReset();

    if (toastId.current) {
      console.log("removing.....");
      toast.remove(toastId.current);
    }

    if (images.length === MAX_ALLOWED_IMAGES) {
      toastId.current = toast.error(
        `Maximum of ${MAX_ALLOWED_IMAGES} images are allowed!`
      );
      return;
    }

    const uploadableFiles = [];
    let isSomeFilesSkipped = false;
    let errorMessage = "";

    allFiles.forEach((file) => {
      const isAllowed = checkMaxFileSize(file.size, MAX_IMAGE_SIZE_IN_MB);
      if (isAllowed) {
        uploadableFiles.push({
          raw: file,
          preview: URL.createObjectURL(file),
        });
      } else {
        isSomeFilesSkipped = true;
      }
    });

    if (isEmpty(uploadableFiles)) {
      errorMessage = `Please upload files with size less than ${MAX_IMAGE_SIZE_IN_MB}MB!`;
    } else if (isSomeFilesSkipped) {
      errorMessage = `Some of the images are not less than ${MAX_IMAGE_SIZE_IN_MB}MB!`;
    }

    // show the error message if the error flag is set
    if (errorMessage) {
      toastId.current = toast.error(errorMessage);
    }
    // set the images back to state
    setImages((prevFiles) => [...prevFiles, ...uploadableFiles]);
  };

  const onAddEvent = (data) => {
    toastId.current = toast.loading("Creating event...");
    createPublicEventMutation({
      images: images.map((image) => image.raw),
      data,
    });
  };

  const defaultValues = {
    startDate: new Date(),
    endDate: new Date(),
    genre: allGenres?.data?.data?.[0]?._id,
  };

  const {
    control,
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
    watch,
    setValue,
  } = useForm({ resolver, mode: "onChange", defaultValues });

  const minDate = watch("startDate");

  useEffect(() => {
    if (!allGenresLoading && allGenres?.data?.data?.length) {
      setValue("genre", allGenres?.data?.data?.[0]?._id);
    }
  }, [allGenresLoading]);

  const onDeleteLocalImage = (idx) => {
    const allImages = [...images];
    allImages.splice(idx, 1);
    setImages(allImages);
  };



  return (
    <>
      <RouteTitle title="Upload Event" />
      <section className={`section ${styles.uploadSection}`}>
        <Container>
          <Row className="mb-4">
            <Col md={12}>
              <div className={`${styles.topHead}`}>
                <Heading
                  mb="0"
                  customClass="cursor-pointer"
                  variant="subHeading"
                  style={{ fontSize: 40 }}
                >
                  UPLOAD
                </Heading>
              </div>
              <div className={styles.headingBorder} />
            </Col>
          </Row>
          <Row>
            <Col md={7} className="mb-3">
              <div className={`${styles.imgSlider}`}>
                {images.length === 0 ? (
                  <div
                    className={`${styles["upload-placeholder"]} d-flex justify-content-center align-items-center  cursor-pointer`}
                    onClick={() => inputFileRef.current.click()}
                  >
                    <p className="text-white">Upload Some Images</p>
                  </div>
                ) : (
                  <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={pagination}
                    navigation={true}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={(swiper) => console.log(swiper)}
                  >
                    {images?.map((image, index) => (
                      <SwiperSlide
                        key={`event_img_${index}`}
                        className={styles.swiperSlide}
                      >
                        <img src={image?.preview} alt={image.raw.name} />
                        <Button
                          type="black"
                          onClick={() => onDeleteLocalImage(index)}
                        >
                          Delete
                        </Button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              <div className="d-flex justify-content-between flex-wrap mt-3">
                <Text variant="white">PREVIEW</Text>
                <Text>
                  UPLOAD UP TO {MAX_ALLOWED_IMAGES} IMAGES/ VIDEOS (
                  {MAX_IMAGE_SIZE_IN_MB} MB MAX)
                </Text>
                <div className={styles.uploadDiv}>
                  <input
                    multiple
                    type="file"
                    onChange={onImageChange}
                    accept="image/*"
                    ref={inputFileRef}
                  />
                  <Text variant="white">UPLOAD</Text>
                </div>
              </div>
            </Col>
            <Col md={5} className="mb-3">
              <form onSubmit={handleSubmit(onAddEvent)}>
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupTitle"
                >
                  <Form.Label>Title:</Form.Label>
                  <Form.Control type="text" {...register("title")} />
                </Form.Group>
                <Row>
                  <Col xl={6}>
                    <Form.Group
                      className={`${styles.formGroup} mb-2 d-flex align-items-center gap-1`}
                      controlId="formGroupStartDate"
                    >
                      <Form.Label>From:</Form.Label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            onChange={field.onChange}
                            value={field.value}
                            {...dateTimePickerProps}
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl={6}>
                    <Form.Group
                      className={`${styles.formGroup} mb-2 d-flex align-items-center gap-1`}
                      controlId="formGroupEndDate"
                    >
                      <Form.Label>To:</Form.Label>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DateTimePicker
                            onChange={field.onChange}
                            value={field.value}
                            minDate={minDate}
                            {...dateTimePickerProps}
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Genre and price section */}
                <Row>
                  <Col lg={6} className="mb-2">
                    <Form.Group
                      className={`${styles.formGroup} w-auto d-flex align-items-center gap-3`}
                      controlId="formGroupGenre"
                    >
                      <Form.Label>Genre:</Form.Label>
                      <Form.Select
                        aria-label="ALL EVENTS"
                        {...register("genre")}
                      >
                        {!allGenresLoading &&
                          allGenres?.data?.data?.map((genre) => (
                            <option key={genre._id} value={genre._id}>
                              {genre.genre}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={6} className="mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <Form.Group
                        className={`${styles.formGroup} w-auto d-flex align-items-center gap-3`}
                        controlId="formGroupPrice"
                      >
                        {/* <Form.Label>price:</Form.Label> */}
                        <div
                          className={`d-flex gap-3 align-items-center ${styles.radioBtn}`}
                        >
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                              checked={showPrice === false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setShowPrice(false);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              for="flexRadioDefault2"
                            >
                              Free
                            </label>
                          </div>
                          <div className={`form-check ${styles.formCheck}`}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              checked={showPrice}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setShowPrice(true);
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              for="flexRadioDefault1"
                            >
                              Paid
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                      <Form.Group
                        className={`${styles.formGroup} ${styles.priceContainer}`}
                        style={{ display: showPrice ? "block" : "hidden" }}
                      >
                        <Form.Control
                          type="number"
                          step="any"
                          {...register("price")}
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupLocation"
                >
                  <Form.Label>location:</Form.Label>
                  <Form.Control type="text" {...register("location")} />
                </Form.Group>

                <Form.Group
                  className={`${styles.formGroup} mb-2`}
                  controlId="formGroupDescription"
                >
                  <Form.Label className="mb-1">Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    {...register("description")}
                  />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupVenue"
                >
                  <Form.Label>Venue:</Form.Label>
                  <Form.Control type="text" {...register("venue")} />
                </Form.Group>

                {/* Organization and url links */}
                <Row>
                  <Col lg={7} className="mb-2">
                    <Form.Group
                      className={`${styles.formGroup} d-flex align-items-center gap-3`}
                      controlId="formGroupOrganization"
                    >
                      <Form.Label>Organization:</Form.Label>
                      <Form.Control type="text" {...register("organization")} />
                    </Form.Group>
                  </Col>
                  <Col lg={5} className="mb-2">
                    <div className="gap-3">
                      <Form.Group
                        className={`${styles.formGroup} d-flex align-items-center gap-3`}
                        controlId="formGroupOrganizationUrl"
                      >
                        <Form.Label>Url:</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("organizationUrl")}
                        />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>

                <Form.Group
                  className={`${styles.formGroup} mb-2`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>Describe your event organization:</Form.Label>
                  <Form.Control as="textarea" {...register("eventOrgDetail")} />
                </Form.Group>
                {/* Event url link */}
                <Form.Group
                  className={`${styles.formGroup} d-flex align-items-center gap-3 mb-4`}
                  controlId="formGroupOrganization"
                >
                  <Form.Label>Event URL:</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("eventUrl")}
                    style={{ flex: 1 }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end align-items-center">
                  <button
                    className="text-button"
                    htmlType="submit"
                    disabled={!isDirty || !isValid || images.length === 0}
                  >
                    <Text variant="white">SUBMIT</Text>
                  </button>
                </div>
              </form>
            </Col>
          </Row>
          <Row className={`mt-5 ${styles.footer}`}>
            <Col>
              <Text
                variant="white"
                className="text-uppercase"
                style={{
                  fontFamily: `var(--manrope-bold) !important`,
                }}
              >
                <h4>Uploading with ease</h4>
              </Text>
              <Text className="mt-4">
                <ol>
                  <li>
                    Upload your event's best photos and videos in our 2 x 3
                    frame ({MAX_IMAGE_SIZE_IN_MB}mb max)
                  </li>
                  <li>Fill out all the information fields on the right</li>
                  <li>Submit!</li>
                </ol>
              </Text>
              <div className={styles.contactInfo}>
                <Text className="mb-0">
                  Once of our admins will verify and approve the event. Your
                  event will be live on Moivon within 24 hours.
                </Text>
                <Text>
                  If your event is not approved or if you have questions and
                  concerns, please email{" "}
                  <a href="mailto://info@moivon.com">info@moivon.com</a>
                </Text>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UploadEvent;
