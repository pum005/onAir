import axios from "axios";
import { User } from "../store";

// 토큰 검증 및 새로운 액세스 토큰을 받아오는 함수
export const refreshToken = async (userId: number): Promise<string | null> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null; // refreshToken이 없으면 null 반환
  }

  try {
    const response = await axios.post(
      "https://j9b302.p.ssafy.io/token/refresh",
      {
        userId: userId,
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
