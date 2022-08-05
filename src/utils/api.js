import axios from "axios";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const prepareImageSrc = (url) => `${BASE_URL}/${url}`;

export { prepareImageSrc, axiosInstance };
