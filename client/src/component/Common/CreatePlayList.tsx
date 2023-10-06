import React, { useState } from "react";
import { Modal, TextField, Button, Box } from "@mui/material";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import styles from "./CreatePlayList.module.css";
import AlertModal from "./AlertModal";
import { error } from "console";
import Swal from "sweetalert2";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refresh: () => void;
};

const MusicBoxAddModal: React.FC<Props> = ({ isOpen, onClose, refresh }) => {
  /** state */
  const [playlistName, setPlaylistName] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false); // State for AlertModal

  /** action */
  const handleConfirm = () => {
    if (playlistName === "") {
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
        icon: "warning",
        title: "제목을 작성해주세요!",
      });
      onClose();

      return;
    } else {
      requestWithTokenRefresh(() => {
        return axios.post(
          "https://j9b302.p.ssafy.io/api/playlist",
          {
            playlistName: playlistName,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(response => {
          console.log(response);
          refresh();
          setPlaylistName("");
          Swal.fire({
            icon: "success",
            title: "플레이리스트가 생성되었습니다!",
            confirmButtonColor: "6966FF",
            confirmButtonText: "확인",
            customClass: {
              popup: "my-popup-class",
            },
          });
          onClose();
        })
        .catch(error => {
          console.log("통신에러 발생", error);
        });
    }
  };

  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box className={styles.modalContainer}>
          <div className={styles.playlistTitle}>
            <h2>플레이리스트 생성</h2>
          </div>
          <TextField
            placeholder="제목을 입력해주세요"
            variant="standard"
            fullWidth
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
            inputProps={{
              style: { color: "#f5e9e9" }, // This style is applied to the actual input element
            }}
            style={{ width: "300px", marginBottom: "10px" }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleConfirm();
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              className={styles.modalButtonCreate}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              생성하기
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              className={styles.modalButtonCancle}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
      <AlertModal
        open={showAlertModal}
        message="플레이리스트가 성공적으로 생성되었습니다."
        onClose={handleCloseAlertModal}
      />
    </>
  );
};

export default MusicBoxAddModal;
