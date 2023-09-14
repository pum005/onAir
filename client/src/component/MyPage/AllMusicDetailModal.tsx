import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./AllMusicDetailModal.module.css";

type AllMusicDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

function AllMusicDetailModal({
  isOpen,
  onClose,
  title,
}: AllMusicDetailModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title} 노래 목록
        </Typography>
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}
export default AllMusicDetailModal;
