import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import styles from "./DeleteModal.module.css";
import AlertModal from "../Common/AlertModal";

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

  const [showAlertModal, setShowAlertModal] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const handleDelete = () => {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
    };
    console.log(oncastId);
    if (oncastId) {
      requestWithTokenRefresh(() => {
        return axios.patch(
          `https://j9b302.p.ssafy.io/api/oncast/${oncastId}`,
          {},
          {
            headers: headers,
            withCredentials: true,
          }
        );
      })
        .then(response => {
          console.log("OnCast Update 성공!", response);
          setAlertMessage("삭제되었습니다");
          setShowAlertModal(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch(error => {
          console.error("Error updating oncast", error);
        });
    } else if (playlistId && musicId) {
      console.log(playlistId);
      console.log(musicId);
      // playlistId와 musicId 모두 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete("https://j9b302.p.ssafy.io/api/playlist/music", {
          data: {
            playlistMetaId: playlistId,
            musicId: musicId,
          },
          headers: headers,
          withCredentials: true,
        });
      })
        .then(response => {
          setAlertMessage("삭제되었습니다");
          setShowAlertModal(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch(error => {
          console.error("Error deleting the music from playlist", error);
        });
    } else if (musicId) {
      // musicId만 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete("https://j9b302.p.ssafy.io/api/my-musicbox", {
          data: { musicId: musicId },
          headers: headers,
          withCredentials: true,
        });
      })
        .then(response => {
          setAlertMessage("삭제되었습니다");
          setShowAlertModal(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        })
        .catch(error => {
          console.error("Error deleting the music", error);
        });
    } else if (playlistId) {
      // playlistId만 있을 때의 처리
      requestWithTokenRefresh(() => {
        return axios.delete(
          `https://j9b302.p.ssafy.io/api/playlist/${playlistId}`,
          {
            headers: headers,
            withCredentials: true,
          }
        );
      })
        .then(response => {
          setAlertMessage("삭제되었습니다");
          setShowAlertModal(true);
          if (refresh) {
            refresh();
          }
        })
        .catch(error => {
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
            style={{
              fontFamily: "GangwonEduPowerExtraBoldA",
              fontSize: "25px",
            }}
          >
            삭제하시겠습니까 ?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleDelete}
              className={styles.modalButtonDelete}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              확인
            </Button>
            <Button
              variant="contained"
              onClick={onClose}
              className={styles.modalButtonCancle}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
      <AlertModal
        open={showAlertModal}
        message={alertMessage}
        onClose={() => setShowAlertModal(false)}
      />
    </>
  );
}

export default DeleteModal;
