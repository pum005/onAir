import React, { useEffect, useRef, useState } from "react";
import Equalizer from "../Common/Equalizer";
import { RadioScripts } from "../Common/RadioScript";
import styles from "./Radio.module.css";
import { FinishModal } from "./FinishModal";

type RadioProps = {
  ttsFiles: string[];
  scriptFiles: string[];
  djName: string; // djName을 추가합니다.
};

export const Radio = ({ ttsFiles, scriptFiles, djName }: RadioProps) => {
  const [currentTTSIndex, setCurrentTTSIndex] = useState(0); // 로컬 상태 변수 추가
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
  };

  const handleAudioEnd = () => {
    const nextIndex = currentTTSIndex + 1; // 미리 다음 인덱스를 계산
    setCurrentTTSIndex(nextIndex); // 상태를 업데이트

    if (nextIndex === 4) {
      // 다음 인덱스가 4라면 (0, 1, 2, 3 이후)
      setCurrentTTSIndex(0); // 인덱스 초기화
      setShowModal(true); // 모달 표시
    }
  };

  return (
    <div className={styles.container}>
      {isAudioLoaded && <Equalizer audioElement={audioRef.current!} />}
      <audio
        ref={audioRef}
        controls
        autoPlay
        onEnded={handleAudioEnd}
        onLoadedMetadata={handleAudioLoaded}
        className={styles.audioStyle}
        crossOrigin="anonymous"
      >
        <source src={ttsFiles[currentTTSIndex]} type="audio/mp3" />{" "}
        {/* props에서 가져오도록 수정 */}
        Your browser does not support the audio element.
      </audio>
      <RadioScripts script={scriptFiles[currentTTSIndex]} djName={djName} />
      {/* props에서 가져오도록 수정 */}
      <FinishModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};
