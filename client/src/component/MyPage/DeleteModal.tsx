import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DeleteConfirm } from "./DeleteConfirmModal";
import React from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import styles from "./DeleteModal.module.css";

type DeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  musicId?: number | null;
  playlistId?: number | null;
  setRefreshKey?: () => void;
  refresh?: () => void;
  oncastId?: number | null;
};

function DeleteModal({
  isOpen,
  onClose,
  musicId,
  setRefreshKey,
  playlistId,
  refresh,
  oncastId,
}: DeleteModalProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDelete = () => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    };
    console.log(oncastId);
    if (oncastId) {
      requestWithTokenRefresh(() => {
        return axios.patch(
          `http://localhost:8080/api/oncast/${oncastId}`,
          {},
          {
            headers: headers,
            withCredentials: true,
          }
        );
      })
        .then((response) => {
          console.log("OnCast Update 성공!", response);
          alert("삭제되었습니다.");
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch((error) => {
          console.error("Error updating oncast", error);
        });
    } else if (playlistId && musicId) {
      console.log(playlistId);
      console.log(musicId);
      // playlistId와 musicId 모두 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete("http://localhost:8080/api/playlist/music", {
          data: {
            playlistMetaId: playlistId,
            musicId: musicId,
          },
          headers: headers,
          withCredentials: true,
        });
      })
        .then((response) => {
          console.log("Deleted 성공!", response);
          setShowConfirm(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch((error) => {
          console.error("Error deleting the music from playlist", error);
        });
    } else if (musicId) {
      // musicId만 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete("http://localhost:8080/api/my-musicbox", {
          data: { musicId: musicId },
          headers: headers,
          withCredentials: true,
        });
      })
        .then((response) => {
          console.log("Deleted 성공!", response);
          setShowConfirm(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch((error) => {
          console.error("Error deleting the music", error);
        });
    } else if (playlistId) {
      // playlistId만 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete(
          `http://localhost:8080/api/playlist/${playlistId}`,
          {
            headers: headers,
            withCredentials: true,
          }
        );
      })
        .then((response) => {
          console.log("Deleted 성공!", response);
          setShowConfirm(true);
          if (refresh) {
            refresh();
          }
        })
        .catch((error) => {
          console.error("Error deleting the playlist", error);
        });
    } else {
      console.error("No musicId or playlistId or No OncastId provided");
    }

    onClose();
  };

  const handleConfirmClose = () => {
    setShowConfirm(false); // 알림 모달 닫기
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose} className={styles.modalContainer}>
        <Box className={styles.modalBox}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            marginBottom={2}
            className={styles.modalTypography}
          >
            삭제하시겠습니까 ?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose} className={styles.modalButton}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              className={styles.modalButton}
            >
              삭제
            </Button>
          </Box>
        </Box>
      </Modal>
      <DeleteConfirm show={showConfirm} onClose={handleConfirmClose} />
    </>
  );
}

export default DeleteModal;
