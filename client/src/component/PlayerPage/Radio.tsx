import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const Radio = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();

  const handleAudioEnd = () => {
    dispatch({ type: "INCREMENT_TTS_INDEX" }); // 인덱스 증가
    navigate("/MusicPlayer");
  };

  // 현재 인덱스에 맞게 tts와 script 선택
  const currentTTS = [`tts_one`, `tts_two`, `tts_three`, `tts_four`][
    radioDummyData.currentTTSIndex
  ];
  const currentScript = [
    `script_one`,
    `script_two`,
    `script_three`,
    `script_four`,
  ][radioDummyData.currentTTSIndex];

  return (
    <div
      style={{ backgroundColor: "#000104", height: "100vh", color: "white" }}
    >
      <audio controls autoPlay onEnded={handleAudioEnd}>
        <source src={radioDummyData[currentTTS] as string} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <div>
        <h3>Script:</h3>
        <p>{radioDummyData[currentScript]}</p>
      </div>
    </div>
  );
};
