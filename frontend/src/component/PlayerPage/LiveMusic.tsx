import React, { useState, useEffect } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type LiveMusicProps = {
  musicFiles: any[];
  playedTime: number;
};

type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

export const LiveMusic = ({ musicFiles, playedTime }: LiveMusicProps) => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      start: playedTime,
    },
  };

  const currentMusic = musicFiles[currentMusicIndex];

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
    event.target.seekTo(playedTime); // 추가된 코드
  };

  const handleVideoEnd = () => {
    const nextMusicIndex = currentMusicIndex + 1;
    if (nextMusicIndex < musicFiles.length) {
      setCurrentMusicIndex(nextMusicIndex);
    } else {
      setCurrentMusicIndex(0);
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
    window.scrollTo(0, 84);
  }, []);

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

      player.seekTo(newTime);
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${currentMusic.image})`,
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
      <h2 style={{ fontStyle: "italic", fontSize: "30px" }}>
        {currentMusic.title}
      </h2>
      <p
        style={{
          fontFamily: "Pretendard-Medium",
          opacity: 0.7,
          fontSize: "15px",
        }}
      >
        {currentMusic.artist}
      </p>
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
            background: "rgb(62, 62, 62)",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: "#7066e0",
              height: "4px",
              borderRadius: "10px",
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
          <span style={{ fontFamily: "Pretendard-Medium" }}>
            {formatTime(currentTime)}
          </span>
          {/* <div>
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
          </div> */}
          <span style={{ fontFamily: "Pretendard-Medium" }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <img
        src={currentMusic.image}
        alt="Album cover"
        style={{
          width: "400px",
          height: "400px",
          boxShadow: "15px 15px 6px black",
        }}
      />

      <YouTube
        videoId={currentMusic.path}
        opts={opts}
        onReady={onPlayerReady}
        onEnd={handleVideoEnd}
      />
    </div>
  );
};

export default LiveMusic;
