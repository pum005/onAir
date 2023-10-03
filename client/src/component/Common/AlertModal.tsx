import { Box, Button, Modal, Typography } from "@mui/material";
import styles from "./AlertModal.module.css";

const AlertModal: React.FC<{
  open: boolean;
  message: string;
  onClose: () => void;
}> = ({ open, message, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} className={styles.alertModalContainer}>
      <Box className={styles.alertBox}>
        <Typography
          sx={{
            paddingTop: "10px",
            paddingBottom: "30px",
            fontSize: "25px",
            fontFamily: "GangwonEduPowerExtraBoldA",
          }}
        >
          {message}
        </Typography>
        <Button
          onClick={onClose}
          disableRipple
          variant="contained"
          className={styles.checkButton}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClose();
            }
          }}
          style={{ fontFamily: "Shilla_Gothic-Bold" }}
        >
          확인
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
