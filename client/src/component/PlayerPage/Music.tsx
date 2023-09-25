import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

type MusicProps = {
  musicFiles: any[];
  onFinish: () => void;
};

export const Music = ({ musicFiles, onFinish }: MusicProps) => {
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0); // 현재 재생 중인 음악의 인덱스

  // YouTube 플레이어 설정
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  // 현재 재생 중인 음악의 정보
  const currentMusic = musicFiles[currentMusicIndex];

  const handleVideoEnd = () => {
    const nextMusicIndex = currentMusicIndex + 1;
    if (nextMusicIndex < musicFiles.length) {
      setCurrentMusicIndex(nextMusicIndex);
    } else {
      setCurrentMusicIndex(0);
      onFinish(); // 음악 재생 완료 후 콜백 함수 호출
    }
  };

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      {/* 현재 재생 중인 음악의 제목과 아티스트를 출력합니다. */}
      <h2>{currentMusic.title}</h2>
      <p>{currentMusic.artist}</p>

      <YouTube
        videoId={currentMusic.youtubeId}
        opts={opts}
        onEnd={handleVideoEnd} // 음악이 끝나면 다음 음악으로 넘어갑니다.
      />
    </div>
  );
};
