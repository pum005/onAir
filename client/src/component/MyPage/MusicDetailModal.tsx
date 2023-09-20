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
};

const MusicDetailModal: React.FC<MusicDetailModalProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  const [songs, setSongs] = useState<MusicInfoType[]>([]);

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:8080/api/my-musicbox/info", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
          withCredentials: true,
        })
        .then((response) => {
          setSongs(response.data.musicInfo);
        })
        .catch((error) => {
          console.error("데이터 가져오기 오류", error);
        });
    }
  }, [isOpen]);

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
    // 다른 보관함으로 이동하는 로직을 여기에 추가
    console.log(`Moving song index ${selectedSong}`);
    handleMenuClose();
    setPlayListModalOpen(true);
  };

  const handleDeleteSong = () => {
    // 노래를 삭제하는 로직을 여기에 추가
    console.log(`Deleting song index ${selectedSong}`);
    handleMenuClose();
    setDeleteListModalOpen(true);
  };

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Box className={styles.modalBox}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title} 노래 목록
          </Typography>
          {songs.map((song, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "5px",
              }}
            >
              <img
                src={song.youtubeVideoId}
                alt="Album Cover"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <div style={{ flex: 2 }}>
                <div>{song.title}</div>
                <div style={{ color: "#888", fontSize: "0.9em" }}>
                  {song.artist}
                </div>
              </div>
              <div style={{ flex: 1, textAlign: "right" }}>
                {formatTime(song.duration)}
                <MoreVertIcon
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={(event) => handleMenuOpen(event, index)}
                />
              </div>
            </div>
          ))}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMoveToOtherBox}>
              다른 보관함으로 이동
            </MenuItem>
            <MenuItem onClick={handleDeleteSong}>삭제하기</MenuItem>
          </Menu>
          <Button onClick={onClose}>닫기</Button>
        </Box>
      </Modal>
      <PlayListModal
        isOpen={playListModalOpen}
        onClose={() => setPlayListModalOpen(false)}
      />
      <DeleteModal
        isOpen={deleteListModalOpen}
        onClose={() => setDeleteListModalOpen(false)}
      />
    </>
  );
};

export default MusicDetailModal;
