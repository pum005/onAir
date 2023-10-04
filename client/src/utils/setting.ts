import axios from "axios";

// axios 객체 생성
export const $ = axios.create({
  // baseURL: "http://localhost:8081/ws",
  baseURL: "https://j9b302a.p.ssafy.io/ws",
  headers: {
    "Content-Type": "application/json",
  },
});

$.interceptors.request.use((config) => {
  config.headers["token"] = sessionStorage.getItem("token");
  return config;
});

//찍
