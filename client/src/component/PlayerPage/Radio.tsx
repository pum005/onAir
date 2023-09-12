import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";

export const Radio = () => {
  const dispatch = useDispatch();
  const radioDummyData = useSelector((state: RootState) => state.radioDummy);
  const navigate = useNavigate();

  //오디오가 종료되면 호출되는 함수
  //INCREMENT_TTS_INDEX 액션을 디스패치하여 현재의 TTS의 인덱스를 증가시킴
  //그 뒤 음악 플레이어 페이지로 옮겨줌
  const handleAudioEnd = () => {
    dispatch({ type: "INCREMENT_TTS_INDEX" }); // 인덱스 증가
    navigate("/MusicPlayer");
  };

  // 배열 인덱싱을 사용하여 현재 TTS와 스크립트의 키를 선택
  //radioDummyData.currentTTSIndex는 현재 재생해야 할 TTS의 인덱스
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
