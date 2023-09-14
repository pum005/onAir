import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type FinishModalProps = {
  show: boolean;
  onClose: () => void;
};

export const FinishModal: React.FC<FinishModalProps> = ({ show, onClose }) => {
  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"온캐스트 종료"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          온캐스트가 종료되었습니다!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};
