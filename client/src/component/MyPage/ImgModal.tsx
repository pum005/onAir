// ImgModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";

type ImgModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  userImage: FileList | null;
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
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleUpdateImg = () => {
    setSubmitClicked(!submitClicked);
  };

  useEffect(() => {
    if (submitClicked && userImage) {
      const formData = new FormData();
      formData.append("image", userImage[0]);

      requestWithTokenRefresh(() => {
        return axios.put(
          "http://localhost:8080/api/user/profile/update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(() => {
          onImageConfirm();
          setSubmitClicked(false);
        })
        .catch(error => {
          console.error("이미지 변경 실패:", error);
          setSubmitClicked(false);
        });
    }
  }, [submitClicked, userImage, onImageConfirm]);

  useEffect(() => {
    if (userImage) {
      const newFileURL = URL.createObjectURL(userImage[0]);
      setFileURL(newFileURL);
    } else {
      setFileURL("");
    }
  }, [userImage]);

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
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          style={{ display: "block" }}
        />
        <Button type="button" onClick={onImageRemove}>
          이미지 삭제
        </Button>
        <Button onClick={handleUpdateImg}>변경</Button>{" "}
        <Button onClick={onClose}>x</Button>
      </Box>
    </Modal>
  );
}

export default ImgModal;
