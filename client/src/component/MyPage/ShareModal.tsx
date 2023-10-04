import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./ShareModal.module.css";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  oncastId: number;
  setRefreshKey?: () => void;
};

function ShareModal({
  isOpen,
  onClose,
  oncastId,
  setRefreshKey,
}: ShareModalProps) {
  const [showConfirm, setShowConfirm] = React.useState(false); // 상태 추가

  const handleDelete = () => {
    console.log(oncastId);

    requestWithTokenRefresh(() => {
      return axios.patch(
        `https://j9b302.p.ssafy.io/api/oncast/shares/${oncastId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      );
    })
      .then(response => {
        console.log(response.data);
        if (response.data.message === "이미 공유된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 공유된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.data.message === "공유하기 성공.") {
          Swal.fire({
            icon: "success",
            title: "공유 되었습니다!",
            showConfirmButton: false,
            timer: 1500,
          });
          // setShowConfirm(true);
          if (setRefreshKey) {
            setRefreshKey();
          }
        }
        if (response.data.message === "이미 삭제된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 삭제된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if (response.data.message === "이미 채택된 온캐스트입니다.") {
          Swal.fire({
            icon: "error",
            title: "이미 채택된 온캐스트입니다!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch(error => {
        console.error("통신에러 발생", error);
      });

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
            공유하시겠습니까?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            {/* 아래의 버튼에 스타일을 추가하였습니다. */}
            <Button
              variant="contained"
              onClick={handleDelete}
              className={styles.modalButtonDelete}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              확인
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              className={styles.modalButtonCancle}
              style={{ fontFamily: "Shilla_Gothic-Bold" }}
            >
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* <ShareConfirm show={showConfirm} onClose={handleConfirmClose} /> */}
    </>
  );
}

export default ShareModal;
