import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import Equalizer from "../Common/Equalizer";
import { RadioScripts } from "../Common/RadioScript";
import styles from "./Radio.module.css";
import { FinishModal } from "./FinishModal";

export const Radio = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null); // 오디오 태그 참조
  const [isAudioLoaded, setIsAudioLoaded] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false); // 모달 상태 추가

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const currentTTS = [`tts_one`, `tts_two`, `tts_three`, `tts_four`][
    radioDummyData.currentTTSIndex
  ];

  const handleAudioLoaded = () => {
    setIsAudioLoaded(true);
  };

  const handleAudioEnd = () => {
    dispatch({ type: "INCREMENT_TTS_INDEX" });

    if (radioDummyData.currentTTSIndex === 3) {
      setShowModal(true); // 4번째 TTS가 끝나면 모달 표시
    } else {
      navigate("/MusicPlayer");
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
      >
        <source src={radioDummyData[currentTTS] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <RadioScripts />
      <div className={styles.marginTop}></div>
      <FinishModal show={showModal} onClose={handleCloseModal} />
    </div>
  );
};
