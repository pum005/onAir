import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./MusicDetailModal.module.css";
import { useState } from "react";
import PlayListModal from "../Common/PlayListModal";
import DeleteModal from "./DeleteModal";
import { useEffect } from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import CloseIcon from "@mui/icons-material/Close";

type MusicInfoType = {
  musicId: number;
  title: string;
  artist: string;
  duration: number;
  albumCoverUrl: string;
  youtubeVideoId: string;
};

type MusicDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  playlistMetaId?: number | null;
};

const MusicDetailModal: React.FC<MusicDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  playlistMetaId,
}) => {
  const [songs, setSongs] = useState<MusicInfoType[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<MusicInfoType[]>([]);
  const [refreshKey, setRefreshKey] = useState(false);

  console.log(playlistMetaId);
  useEffect(() => {
    if (!isOpen) return; // isOpen이 false면 아무 작업도 수행하지 않습니다.

    requestWithTokenRefresh(() => {
      console.log("재렌더링 몇번?");
      return axios.get("https://j9b302.p.ssafy.io/api/my-musicbox/info", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });
    })
      .then(response => {
        if (response.data.message || !response.data.musicInfo) {
          setSongs([]);
        } else {
          setSongs(response.data.musicInfo);
        }
      })
      .catch(error => {
        console.error("데이터 가져오기 오류", error);
      });
  }, [isOpen, refreshKey]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.round(milliseconds / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSong, setSelectedSong] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<any, MouseEvent>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedSong(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSong(null);
  };

  const [playListModalOpen, setPlayListModalOpen] = useState(false);
  const [deleteListModalOpen, setDeleteListModalOpen] = useState(false);

  const handleMoveToOtherBox = () => {
    console.log(`Moving song index ${selectedSong}`);
    handleMenuClose();
    setSelectedSong(selectedSong);
    // 여기서 상태 변경 후 모달 열기
    setTimeout(() => {
      setPlayListModalOpen(true);
    }, 0);
  };

  const handleDeleteSong = () => {
    // 노래를 삭제하는 로직을 여기에 추가
    console.log(`Deleting song index ${selectedSong}`);
    handleMenuClose();
    setSelectedSong(selectedSong);
    setTimeout(() => {
      setDeleteListModalOpen(true);
    }, 0);
  };

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
        <Box className={styles.modalBox}>
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
                  {title} 음악 목록
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.musicList}>
            {songs.length > 0 ? (
              songs.map((song, index) => (
                <div key={index} className={styles.songItem}>
                  <div className={styles.albumCoverUrl}>
                    <img
                      src={song.albumCoverUrl}
                      alt="Album Cover"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <div className={styles.songTitle}>{song.title}</div>
                    <div style={{ color: "#888", fontSize: "0.9em" }}>
                      <div className={styles.artist}>{song.artist}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div className={styles.duration}>
                      {formatTime(song.duration)}
                    </div>
                    <MoreVertIcon
                      style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={event => handleMenuOpen(event, index)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Pretendard-ExtraBold",
                  fontSize: "30px",
                  color: "#a3a3a3",
                }}
              >
                음악이 없습니다.
              </div>
            )}
          </div>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            slotProps={{
              paper: {
                style: {
                  backgroundColor: "#282828", // 예: '#333333'
                  color: "#ffffff",
                },
              },
            }}
          >
            <MenuItem onClick={handleMoveToOtherBox} className={styles.items}>
              다른 플레이리스트로 이동
            </MenuItem>
            <MenuItem onClick={handleDeleteSong} className={styles.items}>
              삭제하기
            </MenuItem>
          </Menu>
        </Box>
      </Modal>
      <PlayListModal
        musicId={selectedSong !== null ? songs[selectedSong]?.musicId : null}
        isOpen={playListModalOpen}
        onClose={() => setPlayListModalOpen(false)}
      />
      <DeleteModal
        musicId={selectedSong !== null ? songs[selectedSong].musicId : null}
        isOpen={deleteListModalOpen}
        onClose={() => {
          setDeleteListModalOpen(false);
          setSelectedSong(null);
        }}
        setRefreshKey={() => setRefreshKey(prev => !prev)}
      />
    </>
  );
};

export default MusicDetailModal;
