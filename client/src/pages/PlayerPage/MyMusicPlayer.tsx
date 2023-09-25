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

  const [isPlaying, setIsPlaying] = useState(false); // 현재 재생 상태를 저장
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간
  const [duration, setDuration] = useState(0); // 전체 오디오 길이

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    handleSongEnd();
  };

  const skipToPrevious = () => {
    if (currentTrackIndex === 0) {
      setCurrentTrackIndex(musicDummyData.length - 1);
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    setDuration(e.currentTarget.duration);
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
          {/* 오디오 태그에 이벤트 핸들러 추가 */}
          <audio
            ref={audioRef}
            onEnded={handleSongEnd}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadMetadata}
          >
            <source type="audio/mp3" />
          </audio>
          {/* 커스텀 오디오 컨트롤러 */}
          <div className={styles.audioControls}>
            <button onClick={skipToPrevious}>◀</button>
            <button onClick={togglePlay}>{isPlaying ? "||" : "▶"}</button>
            <button onClick={skipToNext}>▶</button>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
            </span>
            <span>
              {Math.floor(duration / 60)}:
              {String(Math.floor(duration % 60)).padStart(2, "0")}
            </span>
          </div>
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
