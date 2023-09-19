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
  const dummySongs = [
    // 여기에 더미 데이터를 추가합니다.
    {
      title: "사라지나요",
      artist: "PATEKO",
      length: 210,
      cover: "/images/사라지나요.jpg",
    },
    {
      title: "결을",
      artist: "Cloudybay",
      length: 240,
      cover: "/images/결을.jpg",
    },
    // ... 더 많은 노래들
  ];

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
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
          {dummySongs.map((song, index) => (
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
                src={song.cover}
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
                {formatTime(song.length)}
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
