import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ShareConfirm } from "./ShareConfirmModal";
import React from "react";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [showConfirm, setShowConfirm] = React.useState(false); // 상태 추가

  const handleDelete = () => {
    onClose();
    setShowConfirm(true);
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
