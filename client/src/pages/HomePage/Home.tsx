import { useNavigate } from "react-router";
// import NavBar from "../../component/Common/Navbar";
import styles from "./Home.module.css";
import React, { useState, useEffect } from "react";
import LoginAlertModal from "../../component/Common/NoLoginModal";

export const Home = () => {
  /** state 관리 */
  const [showText, setShowText] = useState(true);
  const [showRadioButton, setShowRadioButton] = useState(false);
  const [loginAlertModalOpen, setLoginAlertModalOpen] = useState(false);

  //페이지 이동 함수 생성.
  const navigate = useNavigate();

  /** action 관리 */
  useEffect(() => {
    setTimeout(() => {
      setShowText(false);
      setShowRadioButton(true);
    }, 3000);
  }, []);

  const navigateToCreateRadio = () => {
    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
    if (isLoggedIn) {
      navigate("./CreateRadio");
    } else {
      setLoginAlertModalOpen(true);
    }
  };

  return (
    <div
      className={styles.background}
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      {/* <NavBar /> */}
      <div className={styles.centerContent}>
        {showText && (
          <h2 className={styles.fadeInOutText}>
            당신의 이야기로 음악을 추천해드립니다
          </h2>
        )}

        {showRadioButton && (
          <div
            style={{ userSelect: "none" }}
            onClick={navigateToCreateRadio}
            className={`${styles.verticalAlign} ${styles.fadeInGif}`}
          >
            <img
              src="/images/magichall.gif"
              alt="Magic Hall"
              className={styles.largeGif}
            />

            <div className={styles.centerText}>MAKE A ONCAST</div>
          </div>
        )}

        <LoginAlertModal
          open={loginAlertModalOpen}
          handleClose={() => setLoginAlertModalOpen(false)}
        />
      </div>
    </div>
  );
};
