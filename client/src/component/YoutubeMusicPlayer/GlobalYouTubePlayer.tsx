import React, { useState, useCallback, useEffect } from "react";
import YouTube from "react-youtube";
import { useSelector } from "react-redux";
import { RootState, MusicInfo } from "../../store";
import Button from "@mui/material/Button";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import styles from "./GlobalYouTubePlayer.module.css";

//YouTubePlayer타입
type YouTubePlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
};

export const GlobalYouTubePlayer = () => {
  // 리덕스 스토어에서 음악 데이터 가져오기
  const MusicData = useSelector((state: RootState) => state.music);
  const MusicDataArray: MusicInfo[] = Object.values(MusicData);
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  // 현재 재생 중인 노래의 인덱스
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(true); // 현재 재생 상태를 저장
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  // YouTube 영상 재생 옵션 설정
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: isPlaying ? 1 : 0, // 자동재생
    },
  };

  // 다음 노래로 전환하는 함수
  const handleMusicEnd = useCallback(() => {
    // 마지막 노래면 처음으로 돌아감, 그렇지 않으면 다음 노래로
    setCurrentMusicIndex(
      (prevIndex) => (prevIndex + 1) % MusicDataArray.length
    );
  }, [MusicDataArray]);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setPlayer(event.target);
  };

  const skipToPrevious = () => {
    if (currentMusicIndex === 0) {
      setCurrentMusicIndex(MusicDataArray.length - 1);
    } else {
      setCurrentMusicIndex(currentMusicIndex - 1);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      player.pauseVideo(); // YouTube 동영상 일시정지
    } else {
      player.playVideo(); // YouTube 동영상 재생
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // 버튼을 잠시 비활성화
    setIsButtonEnabled(false);
    // 1.5초 후 버튼을 활성화
    const timer = setTimeout(() => {
      setIsButtonEnabled(true);
    }, 1500);
    // 컴포넌트 unmount 혹은 effect가 재실행될 때 타이머를 클리어해주는 작업
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

  const handleSongEnd = () => {
    if (currentMusicIndex < MusicDataArray.length - 1) {
      setCurrentMusicIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentMusicIndex(0);
    }
  };

  const skipToNext = () => {
    handleSongEnd();
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
  // 현재 재생 중인 노래의 videoId
  const videoId = MusicDataArray[currentMusicIndex]?.youtubeVideoId;

  return (
    <div className={styles.audioContainer}>
      {/* videoId가 있으면 YouTube 컴포넌트 렌더링 */}
      {videoId && (
        <YouTube
          videoId={videoId}
          opts={opts}
          onEnd={handleMusicEnd} // 노래가 끝나면 호출될 함수
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
      {/* 커스텀 오디오 컨트롤러 */}
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
            disabled={!isButtonEnabled}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
          <Button
            onClick={skipToNext}
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
