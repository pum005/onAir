import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import LoginModal from "../../component/Common/LoginModal";
import MainLogo from "../../resources/MainLogo.png";

type HomeProps = {
  setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlbumIcon: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Home: React.FC<HomeProps> = ({ setShowNavBar }) => {
  /** state 관리 */
  const [showText, setShowText] = useState(false);
  const [showRadioButton, setShowRadioButton] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);
  const [showBlackScreen, setShowBlackScreen] = useState(true); // 검정 화면 표시 상태

  const handleShowMainScreen = () => {
    setShowNavBar(true); // NavBar를 표시
    localStorage.setItem("showNavBar", JSON.stringify(true)); // 변경된 상태를 로컬 스토리지에 저장
    setShowBlackScreen(false); // 검정 화면을 숨기고 메인 화면을 표시
  };

  const navigate = useNavigate();

  if (showBlackScreen) {
    return (
      <div
        style={{
          backgroundColor: "#000",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button onClick={handleShowMainScreen}>메인 화면 보기</button>
      </div>
    );
  }

  //페이지 이동 함수 생성.

  /** action 관리 */
  // useEffect(() => {
  //   setTimeout(() => {
  //     setShowText(false);
  //     setShowRadioButton(true);
  //   }, 3000);
  // }, []);

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
      }).then(result => {
        if (result.isConfirmed) {
          handleLoginModalOpen();
        }
      });
    }
  };

  return (
    <div
      className={styles.background}
      style={{
        backgroundColor: "#000104",
        height: "650px",
        color: "white",
        overflow: "hidden",
        // paddingBottom: "10px",
      }}
    >
      <div className={styles.centerContent}>
        {showText && (
          <>
            <div className={styles.fadeInBox}>
              <h2 className={styles.fadeInOutText} style={{ fontSize: "30px" }}>
                <img
                  src={MainLogo}
                  alt="MainLogo"
                  className={styles.customImage}
                />
                <div className={styles.underline}></div>
                <div className={styles.textBelowLine}>
                  <span className={styles.grayText}>당신만의 </span>
                  <span className={styles.whiteText}>" ONCAST "</span>
                  <span className={styles.grayText}> 를 만들어 보세요!</span>
                </div>
              </h2>
            </div>
          </>
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
            <div className={styles.enterText}>
              <div className={styles.centerText}>MAKE A ONCAST</div>
            </div>
          </div>
        )}
        <LoginModal
          open={loginModalOpen}
          handleClose={handleLoginModalClose}
        ></LoginModal>
      </div>
    </div>
  );
};
