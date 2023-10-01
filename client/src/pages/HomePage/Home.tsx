import { useNavigate } from "react-router";
// import NavBar from "../../component/Common/Navbar";
import styles from "./Home.module.css";
import React, { useState, useEffect } from "react";
import LoginAlertModal from "../../component/Common/NoLoginModal";
import Swal from "sweetalert2";
import LoginModal from "../../component/Common/LoginModal";

export const Home = () => {
  /** state 관리 */
  const [showText, setShowText] = useState(true);
  const [showRadioButton, setShowRadioButton] = useState(false);
  // const [loginAlertModalOpen, setLoginAlertModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

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
      Swal.fire({
        icon: "error",
        title: "로그인 후 이용 가능합니다!",
        confirmButtonColor: "6966FF",
        confirmButtonText: "확인",
        customClass: {
          popup: "my-popup-class",
        },
      });
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

        {/* 여기부분수정 */}
        {/* <LoginAlertModal
          open={loginAlertModalOpen}
          handleClose={() => setLoginAlertModalOpen(false)}
        /> */}
      </div>
    </div>
  );
};
