import React, { useState, useRef } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
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
import { MAX_IMAGE_SIZE_IN_MB } from "../../utils/constants";

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  dates: yup.date("Invalid Date").required("Required"),
  price: yup.number("Invalid price").required("Required"),
});

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

const pagination = {
  clickable: true,
};

function UploadEvent() {
  useBackgroundVideo();
  const resolver = useYupValidationResolver(validationSchema);

  const toastId = useRef(null);
  const [images, setImages] = useState([]);

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

  const onImageChange = (event) => {
    const { files } = event.target;

    const uploadableFiles = [];
    let isSomeFilesSkipped = false;
    let errorMessage = "";

    Array.from(files).forEach((file) => {
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
      toast.error(errorMessage);
    }

    // set the images back to state
    setImages(uploadableFiles);
  };

  const onAddEvent = (data) => {
    toastId.current = toast.loading("Creating event...");
    createPublicEventMutation({
      images: images.map((image) => image.raw),
      data,
    });
  };

  const defaultValues = {
    dates: new Date(),
  };
  const {
    control,
    handleSubmit,
    register,
    formState: { isSubmitting, isDirty, isValid },
    reset,
  } = useForm({ resolver, mode: "onChange", defaultValues });

  return (
    <>
      <RouteTitle title="Upload Event" />
      <section className={`section ${styles.uploadSection}`}>
        <Container>
          <Row className="mb-4 border-b">
            <Col md={12}>
              <div className={` ${styles.topHead}`}>
                <Heading
                  mb="0"
                  customClass="cursor-pointer"
                  variant="subHeading"
                >
                  UPLOAD
                </Heading>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={7} className="mb-3">
              <div className={`${styles.imgSlider}`}>
                {images.length === 0 ? (
                  <div
                    className={`${styles["upload-placeholder"]} d-flex justify-content-center align-items-center`}
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
                      <SwiperSlide key={`event_img_${index}`}>
                        <img src={image?.preview} alt={image.raw.name} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              <div className="d-flex justify-content-between flex-wrap mt-3">
                <Text>PREVIEW</Text>
                <Text variant="white">
                  UPLOAD UP TO 5 IMAGES/ VIDEOS (10 MB MAX)
                </Text>
                <div className={styles.uploadDiv}>
                  <input
                    multiple
                    type="file"
                    onChange={onImageChange}
                    accept="image/*"
                  />
                  <Text>UPLOAD</Text>
                </div>
              </div>
            </Col>
            <Col md={5} className="mb-3">
              <form className="ps-2" onSubmit={handleSubmit(onAddEvent)}>
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupTitle"
                >
                  <Form.Label>Title:</Form.Label>
                  <Form.Control type="text" {...register("title")} />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupDate"
                >
                  <Form.Label>Date:</Form.Label>

                  <Controller
                    name="dates"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    )}
                  />
                </Form.Group>
                <div className="d-flex gap-3">
                  <Form.Group
                    className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                    controlId="formGroupGenre"
                  >
                    <Form.Label>Genre:</Form.Label>
                    <Form.Select aria-label="ALL EVENTS" {...register("genre")}>
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
                    <Form.Control
                      type="number"
                      step="any"
                      {...register("price")}
                    />
                  </Form.Group>
                </div>

                <Form.Group
                  className={`${styles.formGroup} mb-2 d-flex align-items-center gap-3`}
                  controlId="formGroupLocation"
                >
                  <Form.Label>location:</Form.Label>
                  <Form.Control type="text" {...register("location")} />
                </Form.Group>

                <Form.Group
                  className={`${styles.formGroup} mb-3`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>DEscription:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="5"
                    {...register("description")}
                  />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-3 d-flex align-items-center gap-3`}
                  controlId="formGroupVenue"
                >
                  <Form.Label>Venue:</Form.Label>
                  <Form.Control type="text" {...register("venue")} />
                </Form.Group>
                <Form.Group
                  className={`${styles.formGroup} mb-2`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>Describe your event organization:</Form.Label>
                  <Form.Control as="textarea" {...register("eventOrgDetail")} />
                </Form.Group>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isDirty || !isValid || images.length === 0}
                >
                  Submit
                </Button>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UploadEvent;
