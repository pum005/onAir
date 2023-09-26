import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../component/Common/Navbar";
// import { musicDummyData } from "./MusicDummy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import styles from "./MyMusicPlayer.module.css";
import SearchModal from "../../component/Common/SearchMusicModal";
import DeleteModal from "../../component/MyPage/DeleteModal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { requestWithTokenRefresh } from "../../utils/requestWithTokenRefresh ";
import axios from "axios";
import YouTube from "react-youtube";

type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

type MusicInfo = {
  musicId: number;
  title: string;
  artist: string;
  duration: number;
  albumCoverUrl: string;
  youtubeVideoId: string;
};

type ApiResponse = {
  musicInfo: MusicInfo[];
};

export const MyMusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [musicData, setMusicData] = useState<MusicInfo[]>([]);

  const location = useLocation();
  //받아와야함
  const playlistMetaId = location.state?.playlistMetaId;

  useEffect(() => {
    requestWithTokenRefresh(() => {
      return axios.get("http://localhost:8080/api/my-musicbox/info", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        withCredentials: true,
      });
    })
      .then((response) => {
        setMusicData(response.data.musicInfo);
      })
      .catch((error) => {
        console.error("axios 에러", error);
      });
  }, []);

  const handleSongEnd = () => {
    if (currentTrackIndex < musicData.length - 1) {
      setCurrentTrackIndex((prevIndex) => prevIndex + 1);
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

  const [isPlaying, setIsPlaying] = useState(true); // 현재 재생 상태를 저장
  const [currentTime, setCurrentTime] = useState<number>(0);
  console.log(currentTime);
  const [duration, setDuration] = useState<number>(0);
  const [player, setPlayer] = useState<any>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      player.pauseVideo(); // YouTube 동영상 일시정지
    } else {
      player.playVideo(); // YouTube 동영상 재생
    }
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    handleSongEnd();
  };

  const skipToPrevious = () => {
    if (currentTrackIndex === 0) {
      setCurrentTrackIndex(musicData.length - 1);
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
    },
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player) return;

    // 클릭한 위치의 X 좌표
    const clickX = e.nativeEvent.offsetX;
    // 프로그레스 바의 전체 너비
    const width = e.currentTarget.offsetWidth;

    // 클릭한 위치의 비율
    const clickRatio = clickX / width;
    // 새로운 재생 위치 (초 단위)
    const newTime = clickRatio * duration;

    // YouTube 동영상의 재생 위치를 변경
    player.seekTo(newTime);
  };

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const updateProgress = () => {
    if (player) {
      const newCurrentTime = player.getCurrentTime();
      setCurrentTime(newCurrentTime);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [player]);

  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <div className={styles.songDisplayContainer}>
          <div className={styles.coverImageContainer}>
            <img
              src={musicData[currentTrackIndex]?.albumCoverUrl}
              alt={musicData[currentTrackIndex]?.title}
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
              {musicData.map((song, index) => (
                <div
                  key={index}
                  className={`${styles.playlistItem} ${
                    currentTrackIndex === index ? styles.playlistItemActive : ""
                  }`}
                >
                  <img
                    src={song.albumCoverUrl}
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
                      onClick={(event) => {
                        event.stopPropagation(); // 이 줄을 추가하세요
                        handleDeleteModalOpen();
                      }}
                    />
                    {Math.floor(song.duration / 60000)}:
                    {String((song.duration % 60000) / 1000).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.audioContainer}>
          {/* 오디오 태그에 이벤트 핸들러 추가 */}
          <YouTube
            videoId={musicData[currentTrackIndex]?.youtubeVideoId}
            opts={opts}
            onEnd={handleSongEnd}
            onReady={onPlayerReady}
            onStateChange={(event) => {
              if (player) {
                setCurrentTime(player.getCurrentTime());
                setDuration(player.getDuration());
              }

              if (event.data === YouTube.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === YouTube.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
            }}
          />
          {/* 커스텀 오디오 컨트롤러 */}
          <div className={styles.audioControls}>
            <Button onClick={skipToPrevious} color="primary" variant="outlined">
              <SkipPreviousIcon />
            </Button>
            <Button onClick={togglePlay} color="primary" variant="outlined">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </Button>
            <Button onClick={skipToNext} color="primary" variant="outlined">
              <SkipNextIcon />
            </Button>
            <div
              className={styles.progressBar}
              onClick={handleProgressBarClick}
            >
              <div
                className={styles.progress}
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span>
              {Math.floor(currentTime / 60)}:
              {String(Math.floor(currentTime % 60)).padStart(2, "0")}
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
