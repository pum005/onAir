// nickNameModal.tsx
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { setNickName } from "../../store";
import { error } from "console";

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
  //아
  const handleUpdateNickName = () => {
    setSubmitClicked(!submitClicked);
  };

  useEffect(() => {
    if (submitClicked) {
      requestWithTokenRefresh(() => {
        return axios.get("http://localhost:8080/api/user/check-nickname", {
          params: {
            nickName: newNickName,
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
        .then(Response => {
          if (Response.data === false) {
            return axios
              .put(
                "http://localhost:8080/api/user/nickname/update",
                {
                  nickname: newNickName,
                },
                {
                  headers: {
                    Authorization:
                      "Bearer " + localStorage.getItem("accessToken"),
                  },
                  withCredentials: true,
                }
              )
              .then(() => {
                setSubmitClicked(false);
                onUpdateNickName(newNickName);
                onClose();
              });
          } else {
            alert("닉네임 중복이 발생했습니다.");
            setSubmitClicked(false);
          }
        })
        .catch(error => {
          console.error("닉네임 변경 에러 발생", error);
          setSubmitClicked(false);
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
