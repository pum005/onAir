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
        // style={{ width: "0px", height: "0px" }}
      >
        <source src={ttsFiles[currentTTSIndex]} type="audio/mp3" />{" "}
        {/* props에서 가져오도록 수정 */}
        Your browser does not support the audio element.
      </audio>
      <RadioScripts script={scriptFiles[currentTTSIndex]} djName={djName} />
    </div>
  );
};
