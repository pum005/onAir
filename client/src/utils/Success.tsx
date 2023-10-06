import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // react-router-dom 라이브러리에서 필요한 훅을 가져옵니다.
import { useDispatch } from "react-redux"; // react-redux 라이브러리에서 useDispatch 훅을 가져옵니다.
import { setUserData } from "../store"; // 사용자 데이터를 설정하는 Redux 액션을 가져옵니다.

const Login: React.FC = () => {
  const location = useLocation(); // 현재 라우터의 위치 정보를 가져옵니다.
  const navigate = useNavigate(); // 페이지 이동을 위한 훅입니다.
  const dispatch = useDispatch(); // Redux의 dispatch 함수를 가져옵니다.
  const params = new URLSearchParams(location.search); // 현재 URL의 쿼리 파라미터를 분석하기 위한 객체를 생성합니다.
  const accessToken = params.get("access"); // URL에서 "access" 쿼리 파라미터 값을 가져옵니다.

  // accessToken 값이 변경될 때마다 실행되는 useEffect 훅입니다.
  useEffect(() => {
    if (accessToken) {
      sendLoginRequest(accessToken);
    }
  }, [accessToken]);

  // 서버에 로그인 요청을 보내는 함수입니다.
  const sendLoginRequest = async (token: string | null) => {
    // 서버에 POST 요청을 보냅니다.
    const response = await fetch(
      "https://j9b302.p.ssafy.io/api/oauth/login",
      // "https://j9b302.p.ssafy.io/api/oauth/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access: token }), // access 토큰을 JSON 형태로 전송합니다.
      }
    );

    const data = await response.json(); // 서버의 응답을 JSON 형태로 파싱합니다.
    console.log(data);

    // accessToken을 localStorage에 저장
    localStorage.setItem("accessToken", data.accessToken);

    // 데이터를 Redux에 저장
    dispatch(
      setUserData({
        nickname: data.nickname,
        profileImage: data.profileImage,
        userId: data.userId,
      })
    );

    // 홈페이지로 리디렉션
    navigate("/");
  };

  return null;
};

export default Login;
