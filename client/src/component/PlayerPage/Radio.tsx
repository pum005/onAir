import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import Equalizer from "../Common/Equalizer";
import { RadioScripts } from "../Common/RadioScript";
import styles from "./Radio.module.css";

export const Radio = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null); // 오디오 태그 참조
  const [isAudioLoaded, setIsAudioLoaded] = React.useState(false);

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
  };

  const handleAudioEnd = () => {
    dispatch({ type: "INCREMENT_TTS_INDEX" });
    navigate("/MusicPlayer");
  };

  const currentTTS = [`tts_one`, `tts_two`, `tts_three`, `tts_four`][
    radioDummyData.currentTTSIndex
  ];
  const currentScript = [
    `script_one`,
    `script_two`,
    `script_three`,
    `tts_four`,
  ][radioDummyData.currentTTSIndex];

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
      >
        <source src={radioDummyData[currentTTS] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <RadioScripts />
      <div className={styles.marginTop}></div>
    </div>
  );
};
