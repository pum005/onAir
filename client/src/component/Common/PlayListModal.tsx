// PlayListModal.tsx

import Modal from "@mui/material/Modal";
import styles from "./PlayListModal.module.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "./AddPlayList";
import React, { useEffect } from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import nullImg from "../../resources/LogoDesign.png";
import CloseIcon from "@mui/icons-material/Close";
import AlertModal from "./AlertModal";

type PlayListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  musicId?: number | null;
};

type Playlist = {
  playlistMetaId: number;
  index: number;
  playlistImage: string | null;
  playlistName: string;
  playlistCount: number;
};

function PlayListModal({ isOpen, onClose, musicId }: PlayListModalProps) {
  // AlertModal을 위한 state
  const [alertModalOpen, setAlertModalOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [selectedPlaylistName, setSelectedPlaylistName] = React.useState<
    string | undefined
  >();
  const [playlists, setPlaylists] = React.useState<Playlist[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(false);

  const handleAddClick = (name: string, playlistMetaId: number) => {
    setSelectedPlaylistName(name);
    if (!musicId) {
      console.error("No musicId provided!");
      return;
    }
    axios
      .post(
        "https://j9b302.p.ssafy.io/api/playlist/music",
        {
          playlistMetaId: playlistMetaId,
          musicId: musicId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        }
      )
      .then(response => {
        if (
          response.data.message === "이미 플레이리스트에 추가된 음악입니다."
        ) {
          setAlertMessage("이미 플레이리스트에 추가된 음악입니다.");
          setAlertModalOpen(true);
        } else {
          setAlertMessage("추가되었습니다.");
          setAlertModalOpen(true);
        }
      })
      .catch(error => {
        console.error("Error adding music to playlist", error);
      });
  };

  //내 보관함 불러오기 아직
  useEffect(() => {
    if (isOpen) {
      requestWithTokenRefresh(() => {
        return axios.get("https://j9b302.p.ssafy.io/api/playlist", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        });
      })
        .then(response => {
          setPlaylists(response.data);
        })
        .catch(error => {
          console.log("통신에러", error);
        });
    }
  }, [isOpen, refreshKey]);

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box className={styles.modalContainer}>
          <div className={styles.header}>
            <div>
              <div>
                <CloseIcon onClick={onClose} className={styles.closeIcon} />
              </div>
              <div>
                <Typography
                  id="modal-modal-title"
                  component="h2"
                  style={{
                    fontFamily: "GangwonEduPowerExtraBoldA",
                    fontSize: "25px",
                  }}
                >
                  플레이리스트
                </Typography>
              </div>
            </div>
          </div>

          <div className={styles.playlistContainer}>
            {playlists.length > 0 ? (
              playlists.map(playlist => (
                <Box key={playlist.playlistMetaId} className={styles.playlist}>
                  <div className={styles.albumCoverUrl}>
                    <img
                      src={playlist.playlistImage || nullImg}
                      alt={playlist.playlistName}
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant="subtitle1"
                      className={styles.songTitle}
                      style={{ fontFamily: "Pretendard-SemiBold" }}
                    >
                      {playlist.playlistName}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={styles.songCount}
                      style={{ fontFamily: "Pretendard-SemiBold" }}
                    >
                      음악 : {playlist.playlistCount}곡
                    </Typography>
                  </div>
                  <Box sx={{ marginLeft: "auto", cursor: "pointer" }}>
                    <AddCircleOutlineIcon
                      className={styles.addButton}
                      onClick={() =>
                        handleAddClick(
                          playlist.playlistName,
                          playlist.playlistMetaId
                        )
                      }
                    />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography
                style={{
                  fontFamily: "GangwonEduPowerExtraBoldA",
                  fontSize: "20px",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                플레이리스트가 없습니다.
              </Typography>
            )}
          </div>
        </Box>
      </Modal>
      <AlertModal
        open={alertModalOpen}
        message={alertMessage}
        onClose={() => {
          setAlertModalOpen(false);
          setRefreshKey(prevKey => !prevKey);
        }}
      />
    </>
  );
}

export default PlayListModal;
