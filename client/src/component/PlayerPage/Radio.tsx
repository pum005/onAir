import React, { useEffect, useRef, useState } from "react";
import Equalizer, { getColorByDjName } from "../Common/Equalizer";
import { RadioScripts } from "../Common/RadioScript";
import styles from "./Radio.module.css";

type RadioProps = {
  ttsFiles: string[];
  scriptFiles: string[];
  djName: string; // djName을 추가합니다.
  onFinish: () => void;
};

export const Radio = ({
  ttsFiles,
  scriptFiles,
  djName,
  onFinish,
}: RadioProps) => {
  const [currentTTSIndex, setCurrentTTSIndex] = useState(0); // 로컬 상태 변수 추가
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const djColor = getColorByDjName(djName);
  const [charIndex, setCharIndex] = useState(0); // 스크립트의 현재 글자 인덱스

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      // 재생 시간에 따른 글자 인덱스를 계산하는 로직
      // 예시: 1초에 5글자를 표시하도록 설정
      const currentSeconds = audioRef.current.currentTime;
      setCharIndex(Math.floor(currentSeconds * 8));
    }
  };

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
  };

  const handleAudioEnd = () => {
    const nextIndex = currentTTSIndex + 1;
    setCurrentTTSIndex(nextIndex);

    if (nextIndex === 4) {
      setCurrentTTSIndex(0);
    } else {
      onFinish(); // TTS 재생 완료 후 콜백 함수 호출
    }
  };

  return (
    <div
      className={styles.container}
      style={
        {
          "--hoverBackgroundColor": djColor.backgroundColor,
        } as React.CSSProperties
      }
    >
      {isAudioLoaded && (
        <Equalizer audioElement={audioRef.current!} djName={djName} />
      )}
      <audio
        ref={audioRef}
        controls
        autoPlay
        onEnded={handleAudioEnd}
        onLoadedMetadata={handleAudioLoaded}
        className={styles.audioStyle}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        style={{ width: "0px", height: "0px" }}
      >
        <source src={ttsFiles[currentTTSIndex]} type="audio/mp3" />{" "}
        {/* props에서 가져오도록 수정 */}
        Your browser does not support the audio element.
      </audio>
      <RadioScripts
        script={scriptFiles[currentTTSIndex].slice(0, charIndex)}
        djName={djName}
      />
    </div>
  );
};
