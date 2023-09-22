import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShareConfirm } from "./ShareConfirmModal";
import React from "react";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import Swal from "sweetalert2";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  oncastId: number;
};

function ShareModal({ isOpen, onClose, oncastId }: ShareModalProps) {
  const [showConfirm, setShowConfirm] = React.useState(false); // 상태 추가

  const handleDelete = () => {
    console.log(oncastId);

    requestWithTokenRefresh(() => {
      return axios.patch(
        `http://localhost:8080/api/oncast/shares/${oncastId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then((response) => {
        if (response.data.message === "이미 공유된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 공유된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.data.message === "공유하기 성공") setShowConfirm(true);
        if (response.data.message === "이미 삭제된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 삭제된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.data.message === "이미 채택된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 채택된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.error("통신에러 발생", error);
      });

    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirm(false); // 알림 모달 닫기
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            width: 400,
            backgroundColor: "white",
            borderRadius: 2, // 모서리 둥글게
            boxShadow: 3, // 그림자 효과
            p: 3,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            marginBottom={2}
          >
            공유하시겠습니까?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            {/* 아래의 버튼에 스타일을 추가하였습니다. */}
            <Button variant="outlined" color="primary" onClick={onClose}>
              취소
            </Button>
            <Button variant="contained" color="primary" onClick={handleDelete}>
              공유
            </Button>
          </Box>
        </Box>
      </Modal>
      <ShareConfirm show={showConfirm} onClose={handleConfirmClose} />
    </>
  );
}

export default ShareModal;
