import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

export const Music = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();

  const currentMusicKey = [
    `oncast_music_one`,
    `oncast_music_two`,
    `oncast_music_three`,
  ][radioDummyData.currentMusicIndex];

  const currentYoutubeId = String(radioDummyData[currentMusicKey]);
  const currentMusicTitle =
    radioDummyData.musicTitle[radioDummyData.currentMusicIndex];
  const currentMusicArtist =
    radioDummyData.musicArtist[radioDummyData.currentMusicIndex];
  const currentMusicCover =
    radioDummyData.musicCover[radioDummyData.currentMusicIndex];

  const [progress, setProgress] = useState(0); // Progress Bar의 진행 상태
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
    },
  };

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const handleVideoEnd = () => {
    dispatch({ type: "INCREMENT_MUSIC_INDEX" });
    navigate("/RadioPlayer");
  };

  const updateProgress = () => {
    if (player) {
      const newCurrentTime = player.getCurrentTime();
      const newDuration = player.getDuration();
      setCurrentTime(newCurrentTime);
      setDuration(newDuration);
      setProgress((newCurrentTime / newDuration) * 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [player]);

  useEffect(() => {
    console.log("Current Music Index:", radioDummyData.currentMusicIndex);
  }, [radioDummyData.currentMusicIndex]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (player && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = x / rect.width;
      const newTime = clickedValue * player.getDuration();

      player.seekTo(newTime); // 원하는 노래 지점으로 이동
    }
  };

  const handlePlay = () => {
    if (player) {
      player.playVideo(); // 영상 재생
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo(); // 영상 일시정지
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${currentMusicCover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 1, 4, 0.9)",
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Album Info */}
      <div style={{ textAlign: "center", zIndex: 2 }}>
        <h2>{currentMusicTitle}</h2>
        <p>{currentMusicArtist}</p>
      </div>

      {/* 진행 바, 현재/전체 시간, 재생/일시정지 아이콘 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "50%",
            background: "#ccc",
            cursor: "pointer",
          }}
          onClick={handleProgressBarClick}
        >
          <div
            style={{
              width: `${progress}%`,
              background: "blue",
              height: "4px",
            }}
          ></div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "50%",
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <div>
            {isPlaying ? (
              <PauseIcon
                onClick={handlePlayPause}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <PlayArrowIcon
                onClick={handlePlayPause}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* 현재 시간과 전체 영상 길이 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      ></div>

      {/* Album Cover */}
      <img
        src={currentMusicCover}
        alt="Album cover"
        style={{ width: "400px", height: "400px" }}
      />

      {/* YouTube Player */}
      <YouTube
        videoId={currentYoutubeId}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleVideoEnd}
      />

      {/* Play/Pause Button */}
      <div style={{ marginTop: "20px" }}></div>
    </div>
  );
};
