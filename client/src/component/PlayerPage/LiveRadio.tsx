import React, { useEffect, useRef, useState } from "react";
import Equalizer from "../Common/Equalizer";
import styles from "./Radio.module.css";
import { LiveScriptRadio } from "./LiveScriptRadio";
import { getColorByDjName } from "../Common/Equalizer";
import "./LiveRadio.module.css";

type RadioProps = {
  ttsFile: string;
  script: string;
  playedTime: number;
  djName: string;
};

export const Radio = ({ ttsFile, script, playedTime, djName }: RadioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [charIndex, setCharIndex] = useState(0); // 스크립트의 현재 글자 인덱스 추가

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
    if (audioRef.current) {
      audioRef.current.currentTime = playedTime / 1000;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentSeconds = audioRef.current.currentTime;
      setCharIndex(Math.floor(currentSeconds * 8)); // 재생 시간에 따른 글자 인덱스를 계산하는 로직
    }
  };
  useEffect(() => {
    window.scrollTo(0, 84);
  }, []);

  const { backgroundColor } = getColorByDjName(djName);

  return (
    <div
      className={styles.container}
      style={
        { "--hoverBackgroundColor": backgroundColor } as React.CSSProperties
      }
    >
      {/* 배경색 적용 */}
      {isAudioLoaded && (
        <Equalizer audioElement={audioRef.current!} djName={djName} />
      )}
      <audio
        ref={audioRef}
        controls
        autoPlay
        onLoadedMetadata={handleAudioLoaded}
        className={styles.audioStyle}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        style={{ width: "0px", height: "0px" }}
      >
        <source src={ttsFile} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <LiveScriptRadio script={script.slice(0, charIndex)} djName={djName} />
    </div>
  );
};
