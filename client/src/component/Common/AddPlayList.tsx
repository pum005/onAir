import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type AlertDialogProps = {
  open: boolean;
  handleClose: () => void;
  playlistName?: string; // 추가한 코드
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  handleClose,
  playlistName,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">추가 완료</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {playlistName
            ? `${playlistName} 플레이리스트에 추가되었습니다.`
            : "전체 플레이리스트에 추가되었습니다."}{" "}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
