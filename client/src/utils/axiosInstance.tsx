import axios from "axios";
import { refreshToken } from "../apis/tokenApi";
import store from "../store"; // 수정된 부분: default import로 변경

// axios 인스턴스 생성
const instance = axios.create({
  baseURL: "https://j9b302.p.ssafy.io",
});

// 응답 인터셉터 추가
instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (
      error.response.status === 401 &&
      error.response.data.message === "토큰 만료"
    ) {
      const userId = store.getState().user.userId; // 직접적으로 Redux store에서 userId를 가져옵니다.
      const newAccessToken = await refreshToken(userId); // userId를 refreshToken 함수로 전달합니다.

      if (newAccessToken) {
        console.log(newAccessToken);
        error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance.request(error.config);
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
