import axios from "axios";

// axios 객체 생성
export const $ = axios.create({
  // baseURL: "https://musicat.kr/api",
  // baseURL: "http://localhost:8081/ws",
  baseURL: "http://j9b302a.p.ssafy.io:8080/ws",
  headers: {
    "Content-Type": "application/json",
  },
});

$.interceptors.request.use(config => {
  config.headers["token"] = sessionStorage.getItem("token");
  return config;
});
