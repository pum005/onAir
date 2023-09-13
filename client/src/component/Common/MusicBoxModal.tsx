// PlayListModal.tsx
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
type MusicBoxModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function MusicBoxModal({ isOpen, onClose }: MusicBoxModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          width: 400,
          backgroundColor: "white",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          보관함 추가
        </Typography>
        <Button onClick={onClose}>닫기</Button>
        <button>추가버튼</button>
      </Box>
    </Modal>
  );
}

export default MusicBoxModal;
