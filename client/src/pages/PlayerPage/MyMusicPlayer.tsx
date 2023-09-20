import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../component/Common/Navbar";
import { musicDummyData } from "./MusicDummy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import styles from "./MyMusicPlayer.module.css";
import SearchModal from "../../component/Common/SearchMusicModal";
import DeleteModal from "../../component/MyPage/DeleteModal";

type MyMusicPlayerProps = {};

export const MyMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicDummyData[currentTrackIndex].musicSrc; // 노래 소스 업데이트
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  const handleSongEnd = () => {
    if (currentTrackIndex < musicDummyData.length - 1) {
      setCurrentTrackIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
  };

  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false); // 모달의 열림/닫힘 상태를 관리하는 상태 변수
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const handleSearchModalOpen = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchModalClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.songDisplayContainer}>
          <div className={styles.coverImageContainer}>
            <img
              src={musicDummyData[currentTrackIndex].cover}
              alt={musicDummyData[currentTrackIndex].title}
              className={styles.coverImage}
            />
          </div>
          <div className={styles.songListContainer}>
            <div className={styles.songListHeader}>
              <div>현재 재생 목록</div>
              <AddCircleOutline
                onClick={handleSearchModalOpen}
                style={{ cursor: "pointer" }}
              />
            </div>
            <div className={styles.songList}>
              {musicDummyData.map((song, index) => (
                <div
                  key={index}
                  className={`${styles.playlistItem} ${
                    currentTrackIndex === index ? styles.playlistItemActive : ""
                  }`}
                >
                  <img
                    src={song.cover}
                    alt={song.title}
                    className={styles.albumImage}
                  />
                  <div
                    style={{ flex: 1 }}
                    onClick={() => setCurrentTrackIndex(index)}
                  >
                    <strong>{song.title}</strong>
                    <br />
                    {song.artist}
                  </div>
                  <div className={styles.songLength}>
                    <DeleteOutlineIcon
                      className={styles.deleteIcon}
                      onClick={event => {
                        event.stopPropagation(); // 이 줄을 추가하세요
                        handleDeleteModalOpen();
                      }}
                    />
                    {Math.floor(song.length / 60000)}:
                    {String((song.length % 60000) / 1000).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.audioContainer}>
          <audio ref={audioRef} onEnded={handleSongEnd} controls>
            <source type="audio/mp3" />
          </audio>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose} // 모달 바깥쪽을 클릭하면 모달을 닫는다.
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose} // 모달 바깥쪽을 클릭하면 모달을 닫는다.
      />
    </div>
  );
};
