import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useHistory 대신 useNavigate를 가져옵니다.
import { useDispatch } from "react-redux";
import { setUserData } from "../store";

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const accessToken = params.get("access");

  useEffect(() => {
    if (accessToken) {
      sendLoginRequest(accessToken);
    }
  }, [accessToken]);

  const sendLoginRequest = async (token: string | null) => {
    const response = await fetch("http://localhost:8080/api/oauth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access: token }),
    });

    const data = await response.json();
    console.log(data);

    // 데이터를 Redux에 저장
    dispatch(
      setUserData({
        nickname: data.data.nickname,
        profileImage: data.data.profileImage,
        userId: data.data.userId,
      })
    );

    // 홈페이지로 리디렉션
    navigate("/"); // useHistory의 push 대신 navigate를 사용합니다.
  };

  return <div>소셜로그인 성공</div>;
};

export default Login;
