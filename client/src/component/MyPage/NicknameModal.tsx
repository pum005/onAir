// nickNameModal.tsx
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type NickNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentNickName: string;
  onUpdateNickName: (newNickName: string) => void;
};

function NickNameModal({
  isOpen,
  onClose,
  currentNickName,
  onUpdateNickName,
}: NickNameModalProps) {
  const [newNickName, setNewNickName] = useState(currentNickName);

  const handleNickNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickName(event.target.value);
  };

  const handleUpdateNickName = () => {
    onUpdateNickName(newNickName);
    onClose();
  };

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
          닉네임 변경
        </Typography>
        <input
          type="text"
          value={newNickName}
          onChange={handleNickNameChange}
          style={{ display: "block" }}
        />
        <Button onClick={handleUpdateNickName}>저장</Button>{" "}
        <Button onClick={onClose}>닫기</Button>
      </Box>
    </Modal>
  );
}

export default NickNameModal;
