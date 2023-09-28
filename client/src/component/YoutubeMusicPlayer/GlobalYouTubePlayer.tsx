import React, { useState, useCallback, useEffect } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState, MusicInfo, setSelectedMusicIndex } from "../../store";
import Button from "@mui/material/Button";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import styles from "./GlobalYouTubePlayer.module.css";

//파일 분리 완료
type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

export const GlobalYouTubePlayer = () => {
  const MusicData = useSelector((state: RootState) => state.music);
  const MusicDataArray: MusicInfo[] = Object.values(MusicData).filter(
    (item) => item.musicId
  );

  const [player, setPlayer] = useState<any>(null);
  const currentMusicIndex = useSelector(
    (state: RootState) => state.selectedMusicIndex
  );
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const dispatch = useDispatch();

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
    },
  };

  const handleMusicEnd = useCallback(() => {
    if (currentMusicIndex === MusicDataArray.length - 1) {
      dispatch(setSelectedMusicIndex(0));
      if (player) {
        player.playVideo();
      }
    } else {
      dispatch(setSelectedMusicIndex(currentMusicIndex + 1));
    }
  }, [currentMusicIndex, MusicDataArray, player, dispatch]);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const skipToPrevious = () => {
    if (currentMusicIndex === 0) {
      dispatch(setSelectedMusicIndex(MusicDataArray.length - 1));
    } else {
      dispatch(setSelectedMusicIndex(currentMusicIndex - 1));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    setIsButtonEnabled(false);
    const timer = setTimeout(() => {
      setIsButtonEnabled(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [currentMusicIndex]);

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

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player) return;
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const clickRatio = clickX / width;
    const newTime = clickRatio * duration;
    player.seekTo(newTime);
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        dispatch(
          setSelectedMusicIndex((currentMusicIndex + 1) % MusicDataArray.length)
        );
      } else if (event.key === "ArrowLeft") {
        skipToPrevious();
      } else if (event.key === " ") {
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [
    currentMusicIndex,
    MusicDataArray.length,
    skipToPrevious,
    togglePlay,
    dispatch,
  ]);

  const setCurrentMusicByMusicId = (musicId: number) => {
    const newIndex = MusicDataArray.findIndex((m) => m.musicId === musicId);
    if (newIndex !== -1) {
      dispatch(setSelectedMusicIndex(newIndex));
    }
  };
  // 여기서 이벤트 리스너를 설정하는 부분을 추가했습니다.
  useEffect(() => {
    const handleMusicSelect = (event: CustomEvent) => {
      setCurrentMusicByMusicId(event.detail.musicId);
    };

    window.addEventListener("musicSelect", handleMusicSelect as any);
    return () => {
      window.removeEventListener("musicSelect", handleMusicSelect as any);
    };
  }, [setCurrentMusicByMusicId]);

  const videoId = MusicDataArray[currentMusicIndex]?.youtubeVideoId;

  return (
    <div className={styles.audioContainer}>
      {videoId && (
        <YouTube
          key={videoId}
          videoId={videoId}
          opts={opts}
          onEnd={handleMusicEnd}
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
      )}
      {videoId && (
        <div className={styles.audioControls}>
          <Button
            onClick={skipToPrevious}
            color="primary"
            variant="outlined"
            disabled={!isButtonEnabled}
          >
            <SkipPreviousIcon />
          </Button>
          <Button
            onClick={togglePlay}
            color="primary"
            variant="outlined"
            disabled={!isButtonEnabled || !videoId}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
          <Button
            onClick={() =>
              dispatch(
                setSelectedMusicIndex(
                  (currentMusicIndex + 1) % MusicDataArray.length
                )
              )
            }
            color="primary"
            variant="outlined"
            disabled={!isButtonEnabled}
          >
            <SkipNextIcon />
          </Button>
          <div className={styles.progressBar} onClick={handleProgressBarClick}>
            <div
              className={styles.progress}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className={styles.timeText}>
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
};
