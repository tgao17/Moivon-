import { axiosInstance } from "../utils/api";
import { ALL_ENDPOINTS } from "../utils/endpoints";

export const postQuery = async ({ query }) => {
  return axiosInstance.post(ALL_ENDPOINTS.BUILD_POST_QUERY(), {
    data: query,
  });
};
