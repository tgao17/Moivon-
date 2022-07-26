import React, { useState, useRef } from "react";

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
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as yup from "yup";
import Text from "../../components/Text";
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";
import { checkMaxFileSize, isEmpty } from "../../utils/helpers";
import { MAX_IMAGE_SIZE_IN_MB } from "../../utils/constants";
import { createPublicEvent } from "../../services/Events";
import { fetchAllGenres } from "../../services/Genre";
import { ALL_QUERIES } from "../../utils/endpoints";

// Connect the Images using react-hook-form

const validationSchema = yup.object({
  title: yup.string().required("Required"),
  description: yup.string().required("Required"),
  dates: yup.date("Invalid Date").required("Required"),
  price: yup.number("Invalid price").required("Required"),
});

function UploadEvent() {
  const resolver = useYupValidationResolver(validationSchema);

  const toastId = useRef(null);

  // load all genre
  const {
    data: allGenres,
    isLoading,
    isError,
    error,
  } = useQuery(ALL_QUERIES.QUERY_ALL_GENRES(), fetchAllGenres);

  console.log({
    allGenres,
  });

  const mutation = useMutation(
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

  const [images, setImages] = useState([]);

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
    mutation.mutate({
      images: images.map((image) => image.raw),
      data,
    });
  };

  const defaultValues = {
    dates: new Date(),
    genre: allGenres?.data?.data?.[0].id,
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
      <section className="section">
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
                    pagination={{
                      clickable: true,
                    }}
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
            <Col md={5} className="mb-3" onSubmit={handleSubmit(onAddEvent)}>
              <Form as="form" className="ps-2">
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
                    {/* <Form.Control type="tel" {...register("genre")} /> */}
                    <Form.Select
                      aria-label="Default select example"
                      {...register("genre")}
                    >
                      {allGenres?.data?.data?.map(({ id, attributes }) => (
                        <option key={id} value={id}>
                          {attributes?.genre}
                        </option>
                      ))}
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
                  <Form.Label>Description:</Form.Label>
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
                  className={`${styles.formGroup} mb-4`}
                  controlId="formGroupDescription"
                >
                  <Form.Label>Describe your event organization:</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register("eventOrganisationDescription")}
                  />
                </Form.Group>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={!isDirty || !isValid || images.length === 0}
                >
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default UploadEvent;
