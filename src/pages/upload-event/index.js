import React, { useState, useRef, useEffect } from "react";
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
import { AiOutlinePlus } from "react-icons/ai";
import Button from "../../components/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import Form from "react-bootstrap/Form";
import moment from "moment";
import DateTime from "react-datetime";
import { usePageView } from "../../hooks/usePageView";
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
  closeOnSelect: true,
};

const pagination = {
  clickable: true,
};

const EVENT_PRICE = {
  FREE: "FREE",
  PAID: "PAID",
};

function UploadEvent() {
  useBackgroundVideo();
  usePageView();
  const resolver = useYupValidationResolver(validationSchema);

  const toastId = useRef(null);
  const inputFileRef = useRef();
  const [images, setImages] = useState([]);
  const [priceType, setPriceType] = useState(EVENT_PRICE.FREE);
  const [paidModal, showPaidModal] = useState(false);

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

  React.useEffect(() => {
    const modal = document.getElementById('modal-mask');
    modal.addEventListener('mousewheel', (e)=> {e.preventDefault()})
    modal.addEventListener('touchmove', (e)=> {e.preventDefault()})
  }, [])

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
    console.log(data);
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
    const datepicks = document.getElementsByClassName('datepick');
    for (let i = 0; i < datepicks.length; i ++) {

      datepicks[i].firstElementChild.setAttribute('readonly', true);
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
          <Row className={styles.uploadRow}>
            <Col md={12}>
              <div className={`${styles.topHead}`}>
                <Heading
                  mb="0"
                  customClass="cursor-pointer"
                  variant="subHeading"
                >
                  UPLOAD
                </Heading>
              </div>
              <div className={styles.headingBorder} />
            </Col>
          </Row>
          <Row>
            <Col md={7} className={styles.myCol7}>
              <div className={`${styles.imgSlider}`}>
                {images.length === 0 ? (
                  <div
                    className={`${styles["upload-placeholder"]} d-flex justify-content-center align-items-center  cursor-pointer`}
                    onClick={() => inputFileRef.current.click()}
                  >
                    <p className="text-white">Upload Some Images / Videos</p>
                  </div>
                ) : (
                  <Swiper
                    modules={[Pagination, Navigation]}
                    className="custom-icons"
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

              <div className={"justify-content-between flex-wrap mt-2 " + styles.noneTablet + " " + styles.dflex}>
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
              <div className={`${styles.topHead} ${styles.tablet}`}>
                <Heading
                  mb="0"
                  customClass="cursor-pointer"
                  variant="subHeading"
                >
                  UPLOAD
                </Heading>
              </div>
            </Col>
            <Col md={5} className={styles.myCol5}>
              <form onSubmit={handleSubmit(onAddEvent)}>
                <Row>
                  <Col xl={12}>
                    <Form.Group
                      className={`${styles.formGroup} d-flex align-items-start gap-3`}
                      controlId="formGroupTitle"
                    >
                      <Form.Label style={{width: '55px'}}>Title:</Form.Label>
                      <Form.Control type="text" {...register("title")} />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Genre and price section */}
                <Row>
                  <Col lg={6} className={styles.myCol6}>
                    <Form.Group
                      className={`${styles.formGroup} w-auto d-flex align-items-start gap-3`}
                      controlId="formGroupGenre"
                    >
                      <Form.Label style={{width: '55px'}}>Genre:</Form.Label>
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
                  <Col lg={6} className={styles.myCol55}>
                    <div className={styles.modalMask + ' ' + (paidModal ? styles.show : '')} id="modal-mask"></div>
                    <div className={"align-items-start gap-1 " + styles.tabletModal + ' ' + (paidModal ? styles.show : '')}>
                      <div className={styles.modalBody}>
                        <Form.Group
                          className={`${styles.formGroup} w-auto d-flex align-items-start gap-3`}
                          controlId="formGroupPrice"
                        >
                          {/* <Form.Label>price:</Form.Label> */}
                          <div
                            className={`d-flex gap-2 align-items-start ${styles.radioBtn}`}
                          >
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                checked={priceType === EVENT_PRICE.FREE}
                                onClick={() => setPriceType(EVENT_PRICE.FREE)}
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
                                checked={priceType === EVENT_PRICE.PAID}
                                onClick={() => setPriceType(EVENT_PRICE.PAID)}
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
                          className={`${styles.formGroup} ${
                            styles.priceContainer
                          } ${
                            priceType === EVENT_PRICE.PAID ? "d-block" : "d-none"
                          }`}
                        >
                          <Form.Control
                            type="number"
                            step="any"
                            style={{width: '100%'}}
                            {...register("price")}
                          />
                        </Form.Group>
                      </div>
                      <div className={styles.saveButton} onClick={() => showPaidModal(false)}>
                          SAVE
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className={styles.tabletBar}>
                  <div className="d-flex align-items-center" onClick={() => showPaidModal(true)}>
                    {/* <AiOutlinePlus style={{ width: '17px', height: '17px', marginTop: '-3px' }} /> */}
                    <span className={styles.plus}>+</span>
                    <span className={styles.enterFee}>ENTER FEE</span>
                  </div>                  
                  <button
                    className={styles.submitButton}
                    htmlType="submit"
                    disabled={!isDirty || !isValid || images.length === 0}
                  >SUBMIT
                  </button>
                </div>

                <Row>
                  <Col xl={6}>
                    <Form.Group
                      className={`${styles.formGroup} d-flex align-items-start gap-1`}
                      controlId="formGroupStartDate"
                    >
                      <Form.Label style={{width: '80px'}}>Start Date:</Form.Label>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                          <DateTime
                            dateFormat='MMM DD   '
                            className={styles.dateTimePicker + ' datepick'}
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
                      className={`${styles.formGroup} d-flex align-items-start gap-1`}
                      controlId="formGroupEndDate"
                    >
                      <Form.Label style={{width: '80px'}}>End Date:</Form.Label>
                      <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                          <DateTime
                            className={styles.dateTimePicker + ' datepick'}
                            onChange={field.onChange}
                            dateFormat='MMM DD   '
                            value={field.value}
                            isValidDate={(current) => {
                              const date = moment(minDate).subtract(1, "day");
                              return current.isAfter(date);
                            }}
                            {...dateTimePickerProps}
                          />
                        )}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group
                  className={`${styles.formGroup} d-flex align-items-start gap-1`}
                  controlId="formGroupLocation"
                >
                  <Form.Label style={{width: '80px'}}>location:</Form.Label>
                  <Form.Control type="text" {...register("location")} />
                </Form.Group>

                <Form.Group
                  className={`${styles.formGroup1 + ' ' + styles.formGroup}`}
                  controlId="formGroupDescription"
                >
                  <Form.Label className="mb-1">Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    className={styles.textarea1}
                    {...register("description")}
                  />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} d-flex align-items-start gap-3`}
                  controlId="formGroupVenue"
                >
                  <Form.Label>Venue:</Form.Label>
                  <Form.Control type="text" {...register("venue")} />
                </Form.Group>

                {/* Organization and url links */}
                <Row>
                  <Col lg={7}>
                    <Form.Group
                      className={`${styles.formGroup} d-flex align-items-start gap-3`}
                      controlId="formGroupOrganization"
                    >
                      <Form.Label>Organization:</Form.Label>
                      <Form.Control type="text" {...register("organization")} />
                    </Form.Group>
                  </Col>
                  <Col lg={5}>
                    <div className="gap-3">
                      <Form.Group
                        className={`${styles.formGroup} d-flex align-items-start gap-3`}
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
                  className={`${styles.formGroup1 + ' ' + styles.formGroup}`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>Describe your event organization:</Form.Label>
                  <Form.Control
                    as="textarea"
                    className={styles.textarea2}
                    {...register("eventOrgDetail")}
                  />
                </Form.Group>
                {/* Event url link */}
                <Form.Group
                  className={`${styles.formGroup} d-flex align-items-start gap-3`}
                  controlId="formGroupOrganization"
                >
                  <Form.Label>Event URL:</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("eventUrl")}
                    style={{ flex: 1 }}
                  />
                </Form.Group>
                <div className={"pt-2 justify-content-end align-items-start " + styles.noneTablet + " " + styles.dflex}>
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
          <Row className={styles.footer}>
            <Col className="p-0">
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
