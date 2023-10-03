import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import styles from "./FinishModal.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
type FinishModalProps = {
  show: boolean;
  onClose: () => void;
};

export const FinishModal: React.FC<FinishModalProps> = ({ show, onClose }) => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    onClose();
    navigate("/");
  };
  return (
    <Modal open={show} onClose={onClose} className={styles.modalContainer}>
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
          온캐스트가 종료되었습니다!
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
            onClick={handleConfirm}
            className={styles.modalButtonDelete}
            style={{ fontFamily: "Shilla_Gothic-Bold" }}
          >
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
