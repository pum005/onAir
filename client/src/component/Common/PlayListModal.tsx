// PlayListModal.tsx
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
type PlayListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function PlayListModal({ isOpen, onClose }: PlayListModalProps) {
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
          내 플레이리스트
        </Typography>
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}

export default PlayListModal;
