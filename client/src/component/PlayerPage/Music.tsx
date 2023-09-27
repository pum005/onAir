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

type MusicProps = {
  musicFiles: any[];
  onFinish: () => void;
  onMusicChange?: (music: any) => void;
};

export const Music = ({ musicFiles, onFinish, onMusicChange }: MusicProps) => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [progress, setProgress] = useState(0);
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

  const currentMusic = musicFiles[currentMusicIndex];

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const handleVideoEnd = () => {
    const nextMusicIndex = currentMusicIndex + 1;
    if (nextMusicIndex < musicFiles.length) {
      setCurrentMusicIndex(nextMusicIndex);
    } else {
      setCurrentMusicIndex(0);
      onFinish(); // 음악 재생 완료 후 콜백 함수 호출
    }
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

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (player && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = x / rect.width;
      const newTime = clickedValue * player.getDuration();

      player.seekTo(newTime); // 원하는 노래 지점으로 이동
    }
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

  const formatTime = (time: number) => {
    console.log(time);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (onMusicChange && currentMusic) {
      onMusicChange(currentMusic);
    }
  }, [currentMusic]);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${currentMusic.albumCoverUrl})`,
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
        <h2>{currentMusic.title}</h2>
        <p>{currentMusic.artist}</p>
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

      {/* Album Cover */}
      <img
        src={currentMusic.albumCoverUrl}
        alt="Album cover"
        style={{ width: "400px", height: "400px" }}
      />

      {/* YouTube Player */}
      <YouTube
        videoId={currentMusic.youtubeId}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleVideoEnd}
      />
    </div>
  );
};

export default Music;
