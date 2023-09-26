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
        <Typography className={styles.alertTypography}>{message}</Typography>
        <Button className={styles.alertButton} onClick={onClose}>
          확인
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
