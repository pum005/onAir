import React from "react";
import styles from "./LoginModal.module.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 500,
  bgcolor: "#222222",
  borderRadius: "15px",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const KAKAO_OAUTH_URL = `http://localhost:8080/oauth2/authorization/kakao`;

const redirectToKakaoLogin = () => {
  window.location.href = KAKAO_OAUTH_URL;
};

const NAVER_OAUTH_URL = `http://localhost:8080/oauth2/authorization/naver`;

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
          <Box
            className={styles.modalContainer} // sx prop 대신 className을 사용하며 스타일을 참조합니다.
          >
            <img
              src="images/tempLogo.png"
              alt="tempLogo"
              className={styles.logoImage} // style 대신 className을 사용하며 스타일을 참조합니다.
            />
            <h2 className={styles.title}>나만의 플레이리스트 onAIr</h2>
            <Button
              variant="contained"
              onClick={redirectToKakaoLogin}
              className={styles.kakaoButton} // style 대신 className을 사용하며 스타일을 참조합니다.
              startIcon={
                <img
                  src="/images/kakao.png"
                  alt="Kakao Icon"
                  className={styles.kakaoIcon} // style 대신 className을 사용하며 스타일을 참조합니다.
                />
              }
            >
              카카오톡으로 로그인하기
            </Button>
            <Button
              variant="contained"
              onClick={redirectToNaverLogin}
              className={styles.naverButton} // style 대신 className을 사용하며 스타일을 참조합니다.
              startIcon={
                <img
                  src="/images/naver.png"
                  alt="Naver Icon"
                  className={styles.naverIcon} // style 대신 className을 사용하며 스타일을 참조합니다.
                />
              }
            >
              네이버로 로그인하기
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
