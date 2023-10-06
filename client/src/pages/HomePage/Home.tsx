import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import LoginModal from "../../component/Common/LoginModal";
import MainLogo from "../../resources/MainLogo.png";
import NavBar from "../../component/Common/Navbar";

type HomeProps = {
  setShowNavBar: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Home = () => {
  /** state 관리 */
  const [showText, setShowText] = useState(false);
  const [showRadioButton, setShowRadioButton] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);
  //페이지 이동 함수 생성.
  const navigate = useNavigate();
  const [showLoadingScreen, setShowLoadingScreen] = useState(
    !localStorage.getItem("firstVisit")
  );

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

  useEffect(() => {
    // 페이지에 처음 접근했을 때만 로딩 스크린을 표시합니다.
    if (!localStorage.getItem("firstVisit")) {
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  const [isCircleClicked, setIsCircleClicked] = useState(false);

  const handleCircleClick = () => {
    console.log("Circle Clicked!"); // 이 로그가 출력되는지 확인
    setIsCircleClicked(true);
    // 애니메이션 완료 후 실행될 콜백 함수
    const onAnimationEnd = () => {
      setShowLoadingScreen(false); // 로딩 스크린 숨기기
      const circleElement = document.querySelector(`.${styles.redCircle}`);
      if (circleElement) {
        circleElement.removeEventListener("animationend", onAnimationEnd); // 이벤트 리스너 제거
      }
    };
    // 애니메이션 완료 이벤트 리스너 추가
    const circleElement = document.querySelector(`.${styles.redCircle}`);
    if (circleElement) {
      circleElement.addEventListener("animationend", onAnimationEnd);
    }
  };

  return (
    <div className={styles.background}>
      {showLoadingScreen ? (
        <div className={styles.loadingScreen}>
          <div
            className={
              isCircleClicked ? `${styles.redCircle} clicked` : styles.redCircle
            }
            onClick={() => {
              localStorage.setItem("firstVisit", "false");
              setShowLoadingScreen(false);
              handleCircleClick();
            }}
          ></div>
        </div>
      ) : (
        <>
          <NavBar />
          <div className={styles.centerContent}>
            {showText && (
              <>
                <div className={styles.fadeInBox}>
                  <h2
                    className={styles.fadeInOutText}
                    style={{ fontSize: "30px" }}
                  >
                    <img
                      src={MainLogo}
                      alt="MainLogo"
                      className={styles.customImage}
                    />
                    <div className={styles.underline}></div>
                    <div className={styles.textBelowLine}>
                      <span className={styles.grayText}>당신만의 </span>
                      <span className={styles.whiteText}>" ONCAST "</span>
                      <span className={styles.grayText}>
                        {" "}
                        를 만들어 보세요!
                      </span>
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
        </>
      )}
    </div>
  );
};
