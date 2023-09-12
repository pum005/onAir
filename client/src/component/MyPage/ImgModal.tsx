// ImgModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type ImgModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  userImage: FileList | null; // 이 부분을 추가
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onImageConfirm: () => void;
};

function ImgModal({
  isOpen,
  onClose,
  profileImage,
  userImage,
  onImageChange,
  onImageRemove,
  onImageConfirm, // 이미지 확인 버튼 핸들러 추가
}: ImgModalProps) {
  const [fileURL, setFileURL] = useState<string>("");

  useEffect(() => {
    if (userImage) {
      const newFileURL = URL.createObjectURL(userImage[0]);
      setFileURL(newFileURL);
    } else {
      setFileURL("");
    }
  }, [userImage]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
          backgroundColor: "white",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          이미지 변경
        </Typography>
        <img
          src={fileURL || profileImage}
          alt="프로필 이미지"
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ display: "block" }}
        />
        <button type="button" onClick={onImageRemove}>
          이미지 제거
        </button>
        <Button onClick={onImageConfirm}>확인</Button>{" "}
        {/* 이미지 확인 버튼 추가 */}
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}

export default ImgModal;
