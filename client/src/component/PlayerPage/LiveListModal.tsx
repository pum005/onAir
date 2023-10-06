import { Modal, Backdrop, Fade } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./LiveListModal.module.css";
import axios from "axios";
import AlertModal from "../Common/AlertModal";
import React from "react";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import PlayListModal from "../Common/PlayListModal";

type MusicItem = {
  albumCoverUrl: string;
  artist: string;
  title: string;
  musicId: number;
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
  currentSeq: number | null;
};

export const LiveListModal: React.FC<LiveListModalProps> = ({
  isOpen,
  onClose,
  oncastList,
  currentSeq,
}) => {
  const [alertModalOpen, setAlertModalOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [selectedMusicId, setSelectedMusicId] = React.useState<number | null>(
    null
  );
  const [playListModalOpen, setPlayListModalOpen] = React.useState(false);

  const handleClickOpen = (musicId: number) => {
    setSelectedMusicId(musicId);
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
          if (response.data.message === "음악 추가 완료") {
            setAlertMessage("추가되었습니다.");
            setAlertModalOpen(true);
            // setPlayListModalOpen(true); 이 줄을 제거합니다.
          } else if (
            response.data.message === "이미 보관함에 있는 음악입니다."
          ) {
            setAlertMessage("이미 보관함에 있는 음악입니다.");
            setAlertModalOpen(true);
          }
        })
        .catch(error => {
          console.error("에러발생", error);
        });
    }
  }, [selectedMusicId]);

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
            <CloseIcon
              className={styles.closeButton}
              onClick={onClose}
            ></CloseIcon>
            <h2>온캐스트 편성표</h2>
            {/* <hr /> */}
            <div className={styles.oncastList}>
              <div className={styles.containerNumberflex}>
                {oncastList.map((oncast, index) => (
                  <div
                    key={index}
                    className={`${styles.oncastItem} ${
                      index === currentSeq ? styles.currentOncast : ""
                    }`}
                  >
                    {/* <span className={styles.orderNumber}>{index + 1}</span> */}
                    <div className={styles.flexHeader}>
                      <span className={styles.orderNumber}> {index + 1}</span>
                      <div className={styles.profileAndDetails}>
                        <img
                          src={oncast.profileImage}
                          alt={oncast.nickname}
                          className={styles.profileImage}
                        />
                        <div className={styles.oncastDetails}>
                          <span className={styles.nickname}>
                            {oncast.nickname}
                          </span>
                          <span className={styles.title}>{oncast.title}</span>
                        </div>
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
                            <span className={styles.artist}>
                              {music.artist}
                            </span>
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
          </div>
        </Fade>
      </Modal>
      <AlertModal
        open={alertModalOpen}
        message={alertMessage}
        onClose={() => {
          setAlertModalOpen(false);
          setPlayListModalOpen(true); // AlertModal이 닫힐 때 PlayListModal을 엽니다.
        }}
      />
      <PlayListModal
        musicId={selectedMusicId}
        isOpen={playListModalOpen}
        onClose={() => setPlayListModalOpen(false)}
      />
    </>
  );
};
