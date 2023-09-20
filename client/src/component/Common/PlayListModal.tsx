// PlayListModal.tsx

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "./AddPlayList";
import React, { useEffect } from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import 흥애 from "../../resources/흥애.png";

type PlayListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Playlist = {
  playlistMetaId: number;
  index: number;
  playlistImage: string | null;
  playlistName: string;
  playlistCount: number;
};

function PlayListModal({ isOpen, onClose }: PlayListModalProps) {
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = React.useState<
    string | undefined
  >();
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);

  const handleAddClick = (name: string) => {
    setSelectedPlaylistName(name);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  //내 보관함 불러오기 아직
  useEffect(() => {
    if (isOpen) {
      requestWithTokenRefresh(() => {
        return axios.get("http://localhost:8080/api/playlist", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
        .then((response) => {
          setPlaylists(response.data);
        })
        .catch((error) => {
          console.log("통신에러", error);
        });
    }
  }, [isOpen]);

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

          {playlists.map((playlist) => (
            <Box
              key={playlist.playlistMetaId}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: 2,
              }}
            >
              <img
                src={playlist.playlistImage || 흥애}
                alt={playlist.playlistName}
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <Typography variant="subtitle1">
                  {playlist.playlistName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {playlist.playlistCount}곡
                </Typography>
              </div>
              <Box sx={{ marginLeft: "auto" }}>
                <Button
                  onClick={() => handleAddClick(playlist.playlistName)}
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
