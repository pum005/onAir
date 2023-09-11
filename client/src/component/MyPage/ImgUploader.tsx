import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Modal from "@mui/material/Modal"; // 모달 컴포넌트 import
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function ImgUploader() {
  const userData = useSelector((state: RootState) => state.user);

  const [fileURL, setFileURL] = useState<string>("");
  const [userImage, setUserImage] = useState<null | FileList>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 상태 추가

  const imgUploadInput = useRef<HTMLInputElement>(null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUserImage(event.target.files);

      const newFileURL = URL.createObjectURL(event.target.files[0]);
      setFileURL(newFileURL);
    }
  };

  const onImageRemove = (): void => {
    URL.revokeObjectURL(fileURL);
    setFileURL("");
    setUserImage(null);
  };

  const handleUploadButtonClick = () => {
    // 파일 업로드 input 엘리먼트를 열기 위해 모달을 엽니다.
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // 모달을 닫습니다.
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* 이미지를 클릭하면 모달을 엽니다. */}
      <img
        src={fileURL || userData.profileImage}
        alt="프로필 이미지"
        onClick={handleUploadButtonClick}
        style={{ cursor: "pointer" }}
      />
      {/* 파일 업로드 input 엘리먼트 (display: none) */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={imgUploadInput}
        onChange={onImageChange}
      />

      {/* 모달 컴포넌트 */}
      <Modal open={isModalOpen} onClose={closeModal}>
        {/* 모달 내용 */}
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
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={{ display: "block" }}
          />
          <button type="button" onClick={onImageRemove}>
            이미지 제거
          </button>
          <Button onClick={closeModal}>닫기</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default ImgUploader;
