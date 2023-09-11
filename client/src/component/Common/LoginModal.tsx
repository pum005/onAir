import React from "react";
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
            sx={{
              ...style,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="images/tempLogo.png"
              alt="tempLogo"
              style={{ height: "120px", width: "auto", marginBottom: "20px" }}
            />
            <h2 style={{ color: "white" }}>나만의 플레이리스트 onAIr</h2>
            <Button
              variant="contained"
              onClick={redirectToKakaoLogin} // 카카오 로그인 함수 추가
              style={{
                backgroundColor: "#FEE500",
                fontWeight: "bold",
                padding: "10px 90px",
                marginBottom: "20px",
                color: "black",
                fontSize: "large",
              }}
              startIcon={
                <img
                  src="/images/kakao.png"
                  alt="Kakao Icon"
                  style={{ height: "40px", width: "auto" }}
                />
              }
            >
              카카오톡으로 로그인하기
            </Button>
            <Button
              variant="contained"
              onClick={redirectToNaverLogin} // 카카오 로그인 함수 추가
              style={{
                backgroundColor: "#00C73C",
                fontWeight: "bold",
                padding: "10px 108px",
                marginBottom: "20px",
                color: "white",
                fontSize: "large",
              }}
              startIcon={
                <img
                  src="/images/naver.png"
                  alt="Kakao Icon"
                  style={{ height: "40px", width: "auto" }}
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
