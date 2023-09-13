import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import Equalizer from "../Common/Equalizer";

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
    <div
      style={{
        backgroundColor: "#000104",
        height: "100vh",
        color: "white",
        display: "flex", // Flexbox 레이아웃 적용
        flexDirection: "column", // 수직 정렬
        alignItems: "center", // 수평 중앙 정렬
        justifyContent: "center", // 수직 중앙 정렬
      }}
    >
      {isAudioLoaded && <Equalizer audioElement={audioRef.current!} />}
      <audio
        ref={audioRef}
        controls
        autoPlay
        onEnded={handleAudioEnd}
        onLoadedMetadata={handleAudioLoaded}
        style={{ display: "block", width: "20%", marginTop: "20px" }}
      >
        <source src={radioDummyData[currentTTS] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <div style={{ marginTop: "20px" }}>
        <h3>Script:</h3>
        <p>{radioDummyData[currentScript]}</p>
      </div>
    </div>
  );
};
