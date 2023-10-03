import React, { useEffect, useRef, useState } from "react";
import Equalizer from "../Common/Equalizer";
import styles from "./Radio.module.css";
import { LiveScriptRadio } from "./LiveScriptRadio";

type RadioProps = {
  ttsFile: string;
  script: string;
  playedTime: number;
};

export const Radio = ({ ttsFile, script, playedTime }: RadioProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
    if (audioRef.current) {
      audioRef.current.currentTime = playedTime / 1000;
    }
  };

  return (
    <div className={styles.container}>
      {/* {isAudioLoaded && <Equalizer audioElement={audioRef.current!} djName={djName} />} */}
      <audio
        ref={audioRef}
        controls
        autoPlay
        onLoadedMetadata={handleAudioLoaded}
        className={styles.audioStyle}
        crossOrigin="anonymous"
      >
        <source src={ttsFile} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <LiveScriptRadio script={script} />
    </div>
  );
};
