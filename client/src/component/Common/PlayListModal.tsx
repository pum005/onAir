// PlayListModal.tsx

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "./AddPlayList";
import React from "react";

type PlayListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// 더미 데이터
const playLists = [
  {
    cover: "/images/run.jpg", // 이미지 경로
    name: "신나는",
    songsCount: 12,
  },
  {
    cover: "/images/주저하는.jpg", // 이미지 경로
    name: "힐링",
    songsCount: 8,
  },
  // ... 다른 플레이리스트 데이터
];

function PlayListModal({ isOpen, onClose }: PlayListModalProps) {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = React.useState<
    string | undefined
  >();

  const handleAddClick = (name: string) => {
    setSelectedPlaylistName(name);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <>
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

          {playLists.map((playlist, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: 2,
              }}
            >
              <img
                src={playlist.cover}
                alt={playlist.name}
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <Typography variant="subtitle1">{playlist.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {playlist.songsCount}곡
                </Typography>
              </div>
              <Box sx={{ marginLeft: "auto" }}>
                <Button
                  onClick={() => handleAddClick(playlist.name)}
                  startIcon={<AddCircleOutlineIcon />}
                  variant="outlined"
                  size="small"
                  color="primary"
                >
                  추가
                </Button>
              </Box>
            </Box>
          ))}

          <Box sx={{ marginTop: 2 }}>
            <Button onClick={onClose} variant="outlined" fullWidth>
              닫기
            </Button>
          </Box>
        </Box>
      </Modal>
      <AlertDialog
        open={alertOpen}
        handleClose={handleAlertClose}
        playlistName={selectedPlaylistName}
      />
    </>
  );
}

export default PlayListModal;
