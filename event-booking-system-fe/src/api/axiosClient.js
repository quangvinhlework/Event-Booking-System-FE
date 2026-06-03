import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

const authAxiosClient = (token) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

const axiosClientMultipart = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return instance;
}

const authAxiosClientMultipart = (token) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

const axiosClientJsonBody = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});

export { axiosClient, authAxiosClient, authAxiosClientMultipart, axiosClientMultipart, axiosClientJsonBody };