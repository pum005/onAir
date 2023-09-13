import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import instance from "../../utils/axiosInstance"; // 수정된 부분
import { setNickName } from "../../store";

type NickNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentNickName: string;
  onUpdateNickName: (newNickName: string) => void;
};

function NickNameModal({
  isOpen,
  onClose,
  currentNickName,
  onUpdateNickName,
}: NickNameModalProps) {
  const [newNickName, setNewNickName] = useState(currentNickName);
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickName(event.target.value);
  };

  const handleUpdateNickName = () => {
    setSubmitClicked(!submitClicked);
  };

  useEffect(() => {
    if (submitClicked) {
      instance // 수정된 부분: axios 대신 instance 사용
        .put(
          "/api/user/nickname/update",
          {
            nickname: newNickName,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          }
        )
        .then(() => {
          setSubmitClicked(!submitClicked);
          onUpdateNickName(newNickName);
          onClose();
        })
        .catch(error => {
          console.error("닉네임 변경 에러 발생", error);
        });
    }
  }, [submitClicked]);

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
          닉네임 변경
        </Typography>
        <input
          type="text"
          value={newNickName}
          onChange={handleNickNameChange}
          style={{ display: "block" }}
        />
        <Button onClick={handleUpdateNickName}>저장</Button>{" "}
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}

export default NickNameModal;
