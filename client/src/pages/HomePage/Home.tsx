import { useNavigate } from "react-router";
import NavBar from "../../component/Common/Navbar";
import styles from "./Home.module.css";
import React, { useState, useEffect } from "react";

export const Home = () => {
  /** state 관리 */
  const [showText, setShowText] = useState(true);
  const [showRadioButton, setShowRadioButton] = useState(false);

  //페이지 이동 함수 생성
  const navigate = useNavigate();

  /** action 관리 */
  useEffect(() => {
    setTimeout(() => {
      setShowText(false);
      setShowRadioButton(true);
    }, 3000);
  }, []);

  const navigateToCreateRadio = () => {
    navigate("./CreateRadio");
  };

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <NavBar />
      {showText && (
        <h2 className={styles.fadeInText}>
          당신의 이야기로 음악을 추천해드립니다.
        </h2>
      )}
      {showRadioButton && (
        <button onClick={navigateToCreateRadio}>사연 작성하기</button>
      )}
    </div>
  );
};
