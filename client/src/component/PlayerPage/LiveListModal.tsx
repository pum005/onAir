import { useState, useEffect } from "react";
import axios from "axios";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import { Modal, Backdrop, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AlertDialog from "../Common/AddFullList";
import styles from "./LiveListModal.module.css";

type MusicItem = {
  musicId: number;
  albumCoverUrl: string;
  artist: string;
  title: string;
};

type OncastItem = {
  nickname: string;
  profileImage: string;
  title: string;
  musicList: MusicItem[];
};

type LiveListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  oncastList: OncastItem[];
};

export const LiveListModal: React.FC<LiveListModalProps> = ({
  isOpen,
  onClose,
  oncastList,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedMusicId, setSelectedMusicId] = useState<number | null>(null);

  const handleClickOpen = (musicId: number) => {
    setSelectedMusicId(musicId);
    console.log("플러스 버튼 누름");
  };

  useEffect(() => {
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
          if (response.data.message === "음악 추가 완료") {
            setOpen(true);
          }
          if (response.data.message === "이미 보관함에 있는 음악입니다.") {
            alert("이미 보관함에 있는 음악입니다.");
          }
        })
        .catch(error => {
          console.error("에러발생", error);
        });
    }
  }, [selectedMusicId]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
        }}
        className={styles.modalContainer}
      >
        <Fade in={isOpen}>
          <div className={styles.paper}>
            <button className={styles.closeButton} onClick={onClose}>
              x
            </button>
            <h2>온캐스트 편성표</h2>
            <hr />
            <div className={styles.oncastList}>
              {oncastList.map((oncast, index) => (
                <div key={index} className={styles.oncastItem}>
                  <div className={styles.profileAndDetails}>
                    <img
                      src={oncast.profileImage}
                      alt={oncast.nickname}
                      className={styles.profileImage}
                    />
                    <div className={styles.oncastDetails}>
                      <span className={styles.nickname}>{oncast.nickname}</span>
                      <span className={styles.title}>{oncast.title}</span>
                    </div>
                  </div>
                  <ul className={styles.musicList}>
                    {oncast.musicList.map((music, mIndex) => (
                      <li key={mIndex} className={styles.musicItem}>
                        <img
                          src={music.albumCoverUrl}
                          alt={music.title}
                          className={styles.albumCover}
                        />
                        <div className={styles.musicDetails}>
                          <span className={styles.songTitle}>
                            {music.title}
                          </span>
                          <span className={styles.artist}>{music.artist}</span>
                        </div>
                        <AddCircleOutlineIcon
                          className={styles.addIcon}
                          onClick={() => handleClickOpen(music.musicId)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Fade>
      </Modal>
      <AlertDialog open={open} handleClose={handleClose} />;
    </>
  );
};
