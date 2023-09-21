import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type RadioPlayModalProps = {
  open: boolean;
  handleClose: () => void;
  radioName?: string;
};

const RadioPlayModal: React.FC<RadioPlayModalProps> = ({
  open,
  handleClose,
  radioName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">라디오 플레이어</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {radioName
            ? `${radioName} 라디오를 들으시겠습니까?`
            : "전체 플레이리스트에 추가되었습니다."}{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          확인
        </Button>
        <Button onClick={handleClose} color="secondary">
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RadioPlayModal;
