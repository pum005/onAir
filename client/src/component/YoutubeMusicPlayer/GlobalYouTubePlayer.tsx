import React, { useState, useCallback, useEffect } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState, MusicInfo, setSelectedMusicIndex } from "../../store";
import Button from "@mui/material/Button";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import LoopIcon from "@mui/icons-material/Loop";

import { useNavigate } from "react-router-dom";
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
  const [isRandom, setIsRandom] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
    },
  };

  const handleMusicEnd = useCallback(() => {
    if (isLoop) {
      if (player) {
        player.playVideo();
      }
      return;
    }

    let nextIndex;
    if (isRandom) {
      do {
        nextIndex = Math.floor(Math.random() * MusicDataArray.length);
      } while (nextIndex === currentMusicIndex && MusicDataArray.length > 1);
    } else {
      nextIndex =
        currentMusicIndex === MusicDataArray.length - 1
          ? 0
          : currentMusicIndex + 1;
    }
    dispatch(setSelectedMusicIndex(nextIndex));
    if (player) {
      player.playVideo();
    }
  }, [currentMusicIndex, MusicDataArray, player, dispatch, isRandom, isLoop]);

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
    if (isDebouncing) return; // 디바운싱 중이면 아무 것도 수행하지 않음
    setIsDebouncing(true); // 디바운싱 시작
    setTimeout(() => setIsDebouncing(false), 700);
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
      if (!isVisible) {
        return;
      }
      if (player) {
        // player가 존재할 때만 실행
        const jumpTime = 10; // 10초 앞뒤로 이동

        if (event.key === "ArrowRight") {
          const newTime = player.getCurrentTime() + jumpTime;
          if (newTime < player.getDuration()) {
            player.seekTo(newTime);
          } else {
            player.seekTo(player.getDuration()); // 끝까지 이동
          }
        } else if (event.key === "ArrowLeft") {
          const newTime = player.getCurrentTime() - jumpTime;
          if (newTime > 0) {
            player.seekTo(newTime);
          } else {
            player.seekTo(0); // 시작점으로 이동
          }
        } else if (event.key === " ") {
          // 스페이스바를 눌렀을 때
          event.preventDefault(); // 브라우저 기본 동작(예: 스크롤)을 방지
          togglePlay(); // 재생 및 일시정지 토글
        }
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

  const playlistMetaId = useSelector(
    (state: RootState) => state.playlistMetaId
  );
  const redirectToPlaylist = () => {
    navigate("/MyMusicPlayer", {
      state: {
        playlistMetaId: playlistMetaId,
        currentMusicIndex: currentMusicIndex,
      },
    });
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const videoId = MusicDataArray[currentMusicIndex]?.youtubeVideoId;

  return (
    <div className={styles.audioContainer}>
      <Button onClick={handleToggleVisibility}> 응애버튼</Button>
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
      {isVisible && videoId && (
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
          <Button
            onClick={() => setIsRandom(!isRandom)}
            color="primary"
            variant="outlined"
            disabled={!isButtonEnabled}
          >
            <ShuffleIcon color={isRandom ? "secondary" : "action"} />
          </Button>
          <Button
            onClick={() => setIsLoop(!isLoop)}
            color="primary"
            variant="outlined"
            disabled={!isButtonEnabled}
          >
            <LoopIcon color={isLoop ? "secondary" : "action"} />
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
          <span className={styles.timeText}>
            /{Math.floor(duration / 60)}:
            {String(Math.floor(duration % 60)).padStart(2, "0")}
          </span>
          <Button onClick={redirectToPlaylist}>
            여기 누르면 원래 노래 나오던 페이지
          </Button>
        </div>
      )}
    </div>
  );
};
