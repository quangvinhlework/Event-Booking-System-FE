import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/nvtt_lqv/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const authAxiosClient = (token) => {
  const instance = axios.create({
    baseURL: "http://localhost:8080/nvtt_lqv/api",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

const axiosClientJson = axios.create({
  baseURL: "http://localhost:8080/nvtt_lqv/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export { axiosClient, authAxiosClient, axiosClientJson };