import axios from "axios";
import { User } from "../store";

// 토큰 검증 및 새로운 액세스 토큰을 받아오는 함수
export const refreshToken = async (userId: number): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("userId:", userId); // 값 출력
  console.log("refreshToken:", refreshToken); // 값 출력

  if (!refreshToken) {
    return null; // refreshToken이 없으면 null 반환
  }

  try {
    const response = await axios.post("http://localhost:8080/token/refresh", {
      userId: userId, // 여기를 수정했습니다.
      refreshToken: refreshToken,
    });

    const { data } = response;

    if (data.accessToken) {
      // 새로운 액세스 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } else {
      return null; // 새로운 액세스 토큰이 없으면 null 반환
    }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null; // 에러 발생 시 null 반환
  }
};
