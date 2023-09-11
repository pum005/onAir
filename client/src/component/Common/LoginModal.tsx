import * as React from "react";
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
  borderRadius: "15px", // 둥글게 하기 위한 속성
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
              display: "flex", // Flexbox 레이아웃 설정
              flexDirection: "column", // 방향을 열로 설정
              justifyContent: "center", // 중앙에 내용을 정렬 (수직 중앙 정렬)
              alignItems: "center", // 세로 중앙 정렬 (수평 중앙 정렬)
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
              style={{
                backgroundColor: "#FEE500", // 이미지의 버튼 색상
                fontWeight: "bold", // 굵은 텍스트
                padding: "10px 90px", // 버튼 내부의 패딩
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
              } // 카카오톡 아이콘 경로
            >
              카카오톡으로 로그인하기
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
