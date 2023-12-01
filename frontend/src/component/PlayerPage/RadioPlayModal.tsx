import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Navigate, useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styles from "./RadioPlayModal.module.css";

type RadioPlayModalProps = {
  open: boolean;
  handleClose: () => void;
  radioName?: string;
  oncastId?: number;
};

const RadioPlayModal: React.FC<RadioPlayModalProps> = ({
  open,
  handleClose,
  radioName,
  oncastId,
}) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    //여기서 옮길때 방법은 2가지
    navigate("/player", { state: { oncastId } });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose} className={styles.modalContainer}>
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
          {radioName}을(를) 들으시겠습니까?
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
          <Button
            variant="contained"
            onClick={handleClose}
            className={styles.modalButtonCancle}
            style={{ fontFamily: "Shilla_Gothic-Bold" }}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
//
export default RadioPlayModal;
