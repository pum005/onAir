import React from "react";
import styles from "./PlayListModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "../Common/AddFullList";
import PlayListModal from "../Common/PlayListModal";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

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
          "https://j9b302.p.ssafy.io/api/my-musicbox",
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
            Swal.fire({
              icon: "success",
              title: "전체 보관함에 추가 되었습니다!",
              confirmButtonColor: "6966FF",
              confirmButtonText: "확인",
              customClass: {
                popup: "my-popup-class",
              },
            }).then(result => {
              if (result.isConfirmed) {
                handleClose();
              }
            });
          }
          if (response.data.message === "이미 보관함에 있는 음악입니다.") {
            // setOpen(false);

            Swal.fire({
              icon: "error",
              title: "이미 보관함에 있는 음악입니다!",
              confirmButtonColor: "6966FF",
              confirmButtonText: "확인",
              customClass: {
                popup: "my-popup-class",
              },
            }).then(result => {
              if (result.isConfirmed) {
                handleClose();
              }
            });
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
        <div className={styles.closeButton}>
          <CloseIcon style={{ cursor: "pointer" }} onClick={onClose}>
            닫기
          </CloseIcon>
        </div>
        <div className={styles.playListTitle}>
          <h2 style={{ marginTop: "10px" }}>노래 목록</h2>
        </div>
        {/* <hr className={styles.hrStyle} /> */}
        <div>
          {songsToShow.map((music, index) => (
            <div
              key={index}
              onClick={() => handleSongClick(index)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #626262",
                padding: "5px",
              }}
              className={styles.cursorHover}
            >
              <img
                src={music.albumCoverUrl}
                alt="Album Cover"
                style={{ width: "40px", height: "40px", marginRight: "10px" }}
              />
              <div style={{ flex: 2 }}>
                <div
                  style={{ fontFamily: "Pretendard-SemiBold" }}
                  className={styles.musicTitle}
                >
                  {music.title}
                </div>
                <div
                  style={{
                    color: "#888",
                    fontSize: "15px",
                    fontFamily: "Pretendard-SemiBold",
                  }}
                >
                  {music.artist}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontFamily: "Pretendard-SemiBold",
                }}
                className={styles.songDuration}
              >
                {formatTime(music.duration)}
              </div>
              <AddCircleOutlineIcon
                style={{ marginLeft: "8px", fontSize: "20px" }}
                onClick={event => handleClickOpen(event, music.musicId)}
                cursor="pointer"
                className={styles.addIcon}
              />
            </div>
          ))}
        </div>
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
