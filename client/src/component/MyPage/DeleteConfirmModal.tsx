import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmProps = {
  show: boolean;
  onClose: () => void;
};

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  show,
  onClose,
}) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        className: styles.dialogContent,
      }}
    >
      <DialogTitle id="alert-dialog-title" className={styles.dialogTitle}>
        {"삭제 완료"}
      </DialogTitle>
      <DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={onClose} className={styles.dialogButton}>
            확인
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
