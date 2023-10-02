import React, { useState, useCallback, useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { useDispatch, useSelector } from "react-redux";
import { RootState, MusicInfo, setSelectedMusicIndex } from "../../store";
import Button from "@mui/material/Button";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import styles from "./GlobalYouTubePlayer.module.css";
import { BiSolidAlbum } from "react-icons/bi";
import { Paper, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

//파일 분리 완료
type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const GlobalYouTubePlayer = () => {
  const MusicData = useSelector((state: RootState) => state.music);
  const MusicDataArray: MusicInfo[] = Object.values(MusicData).filter(
    item => item.musicId
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
  const audioRef = useRef<HTMLAudioElement>(null);
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
    const newIndex = MusicDataArray.findIndex(m => m.musicId === musicId);
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

  const handleToggleStop = () => {
    // 노래가 재생 중이면 일시정지
    if (isPlaying && player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
    setIsVisible(!isVisible);
  };

  const videoId = MusicDataArray[currentMusicIndex]?.youtubeVideoId;

  return (
    <div
      className={styles.audioContainer}
      style={isVisible ? {} : { width: "0px", overflow: "hidden" }}
    >
      <Tooltip
        title={videoId ? "Play Music" : "현재 재생 가능한 음악이 없습니다!"}
      >
        <Button
          onClick={handleToggleVisibility}
          className={
            isVisible && videoId ? styles.albumTrueButton : styles.albumButton
          }
        >
          <BiSolidAlbum color="white" size="200px" />
        </Button>
      </Tooltip>

      {videoId && (
        <YouTube
          key={videoId}
          videoId={videoId}
          opts={opts}
          onEnd={handleMusicEnd}
          onReady={onPlayerReady}
          onStateChange={event => {
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
          <div className={styles.progressBar} onClick={handleProgressBarClick}>
            <div
              className={styles.progress}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <Grid container spacing={3} className={styles.gridContainer}>
            <Grid item xs>
              <div className={styles.controlButtons}>
                <Button onClick={skipToPrevious} disabled={!isButtonEnabled}>
                  <SkipPreviousIcon />
                </Button>
                <Button
                  onClick={togglePlay}
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
                  disabled={!isButtonEnabled}
                >
                  <SkipNextIcon />
                </Button>
              </div>
            </Grid>

            <Grid item xs>
              <div className={styles.timeInfo}>
                <span>
                  {Math.floor(currentTime / 60)}:
                  {String(Math.floor(currentTime % 60)).padStart(2, "0")}
                </span>
                <span> / </span>
                <span>
                  {Math.floor(duration / 60)}:
                  {String(Math.floor(duration % 60)).padStart(2, "0")}
                </span>
              </div>
            </Grid>

            <Grid item xs>
              <Button
                onClick={redirectToPlaylist}
                style={{ textTransform: "none" }}
              >
                <div className={styles.currentSongInfo}>
                  <img
                    src={MusicDataArray[currentMusicIndex]?.albumCoverUrl}
                    alt="Album Cover"
                    width="50"
                    height="50"
                    style={{ marginRight: "10px" }}
                  />
                  <div>
                    <span className={styles.currentSongTitle}>
                      {MusicDataArray[currentMusicIndex]?.title}
                    </span>
                    <br />
                    <span className={styles.currentSongArtist}>
                      {MusicDataArray[currentMusicIndex]?.artist}
                    </span>
                  </div>
                </div>
              </Button>
            </Grid>

            <Grid item xs>
              <div className={styles.iconControls}>
                <Button
                  onClick={() => setIsRandom(!isRandom)}
                  disabled={!isButtonEnabled}
                >
                  <ShuffleIcon color={isRandom ? "secondary" : "action"} />
                </Button>
                <Button
                  onClick={() => setIsLoop(!isLoop)}
                  disabled={!isButtonEnabled}
                >
                  <RepeatOneIcon color={isLoop ? "secondary" : "action"} />
                </Button>
              </div>
            </Grid>

            <Grid item xs>
              <div className={styles.closeIconContainer}>
                <Button onClick={handleToggleStop}>
                  <HighlightOffIcon />
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};
