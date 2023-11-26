import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import WarningIcon from "@mui/icons-material/Warning"; // 경고 아이콘

interface LoginAlertModalProps {
  open: boolean;
  handleClose: () => void;
}

const LoginAlertModal: React.FC<LoginAlertModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: "#333", // 배경색 변경
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" style={{ color: "red" }}>
        <WarningIcon style={{ marginRight: "10px", verticalAlign: "middle" }} />
        로그인 필요
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          style={{ color: "white" }}
        >
          로그인 후 사용 가능합니다!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginAlertModal;
