import React, { useState } from "react";
import { Modal, TextField, Button, Box } from "@mui/material";
import { CreatePlayListConfirm } from "./CreatePlayListConfirmModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (playlistName: string) => void;
};

const MusicBoxAddModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 알림 모달창 상태 관리

  const handleConfirm = () => {
    onConfirm(playlistName);
    setPlaylistName(""); // Reset the input
    setShowConfirmModal(true); // 알림 모달창 띄우기
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>보관함 추가</h2>
          <TextField
            label="플레이리스트 이름"
            variant="outlined"
            fullWidth
            value={playlistName}
            onChange={e => setPlaylistName(e.target.value)}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              fullWidth
            >
              확인
            </Button>
          </Box>
        </Box>
      </Modal>
      <CreatePlayListConfirm
        show={showConfirmModal}
        onClose={handleCloseConfirmModal}
      />
    </>
  );
};

export default MusicBoxAddModal;
