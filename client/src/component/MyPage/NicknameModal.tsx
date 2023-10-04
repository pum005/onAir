// nickNameModal.tsx
import React, { useEffect, useState } from "react";
import { Modal, TextField, Button, Box } from "@mui/material";

import Typography from "@mui/material/Typography";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { setNickName } from "../../store";
import { error } from "console";
import styles from "./NicknameModal.module.css";
import Swal from "sweetalert2";

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
    if (newNickName.length > 10) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        customClass: {
          popup: "swal2-popup",
        },
      });
      Toast.fire({
        icon: "error",
        title: "10글자를 초과하였습니다!",
      });
      onClose();
      // alert("10글자를 초과하였습니다.");
      return;
    }
    setSubmitClicked(!submitClicked);
  };

  useEffect(() => {
    if (submitClicked) {
      requestWithTokenRefresh(() => {
        return axios.get("https://j9b302.p.ssafy.io/api/user/check-nickname", {
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
                "https://j9b302.p.ssafy.io/api/user/nickname/update",
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
                Swal.fire({
                  icon: "success",
                  title: "닉네임 변경이 완료되었습니다!",
                  confirmButtonColor: "6966FF",
                  confirmButtonText: "확인",
                  customClass: {
                    popup: "my-popup-class",
                  },
                });
                onClose();
              });
          } else {
            const Toast = Swal.mixin({
              toast: true,
              position: "top",
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
              customClass: {
                popup: "swal2-popup",
              },
            });
            Toast.fire({
              icon: "error",
              title: "닉네임 중복이 발생했습니다!",
            });
            onClose();
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
      <Box className={styles.modalContainer}>
        <div className={styles.nickNameModifyTitle}>
          <h2>닉네임 변경</h2>
        </div>
        <TextField
          placeholder="닉네임을 입력해주세요"
          variant="standard"
          fullWidth
          // value={newNickName}
          onChange={handleNickNameChange}
          inputProps={{
            style: { color: "#f5e9e9" }, // This style is applied to the actual input element
          }}
          style={{ width: "300px" }}
          className={styles.TextField}
        ></TextField>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            marginTop: "20px",
          }}
        >
          <Button
            className={styles.nickNamePersist}
            onClick={handleUpdateNickName}
          >
            저장
          </Button>{" "}
          <Button className={styles.nickNameModalClose} onClick={onClose}>
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default NickNameModal;
