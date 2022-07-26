import { axiosInstance } from "../utils/api";
import { ALL_ENDPOINTS } from "../utils/endpoints";

export const fetchAllGenres = async () => {
  return axiosInstance.get(ALL_ENDPOINTS.BUILD_ALL_GENRES());
};
