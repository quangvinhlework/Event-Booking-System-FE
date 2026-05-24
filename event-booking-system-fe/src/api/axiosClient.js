import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/nvtt_lqv/api",
});

const authAxiosClient = (token) => {
  const instance = axios.create({
    baseURL: "http://localhost:8080/nvtt_lqv/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

const axiosClientMultipart = () => {
  const instance = axios.create({
    baseURL: "http://localhost:8080/nvtt_lqv/api",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return instance;
}

const authAxiosClientMultipart = (token) => {
  const instance = axios.create({
    baseURL: "http://localhost:8080/nvtt_lqv/api",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

export { axiosClient, authAxiosClient, authAxiosClientMultipart, axiosClientMultipart };