// ImgModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import styles from "./ImgModal.module.css";
import CachedIcon from "@mui/icons-material/Cached";

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
          "https://j9b302.p.ssafy.io/api/user/profile/update",
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
      <Box className={styles.modalContainer}>
        <div className={styles.ImgModifyTitle}>
          <h2>이미지 변경</h2>
        </div>
        <div className={styles.ImgContainer}>
          <img src={fileURL || profileImage} alt="프로필 이미지" />
          <Button className={styles.ImgModifyButton} onClick={onImageRemove}>
            <CachedIcon sx={{ fontSize: 80 }} style={{ fill: "white" }} />
          </Button>
        </div>
        <Box>
          <label className={styles.fileUpload}>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onImageChange}
            />
            <Button
              sx={{
                color: "#000000",
                fontFamily: '"Shilla_Gothic-Bold"',
                marginTop: "5px",
                marginBottom: "5px",
              }}
              component="span"
            >
              파일 업로드
            </Button>
          </label>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginTop: "10px",
          }}
        >
          <Button
            className={styles.imgModifyConfirmButton}
            onClick={handleUpdateImg}
          >
            변경하기
          </Button>
          <Button className={styles.ImgModalCloseButton} onClick={onClose}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ImgModal;
