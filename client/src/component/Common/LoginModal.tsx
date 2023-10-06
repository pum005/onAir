import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import styles from "./LoginModal.module.css";

//카카오 로그인으로 가게 해주는 url
const KAKAO_OAUTH_URL = `https://j9b302.p.ssafy.io/oauth2/authorization/kakao`;
// const KAKAO_OAUTH_URL = `https://j9b302.p.ssafy.io/oauth2/authorization/kakao`;

const redirectToKakaoLogin = () => {
  window.location.href = KAKAO_OAUTH_URL;
};

//네이버 로그인으로 가게 해주는 url
const NAVER_OAUTH_URL = `https://j9b302.p.ssafy.io/oauth2/authorization/naver`;
// const NAVER_OAUTH_URL = `https://j9b302.p.ssafy.io/oauth2/authorization/naver`;

const redirectToNaverLogin = () => {
  window.location.href = NAVER_OAUTH_URL;
};

export default function LoginModal({ open, handleOpen, handleClose }: any) {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={styles.modalContent}>
            <img src="onAIr.png" alt="Logo" className={styles.tempLogo} />
            <h2 className={styles.modalTitle}></h2>
            <div className={styles.loginSet}>
              <Button
                variant="contained"
                onClick={redirectToKakaoLogin} // 카카오 로그인 함수 추가
                style={{
                  backgroundColor: "#FEE500",
                  fontWeight: "bold",
                  // padding: "50px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                  color: "black",
                  fontSize: "large",
                  borderRadius: "10px",
                }}
                startIcon={
                  <img
                    src="/images/kakao.png"
                    alt="Kakao Icon"
                    style={{ height: "40px", width: "auto" }}
                  />
                }
              >
                <div className={styles.font}>카카오로 로그인하기</div>
              </Button>
              <Button
                variant="contained"
                onClick={redirectToNaverLogin} // 카카오 로그인 함수 추가
                style={{
                  backgroundColor: "#00C73C",
                  fontWeight: "bold",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  marginBottom: "20px",
                  color: "white",
                  fontSize: "large",
                  borderRadius: "10px",
                }}
                startIcon={
                  <img
                    src="/images/naver.png"
                    alt="Kakao Icon"
                    style={{ height: "40px", width: "auto" }}
                  />
                }
              >
                <div className={styles.font}>네이버로 로그인하기</div>
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
