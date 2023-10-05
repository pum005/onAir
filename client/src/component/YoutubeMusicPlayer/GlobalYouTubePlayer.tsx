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
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

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
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [oneSecnonds, setOneSeconds] = useState<number>(0);
  const [animate, setAnimate] = useState(false);
  const [showAlbumIcon, setShowAlbumIcon] = useState(true);

  useEffect(() => {
    let interval: any;

    if (!MusicDataArray || MusicDataArray.length === 0) {
      return;
    }

    if (isPlaying) {
      // 초기에는 바로 애니메이션을 시작하지 않습니다.
      setTimeout(() => {
        setAnimate(true);
      }, 2000);

      interval = setInterval(() => {
        // 애니메이션이 끝나면 다음 노래로 넘어갑니다.
        setAnimate(false);

        setOneSeconds(prevIndex => (prevIndex + 1) % MusicDataArray.length);

        // 다음 노래를 보여주기 시작할 때만 애니메이션을 시작합니다.
        setTimeout(() => {
          setAnimate(true);
        }, 2000);
      }, 4000); // 애니메이션 (2초) + 대기 시간 (2초) = 총 4초
    }

    return () => {
      clearInterval(interval);
    };
  }, [MusicDataArray.length, isPlaying]);

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

  const isLoggedIn = !!localStorage.getItem("accessToken");

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

  // Tooltip에 표시할 메시지를 결정하는 함수
  const getTooltipMessage = () => {
    if (!isLoggedIn) return "로그인 후 사용 가능합니다";
    return videoId ? "Play Music" : "현재 재생 가능한 음악이 없습니다!";
  };

  const handleToggleVisibility = () => {
    // 로그인이 되지 않은 상태라면 아무것도 하지 않음
    if (!isLoggedIn) return;

    const persistedMusicValue = localStorage.getItem("persist:music");
    if (!persistedMusicValue) return; // 값이 없으면 아무것도 하지 않음

    const parsedValue = JSON.parse(persistedMusicValue);
    const musicEntries = Object.entries(parsedValue).filter(
      ([key, value]) => key !== "_persist"
    );

    // 재생할 곡이 없으면 함수를 종료
    if (!musicEntries.length) {
      return;
    }

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

  useEffect(() => {
    if (videoId && player) {
      player.loadVideoById(videoId);
      player.playVideo();
    }
  }, [videoId, player]);

  return (
    <div
      className={styles.audioContainer}
      style={isVisible ? {} : { width: "0px", overflow: "hidden" }}
    >
      {showAlbumIcon && (
        <Tooltip title={getTooltipMessage()}>
          <Button
            onClick={handleToggleVisibility}
            className={
              isVisible && videoId ? styles.albumTrueButton : styles.albumButton
            }
          >
            <BiSolidAlbum color="white" size="200px" />
          </Button>
        </Tooltip>
      )}

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

          <Grid container spacing={1} className={styles.gridContainer}>
            <Grid item xs={2}>
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

            <Grid item xs={1}>
              <div
                className={styles.timeInfo}
                style={{
                  fontFamily: "Pretendard-SemiBold",
                  fontSize: "13px",
                  color: "#A3A3A3",
                }}
              >
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

            <Grid item xs={4}>
              <Button
                onClick={redirectToPlaylist}
                style={{ textTransform: "none" }}
                className={styles.redirectPlaylist}
              >
                <div className={styles.currentSongInfo}>
                  <img
                    src={MusicDataArray[currentMusicIndex]?.albumCoverUrl}
                    alt="Album Cover"
                    width="45"
                    height="45"
                    style={{ marginRight: "10px" }}
                  />
                  <div>
                    <span
                      className={styles.currentSongTitle}
                      style={{
                        fontFamily: "Pretendard-SemiBold",
                        fontSize: "15px",
                      }}
                    >
                      {MusicDataArray[currentMusicIndex]?.title}
                    </span>
                    <span> - </span>
                    <span
                      className={styles.currentSongArtist}
                      style={{
                        fontFamily: "Pretendard-SemiBold",
                        fontSize: "12px",
                        color: "#A3A3A3",
                      }}
                    >
                      {MusicDataArray[currentMusicIndex]?.artist}
                    </span>
                  </div>
                </div>
              </Button>
            </Grid>
            <Grid item xs={2}>
              <div
                className={`${styles.nextMusicItem} ${
                  animate ? styles.animateSlideUp : ""
                }`}
              >
                <img
                  src={MusicDataArray[oneSecnonds]?.albumCoverUrl}
                  alt="Album Cover"
                  width="45"
                  height="45"
                  style={{ marginRight: "10px" }}
                />
                <div style={{ flex: 2 }} className={styles.nextMusicBox}>
                  <div
                    className={styles.currentSongTitle}
                    style={{
                      fontFamily: "Pretendard-SemiBold",
                      fontSize: "15px",
                      marginBottom: "8px",
                    }}
                  >
                    {MusicDataArray[oneSecnonds]?.title}
                  </div>
                  <div
                    className={styles.currentSongArtist}
                    style={{
                      fontFamily: "Pretendard-SemiBold",
                      fontSize: "12px",
                      color: "#A3A3A3",
                      marginBottom: "2px",
                    }}
                  >
                    {MusicDataArray[oneSecnonds]?.artist}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={2}>
              <div className={styles.iconControls}>
                <Button
                  onClick={() => setIsRandom(!isRandom)}
                  disabled={!isButtonEnabled}
                >
                  <ShuffleIcon
                    style={{ color: isRandom ? "white" : "rgb(62, 62, 62)" }}
                  />
                </Button>
                <Button
                  onClick={() => setIsLoop(!isLoop)}
                  disabled={!isButtonEnabled}
                >
                  <RepeatOneIcon
                    style={{ color: isLoop ? "white" : "rgb(62, 62, 62)" }}
                  />
                </Button>
              </div>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};
