import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  handleClose: () => void;
  handleConfirmLogout: () => void;
};

const LogoutAlertModal: React.FC<Props> = ({
  open,
  handleClose,
  handleConfirmLogout,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h5" component="span" style={{ fontWeight: 600 }}>
          로그아웃
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">로그아웃 하시겠습니까?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          아니오
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmLogout}
        >
          예
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutAlertModal;
