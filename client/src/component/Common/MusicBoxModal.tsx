// PlayListModal.tsx
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styles from "./MusicBoxModal.module.css";
type MusicBoxModalProps = {
  isOpen: boolean;
  onClose: () => void;
  addMusicBox: () => void;
  title: string;
  setTitle: (title: string) => void;
};

function MusicBoxModal({
  isOpen,
  onClose,
  addMusicBox,
  title,
  setTitle,
}: MusicBoxModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          보관함 추가
        </Typography>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={onClose}>닫기</Button>
        <button onClick={addMusicBox}>추가버튼</button>
      </Box>
    </Modal>
  );
}

export default MusicBoxModal;
