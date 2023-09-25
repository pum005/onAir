import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

type LiveMusicProps = {
  musicFiles: any[];
};

export const LiveMusic = ({ musicFiles }: LiveMusicProps) => {
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
  console.log(currentMusic);

  const handleVideoEnd = () => {
    // 노래가 끝나면 아무런 액션을 취하지 않습니다.
  };

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      {/* 현재 재생 중인 음악의 제목과 아티스트를 출력합니다. */}
      <h2>{currentMusic?.title}</h2>
      <p>{currentMusic?.artist}</p>

      <YouTube
        videoId={currentMusic?.path} // youtubeId를 path로 변경했습니다.
        opts={opts}
        onEnd={handleVideoEnd}
      />
    </div>
  );
};
