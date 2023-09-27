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
          paddingTop: '10px',
          paddingBottom: '30px'
        }}>{message}</Typography>
        <Button onClick={onClose} disableRipple variant="contained"
        sx={{
          backgroundColor: '#6966FF',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '13px',
          fontSize: '1em',
          fontWeight: 600,
          cursor: 'pointer',
      }}>
          확인
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;
