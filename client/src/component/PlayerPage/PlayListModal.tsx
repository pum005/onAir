import React from "react";
import styles from "./PlayListModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional props
  content?: string; // Optional props
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const dispatch = useDispatch();

  const handleSongClick = (index: number) => {
    dispatch({ type: "SET_MUSIC_INDEX", payload: index });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const songsToShow = radioDummyData.musicTitle.slice(
    0,
    radioDummyData.currentMusicIndex + 1
  );

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>PlayList</h2>
        <hr className={styles.hrStyle} />
        <ul className={styles.songList}>
          {songsToShow.map((title, index) => (
            <li key={index} onClick={() => handleSongClick(index)}>
              <img src={radioDummyData.musicCover[index]} alt="Album Cover" />
              <div>
                <h3>{title}</h3>
                <p>{radioDummyData.musicArtist[index]}</p>
                <span>{formatTime(radioDummyData.musicLength[index])}</span>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Modal;
