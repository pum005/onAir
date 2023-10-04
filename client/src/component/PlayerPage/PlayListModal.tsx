import React from "react";
import styles from "./PlayListModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "../Common/AddFullList";
import PlayListModal from "../Common/PlayListModal";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional props
  content?: string; // Optional props
  currentMusicList?: {
    musicId: number;
    title: string;
    artist: string;
    albumCoverUrl: string;
    duration: number;
  }[];
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, currentMusicList }) => {
  if (!isOpen) return null;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [playListModalOpen, setPlayListModalOpen] = React.useState(false);
  const [selectedMusicId, setSelectedMusicId] = React.useState<number | null>(
    null
  );
  const [isPulsButtonClicked, setIsPlusButtonClicked] = React.useState(false);
  const songsToShow = currentMusicList || [];

  const handleSongClick = (index: number) => {
    dispatch({ type: "SET_MUSIC_INDEX", payload: index });
    onClose();
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.round(milliseconds / 1000);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleClickOpen = (event: React.MouseEvent, musicId: number) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setSelectedMusicId(musicId);
    setIsPlusButtonClicked(!isPulsButtonClicked);
  };

  const handleClose = () => {
    setOpen(false);
    // 알림 모달이 닫히면 플레이리스트 모달을 연다.
    setPlayListModalOpen(true);
  };

  React.useEffect(() => {
    if (selectedMusicId) {
      requestWithTokenRefresh(() => {
        return axios.post(
          "http://localhost:8080/api/my-musicbox",
          { musicId: selectedMusicId },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
            withCredentials: true,
          }
        );
      })
        .then(response => {
          console.log(response.data);
          if (response.data.message === "음악 추가 완료") {
            setOpen(true);
          }
          if (response.data.message === "이미 보관함에 있는 음악입니다.") {
            setOpen(false);
            alert("이미 보관함에 있는 음악입니다.");
          }
        })
        .catch(error => {
          console.error("에러발생", error);
        });
    }
  }, [selectedMusicId, isPulsButtonClicked]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>PlayList</h2>
        <hr className={styles.hrStyle} />

        {songsToShow.map((music, index) => (
          <div
            key={index}
            onClick={() => handleSongClick(index)}
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
              src={music.albumCoverUrl}
              alt="Album Cover"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <div style={{ flex: 2 }}>
              <div>{music.title}</div>
              <div style={{ color: "#888", fontSize: "0.9em" }}>
                {music.artist}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {formatTime(music.duration)}
            </div>
            <AddCircleOutlineIcon
              style={{ marginLeft: "8px" }}
              onClick={event => handleClickOpen(event, music.musicId)}
              cursor="pointer"
            />
          </div>
        ))}
        <button onClick={onClose}>닫기</button>
      </div>
      <AlertDialog open={open} handleClose={handleClose} />
      <PlayListModal
        isOpen={playListModalOpen}
        onClose={() => setPlayListModalOpen(false)}
        musicId={selectedMusicId}
      />
    </div>
  );
};

export default Modal;
