import { axiosInstance } from "../utils/api";
import { HEADERS } from "../utils/constants";
import { ALL_ENDPOINTS } from "../utils/endpoints";

export const fetchAllEvent = async () => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_ALL_EVENTS());
};

export const fetchRelatedEvents = async () => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_RELATED_EVENTS());
};

export const fetchSingleEvent = async ({ eventId }) => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_SINGLE_EVENT({ eventId }));
};

export const createPublicEvent = ({ images, json_data }) => {
  const formData = new FormData();
  // append multiple images
  images.forEach((image) => formData.append("files.image", image, image.name));
  formData.append(
    "data",
    JSON.stringify({
      ...json_data,
      publishedAt: null,
    })
  );
  return axiosInstance.post(
    ALL_ENDPOINTS.BUILD_POST_NEW_EVENT(),
    formData,
    HEADERS.formData
  );
};
